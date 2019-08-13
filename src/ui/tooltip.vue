<template lang='pug'>
.ui-tooltip
  span(ref='trigger')
    slot
  .popup(
    ref='popup'
    v-if='show'
  )
</template>

<script>
export default
{
  name: 'ui-tooltip',

  data(){
    return {
      show: false
    }
  },

  props: {
    trigger: 'hover',
    transition: 'fade',
  },

  methods: {
    show_popup(){},

    hide_popup(){},

    set_popup_pos(){},

    on_mouseenter(){},

    on_mouseleave(){},

  }, // methods

  mounted(){
    this.$refs.trigger.$on('click', () => {
      console.log('clicked')
    })
  }
}
</script>