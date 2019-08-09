import Vue from 'vue'
import app from './comps/app.vue'
import store from './store'
import ui from './ui'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)
Vue.component('faicon', FontAwesomeIcon)

Vue.use(ui)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(app)
}).$mount('#app')
