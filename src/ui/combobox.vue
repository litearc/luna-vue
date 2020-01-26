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
      span.fix-sz {{ items[isel] }}
      .expand
      span.fix-sz
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
    },
  },
}
</script>

<style scoped lang='sass'>
</style>
