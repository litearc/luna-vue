<template lang='pug'>
#app
  .flex-row
    #sidebar.fix-sz.flex-col
      .flex-row
        span.fix-sz.bold name
        ui-input.expand(placeholder='input name here')
      .v-sep
      .flex-row
        span.fix-sz user
        .expand
        faicon.icon.fix-sz.clickable(
          icon='user-secret'
          @click='on_icon_click'
        )
      .expand
      span.fix-sz bottom of page
    #viewer.expand
</template>

<script>
export default {
  name: 'app',

  components: {
    
  },

  data(){
    return {
      input: '',
    }
  },

  methods: {
    on_icon_click(){
      this.$message({
        message: 'Annotations saved successfully',
        type: 'success',
      })
    }
  }
  
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
