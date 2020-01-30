import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:
  {
    // an tab array containing the editor data associated with each open tab
    tabs: [],

    // data for a sprite tab
    tab_sprite: {
      fname: '',
      sprite_w: 24,
      sprite_h: 32,
    },

    // data for an animation tab
    tab_anim: {
    },

    // data for a tileset tab
    tab_tileset: {
    },

    // data for a map tab
    tab_map: {
    },
  },

  mutations:
  {
  },

  actions:
  {
  },
})
