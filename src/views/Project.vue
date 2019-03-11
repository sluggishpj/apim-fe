<template>
    <div class="project">
        <h2>project {{projectId}}</h2>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'project',
    props: {
        projectId: String,
        default: '0'
    },
    components: {
        HelloWorld
    }
}
</script>
