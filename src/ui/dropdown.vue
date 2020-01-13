<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  #trigger
    slot
    ui-menu#menu(:items='items')
</template>

<script>
import popup_mixin from '../mixins/popup'
import ui_menu from './menu'

export default
{
  name: 'ui-dropdown',
  // mixins: [ popup_mixin ],

  data(){
    return {
      items: [
        { name: 'a', contents: null },
        { name: 'b', contents: null },
        { name: 'c', contents: [
          { name: '1', contents: [
            { name: 'aa', contents: null },
            { name: 'bb', contents: null },
          ] },
          { name: '2', contents: null }
        ] }
      ]
    }
  },

  props: {
    trigger: { default: 'hover-keep' },
  },

  components: {
    'ui-menu': ui_menu,
  },
}
</script>

<style lang='sass'>
#menu
  display: none

#trigger:hover #menu
  display: block

</style>