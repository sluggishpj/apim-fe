<template>
    <router-view></router-view>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props: {
        projectId: { type: String, required: true }
    },
    created() {
        this.fetchProjectInfo({ projectId: this.projectId })
    },
    methods: {
        ...mapActions(['fetchProjectInfo'])
    }
}
</script>
