<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  // add position: relative?
  span hello {{ num }} 
  #trigger(ref='trigger' :style='trigger_style' @click='test_color="green"')
    slot
    ui-menu#menu(:items='items')
</template>

<script>
import ui_menu from './menu'

export default
{
  name: 'ui-dropdown',

  computed: {

    trigger_style(){
      console.log('trigger style')
      return {
        border: '1px solid blue',
        display: 'inline-block',
        'background-color': this.test_color,
        // '--bg-color': this.test_color,
      }
    }
  },
  
  props: {
    placement: { default: 'bottom' }
  },

  data(){
    return {
      items: [
        { name: 'a this is a long string', contents: null },
        { name: 'b', contents: null },
        { name: 'c this is also a long string', contents: [
          { name: '1', contents: [
            { name: 'aa', contents: null },
            { name: 'bb', contents: null },
          ] },
          { name: '2', contents: null }
        ] }
      ],
      trigger_xpos: null,
      trigger_ypos: null,
      test_color: 'red',
      num: 0
    }
  },

  props: {
    trigger: { default: 'hover-keep' },
  },

  components: {
    'ui-menu': ui_menu,
  },

  mounted(){
    console.log('mounted')
    this.trigger_xpos = this.$refs.trigger.offsetLeft
    this.trigger_ypos = this.$refs.trigger.offsetTop
    this.test_color = 'green'
  },
}
</script>

<style lang='sass'>
#menu
  display: none
  position: absolute

// #trigger
//   background-color: var(--bg-color)

#trigger:hover #menu
  display: block

</style>