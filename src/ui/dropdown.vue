<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  // add position: relative?
  #trigger(
    ref='trigger'
    :class='{enabled}'
  )
    slot
    ui-menu#menu(
      :items='items'
      :style='menu_style'
      @clicked='on_click($event)'
    )
</template>

<script>
import ui_menu from './menu'

export default
{
  name: 'ui-dropdown',

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
          { name: '2', contents: null },
          { name: '3', contents: null }
        ] }
      ],
      wtrigger: null,
      htrigger: null,
      wmenu: null,
      hmenu: null,
      enabled: true,
    }
  },

  props: {
    placement: { default: 'bottom' },
    trigger: { default: 'hover-keep' },
  },

  computed: {
    menu_style(){
      return {
        '--menu-top' : `${this.htrigger}px`
      }
    }
  },

  components: {
    'ui-menu': ui_menu,
  },

  methods:
  {
    on_click(arr){
      this.enabled = false // to make the menu go away
      this.$emit('item-selected', arr)
    },
  },

  mounted(){
    this.wtrigger = this.$refs.trigger.offsetWidth
    this.htrigger = this.$refs.trigger.offsetHeight
    this.$refs.trigger.addEventListener('mouseenter', () => {
      this.enabled = true
    })
  },

}
</script>

<style scoped lang='sass'>
#menu
  display: none
  position: absolute
  white-space: nowrap
  top: var(--menu-top)
  // bottom: var(--menu-top)

#trigger
  display: inline-block
  position: relative

#trigger.enabled:hover #menu
  display: block

</style>
