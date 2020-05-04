<template lang='pug'>
  span editor_anim {{ val }}
</template>

<script>
export default
{
  name: 'editor_anim',

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
