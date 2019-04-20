<template>
    <div class="interface-info">
        <Tabs>
            <TabPane name="apiList" label="预览" icon="md-eye">
                <InterfacePreview :apiInfo="apiInfo" :projectId="projectId"/>
            </TabPane>

            <TabPane name="projectMember" label="编辑" icon="md-build">
                <InterfaceEdit :apiInfo="apiInfo"/>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import { Tabs, TabPane } from 'iview'
import { getApi } from '@/services'
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
        }
    },
    components: { Tabs, TabPane, InterfacePreview, InterfaceEdit },
    data: () => ({
        apiInfo: {} // api 详情
    }),
    created() {
        if (this.interfaceId !== 0) {
            this.fetchApiInfo(this.interfaceId)
        }
    },
    methods: {
        async fetchApiInfo(interfaceId) {
            try {
                const res = await getApi({ interfaceId })
                console.log('fetchApiInfo res', res)
                if (res.code === 0) {
                    this.apiInfo = res.data
                }
            } catch (err) {
                console.log('fetchApiInfo err', err)
            }
        }
    },
    watch: {
        interfaceId(interfaceId) {
            if (interfaceId !== 0) {
                this.fetchApiInfo(interfaceId)
            }
        }
    }
}
</script>
<style scoped lang="scss">
</style>
