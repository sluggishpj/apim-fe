<template>
  <div class="group">
    <h2>group {{groupId}}</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'group',
  props: {
      'groupId': String,
      default: '0'
  },
  components: {
    HelloWorld,
  }
};
</script>
