import ui_input from './input.vue'
import ui_textarea from './textarea.vue'

import dialog from './dialog.js'
import message from './message.js'

const comps = [
  ui_input,
  ui_textarea,
]

const install = function(Vue, opts = {}){
  comps.forEach(comp => {
    Vue.component(comp.name, comp)
  })

  Vue.prototype.$dialog = dialog
  Vue.prototype.$message = message
}

export default { install }
