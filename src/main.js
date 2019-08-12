import Vue from 'vue'
import app from './comps/app.vue'
import store from './store'
import ui from './ui'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheckCircle)
library.add(faExclamationCircle)
library.add(faTimesCircle)
library.add(faUserSecret)
Vue.component('faicon', FontAwesomeIcon)

Vue.use(ui)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(app)
}).$mount('#app')
