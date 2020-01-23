<template lang='pug'>
textarea#el(
  v-bind='$attrs'
  :value='value'
  spellcheck='false'
  @input='$emit("input", $event.target.value)'
)
</template>

<script>
export default
{
  name: 'ui-textarea',
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
  resize: none
</style>
