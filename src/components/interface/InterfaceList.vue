<template>
    <div class="interface-list">
        <div class="left-side-bar">
            <div class="cat-head">
                <div class="title">接口列表</div>
                <Button :size="'small'" type="primary" @click="showAddCat">添加分类</Button>
            </div>
            <CustomTree
                :treeContent="catList"
                @appendChild="showAddApi"
                @removeParent="removeCat"
                @removeChild="removeApi"
                @change="handleApiChange"
            />
        </div>

        <!-- 添加分类弹窗 -->
        <AddCat v-model="isShowAddCat" :projectId="projectId" @success="fetchCatAndApiInfo"/>

        <!-- 添加接口弹窗 -->
        <AddInterface
            v-if="catData.name"
            v-model="isShowAddApi"
            :projectId="projectId"
            :catData="catData"
            @success="fetchCatAndApiInfo"
        />

        <div class="right-content">右边内容</div>
    </div>
</template>
<script>
import { getCatAndApiInfo, deleteCat, deleteApi } from '@/services'
const CustomTree = () => import('@/components/CustomTree.vue')
const AddCat = () => import('@/components/interfaceCat/AddCat.vue')
const AddInterface = () => import('@/components/interface/AddInterface.vue')

export default {
    name: 'InterfaceList',
    components: {
        CustomTree,
        AddCat,
        AddInterface
    },
    props: {
        projectId: { type: Number, required: true },
        projectInfo: {
            type: Object,
            required: true
        }
    },
    created() {
        if (this.projectId) {
            this.fetchCatAndApiInfo()
        }
    },
    data() {
        return {
            // 分类目录
            catList: [],
            // 显示添加分类提示框
            isShowAddCat: false,
            // 显示添加接口提示框
            isShowAddApi: false,
            catData: {}
        }
    },
    methods: {
        // 点击某个api
        handleApiChange(item) {
            console.log('handleApiChange', item)
        },

        // 添加api
        showAddApi(data) {
            this.catData = data
            this.isShowAddApi = true
        },

        // 展示添加分类
        showAddCat() {
            this.isShowAddCat = true
        },

        // 删除某个分类
        removeCat(data) {
            this.$Modal.confirm({
                title: '警告',
                content: `<div>确定删除 <b>${data.name}</b> 分类？</div>`,
                loading: true,
                onOk: async () => {
                    try {
                        const deleteRes = await deleteCat({
                            catId: data._id
                        })

                        console.log('deleteCat', deleteRes)
                        if (deleteRes.code === 0) {
                            // 删除成功
                            this.$Modal.remove()
                            this.$Message.info('删除成功')
                            this.fetchCatAndApiInfo()
                        } else {
                            // 删除失败
                            this.$Modal.remove()
                            this.$Message.error(deleteRes.msg)
                        }
                    } catch (err) {
                        this.$Modal.remove()
                        console.log('deleteCat err', err)
                    }
                }
            })
        },

        // 删除某个接口
        removeApi(data) {
            this.$Modal.confirm({
                title: '警告',
                content: `<div>确定删除 <b>${data.name}</b> 接口？</div>`,
                loading: true,
                onOk: async () => {
                    try {
                        const deleteRes = await deleteApi({
                            interfaceId: data._id
                        })

                        console.log('removeApi', deleteRes)
                        if (deleteRes.code === 0) {
                            // 删除成功
                            this.$Modal.remove()
                            this.$Message.info('删除成功')
                            this.fetchCatAndApiInfo()
                        } else {
                            // 删除失败
                            this.$Modal.remove()
                            this.$Message.error(deleteRes.msg)
                        }
                    } catch (err) {
                        this.$Modal.remove()
                        console.log('removeApi err', err)
                    }
                }
            })
        },

        // 获取api和分类信息
        async fetchCatAndApiInfo() {
            try {
                const res = await getCatAndApiInfo({
                    projectId: this.projectId
                })
                console.log('fetchCatAndApiInfo', res)

                if (res.code === 0) {
                    const catList = res.data
                    catList.forEach(cat => {
                        cat.children = cat.children || []
                    })
                    this.catList = catList
                }
            } catch (err) {
                console.log('fetchCatAndApiInfo err', err)
            }
        }
    }
}
</script>
<style lang="scss">
.interface-list {
    display: flex;
    .left-side-bar {
        flex: 1;
        box-sizing: border-box;
        border-right: 1px solid #ccc;
        font-size: 16px !important;
        text-align: left;
        .cat-head {
            height: 48px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: #fedfe1;
        }
    }
    .right-content {
        flex: 5;
        background: #ccc;
    }
}
</style>
