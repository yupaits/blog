<template>
  <div class="gitalk-container">
    <div id="gitalk-container"></div>
  </div>
</template>

<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
export default {
  name: 'comment',
  data() {
    return {}
  },
  mounted() {
    let body = document.querySelector('.gitalk-container');
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    body.appendChild(script);
    script.onload = () => {
      const gitalk = new Gitalk({
        clientID: '5680169c83c7f32a7352',
        clientSecret: '1a71f599143d186c5e8fd00f3f96f482d8ff71ea',
        repo: 'blog',
        owner: 'yupaits',
        admin: ['yupaits'],
        distractionFreeMode: false,
        id: location.pathname,
        language: 'zh-CN'
      });
      gitalk.render('gitalk-container');
    }
  }
}
</script>