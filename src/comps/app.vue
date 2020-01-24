<template lang='pug'>
#app.center
  #icon-menu(v-if='show == "start_menu"')
    ui-icon-text(
      icon='file'
      text='New File'
      hl='text'
      @click='on_new_file'
    )
    ui-icon-text(
      icon='folder'
      text='New Project'
      hl='text'
      @click='on_new_proj'
    )
    ui-icon-text(
      icon='folder-open'
      text='Open File / Project'
      hl='text'
      @click='on_open'
    )

  #new-file-menu(v-if='show == "new_file_menu"')
    .flex-row
      faicon.icon.clickable.fix-sz(
        icon='arrow-left'
        style='align-self: center'
        @click='back_to_start'
      )
      ui-radio.fix-sz(
        :items='["Sprite", "Animation", "Tileset", "Map"]'
      )
      ui-combobox(
        :items='["Sprite", "Animation", "Tileset", "Map"]'
      )
</template>

<script>
export default {
  name: 'app',

  data(){
    return {
      show: 'start_menu',
    }
  },

  methods:
  {
    on_new_file(){
      this.show = 'new_file_menu'
    },

    on_new_proj(){
    },

    on_open(){
    },

    back_to_start(){
      this.show = 'start_menu'
    },
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

.item-icon
  display: inline-block
  text-align: center
  width: 24px

.menu-item:hover
  color: $c-bright

</style>
