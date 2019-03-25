<template>
    <div class="user-info">
        <h2 class="title">用户信息</h2>
        <BaseEdit
            :label="'用户名：'"
            :val="userInfo.username"
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
import { updateUsername } from '@/services/index'

export default {
    name: 'user-info',
    components: {
        BaseEdit
    },
    props: {
        userId: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        isShowUsername: true,
        isLoading: false
    }),
    computed: {
        ...mapGetters(['userInfo'])
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
