<template lang='pug'>
.ui-radio
  .flex-row.align-bl(
    v-for='(item,i) in items'
    :key='i'
    @click='on_click(i)'
  )
    span.inline-block
      faicon.icon.selected(
        v-if='selected == i'
        icon='dot-circle'
      )
      faicon.icon.unselected(
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


