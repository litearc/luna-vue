import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:
  {
    // an tab array containing the editor data associated with each open tab.
    // each tab should have a `type` property, which is a string, e.g. `sprite`
    // or 'map', and a `data` property, which contains the editor data. if the
    // type is 'none', the 'new resource' page is shown. the 'name' is displayed
    // in the tab.
    tabs: [
      { name: 'Untitled', type: 'none', data: {} },
    ],
  },

  mutations:
  {
    // generic way to set variables
    set(s, [name, val]){
      s[name] = val
    },

    // set an object's property reactively
    set_prop(s, [obj, prop, val]){
      Vue.set(obj, prop, val)
    },

    // recursively merge a source object into a destination object, i.e. don't
    // simply create references.
    merge(s, [dest, src]){
    },

    push(s, [arr, item]){
      arr.push(item)
    },

  },

  actions:
  {
  },
})
