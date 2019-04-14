<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    created() {
        this.$store.dispatch('fetchSelfInfo')
    },
    computed: {
        ...mapGetters(['userInfo']),
        username() {
            return this.userInfo.username
        }
    },
    methods: {
        // 处理登录状态
        handleLoginState({ username, routeName }) {
            if (username && routeName === 'login') {
                // 在 login 页面且已经是登录状态
                this.$router.replace({
                    name: 'group',
                    params: { groupId: '0' }
                })
            } else if (!username && routeName !== 'login') {
                // 未登录，且不在 login 页面
                this.$router.replace({
                    name: 'login'
                })
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
