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
 
  props: [
    'value'
  ],
}
</script>

<style lang='sass'>
@import ../theme
#el
  @include input
</style>
