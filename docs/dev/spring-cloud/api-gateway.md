# 快速搭建微服务-API网关

API网关是整个后端微服务体系的门户，外部应用通过网关对后台数据进行相关操作，网关中包含了定义后台服务路由规则、服务限流、设置跨域、开启饥饿加载模式等内容。本文对这些内容一一进行说明。

<!-- more -->

## 路由规则

定义请求前缀和后台服务的service-id即可。

```yaml
zuul:
  routes:
    auth:
      path: /auth/**
      service-id: auth-server
    api-order:
      path: /api-order/**
      service-id: service-order
    api-goods:
      path: /api-goods/**
      service-id: service-goods
    api-wechat-admin:
      path: /api-wechat-admin/**
      service-id: service-wechat-admin
```

## 服务限流

通过编写自定义的限流Filter实现服务限流。

- RateLimitProperties.java

```Java
@Data
@Configuration
@ConfigurationProperties("rate-limit")
public class RateLimitProperties {

    // 限流开关
    private Boolean enabled = Boolean.TRUE;

    // 定义<service-id, 每秒限制请求数>对应关系
    private Map<String, Double> limits = Maps.newHashMap();

    // 开启限流的内存阈值，当服务器的可用内存小于阈值时开启限流
    private Long memorySizeKb = 1000000L;
}

```

- RateLimitFilter.java

```Java
@Slf4j
@RefreshScope
@EnableConfigurationProperties({RateLimitProperties.class})
public class RateLimitFilter extends ZuulFilter {

    @Autowired
    private RateLimitProperties rateLimitProperties;

    @Autowired
    private SystemPublicMetrics systemPublicMetrics;

    private static final double DEFAULT_PERMITS_PER_SECOND = 1000.0;

    private Map<String, RateLimiter> rateLimiterMap = Maps.newConcurrentMap();

    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        //order一定要大于org.springframework.cloud.netflix.zuul.filters.pre.PreDecorationFilter的order(值为5)，否则，RequestContext.getCurrentContext()里拿不到serviceId等数据。
        return 20;
    }

    @Override
    public boolean shouldFilter() {
        //手动配置不限流的话，强制关闭限流
        if (!rateLimitProperties.getEnabled()) {
            return false;
        }
        //获取可用内存信息
        Collection<Metric<?>> metrics = systemPublicMetrics.metrics();
        Optional<Metric<?>> freeMemoryMetric = metrics.stream().filter(metric -> "mem.free".equals(metric.getName())).findFirst();
        //如果没有可用内存指标，默认开启限流
        if (!freeMemoryMetric.isPresent()) {
            return true;
        }
        long freeMemorySize = freeMemoryMetric.get().getValue().longValue();
        //可用内存小于1000000Kb，开启限流
        return freeMemorySize < rateLimitProperties.getMemorySizeKb();
    }

    @Override
    public Object run() {
        RequestContext context = RequestContext.getCurrentContext();

        String key = null;
        String serviceId = (String) context.get(AppConsts.WebConsts.SERVICE_ID_KEY);
        if (serviceId != null) {
            key = serviceId;
            double serviceRate = rateLimitProperties.getLimits().getOrDefault(serviceId, DEFAULT_PERMITS_PER_SECOND);
            RateLimiter oldLimiter = rateLimiterMap.putIfAbsent(key, RateLimiter.create(serviceRate));
            if (oldLimiter != null && oldLimiter.getRate() != serviceRate) {
                rateLimiterMap.replace(key, oldLimiter, RateLimiter.create(serviceRate));
            }
        } else {
            URL routeHost = context.getRouteHost();
            if (routeHost != null) {
                key = routeHost.toString();
                rateLimiterMap.putIfAbsent(key, RateLimiter.create(DEFAULT_PERMITS_PER_SECOND));
            }
        }

        RateLimiter rateLimiter = rateLimiterMap.get(key);
        if (!rateLimiter.tryAcquire()) {
            HttpStatus httpStatus = HttpStatus.TOO_MANY_REQUESTS;
            context.setSendZuulResponse(false);
            context.getResponse().setContentType(AppConsts.WebConsts.TEXT_PLAIN_UTF8_VALUE);
            context.setResponseStatusCode(httpStatus.value());
            context.setResponseBody(httpStatus.getReasonPhrase());
        }
        return null;
    }
}
```

## 设置跨域

采用前后端分离的应用可能需要在服务端进行跨域设置，当然也可以使用Nginx反向代理等方式解决跨域问题。

- CorsProperties.java

```Java
@Data
@Configuration
@ConfigurationProperties("cors")
public class CorsProperties {

    private List<String> origins = Lists.newLinkedList();

    private List<String> methods = Lists.newArrayList();

    private Long maxAge = AppConsts.WebConsts.CORS_MAX_AGE;

    private List<String> allowedHeaders = Lists.newLinkedList();

    private List<String> exposedHeaders = Lists.newLinkedList();
}
```

- CorsConfig.java

```Java
@RefreshScope
@Configuration
public class CorsConfig {

    @Autowired
    private CorsProperties corsProperties;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.getOrigins());
        configuration.setAllowedMethods(corsProperties.getMethods());
        configuration.setMaxAge(corsProperties.getMaxAge());
        configuration.setAllowedHeaders(corsProperties.getAllowedHeaders());
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(corsProperties.getExposedHeaders());
        source.registerCorsConfiguration(AppConsts.PathConsts.ALL_PATHS, configuration);
        return new CorsFilter(source);
    }
}
```

## 开启饥饿加载模式

开启饥饿加载模式比较容易，简单配置即可。

```yaml
zuul:
  ribbon:
    eager-load:
      enabled: true
```