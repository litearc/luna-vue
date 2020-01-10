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
      items_: ['Hello', 'world', 'this', 'is', 'a', 'test'],
      dir_struct: {},
    }
  },

  props: {
    items: {},
  },

  created() {
    this.dir_struct = {
      name: 'root folder',
      is_folder: true,
      is_open: true,
      contents: [
        {
          name: 'folder A',
          is_folder: true,
          is_open: true,
          contents: [
            {
              name: 'item 1A',
              is_folder: false,
            },
            {
              name: 'item 1B',
              is_folder: false,
            },
          ]
        },
        {
          name: 'folder B',
          is_folder: true,
          is_open: true,
          contents: [
            {
              name: 'item 1B',
              is_folder: false,
            },
          ]
        },
        {
          name: 'item 1',
          is_folder: false,
        },
        {
          name: 'item 2',
          is_folder: false,
        },
      ]
    }
  }
}
</script>

<style lang='sass'>
@import ../theme

.item:hover
  color: $c-bright
</style>