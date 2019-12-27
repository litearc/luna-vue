<template lang='pug'>
#menu
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

}
</script>

<style lang='sass'>
</style>