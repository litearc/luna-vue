import Vue from 'vue'
import app from './comps/app.vue'
import store from './store'
import ui from './ui'
import icons from './js/icons'
import './directives/click_outside'

Vue.use(ui)
Vue.component('faicon', icons)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(app)
}).$mount('#app')
