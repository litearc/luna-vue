<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  // div(ref='trigger' style='display: inline-block')
  div(ref='trigger' style='display: inline-block')
    slot
  .tooltip(
    v-if='show'
    ref='popup'
    :style='popup_style'
  ) {{ text }}
</template>

<script>
import popup_mixin from '../mixins/popup'

export default
{
  name: 'ui-tooltip',
  mixins: [ popup_mixin ],

  data(){
    return {
      space: 4, // add a little space between trigger and popup
    }
  },

  props: {
    trigger: { default: 'hover' },
  },
}
</script>

<style scoped lang='sass'>
</style>
