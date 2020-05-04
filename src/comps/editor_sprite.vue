<template lang='pug'>
  span editor_sprite {{ val }}
</template>

<script>
export default
{
  name: 'editor_sprite',

  data(){
    return {
      val: null,
    }
  },

  created(){
    this.val = Math.floor(Math.random() * 101);
  },
}
</script>
