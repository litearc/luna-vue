<template lang='pug'>
.ui-tabs
  .tab(
    v-for='(tab, i) in tabs'
    :key='i'
    :class='{ active: itab === i }'
    @click='on_click(i)'
  )
    .vcenter
      span.flex-row.full-w.align-bl
        span {{ tab.name }}
        .expand
        faicon.icon.hover-hl(
          icon='times-circle'
          @click.stop='on_close(i)'
        )
</template>

<script>
export default
{
  name: 'ui-tabs',

  props: {
    tabs: { default: ()=>[] },
    itab: { default: 0 },
  },

  methods:
  {
    on_click(i){
      this.$emit('tab_changed', i)
    },
    on_close(i){
      this.$emit('tab_closed', i)
    }
  }, // methods
  
}
</script>

<style scoped lang='sass'>
@import ../theme

.ui-tabs
  height: 24px
  overflow: hidden
  white-space: nowrap

.tab
  display: inline-block
  width: $tab-width
  height: 100%
  padding-left: 8px
  padding-right: 8px
  overflow: hidden
  border-radius: 4px 4px 0px 0px
  background-color: $cD

  &.active
    background-color: $cH
</style>

