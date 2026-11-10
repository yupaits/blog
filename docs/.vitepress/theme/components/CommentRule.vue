<template>
  <section class="comment-rule">
    <h4>评论区留言准则：</h4>
    <p>1. 本评论区禁止传播封建迷信、吸烟酗酒、低俗色情、赌博诈骗等任何违法违规内容。</p>
    <p>2. 当他人以不正当方式诱导打赏、私下交易，请谨慎判断，以防人身财产损失。</p>
    <p>3. 请勿轻信各类招聘征婚、代练代抽、私下交易、购买礼包码、游戏币等广告信息，谨防网络诈骗。</p>
  </section>
</template>

<style>
.comment-rule {
  margin-top: 40px;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-card, 12px);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.8;
}

.comment-rule h4 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.comment-rule p {
  margin: 2px 0;
}

@media (max-width: 639px) {
  .comment-rule {
    padding: 14px 16px;
  }
}
</style>