<template>
    <div class="project">
        <div class="project-info-wrapper">
            <Tabs v-model="projectMenu">
                <TabPane name="apiList" label="接口" icon="md-apps">这是接口</TabPane>

                <TabPane name="projectMember" label="项目成员管理" icon="md-people">
                    <ProjectMember  :projectId="projectId"/>
                </TabPane>

                <TabPane name="projectInfo" label="项目设置" icon="md-settings">
                    <ProjectInfo v-if="projectMenu==='projectInfo'" :projectId="projectId" @on-update="fetchProjectInfo" :projectInfo="projectInfo"/>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import { Tabs, TabPane } from 'iview'
import { getProjectInfoById, getGroupInfoById } from '@/services'
import { mapGetters, mapMutations } from 'vuex'
const ProjectInfo = () => import('@/components/project/ProjectInfo.vue')
const ProjectMember = () => import('@/components/project/ProjectMember.vue')

export default {
    name: 'project',
    props: {
        projectId: { type: String, required: true }
    },

    components: { Tabs, TabPane, ProjectInfo, ProjectMember },

    created() {
        // 根据 projectId 获取项目信息
        this.fetchProjectInfo()
    },

    data: () => ({
        projectMenu: 'apiList',
        projectInfo: {}
    }),

    methods: {
        ...mapMutations(['setBreadCrumbDesc']),
        // 获取项目信息
        async fetchProjectInfo() {
            try {
                const res = await getProjectInfoById({
                    projectId: this.projectId
                })
                console.log('fetchProjectInfo', res)
                if (res.code === 0) {
                    this.projectInfo = res.data
                    this.setBreadCrumbDesc({
                        name: 'project',
                        title: res.data.projectName
                    })
                    if (res.data.groupId) {
                        this.fetchGroupInfo(res.data.groupId)
                    }
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('fetchProjectInfo err', err)
            }
        },

        // 获取组信息
        async fetchGroupInfo(groupId) {
            try {
                const res = await getGroupInfoById({ groupId })
                console.log('fetchGroupInfo', res)
                if (res.code === 0) {
                    this.setBreadCrumbDesc({
                        name: 'group',
                        title: `${res.data.groupName}`,
                        path: `/group/${groupId}`
                    })
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('fetchGroupInfo err', err)
            }
        }
    }
}
</script>
