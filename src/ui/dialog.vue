<template lang='pug'>
#dialog
  transition(
    name='bg-fade'
    @after-leave='on_bg_afterleave'
  )
    .bg(
      v-show='visible'
    )
  transition(
    name='dialog-fade'
    @after-leave='on_dialog_afterleave'
  )
    .dialog-box.flex-col(
      v-show='visible'
    )
      .fix-sz {{ message }}
      .flex-row
        .expand
        button.fix-sz hello
        button.fix-sz world

</template>

<script>
export default
{
  name: 'ui-dialog',
  inheritAttrs: false,

  data()
  {
    return {
      message: '<no message provided>',
      option: ['Cancel', 'Ok'],
      highlight: null,
      visible: false
    }
  }, // data

  methods:
  {
    on_bg_afterleave(){

    },
    on_dialog_afterleave(){

    }
  } // methods

}
</script>