<template>
  <div class="comment">
    <div class="comment-rule">
      <h4>评论区留言准则：</h4>
      <p>1. 本评论区禁止传播封建迷信、吸烟酗酒、低俗色情、赌博诈骗等任何违法违规内容。</p>
      <p>2. 当他人以不正当方式诱导打赏、私下交易，请谨慎判断，以防人身财产损失。</p>
      <p>3. 请勿轻信各类招聘征婚、代练代抽、私下交易、购买礼包码、游戏币等广告信息，谨防网络诈骗。</p>
    </div>
    <div id="vcomments"></div>
    <div class="visitors">
      <span>本文总阅读量 <i id="busuanzi_value_page_pv"></i> 次</span>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.comment {
  margin-top: 1rem;
}

.comment-rule {
  margin-top: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 16px;
  color: var(--vp-c-text-2);
  flex-grow: 1;
  line-height: 24px;
  font-size: 14px;
  transition: color 0.25s;
}

.visitors {
  margin-top: 1rem;
  text-align: right;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

#vcomments {
  margin-top: 1rem;
}
</style>