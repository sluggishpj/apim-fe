<template>
    <div class="project">
        <h2>project {{projectId}}</h2>
    </div>
</template>

<script>
export default {
    name: 'project',
    props: {
        projectId: { type: String, default: '0' }
    },
    components: {}
}
</script>
