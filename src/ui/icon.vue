<template lang='pug'>
svg#svg(ref='svg' viewBox='0 0 100 100' height='15px')
  path(v-for='path in paths[icon]' :d='path' fill='currentColor')
</template>

<script>
export default
{
  name: 'ui-icon',

  data(){
    return {
      paths: {
        'grid' : ['M20 10h10v80H20zM70 10h10v80H70z', 'M10 20h80v10H10zM10 70h80v10H10z']
      }
    }
  },

  props: {
    icon: {}
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

svg
  position: relative
  top: $font-size/5
  margin: 0 4.5px

</style>

