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
                                    :key="group.group_id"
                                    :title="`${group.group_name || '个人组'}`"
                                    :label="group.group_desc"
                                    :selected="groupId === group._id"
                                    :to="`/group/${group._id}`"
                                >
                                    <!-- <Icon slot="extra" type="ios-cube-outline" size="16" /> -->

                                </Cell>
                            </CellGroup>
                        </Card>
                    </div>
                </div>
            </div>
            <div slot="right" class="demo-split-pane">
                <div class="project-wrapper">项目列表容器</div>
            </div>
        </Split>
    </div>
</template>

<script>
// @ is an alias to /src
import { getGroupList } from '@/services'
import { Split, Card, CellGroup, Cell, Icon } from 'iview'
import { mapGetters } from 'vuex'

export default {
    name: 'group',
    props: {
        groupId: String,
        default: '0'
    },
    components: {
        Split,
        Card,
        CellGroup,
        Cell,
        Icon
    },
    computed: {
        ...mapGetters(['default_group', 'groupList'])
    },
    data: () => ({
        sideBarPercent: 0.2
    })
}
</script>
