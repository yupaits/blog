---
title: 责任链模式
date: 2020-02-04 19:21:28
category: 设计模式
tags:
  - 设计模式
  - Design Pattern
---

责任链模式就是很多对象由每个对象对其下家的引用串联起来形成一条链，请求在这条链上传递，知道最终处理完。就像一根水管一样，水从一端流入，会经过一系列的阀门，最终从另一端流出。如果有一个阀门关着，水就流不出来。

**链上的节点可以控制，根据是否执行分为两种情况：**

- 找到对应的点，执行，跳出。如：for循环的break。
- 所有的节点都执行一遍，上个节点的返回结果作为下个节点的入参。

**业务需求：抽奖**

步骤：
- 抽奖资格判断	
    1. 判断人群	
    1. 判断抽奖限制（如每天只能抽3次）	
    1. 黑名单	
    1. 判断中奖次数限制（如最多只能中3次）	。。。。。。。。
    
- 中奖逻辑	
    1. 根据用户V等级进行概率过滤	
    1. 根据抽奖概率进行过滤

- 发奖逻辑	
    1. 取出当前奖品分布，并选出一个奖品分布来发奖	
    1. 减库存	
    1. 发奖	
    1. 发奖成功后的逻辑处理	
    1. 处理其它processor中添加的callback

代码示例 ：
1. 主流程：

```Java
public class DefaultAwardCommanderProcedure implements AwardCommanderProcdure {	
    private List<Commander> commanderList;

    @Override	
    public AwardResult execute(Context context) {		
        if(getCommanderList() == null || getCommanderList().size() == 0) {			
            return AwardResultUtils.buildErrorResult(DefaultResultCode.SYSTEM_ERROR);		
        }		

        for(Commander commander : getCommanderList()) {
            AwardResult result = commander.execute(context);			
            if(!result.isSuccess()) {				
                AwardLogUtils.getAwardLog().warn("DefaultAwardCommanderProcedure.execute() return false|context=" + context + "|awardResult=[" + result + "]");				
                return result;			
            }
        }		
            
        AwardLogUtils.getAwardLog().warn("DefaultAwardCommanderProcedure.execute() return success|context=[" + context + "]");
        return AwardResultUtils.buildSuccessResult();	
    }

    public List<Commander> getCommanderList() {		
        return commanderList;	
    }

    public void setCommanderList(List<Commander> commanderList) {		
        this.commanderList = commanderList;
    }
}
```

主流程bean xml配置

```xml
<!-- 默认抽奖流程 -->	
<bean id="defaultAwardCommanderProcedure" class="com.taobao.wireless.award.biz.forward.biz.procedure.impl.DefaultAwardCommanderProcedure">
    <property name="commanderList">             
        <list>                 
            <ref bean="permissionCommander" />  <!-- 抽奖逻辑 -->                
            <ref bean="winCommander" />         <!-- 中奖逻辑 -->                
            <ref bean="dispatchCommander" />    <!-- 发奖逻辑 -->        	
        </list>         
    </property> 		
</bean>
```

2. 抽奖逻辑

```Java
public class DefaultCommander implements Commander { 	
    private List<Processor> processorList;	

    @Override	
    public AwardResult execute(Context context) {		
        if(getProcessorList() == null || getProcessorList().size() == 0) {			
            return AwardResultUtils.buildErrorResult(DefaultResultCode.SYSTEM_ERROR);		
        }		
        for(Processor processor : getProcessorList()) {			
            AwardResult result = processor.process(context);			
            if(!result.isSuccess()) {				
                return result;			
            }		
        }		
        return AwardResultUtils.buildSuccessResult();	
    } 	

    public List<Processor> getProcessorList() {		
        return processorList;	
    } 	

    public void setProcessorList(List<Processor> processorList) {		
        this.processorList = processorList;	
    } 
}
```

xml配置

```xml
<!-- 1、判断抽奖资格 -->	
<bean id="permissionCommander" class="com.taobao.wireless.award.biz.forward.biz.commander.impl.PermissionCommander">
    <property name="processorList">            
        <list>            	
            <ref bean="checkUserGroupProcessor" />                  <!-- 判断人群 -->            	
            <ref bean="awardCountingProcessor" />                   <!-- 活动抽奖数计数 -->                
            <ref bean="checkAndReducePermitPermissionProcessor" />  <!-- 判断是否有抽奖权限，有则减权限 -->
            <ref bean="checkBlacklistPermissionProcessor" />        <!-- 黑名单 -->                
            <ref bean="checkWinCountPermissionProcessor" />         <!-- 判断中奖次数限制（如最多只能中3次） -->        	
        </list>         
   </property> 	
</bean>
```

3. 具体的原子执行逻辑

接口：

```Java
public interface Processor {	

    /**	 * 处理逻辑	 
     * @param context	 
     * @return	 
     */	
    AwardResult process(Context context);	
}
```

子类则根据具体的业务功能单独封装实现。

**总结**

1. 串行执行所有的逻辑，如果有一个条件不满足或抛异常，则返回false，跳出流程
1. 扩展性好，能很好地满足各种业务变更，只需要实现相应的接口，增加相应的xml配置即可
1. 直观，将日志统一放到一个日志类管理
1. 定义上下文参数类Context，扩展参数强