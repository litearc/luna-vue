import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:
  {
    // an tab array containing the editor data associated with each open tab.
    // each tab should have a `type` property, which is a string, e.g. `sprite`
    // or 'map', and a `data` property, which contains the editor data. if the
    // type is 'none', the 'new resource' page is shown.
    tabs: [
      { type: 'none', data: {} },
    ],
  },

  mutations:
  {
  },

  actions:
  {
  },
})
