<template>
    <div class="group-info">
        <BaseEdit
            v-if="groupObj"
            :label="'组名：'"
            :val="groupObj.groupName"
            v-model="isShowGroupName"
            @confirm="confirmGroupName"
        />

        <Divider/>

        <BaseEdit
            v-if="groupObj"
            :label="'组描述：'"
            :val="groupObj.groupDesc"
            v-model="isShowGroupDesc"
            @confirm="confirmGroupDesc"
        />
    </div>
</template>

<script>
// @ is an alias to /src
import BaseEdit from '@/components/BaseEdit.vue'
import { mapGetters } from 'vuex'
import { updateGroupName, updateGroupDesc } from '@/services/index'
import { Divider } from 'iview'

export default {
    name: 'group-info',
    components: {
        BaseEdit,
        Divider
    },
    props: {
        groupId: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        isShowGroupName: true,
        isShowGroupDesc: true,
        isLoading: false
    }),
    computed: {
        ...mapGetters(['userInfo', 'groupList']),
        groupObj() {
            return (
                (this.groupList &&
                    this.groupList.find(
                        group => group.groupId === this.groupId
                    )) ||
                []
            )
        }
    },
    methods: {
        async confirmGroupName(newVal) {
            if (!this.isLoading) {
                this.isLoading = true
                console.log('confirmGroupName', newVal)
                try {
                    const res = await updateGroupName({
                        groupId: this.groupId,
                        groupName: newVal
                    })

                    if (res.code === 0) {
                        this.$Message.success('修改组名成功')
                        this.isShowGroupName = true
                        this.$set(this.groupObj, 'groupName', newVal)
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.isLoading = false
                } catch (err) {
                    this.isLoading = false
                    console.log('confirmGroupName err', err)
                }
            }
        },

        async confirmGroupDesc(newVal) {
            if (!this.isLoading) {
                this.isLoading = true
                console.log('confirmGroupDesc', newVal)
                try {
                    const res = await updateGroupDesc({
                        groupId: this.groupId,
                        groupDesc: newVal
                    })

                    if (res.code === 0) {
                        this.$Message.success('修改组描述成功')
                        this.isShowGroupDesc = true
                        this.$set(this.groupObj, 'groupDesc', newVal)
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.isLoading = false
                } catch (err) {
                    this.isLoading = false
                    console.log('confirmGroupDesc err', err)
                }
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
</style>
