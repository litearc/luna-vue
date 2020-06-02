<template lang='pug'>
svg(
  ref='svg'
  viewBox='0 0 120 120'
  :height='height'
  :style='svg_style'
  @click='$emit("click")'
)
  path(v-for='path in paths[icon]' :d='path' fill='currentColor')
</template>

<script>
export default
{
  name: 'ui-icon',

  data(){
    return {
      paths: {
        'grid'     : ['M20 10h10v100H20zM90 10h10v100H90z', 'M10 20h100v10H10zM10 90h100v10H10z'],
        'terra5x1' : ['M50 10h20v100H50z'],
        'terra4x3' : ['M30 20h60v80H30z']
      }
    }
  },

  props: {
    icon: {},
    height: { default: '15px' },
    base: { default: true, type: Boolean },
  },

  computed: {
    svg_style(){
      return {
        position: 'relative',
        top: (this.base) ? '.125em' : '0',
      }
    }
  }, // methods
}
</script>

<style scoped lang='sass'>
@import ../theme

</style>

