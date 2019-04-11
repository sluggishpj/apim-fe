<template>
    <div class="project" v-if="projectInfo">
        <div class="project-info-wrapper">
            <Tabs v-model="projectMenu">
                <TabPane name="apiList" label="接口" icon="md-apps">这是接口</TabPane>

                <TabPane name="projectMember" label="项目成员管理" icon="md-people">
                    <ProjectMember
                        v-if="projectMenu==='projectMember'"
                        :projectInfo="projectInfo"
                        :projectId="projectId"
                    />
                </TabPane>

                <TabPane name="projectInfo" label="项目设置" icon="md-settings">
                    <ProjectInfo
                        v-if="projectMenu==='projectInfo'"
                        :projectId="projectId"
                        :projectInfo="projectInfo"
                    />
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import { Tabs, TabPane } from 'iview'
import { mapGetters } from 'vuex'

const ProjectInfo = () => import('@/components/project/ProjectInfo.vue')
const ProjectMember = () => import('@/components/project/ProjectMember.vue')

export default {
    name: 'project-home',
    components: { Tabs, TabPane, ProjectInfo, ProjectMember },

    data: () => ({
        projectMenu: 'apiList'
    }),

    computed: {
        ...mapGetters(['projectInfo']),
        projectId() {
            return this.projectInfo.projectId
        }
    }
}
</script>
