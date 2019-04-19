<template>
    <div class="project-member">
        <div class="title">
            <div class="member-count">人数：共 {{projectMemberList.length}} 人</div>
            <Button type="primary" v-if="isAdminOrLeader" @click="addProjectMember">添加项目成员</Button>
        </div>

        <template v-for="(userList, idx) in [[owner], projectLeaderList, projectDevList]">
            <div class="member" v-for="member in userList" :key="member.userId">
                <div class="username">
                    <router-link
                        :to="{name: 'user-info', params: {userId: `${member.userId}`}}"
                    >{{member.username}}</router-link>
                </div>

                <div
                    class="role"
                >{{`${roleList[idx]}${member.userId===userInfo.userId? '（本人）':''}`}}</div>

                <!-- 设置 -->
                <div class="setting" v-if="isAdminOrLeader && idx!==0">
                    <Dropdown @on-click="handleMenuClick" trigger="click" :transfer="true">
                        <Icon size="24" type="md-settings" class="setting-icon"/>
                        <DropdownMenu slot="list">
                            <DropdownItem
                                v-if="idx!==1"
                                :name="`setLeader,${member.userId}`"
                                v-text="`设置为${roleList[1]}`"
                            ></DropdownItem>
                            <DropdownItem
                                v-if="idx!==2"
                                :name="`setMember,${member.userId}`"
                                v-text="`设置为${roleList[2]}`"
                            ></DropdownItem>
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
import {
    getProjectMember,
    setProjectMemberRole,
    deleteProjectMember
} from '@/services'
import { Icon, Dropdown, DropdownMenu, DropdownItem } from 'iview'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'ProjectMember',
    props: {
        projectId: {
            type: Number,
            required: true
        },
        projectInfo: {
            type: Object,
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
        this.fetchProjectMember()
    },
    data: () => ({
        roleList: ['项目创建者', '项目负责人', '开发者'],
        projectMemberList: [],
        owner: {} // 项目创建者
    }),
    computed: {
        ...mapGetters(['userInfo']),
        projectLeaderIds() {
            return this.projectInfo.projectLeader || []
        },

        // 项目负责人列表
        projectLeaderList() {
            return this.projectMemberList.filter(user =>
                this.projectLeaderIds.some(userId => userId === user.userId)
            )
        },

        // 当前组开发成员列表
        projectDevList() {
            return this.projectMemberList.filter(user =>
                this.projectLeaderIds.every(userId => userId !== user.userId)
            )
        },

        isAdminOrLeader() {
            return true
        }
    },
    methods: {
        ...mapActions(['fetchProjectInfo']),
        async fetchProjectMember() {
            try {
                const res = await getProjectMember({
                    projectId: this.projectId
                })
                console.log('getProjectMember res', res)

                if (res.code === 0) {
                    const memberList = res.data || []
                    const idx = memberList.findIndex(
                        user => user.userId === this.projectInfo.ownerId
                    )
                    this.owner = memberList[idx]
                    memberList.splice(idx, 1)
                    this.projectMemberList = memberList
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('getProjectMember err', err)
            }
        },

        // 添加项目成员
        addProjectMember() {
            console.log('add ProjectMember')
            this.$router.push({ name: 'add-project-member' })
        },

        // 处理菜单点击事件
        handleMenuClick(val) {
            const [operator, userId] = val.split(',')
            const projectId = Number(this.projectId)
            switch (operator) {
                case 'deleteMember':
                    this.deleteMember(userId, projectId)
                    break
                case 'setLeader':
                    this.setLeader(userId, projectId)
                    break
                case 'setMember':
                    this.setMember(userId, projectId)
                    break
            }
        },

        // 删除项目成员
        async deleteMember(userId, projectId) {
            try {
                const res = await deleteProjectMember({
                    userId,
                    projectId
                })
                console.log('deleteMember', res)

                if (res.code === 0) {
                    this.$Message.success('删除成功')
                    this.fetchProjectMember()
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('deleteMember err', err)
            }
        },

        // 设置为项目负责人
        setLeader(userId, projectId) {
            this.doSetProjectMemberRole({
                userId,
                projectId,
                role: 'leader'
            })
        },

        // 设置为普通成员
        setMember(userId, projectId) {
            this.doSetProjectMemberRole({
                userId,
                projectId,
                role: 'member'
            })
        },

        async doSetProjectMemberRole({ userId, projectId, role }) {
            try {
                const res = await setProjectMemberRole({
                    userId,
                    projectId,
                    role
                })
                console.log('doSetProjectMemberRole', res)

                if (res.code === 0) {
                    this.$Message.success('修改成功')
                    this.fetchProjectInfo({ projectId: this.projectId })
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('setProjectMemberRole err', err)
            }
        }
    }
}
</script>
<style scoped lang="scss">
.project-member {
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
