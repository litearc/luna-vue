<template lang='pug'>
input#el(
  v-bind='$attrs'
  :value='value'
  spellcheck='false'
  @input='$emit("input", $event.target.value)'
)
</template>

<script>
export default
{
  name: 'ui-input',
  inheritAttrs: false,
 
  props: {
    value: {}
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#el
  @include input

  /* this hides the up/down arrows in 'number' inputs */
  &[type=number]
    -moz-appearance: textfield
    appearance: textfield

  &[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button
    -webkit-appearance: none
</style>
