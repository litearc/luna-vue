// registers a directive to listen for clicking outside an element. taken from:
// https://tahazsh.com/detect-outside-click-in-vue

import Vue from 'vue'
let handle

Vue.directive('click-outside', {
  bind(el, binding, vnode){
    handle = (e) => {
      e.stopPropagation()
      const {handler, exclude} = binding.value
      let clicked_on_excluded_el = false
      exclude.forEach(ref => {
        if (!clicked_on_excluded_el) {
          const ex = vnode.context.$refs[ref]
          clicked_on_excluded_el = ex.contains(e.target)
        }
      })
      if (!el.contains(e.target) && !clicked_on_excluded_el)
        vnode.context[handler]()
    }
    document.addEventListener('click', handle)
    document.addEventListener('touchstart', handle)
  },

  unbind () {
    document.removeEventListener('click', handle)
    document.removeEventListener('touchstart', handle)
  },
})

