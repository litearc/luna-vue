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
    )
    ed-tileset-sidebar(
      slot='slot2'
      :itab='itab'
    )
</template>

<script>
import ed_tileset_image from './ed_tileset_image.vue'
import ed_tileset_sidebar from './ed_tileset_sidebar.vue'

export default
{
  name: 'editor_tileset',

  data(){
    return {}
  },

  props: {
    itab: {},
  },

  components: {
    'ed-tileset-image': ed_tileset_image,
    'ed-tileset-sidebar': ed_tileset_sidebar,
  },

  created(){
    console.log(this.data)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#editor_tileset, #image-area, #bar-area
  width: 100%
  height: 100%
</style>
