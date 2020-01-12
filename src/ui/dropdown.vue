<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  #trigger
    slot
    ui-menu#menu
  //- .menu(
  //-   v-if='show'
  //-   ref='popup'
  //-   :style='popup_style'
  //- )
  //-   ui-menu
</template>

<script>
import popup_mixin from '../mixins/popup'
import ui_menu from './menu'

export default
{
  name: 'ui-dropdown',
  // mixins: [ popup_mixin ],

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