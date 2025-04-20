// busuanzi统计
export const initBusuanzi = () => {
  const script = document.createElement('script')
  script.defer = true
  script.async = true
  script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  document.head.appendChild(script)
}