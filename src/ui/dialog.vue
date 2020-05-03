<template lang='pug'>
.ui-dialog
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
      .fixed.pg(style='margin-bottom: 8px') {{ message }}
      .flex-row.align-bl
        .expand
        button.fixed(
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

<style scoped lang='sass'>
@import ../theme

.dialog-box
  @include font
  
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  min-width: 160px
  max-width: 320px

  background-color: $c-pane
  border-radius: 4px
  padding: 16px

.bg
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background-color: $c-semitrans

.bg-fade-enter-active, .bg-fade-leave-active, .dialog-fade-enter-active, .dialog-fade-leave-active
  transition: all $dur-fade

.bg-fade-enter, .bg-fade-leave-to
  background-color: $c-trans

.dialog-fade-enter, .dialog-fade-leave-to
  opacity: 0
</style>
