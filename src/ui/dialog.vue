<template lang='pug'>
#dialog
  transition(
    name='bg-fade'
    @after-leave='on_afterleave'
  )
    .bg(
      v-show='visible'
    )
  transition(
    name='dialog-fade'
    @after-leave='on_afterleave'
  )
    .dialog-box.flex-col(
      v-show='visible'
    )
      .fix-sz.pg(style='margin-bottom: 8px') {{ message }}
      .flex-row
        .expand
        button.fix-sz(
          v-for='(opt, i) in options'
          :key='i'
          @click='on_click'
        ) {{ opt }}

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
      options: ['Cancel', 'Ok'],
      highlight: null,
      visible: false,
      destroyed: false
    }
  }, // data

  methods:
  {
    on_afterleave(el){
      if (!this.destroyed){
        this.$emit('done')
        this.destroyed = true
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }
    },
    on_click(){
      this.visible = false
    }
  } // methods

}
</script>