<template lang='pug'>
#app
  ui-splitter(dir='horizontal')
    template(v-slot:slot1)
      span hello
    template(v-slot:slot2)
      span world
</template>

<script>
export default {
  name: 'app',

  components: {
    
  }, // components

  data(){
    return {
      input: '',
    }
  }, // data

  methods: {
    on_icon_click(){
      this.$message({
        message: 'Annotations saved successfully',
        type: 'success',
      })
    },
    on_button_click(){
      this.$dialog({
        message: `There are unsaved annotations for this series that you are
          editing. Are you sure that you want to continue without saving?`,
        options: ['Cancel', 'Ok'],
        highlight: 1,
        callback: (i, opt) => {
          console.log(`dialog closed ${i} ${opt}`)
        }
      })
    },
  } // methods
  
}
</script>

<style lang='sass'>
@import ../theme
*
  box-sizing: border-box
  user-select: none

#app
  width: 100vw
  height: 100vh
  background-color: #222

  @include global

#sidebar
  padding: 8px
  background-color: $c-pane
  width: 300px
  height: 100vh
  
</style>
