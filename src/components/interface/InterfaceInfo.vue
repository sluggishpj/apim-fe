<template>
    <div class="interface-info">
        <Tabs name="interfaceInfo" v-model="interfaceMenu">
            <TabPane label="预览" tab="interfaceInfo" name="interfacePreview" icon="md-eye">
                <InterfacePreview
                    v-if="interfaceMenu==='interfacePreview'"
                    :apiInfo="apiInfo"
                    :projectId="projectId"
                    :basePath="basePath"
                />
            </TabPane>

            <TabPane label="编辑" tab="interfaceInfo" name="interfaceEdit" icon="md-build">
                <InterfaceEdit
                    v-if="interfaceMenu==='interfaceEdit'"
                    :catList="catList"
                    :apiInfo="apiInfo"
                    :basePath="basePath"
                />
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import { Tabs, TabPane } from 'iview'
import { mapGetters, mapActions } from 'vuex'
const InterfacePreview = () =>
    import('@/components/interface/InterfacePreview.vue')
const InterfaceEdit = () => import('@/components/interface/InterfaceEdit.vue')

export default {
    props: {
        interfaceId: {
            type: Number,
            required: true
        },
        projectId: {
            type: Number,
            required: true
        },
        catList: {
            type: Array,
            required: true
        }
    },
    components: { Tabs, TabPane, InterfacePreview, InterfaceEdit },
    data: () => ({
        interfaceMenu: 'interfacePreview'
    }),
    created() {
        if (this.interfaceId !== 0) {
            this.fetchApiInfo(this.interfaceId)
        }
    },
    methods: {
        ...mapActions(['fetchApiInfo'])
    },
    watch: {
        interfaceId(interfaceId) {
            if (interfaceId !== 0) {
                this.fetchApiInfo(interfaceId)
            }
        }
    },
    computed: {
        ...mapGetters(['projectInfo', 'apiInfo']),
        basePath() {
            return this.projectInfo.basePath
        }
    }
}
</script>
<style scoped lang="scss">
.interface-info {
    width: 100%;
}
</style>
