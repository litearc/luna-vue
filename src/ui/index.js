import Vue from 'vue'
import ui_checkbox from './checkbox.vue'
import ui_combobox from './combobox.vue'
import ui_dropdown from './dropdown.vue'
import ui_icon from './icon.vue'
import ui_icon_text from './icon_text.vue'
import ui_input from './input.vue'
import ui_radio from './radio.vue'
import ui_splitter from './splitter.vue'
import ui_tabs from './tabs.vue'
import ui_textarea from './textarea.vue'
import ui_tooltip from './tooltip.vue'
import ui_tree from './tree.vue'

import dialog from './dialog.js'
import message from './message.js'

const comps = [
  ui_checkbox,
  ui_combobox,
  ui_dropdown,
  ui_icon,
  ui_icon_text,
  ui_input,
  ui_radio,
  ui_splitter,
  ui_tabs,
  ui_textarea,
  ui_tooltip,
  ui_tree,
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
