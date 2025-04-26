<template>
  <div class="page-copyright">
    <p><span class="label">文章作者：</span><a href="mailto:ts495606653@hotmail.com">yupaits</a></p>
    <p><span class="label">文章链接：</span><a :href="link" target="_blank">{{ decodeURI(link) }}</a></p>
    <p>
      <span class="label">版权声明：</span>
      <span>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA
          4.0</a> 许可协议。转载请注明原始来源信息为 <a href="/" target="_blank">yupaits notes</a></span>
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vitepress'
import { onMounted, ref, watch } from 'vue'
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
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 15px;
  padding: 12px 16px;
  margin-bottom: 3rem;
}

.page-copyright:before {
  position: absolute;
  top: 8px;
  right: 12px;
  content: '©';
  color: var(--vp-c-brand-1);
  font-size: 1.3rem;
}

.page-copyright:hover {
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%);
  transition: box-shadow 0.3s ease-in-out;
}

.page-copyright .label {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}

.page-copyright a {
  text-decoration: underline;
  color: var(--vp-c-text-3);
}

.page-copyright a:hover {
  text-decoration: none;
  color: var(--vp-c-brand-1);
}
</style>