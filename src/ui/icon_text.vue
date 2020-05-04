<template lang='pug'>
div(
  @click='$emit("click")'
  :class='{ "hover-hl": hl==="all" }'
)
  span.it-icon
    faicon(
      :icon='icon'
      :class='{ "hover-hl": hl==="icon" }'
    )
  span.it-text(
    :class='{ "hover-hl": hl==="text" }'
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
