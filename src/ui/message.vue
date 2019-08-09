<template lang='pug'>
transition(
  name='fade'
  @after-leave='on_afterleave'
)
  div(
    :class='["ui-message"]'
    :style='style'
    v-show='visible'
  )
    slot
      span Enter message here
</template>

<script>
export default
{
  name: 'ui-input',
  inheritAttrs: false,

  data()
  {
    return {
      duration: 2000,
      on_close: null,
      visible: false,
      width: 0,
      ypos: 0
    }
  }, // data
  
  computed:
  {
    style(){
      return {
        'top': `${ this.ypos }px`,
        'left': `50%`,
        'margin-left': `-${ this.width/2 }px`
      }
    }
  }, // computed

  methods:
  {
    on_afterleave(){
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }, // methods

  mounted(){
    this.timer = setTimeout(() => {
      if (this.on_close !== null)
        this.on_close()
      this.visible = false
    }, this.duration)
  }
}
</script>
