<template lang='pug'>
transition(
  :name='fade_name'
  @after-leave='on_afterleave'
)
  div(
    :class='["ui-message"]'
    :style='style'
    v-show='visible'
  )
    .flex-row.align-bl
      faicon.fixed(
        v-if='type !== ""'
        :class='get_color()'
        :icon='get_icon()'
      )
      span.fixed {{ this.message }}
</template>

<script>
export default
{
  name: 'ui-input',
  inheritAttrs: false,

  data()
  {
    return {
      message: '',
      type: '', // '' (none), 'success', 'warning', or 'failure'
      position: 'bottom', // 'top' or 'bottom'
      duration: 2000,
      on_close: null,
      visible: false,
      ypos: 0,
    }
  }, // data
  
  computed:
  {
    style(){
      return {
        'top': `${ this.ypos }px`,
        'left': `50%`,
      }
    },

    fade_name(){
      if (['top', 'bottom'].includes(this.position))
        return `fade-${ this.position }`
      return "" // error
    }
  }, // computed

  methods:
  {
    on_afterleave(){
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    get_icon(){
      return {
        'success': 'check-circle',
        'warning': 'exclamation-circle',
        'failure': 'times-circle',
      }[this.type]
    },

    get_color(){
      return {
        'success': 'color-green',
        'warning': 'color-gold',
        'failure': 'color-red',
      }[this.type]
    },
  }, // methods

  mounted(){
    this.timer = setTimeout(() => {
      if (this.on_close !== null)
        this.on_close()
      this.visible = false
    }, this.duration)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.ui-message
  @include font

  position: fixed
  text-align: center
  transform: translateX(-50%) // centers div on screen
  transition: all $dur-fade
  padding: 8px
  background-color: $c-bg-message
  border: 1px solid $c-bg-message
  border-radius: 4px

.fade-top-enter-active, .fade-top-leave-active, .fade-bottom-enter-active, .fade-bottom-leave-active
  transition: all $dur-fade

.fade-top-enter, .fade-top-leave-to
  opacity: 0
  transform: translate(-50%, -30px) // the -50% needed to keep div centered

.fade-bottom-enter, .fade-bottom-leave-to
  opacity: 0
  transform: translate(-50%, +30px) // the -50% needed to keep div centered
</style>

