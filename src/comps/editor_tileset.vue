<template lang='pug'>
#editor_tileset
  ui-splitter#splitter(
    min2='400px'
    max2='520px'
    mode='B'
  )
    ed-tileset-image(
      slot='slot1'
      :o='o'
    )
    ed-tileset-sidebar(
      slot='slot2'
      :o='o'
    )
</template>

<script>
import ed_tileset_image from './ed_tileset_image.vue'
import ed_tileset_sidebar from './ed_tileset_sidebar.vue'
import Vue from 'vue'
export const bus = new Vue()

export default
{
  name: 'editor_tileset',

  props: {
    o: {},
  },

  components: {
    'ed-tileset-image': ed_tileset_image,
    'ed-tileset-sidebar': ed_tileset_sidebar,
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#editor_tileset
  width: 100%
  height: 100%
</style>
