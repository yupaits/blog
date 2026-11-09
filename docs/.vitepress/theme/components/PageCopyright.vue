<template>
  <div class="page-copyright">
    <svg class="copyright-mark" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <path d="M10.5 6a3.2 3.2 0 1 0 0 4" fill="none" stroke="currentColor" stroke-width="1.3"
            stroke-linecap="round"/>
    </svg>
    <p><strong class="label">文章作者：</strong><a href="mailto:ts495606653@hotmail.com">yupaits</a></p>
    <p><strong class="label">文章链接：</strong><a :href="link" target="_blank">{{ decodeURI(link) }}</a></p>
    <p>
      <strong class="label">版权声明：</strong>
      <span>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                                                 target="_blank">CC BY-NC-SA
          4.0</a> 许可协议。转载请注明原始来源信息为 <a href="/" target="_blank">yupaits notes</a></span>
    </p>
  </div>
</template>

<script setup>
import {useRoute} from 'vitepress'
import {onMounted, ref, watch} from 'vue'

const link = ref('')
const route = useRoute()

const usePageUrl = () => {
  link.value = window.location.origin + window.location.pathname
}

onMounted(() => {
  usePageUrl()
})

watch(
    () => route.path,
    () => {
      usePageUrl()
    }
)
</script>

<style>
.page-copyright {
  position: relative;
  margin-bottom: var(--blog-space-5, 20px);
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--blog-radius-card, 12px);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.9;
}

.page-copyright p {
  margin: 0;
}

/* 版权标识：内联 SVG，跟随文字颜色，不单独响应 hover */
.copyright-mark {
  position: absolute;
  top: 17px;
  right: 16px;
  display: block;
  color: inherit;
  opacity: 0.55;
  pointer-events: none;
}

.page-copyright .label {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.page-copyright a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.page-copyright a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 639px) {
  .page-copyright {
    padding: 14px 16px;
    font-size: 13px;
  }
}
</style>