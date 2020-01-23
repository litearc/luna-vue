export default
{
  data(){
    return {
      show: false,
      pos: { top: 0, left: 0 },
      space: 0,
      mouse_in: false,
    }
  },

  props: {
    text: '',

    // ('top'|'right'|'bottom'|'left')-('top'|'right'|'bottom'|'left')
    placement: { default: 'bottom' },

    // 'hover', 'hover-keep' (for dropdown menu), 'click', or 'focus'
    trigger: { default: 'hover' },
  },

  computed: {
    popup_style(){
      return {
        'position': 'absolute',
        'top': `${ this.pos.top }px`,
        'left': `${ this.pos.left }px`,
      }
    },
  },

  methods:
  {
    set_popup_pos(){
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
    let tr = this.$refs.trigger

    switch (this.trigger){
      case 'click':
        tr.addEventListener('click', () => {
          this.show = !this.show
          if (this.show)
            this.set_popup_pos()
        })
        tr.addEventListener('mouseenter', () => {
          this.mouse_in = true
        })
        tr.addEventListener('mouseleave', () => {
          this.mouse_in = false
        })
        break

      case 'hover':
        tr.addEventListener('mouseenter', () => {
          this.show = true
          this.set_popup_pos()
          this.mouse_in = true
        })
        tr.addEventListener('mouseleave', () => {
          this.show = false
          this.mouse_in = false
        })
        break

      case 'hover-keep':
        tr.addEventListener('mouseenter', () => {
          this.show = true
          this.set_popup_pos()
          this.mouse_in = true
        })
        // the 'close' condition is handled by the popup
        tr.addEventListener('mouseleave', () => {
          this.mouse_in = false
        })
        break
      
      case 'focus':
        tr.addEventListener('focus', () => {
          this.show = true
          this.set_popup_pos()
        })
        tr.addEventListener('blur', () => {
          this.show = false
        })
        break
    }
  }
}
