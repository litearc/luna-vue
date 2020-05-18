<template lang='pug'>
// reason for the "size='1'" below:
// https://stackoverflow.com/questions/29470676/why-doesnt-the-input-element-respect-min-width
input.ui-input(
  ref='el'
  v-bind='$attrs'
  :value='value'
  size='1'
  spellcheck='false'
  @keydown.enter='blur()'
  @input='$emit("input", $event.target.value)'
  @focus='$emit("focus", $event)'
  @blur='$emit("blur", $event)'
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
    small: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    mclass: { default: null },
    mstyle: { default: null },
  },

  computed:
  {
    el_class(){
      let c = {
        small: this.small,
        right: this.right,
      }
      return (this.mclass === null) ? c : this.mclass
    },

    el_style(){
      return (this.mstyle === null) ? {} : this.mstyle
    },
  }, // computed

  methods:
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

  min-width: 1px
  &.small
    height: 22px
  &.right
    text-align: right
</style>
