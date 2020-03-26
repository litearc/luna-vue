<template lang='pug'>
#ed_tileset_sidebar
  .bold Tileset Properties
  ui-icon#icon(icon='grid')
  span Hello
</template>

<script>
  // svg(viewBox='0 0 100 100' :height='h')
  //   path(d='M20 10h10v80H20zM70 10h10v80H70z' :fill='fill')
  //   path(d='M10 20h80v10H10zM10 70h80v10H10z' :fill='fill')
export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {
      h: '15px',
      fill: '#94989a'
    }
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
 
#icon:hover
  color: red
  /* border: 1px solid red */
</style>

