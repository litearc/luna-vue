<template lang='pug'>
div.it-div(
  @click='$emit("click")'
  :class='{ "hl-hover": hl==="all" }'
)
  span.it-icon
    faicon(
      :icon='icon'
      :class='{ "hl-hover": hl==="icon" }'
    )
  span.it-text(
    :class='{ "hl-hover": hl==="text" }'
  ) {{ text }}
</template>

<script>
export default
{
  name: 'ui-icon-text',

  props: {
    icon: {},
    text: {},
    hl: { default: null },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>
