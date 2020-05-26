<template lang='pug'>
ui-dropdown(
  :items='list'
  :disabled='disabled'
  :value='value'
  trigger='click'
  @input='$emit("input", $event.target.value)'
  @item-selected='on_item_select'
)
  .dropdown(
    :class='el_class'
    :style='el_style'
  )
    span.fixed {{ items[value] }}
    .expand
    span.fixed
      faicon.icon(icon='caret-down')
</template>

<script>
export default
{
  name: 'ui-combobox',

  data(){
    return{
      list: {},
    }
  },

  props: {
    disabled: { default: false },
    items: {},
    mclass: { default: null },
    mstyle: { default: null },
    value: {},
  },

  computed:
  {
    el_class(){
      let def_class = {
        disabled: this.disabled,
      }
      return (this.mclass === null) ? def_class :
        Object.assign(def_style, this.mclass)
    },

    el_style(){
      return (this.mstyle === null) ? {} : this.mstyle
    },
  },

  created(){
    this.list = []
    for (let item of this.items)
      this.list.push({
        name: item,
        contents: null,
      })
  },

  methods:
  {
    on_item_select(arr){
      this.isel = arr[0]
      this.$emit('input', this.isel)
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.dropdown
  border-radius: 4px
  background-color: $c-bg-dropdown
  padding: 4px 13px 4px 13px
  display: flex
  flex-direction: row
  align-items: baseline

  &:not(.disabled):hover
    background-color: $cE
</style>
