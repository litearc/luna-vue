<template lang='pug'>
ui-dropdown(
  :items='list'
  trigger='click'
  @item-selected='on_item_select'
)
  .dropdown(
    :class='el_class'
    :style='el_style'
  )
    span.fixed {{ items[isel] }}
    .expand
    span.fixed
      faicon(icon='caret-down')
</template>

<script>
export default
{
  name: 'ui-combobox',

  data(){
    return{
      list: {},
      isel: 0,
    }
  },

  props: {
    items: {},
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
      this.$emit('item_selected', this.isel)
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.dropdown
  border-radius: 4px
  background-color: $c-dropdown
  padding: 4px 13px 4px 13px
  display: flex
  flex-direction: row
  align-items: baseline

  &:hover
    background-color: $cD
</style>
