import Vue from 'vue'
import dialog_vue from './dialog.vue'
let dialog_ctor = Vue.extend(dialog_vue)

const dialog = function(opts)
{
  if (Vue.prototype.$isServer)
    return

  opts = opts || {}

  if (typeof opts === 'string')
    opts = {
      message: opts,
      options: ['Cancel', 'Ok'],
      highlight: 1
    }

  let el = new dialog_ctor({ data: opts })
  el.$mount()
  document.body.appendChild(el.$el)
  el.visible = true
}

export default dialog
