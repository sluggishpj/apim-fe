<template>
    <div class="group-member">
        <div class="title">
            <div class="member-count">人数：共 {{groupMember.length}} 人</div>
            <Button type="primary" v-if="isAdminOrLeader" @click="goAddMember">添加组成员</Button>
        </div>

        <template v-for="(userList, idx) in [groupLeaderList, groupDevList]">
            <div class="member" v-for="member in userList" :key="member.userId">
                <div class="username">
                    <router-link
                        :to="{name: 'user-info', params: {userId: member.userId}}"
                    >{{member.username}}</router-link>
                </div>

                <div
                    class="role"
                >{{`${idx===0? '组长': '普通成员'}${member.userId===userInfo.userId? '（本人）':''}`}}</div>

                <!-- 设置 -->
                <div class="setting" v-if="isAdminOrLeader">
                    <Dropdown @on-click="handleMenuClick" trigger="click" :transfer="true">
                        <Icon size="24" type="md-settings" class="setting-icon"/>
                        <DropdownMenu slot="list">
                            <DropdownItem v-if="idx!==0" :name="`setLeader,${member.userId}`">设置为组长</DropdownItem>
                            <DropdownItem
                                v-if="idx!==1"
                                :name="`setMember,${member.userId}`"
                            >设置为普通成员</DropdownItem>
                            <DropdownItem
                                divided
                                v-if="member.userId!==userInfo.userId"
                                :name="`deleteMember,${member.userId}`"
                            >删除该成员</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { setGroupMemberRole, deleteGroupMember } from '@/services/index'
import { Icon, Dropdown, DropdownMenu, DropdownItem } from 'iview'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GroupMember',
    props: {
        groupId: {
            type: Number,
            required: true
        }
    },

    components: {
        Icon,
        Dropdown,
        DropdownMenu,
        DropdownItem
    },
    created() {
        if (this.groupId !== 0) {
            this.fetchGroupMember({ groupId: this.groupId })
        }
    },

    computed: {
        ...mapGetters(['userInfo', 'groupList', 'groupMember']),

        // 当前组leader id列表
        groupLeaderIds() {
            const targetGroup = this.groupList.find(
                group => group.groupId === this.groupId
            )
            return (targetGroup && targetGroup.groupLeader) || []
        },

        // 当前组leader列表
        groupLeaderList() {
            return this.groupMember.filter(user =>
                this.groupLeaderIds.some(userId => userId === user.userId)
            )
        },

        // 当前组开发成员列表
        groupDevList() {
            return this.groupMember.filter(user =>
                this.groupLeaderIds.every(userId => userId !== user.userId)
            )
        },

        // 组长或管理员
        isAdminOrLeader() {
            return (
                this.userInfo.role === 'admin' ||
                this.groupLeaderIds.includes(this.userInfo.userId)
            )
        }
    },

    methods: {
        ...mapActions(['fetchGroupMember']),

        // 跳转到添加组成员
        goAddMember() {
            console.log('goAddMember')
            this.$router.push({
                name: 'add-group-member',
                params: { groupId: this.groupId }
            })
        },

        // 处理菜单点击事件
        handleMenuClick(val) {
            const [operator, userId] = val.split(',')
            switch (operator) {
                case 'deleteMember':
                    this.deleteMember(userId)
                    break
                case 'setLeader':
                    this.setLeader(userId)
                    break
                case 'setMember':
                    this.setMember(userId)
                    break
            }
        },

        // 设置为组长
        setLeader(userId) {
            console.log('setLeader')
            this.changeRole({ userId, role: 'leader' })
        },

        // 设置为普通成员
        setMember(userId) {
            console.log('setMember')
            this.changeRole({ userId, role: 'member' })
        },

        // 删除组成员
        deleteMember(userId) {
            console.log('deleteMember')
            this.$Modal.confirm({
                title: '警告',
                content: '<h3>确定删除该成员？</h3>',
                loading: true,
                onOk: async () => {
                    try {
                        const deleteRes = await deleteGroupMember({
                            groupId: this.groupId,
                            userId
                        })

                        console.log('deleteGroupMember', deleteRes)
                        if (deleteRes.code === 0) {
                            // 删除成功
                            this.$Modal.remove()
                            this.$Message.info('删除成功')

                            const targetIdx = this.groupMember.findIndex(
                                user => user.userId === userId
                            )
                            this.groupMember.splice(targetIdx, 1)
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
        },

        // 更改角色
        async changeRole({ userId, role }) {
            userId = Number(userId)
            try {
                const res = await setGroupMemberRole({
                    userId,
                    role,
                    groupId: this.groupId
                })
                console.log('changeRole', res)

                if (res.code === 0) {
                    this.$Message.success('更改角色成功')
                    const nowGroup = this.groupList.find(
                        group => group.groupId === this.groupId
                    )
                    if (role === 'leader') {
                        // 设为组长
                        nowGroup.groupLeader.push(userId)
                    } else if (role === 'member') {
                        // 设为普通成员
                        const { groupLeader } = nowGroup
                        nowGroup.groupLeader = groupLeader.filter(
                            uid => uid !== userId
                        )
                    }
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                this.$Message.error('更改角色失败')
                console.log('changeRole err', err)
            }
        }
    },

    watch: {
        groupId(gId) {
            this.fetchGroupMember({ groupId: gId })
        }
    }
}
</script>

<style lang="scss" scoped>
.group-member {
    font-size: 14px;
}
.title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 60px;
    background: #eee;
    .member-count {
        font-size: 14px;
        font-weight: bold;
    }
}
.member {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    padding: 0 40px;
    border-bottom: 1px solid #f3f3f3;
    &:hover {
        background: #f3f3f3;
    }
    .username {
        flex: 1 0;
        a {
            padding: 0 20px;
            color: #0f2540;
            text-decoration: none;
            &:hover {
                color: #2d8cf0;
            }
        }
    }

    .role {
        flex: 1 0;
    }

    .setting {
        flex: 0 0 100px;
        margin: 0 20px;
        .setting-icon {
            cursor: pointer;
        }
    }
}
</style>
