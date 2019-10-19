<template lang='pug'>
#app
  ui-splitter
    #sidebar.flex-col(slot='slot1')
      .flex-row
        span.fix-sz.bold name
        ui-input.expand(placeholder='input name here')
      .v-sep
      .flex-row
        span.fix-sz user
        .expand
        faicon.icon.fix-sz.clickable(
          icon='cog'
          @click='on_icon_click'
        )
      .flex-row
        span.fix-sz this is a button
        ui-tooltip.fixsz(
          text='click me'
          placement='right'
        )
          button(
            @click='on_button_click'
          ) button
      .expand
      ui-tooltip.fix-sz(
        text='this is the bottom'
        placement='top'
      ) bottom of page
    #viewer(slot='slot2')
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
  }, // methods
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
  padding: 100px

  @include global

#sidebar
  padding: 8px
  background-color: $c-pane
  /* width: 300px */
  width: 100%
  height: 100vh
  
</style>
