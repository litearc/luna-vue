<template lang='pug'>
#editor_tileset
  ui-splitter#splitter(
    min2='250px'
    max2='400px'
    mode='B'
  )
    ed-tileset-image(
      slot='slot1'
      :itab='itab'
      @tile_changed='change_tile'
      @set_ntiles='set_ntiles'
    )
    ed-tileset-sidebar(
      slot='slot2'
      :itab='itab'
      :curr_tile='curr_tile'
      :ntiles='ntiles'
    )
</template>

<script>
import ed_tileset_image from './ed_tileset_image.vue'
import ed_tileset_sidebar from './ed_tileset_sidebar.vue'

// use bus to communicate between tileset image and sidebar
import Vue from 'vue'
export const bus = new Vue()

export default
{
  name: 'editor_tileset',

  data(){
    return {
      curr_tile: 0, // tile-index, row-major
      ntiles: null, // set in ed-tileset-image
    }
  },

  props: {
    itab: {},
  },

  components: {
    'ed-tileset-image': ed_tileset_image,
    'ed-tileset-sidebar': ed_tileset_sidebar,
  },

  methods: {
    change_tile(i){
      this.curr_tile = i
    },
    set_ntiles(n){
      this.ntiles = n
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#editor_tileset, #image-area, #bar-area
  width: 100%
  height: 100%
</style>
