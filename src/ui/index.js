import Vue from 'vue'
import ui_input from './input.vue'
import ui_splitter from './splitter.vue'
import ui_textarea from './textarea.vue'
import ui_tooltip from './tooltip.vue'

import dialog from './dialog.js'
import message from './message.js'

const comps = [
  ui_input,
  ui_splitter,
  ui_textarea,
  ui_tooltip,
]

// a "global" event bus, used to communicate between components and with app
export const ui_bus = new Vue()

const install = function(Vue, opts = {}){
  comps.forEach(comp => {
    Vue.component(comp.name, comp)
  })

  Vue.prototype.$dialog = dialog
  Vue.prototype.$message = message
}

export default { install }
