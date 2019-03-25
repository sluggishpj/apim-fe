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
                                    :selected="groupId === group.groupId"
                                    :to="`/group/${group.groupId}`"
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
                        <TabPane name="projectList" label="项目列表" icon="md-apps">这是项目列表</TabPane>
                        <TabPane name="memberList" label="人员管理" icon="md-people">这是人员管理</TabPane>
                        <TabPane
                            name="groupInfo"
                            v-if="groupId !== userInfo.defaultGroup"
                            label="分组管理"
                            icon="md-settings"
                        >
                            <GroupInfo :groupId="groupId"/>
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
import { mapGetters } from 'vuex'
const GroupInfo = () => import('@/components/GroupInfo.vue')

export default {
    name: 'group',
    props: {
        groupId: { type: String, default: '0' }
    },

    created() {
        this.$store.dispatch('fetchGroupList')
    },

    components: {
        GroupInfo,
        Split,
        Card,
        CellGroup,
        Cell,
        Tabs,
        TabPane
    },

    beforeRouteUpdate(to, from, next) {
        // 进行初始化
        this.groupMenu = 'projectList'
        next()
    },

    computed: {
        ...mapGetters(['userInfo', 'groupList'])
    },

    data: () => ({
        sideBarPercent: 0.2,
        groupMenu: 'projectList'
    }),

    watch: {
        groupList(groupList) {
            // 获取到列表后
            if (this.groupId === '0') {
                const defaultGroup =
                    this.userInfo.defaultGroup ||
                    (groupList.length && groupList[0].groupId)

                if (defaultGroup) {
                    this.$router.replace({
                        name: 'group',
                        params: {
                            groupId: defaultGroup
                        }
                    })
                }
            }
        }
    }
}
</script>
