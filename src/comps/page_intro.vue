<template lang='pug'>
  #icon-menu
    ui-icon-text(
      icon='file'
      text='New File'
      hl='text'
      @click='$emit("new_file_selected")'
    )
    ui-icon-text(
      icon='folder'
      text='New Project'
      hl='text'
      @click='$emit("new_proj_selected")'
    )
    ui-icon-text(
      icon='folder-open'
      text='Open File / Project'
      hl='text'
      @click='on_open'
    )
</template>

<script>
export default {
  name: 'page-intro',

  methods:
  {
    on_open(){
      // open file / folder select dialog, and return path
    },
  },
}
</script>
