<template lang='pug'>
form
  div(
    v-for='(item,i) in items'
    :key='i'
  )
    input(
      type='checkbox'
      id=`item-${i}`
      :value='item'
      v-model='checked'
    )
    label(for=`item-${i}`)
      span {{ item }}
      br
</template>

<script>
export default
{
  name: 'ui-checkbox',
  inheritAttrs: false,

  data(){
    return {
      items: ['Jack', 'John', 'Mike'],
      checked: []
    }
  },
 
  props: {
    options: {}
  }
}
</script>

<style lang='sass'>
@import ../theme
</style>

