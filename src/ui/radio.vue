<template lang='pug'>
#el
  div(
    v-for='(item,i) in items'
    :key='i'
  )
    span.it-icon(style='display: inline-block')
      faicon.selected(
        v-if='selected == i'
        icon='dot-circle'
        @click='on_click(i)'
      )
      faicon.unselected(
        v-else
        icon='circle'
        @click='on_click(i)'
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


