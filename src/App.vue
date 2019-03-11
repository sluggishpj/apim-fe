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
        ...mapGetters(['username'])
    },
    methods: {
        // 处理登录状态
        handleLoginState({ username, routeName }) {
            console.log('username', username)
            console.log('routeName', routeName)
            if (username === null) {
                console.log('未登录')
                if (routeName !== 'login') {
                    this.$router.replace({ name: 'login' })
                }
            } else if (username !== '') {
                console.log('已登录')
                if (routeName === 'login') {
                    this.$router.replace({ name: 'home' })
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
