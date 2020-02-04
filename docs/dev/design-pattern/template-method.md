# 模板方法模式

应用场景很多，尤其是在框架设计中，提供了一个方便的开发程序的模板，你只要实现模板中的一些接口或者方法就能完成一个复杂的任务。

**结构类图**

![template-method](/images/模板方法模式/template-method.png)

AbstractTemplate：定义一个完整的框架，方法的调用顺序已经确定，但会定义一些抽象的方法留给子类去实现。

SubTemplate：实现抽象模板中定义的抽象方法，从而形成一个完整的流程逻辑。

```Java
public TradeFlowActionResult execute(TradeFlowActionParam param, Map context) throws ServiceException {
    try {    // 业务逻辑校验
        this.validateBusinessLogic(param, context);
    } catch (ServiceException ex) {
        sendGoodsLog.info("SendGoodsAction->validateBusinessLogic got exception. param is " + param, ex);
        throw ex;
    } catch (RuntimeException ex) {
        sendGoodsLog.info("SendGoodsAction->validateBusinessLogic got runtime exception. param is " + param, ex);
        throw ex;
    }
    try {
        // 卖家发货业务逻辑
        this.sendGoods(param, context);
    } catch (ServiceException ex) {
        sendGoodsLog.info("SendGoodsAction->sendGoods got exception. param is " + param, ex);
        throw ex;
    } catch (RuntimeException ex) {
        sendGoodsLog.info("SendGoodsAction->sendGoods got runtime exception. param is " + param, ex);
        throw ex;
    }
    try {
        // 补充业务（结果不影响核心业务）
        this.addition(param, context);
    } catch (ServiceException ex) {
        sendGoodsLog.info("SendGoodsAction->addition got exception. param is " + param, ex);
        throw ex;
    } catch (RuntimeException ex) {
        sendGoodsLog.info("SendGoodsAction->addition got runtime exception. param is " + param, ex);
        throw ex;
    }
    // 处理结果
    return null;
}
```

上面提到的三个抽象方法（业务逻辑校验、卖家发货业务逻辑、补充业务）都是在子类中实现的。

使用模板方法模式既控制了主流程结构，又不失灵活性，可以让使用者在其基础上定制开发。