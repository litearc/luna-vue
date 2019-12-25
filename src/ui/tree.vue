<template lang='pug'>
#tree
  // first list folders ...
  span {{ root.name }}
  // ... then files
  #contents(v-if='root.is_folder && root.is_open')
    #folder(v-for='f in folders') {{ f.name }}
    #file(v-for='f in files') {{ f.name }}
</template>

<script>
export default {
  name: 'ui-tree',

  props: {
    root: {},
    indent: { default: 0 },
  },

  computed: {
    files(){
      return this.root.contents.filter(f => !f.is_folder)
    },

    folders(){
      return this.root.contents.filter(f => f.is_folder)
    }
  }, //computed

  created(){
    console.log(this.root)
  },
}
</script>

<style lang='sass'>
</style>
