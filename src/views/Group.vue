<template>
    <div class="group">
        <Split v-model="sideBarPercent" :min="'200px'" :max="'200px'">
            <div slot="left" class="demo-split-pane">
                <div class="side-bar">
                    <div class="group-list">
                        <Card title="组列表" icon="ios-options" :padding="0">
                            <CellGroup>
                                <Cell
                                    v-for="group in groupList"
                                    :key="group.groupId"
                                    :title="`${group.groupName || '个人组'}`"
                                    :label="group.groupDesc"
                                    :selected="gId === group.groupId"
                                    :to="{name: 'group', params: {groupId: group.groupId.toString(), title: group.groupName}}"
                                >
                                    <!-- <Icon slot="extra" type="ios-cube-outline" size="16" /> -->
                                </Cell>
                            </CellGroup>
                        </Card>
                    </div>
                </div>
            </div>
            <div slot="right" class="demo-split-pane">
                <div class="group-info-wrapper">
                    <Tabs v-model="groupMenu">
                        <TabPane name="projectList" label="项目列表" icon="md-apps">
                            <ProjectList :groupId="gId"/>
                        </TabPane>

                        <TabPane
                            v-if="!isSelfGroup"
                            name="memberList"
                            label="组成员管理"
                            icon="md-people"
                        >
                            <GroupMember :groupId="gId"/>
                        </TabPane>

                        <TabPane
                            name="groupInfo"
                            v-if="gId !== userInfo.defaultGroup"
                            label="组信息管理"
                            icon="md-settings"
                        >
                            <GroupInfo :groupId="gId"/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Split>
    </div>
</template>

<script>
// @ is an alias to /src
import { Split, Card, CellGroup, Cell, Tabs, TabPane } from 'iview'
import { mapGetters, mapMutations, mapActions } from 'vuex'
const GroupInfo = () => import('@/components/group/GroupInfo.vue')
const GroupMember = () => import('@/components/group/GroupMember.vue')
const ProjectList = () => import('@/components/project/ProjectList.vue')

export default {
    name: 'group',
    props: {
        groupId: { type: String, default: '0' }
    },

    created() {
        this.fetchGroupList()
        if (this.groupId === '0') {
            this.goDefaultGroup()
        } else {
            this.fetchGroupInfo({ groupId: this.gId })
        }
    },

    components: {
        ProjectList,
        GroupInfo,
        GroupMember,
        Split,
        Card,
        CellGroup,
        Cell,
        Tabs,
        TabPane
    },

    beforeRouteUpdate(to, from, next) {
        // 如果跳到个人组，则判断当前的 groupMenu 是否在项目列表
        // 不是的话则切换到项目列表
        const groupId = Number(to.params.groupId)
        if (groupId === 0) {
            // 回到主页
            this.goDefaultGroup()
        } else {
            this.fetchGroupInfo({ groupId })
            if (
                groupId === this.userInfo.defaultGroup &&
                this.groupMenu !== 'projectList'
            ) {
                // 从其他组跳到个人组，需要隐藏部分功能按钮
                this.groupMenu = 'projectList'
            }
            next()
        }
    },

    computed: {
        ...mapGetters(['userInfo', 'groupList']),

        // 是否是个人组
        isSelfGroup() {
            return this.gId === this.userInfo.defaultGroup
        },

        gId() {
            return Number(this.groupId)
        }
    },

    data: () => ({
        sideBarPercent: 0.2,
        groupMenu: 'projectList'
    }),

    methods: {
        ...mapMutations(['setBreadCrumbDesc']),
        ...mapActions(['fetchGroupInfo', 'fetchGroupList']),

        // 跳转到默认显示的组
        goDefaultGroup() {
            let groupId = 0
            const userInfo = this.userInfo
            const groupList = this.groupList

            if (userInfo.role === 'admin' && groupList.length) {
                groupId = groupList[0].groupId
            } else if (userInfo.role === 'member') {
                groupId = userInfo.defaultGroup
            }
            this.$router.replace({
                name: 'group',
                params: {
                    groupId: groupId.toString()
                }
            })
        }
    },

    watch: {
        groupList() {
            // 获取到组列表后
            if (this.gId === 0) {
                this.goDefaultGroup()
            } else {
                this.fetchGroupInfo({ groupId: this.gId })
            }
        }
    }
}
</script>
