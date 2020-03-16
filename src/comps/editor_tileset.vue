<template lang='pug'>
#el
  ui-splitter(
    min2='250px'
    max2='400px'
    mode='B'
  )
    #image-area(
      slot='slot1'
    )
    ed-tileset-sidebar(
      slot='slot2'
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
    data: { default: {} },
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

#image-area
  width: 100%
  height: 100%
</style>
