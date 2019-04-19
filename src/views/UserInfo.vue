<template>
    <div class="user-info">
        <h2 class="title">用户信息</h2>
        <BaseEdit
            :label="'用户名：'"
            :val="targetUserInfo.username"
            :canEdit="isSelf"
            v-model="isShowUsername"
            @cancel="handleCancel"
            @confirm="handleConfirm"
        />
    </div>
</template>

<script>
// @ is an alias to /src
import BaseEdit from '@/components/BaseEdit.vue'
import { mapGetters } from 'vuex'
import { updateUsername, getUserInfo } from '@/services/index'

export default {
    name: 'user-info',
    components: {
        BaseEdit
    },
    props: {
        userId: {
            type: String,
            required: true
        }
    },
    created() {
        const { userId } = this.userInfo
        if (userId) {
            if (userId === Number(this.userId)) {
                this.targetUserInfo = this.userInfo
            } else {
                this.fetchUserInfo(this.userId)
            }
        }
    },
    beforeRouteUpdate(to, from, next) {
        const { userId } = this.userInfo
        console.log('userId', userId)
        if (userId === Number(to.params.userId)) {
            this.targetUserInfo = this.userInfo
        } else {
            this.fetchUserInfo(to.params.userId)
        }
        next()
    },
    data: () => ({
        isShowUsername: true,
        isLoading: false,
        targetUserInfo: {}
    }),
    computed: {
        ...mapGetters(['userInfo']),
        isSelf() {
            return Number(this.userId) === this.userInfo.userId
        }
    },
    methods: {
        handleCancel() {
            console.log('handleCancel')
        },
        async handleConfirm(newVal) {
            if (!this.isLoading) {
                this.isLoading = true
                console.log('handleConfirm', newVal)
                const res = await updateUsername({ username: newVal })
                if (res.code === 0) {
                    this.$Message.success('修改成功')
                    this.isShowUsername = true
                    this.$store.commit('setUserInfo', {
                        ...this.userInfo,
                        username: newVal
                    })
                } else {
                    this.$Message.error(res.msg)
                }
                this.isLoading = false
            }
        },
        // 获取某个用户公开信息
        async fetchUserInfo(userId) {
            try {
                const res = await getUserInfo({userId})
                console.log('fetchUserInfo res', res)
                if (res.code === 0) {
                    this.targetUserInfo = res.data
                } else {
                    this.$Message.error(res.msg)
                    res.data = {}
                }
            } catch (err) {
                console.log('fetchUserInfo err', err)
            }
        }
    },
    watch: {
        userInfo(info) {
            if (info.userId === Number(this.userId)) {
                this.targetUserInfo = info
            } else {
                this.fetchUserInfo(this.userId)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.user-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.title {
    padding: 20px 0;
}
</style>
