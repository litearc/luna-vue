<template lang='pug'>
input.ui-input(
  ref='el'
  v-bind='$attrs'
  :value='value'
  spellcheck='false'
  @input='$emit("input", $event.target.value)'
  @focus='$emit("focus", $event)'
  @blur='$emit("blue", $event)'
  :class='el_class'
  :style='el_style'
)
</template>

<script>
export default
{
  name: 'ui-input',
  inheritAttrs: false,
 
  props: {
    value: {},
    mclass: { default: null },
    mstyle: { default: null },
  },

  computed:
  {
    el_class(){
      return (this.mclass === null) ? {} : this.mclass
    },

    el_style(){
      return (this.mstyle === null) ? {} : this.mstyle
    },
  }, // computed

  method:
  {
    focus(){ this.$refs.el.focus() },
    blur(){ this.$refs.el.blur() },
  }, // methods

}
</script>

<style scoped lang='sass'>
@import ../theme
.ui-input
  @include input

  /* this hides the up/down arrows in 'number' inputs */
  &[type=number]
    -moz-appearance: textfield
    appearance: textfield

  &[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button
    -webkit-appearance: none
</style>
