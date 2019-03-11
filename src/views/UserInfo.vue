<template>
    <div class="user">
        <h2>user {{userId}}</h2>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'user',
    props: {
        userId: String,
        default: '0'
    },
    components: {
        HelloWorld
    }
}
</script>
