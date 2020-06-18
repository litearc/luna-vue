<template lang='pug'>
#ed_map_sidebar
  .bold.full-w.text-center TILESET
  #tileset.expand.flex.overflow-auto
    canvas#canvas-tileset.no-shrink.block.margin-auto(ref='canvas_tileset')
  .hdivider
  .bold.full-w.text-center.mb-8px TERRA
</template>

<script>
export default
{
  name: 'ed_map_sidebar',

  props: {
    o: {},
  },

  created(){
  },

  mounted(){
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_map_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-bg-pane
</style>

