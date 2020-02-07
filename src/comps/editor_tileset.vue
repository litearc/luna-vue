<template lang='pug'>
  span editor_tileset {{ val }}
</template>

<script>
import ed_tileset_image from './ed_tileset_image.vue'
import ed_tileset_sidebar from './ed_tileset_sidebar.vue'

export default
{
  name: 'editor_tileset',

  data(){
    return {
      val: null,
    }
  },

  created(){
    this.val = Math.floor(Math.random() * 101);
  },
}
</script>

<style lang='sass'>
</style>
