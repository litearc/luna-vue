<template lang='pug'>
#ed_tileset_sidebar
  .bold Tileset Properties
</template>

<script>
export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {}
  },

  props: {
    itab: {},
  },

}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_tileset_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-pane
</style>

