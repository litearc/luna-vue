<template lang='pug'>
  ui-dropdown(
    :items='list'
    trigger='click'
    @item-selected='on_item_select'
  )
    .dropdown(style='width: 200px')
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
