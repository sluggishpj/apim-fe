<template>
    <div class="project-list">
        <div class="title">
            <div class="member-count">项目：共{{projectList.length}}个</div>
            <Button type="primary" v-if="isAdminOrLeader" @click="goAddProject">添加项目</Button>
        </div>
        <div class="list">
            <div
                class="project-item"
                v-for="project in projectList"
                :key="project.projectId"
                @click="goProjectInfo(project.projectId)"
            >
                <div class="logo">
                    <Icon type="logo-github"/>
                </div>
                <div class="name">{{project.projectName}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getProjectList } from '@/services/index'
import { Icon } from 'iview'

export default {
    name: 'ProjectList',
    props: {
        groupId: {
            type: Number,
            required: true
        }
    },
    components: {
        Icon
    },
    created() {
        if (this.groupId !== 0) {
            this.fetchProjectList()
        }
    },
    data: () => ({
        projectList: []
    }),
    computed: {
        ...mapGetters(['userInfo', 'groupList']),

        // 当前组leader id列表
        groupLeaderIds() {
            const targetGroup = this.groupList.find(
                group => group.groupId === this.groupId
            )
            return (targetGroup && targetGroup.groupLeader) || []
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
        // 跳转到添加项目页
        goAddProject() {
            this.$router.push({
                name: 'add-project',
                params: { groupId: this.groupId }
            })
        },

        // 获取该组下的项目列表
        async fetchProjectList() {
            try {
                const res = await getProjectList({ groupId: this.groupId })
                console.log('fetchProjectList', res)
                if (res.code === 0) {
                    this.projectList = res.data
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('fetchProjectList err', err)
            }
        },

        goProjectInfo(projectId) {
            // 跳转到project的接口页
            this.$router.push({ name: 'project', params: { projectId } })
        }
    },
    watch: {
        groupId() {
            this.fetchProjectList()
        }
    }
}
</script>
<style scoped lang="scss">
.title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 60px;
    background: #fedfe1;
    .member-count {
        font-size: 14px;
        font-weight: bold;
    }
}

.list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
}

.project-item {
    border: 1px solid transparent;
    box-sizing: border-box;
    flex: 1;
    min-width: 160px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
        border: 1px solid;
        color: #9f353a;
        .logo {
            font-size: 66px;
        }
        .name {
            font-size: 16px;
        }
    }
    .logo {
        font-size: 60px;
        transition: all 0.2s linear;
    }
    .name {
        font-size: 14px;
        padding-top: 10px;
        transition: all 0.2s linear;
    }
}
</style>
