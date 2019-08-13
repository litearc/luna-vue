<template lang='pug'>
span.ui-tooltip
  // the `display: inline-block` is needed for the `trigger` div to be the same
  // size as the slot, but not expand more than that
  div(ref='trigger' style='display: inline-block')
    slot
  .tooltip(
    v-if='show'
    ref='popup'
    :style='popup_style'
  ) {{ text }}
</template>

<script>
export default
{
  name: 'ui-tooltip',

  data(){
    return {
      show: false,
      pos: { top: 0, left: 0 },
      space: 4, // space (px) between trigger and popup 
    }
  },

  computed: {
    popup_style(){
      return {
        'position': 'absolute',
        'top': `${ this.pos.top }px`,
        'left': `${ this.pos.left }px`,
      }
    }
  },

  props: {
    text: '',
    placement: {default: 'bottom'}, // ('top'|'right'|'bottom'|'left')-('top'|'right'|'bottom'|'left')
    trigger: {default: 'hover'}, // 'hover', 'click', or 'focus'
    transition: 'fade',
  },

  methods: {
    set_popup_pos()
    {
      // if `nextTick` is not used, (pw, ph, pl, pt) all return 0
      this.$nextTick(() => {

        let trigger = this.$refs.trigger,
            popup = this.$refs.popup

        let tw = trigger.offsetWidth,
            th = trigger.offsetHeight,
            tl = trigger.offsetLeft,
            tt = trigger.offsetTop

        let pw = popup.offsetWidth,
            ph = popup.offsetHeight,
            pl = popup.offsetLeft,
            pt = popup.offsetTop

        let top = 0,
            left = 0

        switch (this.placement) {
          case 'top':
            left = tl - pw/2 + tw/2
            top = tt - ph - this.space
            break
          case 'top-left':
            left = tl
            top = tt - ph - this.space
            break
          case 'top-right':
            left = tl + tw - pw
            top = tt - ph - this.space
            break
          case 'left':
            left = tl - pw - this.space
            top = tt + th/2 - ph/2
            break
          case 'left-top':
            left = tl - pw - this.space
            top = tt
            break
          case 'left-bottom':
            left = tl - pw - this.space
            top = tt + th - ph
            break
          case 'right':
            left = tl + tw + this.space
            top = tt + th/2 - ph/2
            break
          case 'right-top':
            left = tl + tw + this.space
            top = tt
            break
          case 'right-bottom':
            left = tl + tw + this.space
            top = tt + th - ph
            break
          case 'bottom':
            left = tl - pw/2 + tw/2
            top = tt + th + this.space
            break
          case 'bottom-left':
            left = tl
            top = tt + th + this.space
            break
          case 'bottom-right':
            left = tl + tw - pw
            top = tt + th + this.space
            break
          default:
            // if user set wrong placement, then use default 'bottom'
            left = tl - pw/2 + tw/2
            top = tt + th + this.space
            break
        }

        this.pos.top = top
        this.pos.left = left
      })
    },

  }, // methods

  mounted(){
    let el = this.$refs.trigger

    switch (this.trigger){
      case 'click':
        el.addEventListener('click', () => {
          this.show = ! this.show
          if (this.show)
            this.set_popup_pos()
        })
        break

      case 'hover':
        el.addEventListener('mouseenter', () => {
          this.show = true
          this.set_popup_pos()
        })
        el.addEventListener('mouseleave', () => {
          this.show = false
        })
        break
      
      case 'focus':
        el.addEventListener('focus', () => {
          this.show = true
          this.set_popup_pos()
        })
        el.addEventListener('blur', () => {
          this.show = false
        })
        break
    }
  }
}
</script>