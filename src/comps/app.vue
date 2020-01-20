<template lang='pug'>
#app
  // splitter between the left sidebar and main content area
  ui-splitter#splitter(
    min1='300px'
    max1='500px'
    mode='A'
  )

    // sidebar
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
      ui-tree(:root='dir_struct')
      .flex-row
        ui-dropdown(
          trigger='hover-keep'
          @item-selected='on_item_selected'
        )
          button dropdown menu
      .expand
      ui-tooltip.fix-sz(
        text='this is the bottom'
        placement='top'
      ) bottom of page
      ui-dropdown.fix-sz(
        trigger='hover-keep'
        placement='top'
        @item-selected='on_item_selected'
      )
        button dropdown menu

    // main content area
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
      dir_struct: {}, // folder structure
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
    on_item_selected(arr){
      console.log('item selected: ' + arr)
    },
  }, // methods

  created(){
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
  },
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

  // for some reason, `position: relative` (along with `overflow: hidden`) is
  // needed to prevent the tooltip from expanding the div
  position: relative // allows absolute position of subelements
  overflow: hidden

  @include global

#sidebar
  padding: 8px
  background-color: $c-pane
  width: 100%
  height: 100vh

</style>
