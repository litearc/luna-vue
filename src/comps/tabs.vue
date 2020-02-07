<template lang='pug'>
#el.flex-col
  #tab-area.flex-row
    #tabs.expand
    #actions
  #content.expand
    component(
      :is='editors[0]'
    )
</template>

<script>
import Vue from 'vue'
import editor_vue from './editor.vue'
let editor_ctor = Vue.extend(editor_vue)

export default
{
  name: 'tabs',

  data(){
    return {
      itab: 0, // index of currently active tab
      editors: ()=>[],
    }
  },

  props: {
    // if the value of a given index in the tab array is `null`, display the
    // "new resource" page to load appropriate data
    tab_data: { default: ()=>[ null ] },
  },

  computed: {
  },

  components: {
  },

  created(){
    // this.editors[0] = new editor_ctor({
    //   props: { ed_data: "hello" },
    //   template: `<span>hello</span>`
    // })
    //
    // this.editors[1] = new editor_ctor({
    //   props: { ed_data: "world" },
    //   template: `<span>world</span>`
    // })

    this.editors[0] = {
      // render (h) {
      //   return h('div', 'hello')
      // }
      template: `<span>hello</span>`
    }

    console.log(this.editors[0])
    console.log(editor_vue)

    let tmp = new editor_ctor()
    console.log(tmp)
  },

  mounted(){
  },
}
</script>

<style lang='sass'>
@import ../theme

#el
  width: 100%
  height: 100%

#tab-area
  height: 24px

#tabs
  height: 100%

#actions
  width: 120px
  height: 100%
</style>

