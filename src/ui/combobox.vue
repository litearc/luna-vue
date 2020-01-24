<template lang='pug'>
  ui-dropdown(
    :items='list'
  )
    .dropdown(style='width: 200px')
      span.fix-sz hello
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
  }
}
</script>

<style scoped lang='sass'>
</style>
