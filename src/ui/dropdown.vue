<template lang='pug'>
span
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  // add position: relative?
  #trigger(
    ref='trigger'
    :class='{enabled, hover:trigger=="hover", click:trigger=="click"}'
    @click.stop='on_trigger_click'
  )
    slot
    // use 'stop' to not trigger click event of #trigger
    ui-menu#menu(
      :items='items'
      :style='menu_style'
      @item-selected='on_item_selected($event)'
      v-click-outside='on_click_outside'
    )
</template>

<script>
import ui_menu from './menu'
import click_outside from 'vue-click-outside'

export default
{
  name: 'ui-dropdown',

  directives: {
    'click-outside': click_outside
  },

  data(){
    return {
      wtrigger: null,
      htrigger: null,
      wmenu: null,
      hmenu: null,
      enabled: false,
    }
  },

  props: {
    disabled: { default: false },
    placement: { default: 'bottom' },
    trigger: { default: 'hover' }, // 'hover' or 'click'
    items: {},
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
    on_item_selected(arr){
      this.enabled = false // to make the menu go away
      this.$emit('item-selected', arr)
    },

    on_trigger_click(){
      if (this.trigger == 'click' && !this.disabled){
        this.enabled = !this.enabled
      }
    },

    on_click_outside(){
      this.enabled = false
    }
  },

  mounted(){
    this.wtrigger = this.$refs.trigger.offsetWidth
    this.htrigger = this.$refs.trigger.offsetHeight

    // for some reason, if I add a `removeEventListener` in `destroyed()`, this
    // stops working after the first time the menu opens
    if (this.trigger == 'hover')
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
  width: 100%

#trigger.enabled.hover:hover #menu
  display: block

#trigger.enabled.click #menu
  display: block

</style>
