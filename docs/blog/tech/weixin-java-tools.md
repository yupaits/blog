---
title: weixin-java-tools微信JavaSDK开发工具包
---

引用自：[微信Java SDK开发文档](https://github.com/Wechat-Group/weixin-java-tools/wiki)

[weixin-java-tools](https://github.com/Wechat-Group/weixin-java-tools) 是一款开源的微信 Java SDK 工具，对微信接口封装的比较全，简单配置即可使用，正式版的更新频率是两个月，是 Java 开发微信项目的利器。此文主要介绍使用过程中遇到的的一些 wiki 中没有详细介绍的地方。

<!-- more -->

## CP_如何调用未支持的接口

> [CP_如何调用未支持的接口](https://github.com/wechat-group/weixin-java-tools/wiki/CP_%E5%A6%82%E4%BD%95%E8%B0%83%E7%94%A8%E6%9C%AA%E6%94%AF%E6%8C%81%E7%9A%84%E6%8E%A5%E5%8F%A3)

使用 `wxCpService.get(url, queryParam)` 和 `wxCpService.post(url, postData)` 方法时 url 和 queryParam 不用附带 accessToken 参数，因为该参数在实际调用微信接口时已经封装在 url 的 queryParam 里了。post 方法中的 postData 是 stringify 处理之后的 JSON 字符串 而不是 JSON 对象。

## MP_js_api

> [MP_js_api](https://github.com/Wechat-Group/weixin-java-tools/wiki/MP_js_api)

微信企业号服务获取JS-SDK需要的证书信息可以调用 `wxCpService.createJsapiSignature(url)`，其中 url 必须是调用 JS-SDK 页面的全路径（包括?后的 queryString）中第一个#之前的字符串。例如当前的页面全路径是 `http://www.yupaits.com/hello?text=world&next=config#wechat`，则 url 应该是 `http://www.yupaits.com/hello?text=world&next=config`。

页面上可以[通过config接口注入权限验证配置](http://qydev.weixin.qq.com/wiki/index.php?title=%E5%BE%AE%E4%BF%A1JS-SDK%E6%8E%A5%E5%8F%A3#.E6.AD.A5.E9.AA.A4.E4.BA.8C.EF.BC.9A.E9.80.9A.E8.BF.87config.E6.8E.A5.E5.8F.A3.E6.B3.A8.E5.85.A5.E6.9D.83.E9.99.90.E9.AA.8C.E8.AF.81.E9.85.8D.E7.BD.AE)。
```javascript
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，企业号的唯一标识，此处填写企业号corpid
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
```

两者结合的实例。点击页面上的“扫码”按钮，调用 js 中的 `scan()` 方法。
```java
@RequestMapping(value = "/jssdk", method = RequestMethod.GET)
public String jsSdkPage(HttpServletRequest request, Model model) {
    try {
        String url = request.getRequestURL().append(StringUtils.isNotBlank(HttpUtil.getRequest().getQueryString()) ? "?" + HttpUtil.getRequest().getQueryString() : "").toString();
        model.addAttribute("jsApiSignature", JSON.toJSONString(wxCpService.createJsapiSignature(url)));
    } catch (WxErrorException e) {
        logger.error("获取JS-API的签名出错，{}", e.getMessage());
    }
    return "weixin/jssdk";
}
```

```javascript
var jsapisignature = JSON.parse('${jsApiSignature}');
function scan() {
    wx.config({
        debug: false,
        appId: jsapisignature.appid,
        timestamp: jsapisignature.timestamp,
        nonceStr: jsapisignature.noncestr,
        signature: jsapisignature.signature,
        jsApiList: [
            'scanQRCode'
        ]
    });

    wx.ready(function () {
        wx.scanQRCode({
            needResult: 1,
            success: function (res) {
                alert('恭喜你');
            },
            error: function (res) {
                if(res.errMsg.indexOf('function_not_exist') > 0){
                    alert('版本过低请升级');
                }
            }
        });
    });

    wx.error(function (res) {
        alert('微信JS接口验证失败，无法调用相关接口');
    });
}
```

