<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    created() {
        this.$store.dispatch('fetchUserInfo')
    },
    computed: {
        ...mapGetters(['username', 'default_group'])
    },
    methods: {
        // 处理登录状态
        handleLoginState({ username, routeName }) {
            if (username === null) {
                console.log('未登录')
                if (routeName !== 'login') {
                    this.$router.replace({ name: 'login' })
                }
            } else if (username !== '') {
                if (routeName === 'login') {
                    const default_group = this.default_group || '0'
                    this.$router.replace({
                        name: 'group',
                        params: { groupId: default_group }
                    })
                }
            }
        }
    },
    watch: {
        username(username) {
            this.handleLoginState({ username, routeName: this.$route.name })
        },
        $route(to) {
            this.handleLoginState({
                username: this.username,
                routeName: to.name
            })
        }
    }
}
</script>
<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
