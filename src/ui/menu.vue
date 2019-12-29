<template lang='pug'>
#menu(ref='menu')
  .item(v-for='(item,i) in items_' :key='i')
    div {{ item }}
</template>

<script>
export default {
  name: 'ui-menu',

  data(){
    return {
      items_: ['Hello', 'world', 'this', 'is', 'a', 'test']
    }
  },

  props: {
    items: {},
  },

  mounted(){
    let menu = this.$refs.menu

    menu.addEventListener('mouseleave', () => {
      this.$emit('close')
    })
  }
}
</script>

<style lang='sass'>
</style>