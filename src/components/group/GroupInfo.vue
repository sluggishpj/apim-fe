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

        <Divider/>

        <Button type="error" @click="confirmDelete">删除分组</Button>
        <Divider/>
    </div>
</template>

<script>
// @ is an alias to /src
import BaseEdit from '@/components/BaseEdit.vue'
import { mapGetters } from 'vuex'
import { updateGroupName, updateGroupDesc, deleteGroup } from '@/services/index'
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
        // 确定组名
        async confirmGroupName(newGroupName) {
            if (!this.isLoading) {
                this.isLoading = true
                console.log('confirmGroupName', newGroupName)
                try {
                    const res = await updateGroupName({
                        groupId: this.groupId,
                        groupName: newGroupName
                    })

                    if (res.code === 0) {
                        this.$Message.success('修改组名成功')
                        this.isShowGroupName = true
                        this.$set(this.groupObj, 'groupName', newGroupName)
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

        async confirmGroupDesc(newGroupDesc) {
            if (!this.isLoading) {
                this.isLoading = true
                console.log('confirmGroupDesc', newGroupDesc)
                try {
                    const res = await updateGroupDesc({
                        groupId: this.groupId,
                        groupDesc: newGroupDesc
                    })

                    if (res.code === 0) {
                        this.$Message.success('修改组描述成功')
                        this.isShowGroupDesc = true
                        this.$set(this.groupObj, 'groupDesc', newGroupDesc)
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.isLoading = false
                } catch (err) {
                    this.isLoading = false
                    console.log('confirmGroupDesc err', err)
                }
            }
        },

        // 删除分组
        confirmDelete() {
            this.$Modal.confirm({
                title: '警告',
                content: '<h3>确定删除该组？</h3>',
                loading: true,
                onOk: async () => {
                    try {
                        const deleteRes = await deleteGroup({
                            groupId: this.groupId
                        })

                        console.log('deleteGroup', deleteRes)
                        if (deleteRes.code === 0) {
                            // 删除成功
                            this.$Modal.remove()
                            this.$Message.info('删除成功')

                            // 从 vuex 中删除
                            this.$store.commit('deleteGroup', {
                                groupId: deleteRes.data.groupId
                            })

                            // 跳转回首页
                            this.$router.replace({
                                name: 'group',
                                params: { groupId: '0' }
                            })
                        } else {
                            // 删除失败
                            this.$Modal.remove()
                            this.$Message.error(deleteRes.msg)
                        }
                    } catch (err) {
                        this.$Modal.remove()
                        console.log('deleteGroup err', err)
                        this.$Message.error('出错了')
                    }
                }
            })
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
