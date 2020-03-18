<template lang='pug'>
.ui-checkbox
  div(
    v-for='(item,i) in items'
    :key='i'
  )
    span.item-icon(style='display: inline-block')
      faicon.checked(
        v-if='checked[i]'
        icon='check-square'
        @click='on_click(i)'
      )
      faicon.unchecked(
        v-else
        icon='square'
        @click='on_click(i)'
      )
    span {{ item }}
</template>

<script>
export default
{
  name: 'ui-checkbox',
  inheritAttrs: false,

  data(){
    return {
      checked: []
    }
  },
 
  props: {
    items: {}
  },

  created(){
    this.checked = Array(this.items.length).fill(false)
  },

  methods:
  {
    on_click(i){
      this.$set(this.checked, i, !this.checked[i])
      this.$emit('clicked', this.checked)
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.item-icon
  display: inline-block
  text-align: center
  width: 24px

.checked
  color: $c-blue
</style>

