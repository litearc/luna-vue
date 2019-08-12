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
    .flex-row
      faicon.icon.fix-sz(
        v-if='type !== ""'
        :class='get_color()'
        :icon='get_icon()'
      )
      span.fix-sz {{ this.message }}
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
      if (['top', 'bottom'].includes(this.position)) return `fade-${ this.position }`
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
