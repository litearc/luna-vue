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
          :class='{ highlighted: highlight === i }'
          @click='on_click(i)'
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
      choice: null,
      callback: null,
      highlight: null,
      visible: false,
      destroyed: false,
    }
  }, // data

  methods:
  {
    on_afterleave(el){
      if (!this.destroyed){
        this.destroyed = true
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
        if (typeof this.callback === 'function')
          this.callback(this.choice, this.options[this.choice])
      }
    },

    on_click(i){
      this.choice = i
      this.visible = false
    },
  }, // methods

}
</script>
