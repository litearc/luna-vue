<template lang='pug'>
.ui-radio
  div(
    v-for='(item,i) in items'
    :key='i'
    @click='on_click(i)'
  )
    span.it-icon(style='display: inline-block')
      faicon.selected(
        v-if='selected == i'
        icon='dot-circle'
      )
      faicon.unselected(
        v-else
        icon='circle'
      )
    span {{ item }}
</template>

<script>
export default
{
  name: 'ui-radio',
  inheritAttrs: false,

  data(){
    return {
      selected: 0
    }
  },
 
  props: {
    items: {}
  },

  methods:
  {
    on_click(i){
      this.selected = i
      this.$emit('clicked', this.selected)
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected
  color: $c-blue
</style>


