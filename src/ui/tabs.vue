<template lang='pug'>
#tab-widget
  #tab(
    v-for='(tab, i) in tabs'
    :key='i'
    :class='{ active: itab === i }'
    @click='on_click(i)'
  )
    span {{ tab.name }}
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
    }
  }, // methods
  
}
</script>

<style scoped lang='sass'>
@import ../theme

#tab-widget
  border: 1px solid blue
  height: 24px

#tab
  display: inline-block
  width: 100px
  height: 100%
  padding-left: 4px
  overflow: hidden
  border: 1px solid green

  &.active
    border: 1px solid blue
</style>

