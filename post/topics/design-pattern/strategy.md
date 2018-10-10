# 策略模式

策略模式通常是指完成某个操作可能会有多种方法，适用于多种场合。我们需要把每个操作方法当作一个实现策略，调用者可根据需要（特定的规则）选择合适的策略。

**结构类图**

![strategy](/images/策略模式/strategy.png)

Context：使用不同的策略环境，根据自身的条件选择不同的策略实现类来完成所需要的操作。它持有一个策略实例的引用。

Strategy：抽象策略，定义每个策略都要实现的方法。

Realize1，Realize2：负责实现抽象策略中定义的策略方法。

**例子**

```Java
@Override
@Enhancement({@Capability(type = CapabilityTypeEnum.INVOCATION_STATS)})
public void sendGoods(SendGoodsParam param) throws ServiceException {
    if (param == null || param.getId() == null) {
        this.throwInValidError(ErrorCodeEnum.NULL_PARAM, null, param);
    }
    TradeFlowService tfs = createTradeFlowServiceByOrderId(param.getId());
    tfs.sendGoods(param);
}
```

`createTradeFlowServiceByOrderId`方法会根据“订单号的长短”选择具体的子策略。

- 长订单号：tpTradeFlowService
- 短订单号：unifyTradeFlowService

彼此子策略实现互不干扰，有效达到隔离效果。