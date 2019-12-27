<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  div(ref='trigger' style='display: inline-block')
    slot
  .menu(
    v-if='show'
    ref='popup'
    :style='popup_style'
  )
    ui-menu
</template>

<script>
import popup_mixin from '../mixins/popup'
import ui_menu from './menu'

export default
{
  name: 'ui-dropdown',
  mixins: [ popup_mixin ],
  components: {
    'ui-menu': ui_menu,
  },
}
</script>