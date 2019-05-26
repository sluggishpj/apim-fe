<template>
    <div class="interface-list">
        <div class="left-side-bar">
            <div class="cat-head">
                <div class="title">接口列表</div>
                <Button :size="'small'" type="primary" @click="showAddCat">添加分类</Button>
            </div>
            <CustomTree
                class="custom-tree"
                :treeContent="catList"
                :selectedItem="selectedItem"
                @appendChild="showAddApi"
                @removeParent="removeCat"
                @editParent="updateCat"
                @removeChild="removeApi"
                @change="handleApiChange"
            />
        </div>

        <!-- 添加分类弹窗 -->
        <AddCat
            v-model="isShowAddCat"
            :projectId="Number(projectId)"
            @success="fetchCatAndApiInfo"
        />

        <!-- 修改分类弹窗 -->
        <UpdateCat v-model="isShowUpdateCat" :catData="catData" @success="fetchCatAndApiInfo"/>

        <!-- 添加接口弹窗 -->
        <AddInterface
            v-if="catData.name"
            v-model="isShowAddApi"
            :projectId="Number(projectId)"
            :catData="catData"
            @success="fetchCatAndApiInfo"
        />

        <div class="right-content">
            <InterfaceInfo
                :catList="catList"
                :projectId="Number(projectId)"
                :interfaceId="Number(interfaceId)"
            />
        </div>
    </div>
</template>
<script>
import { getCatAndApiInfo, deleteCat, deleteApi } from '@/services'
const CustomTree = () => import('@/components/CustomTree.vue')
const AddCat = () => import('@/components/interfaceCat/AddCat.vue')
const UpdateCat = () => import('@/components/interfaceCat/updateCat.vue')
const AddInterface = () => import('@/components/interface/AddInterface.vue')
const InterfaceInfo = () => import('@/components/interface/InterfaceInfo.vue')

export default {
    name: 'InterfaceList',
    components: {
        CustomTree,
        AddCat,
        UpdateCat,
        AddInterface,
        InterfaceInfo
    },
    props: {
        projectId: { type: String, required: true },
        interfaceId: { type: String, required: true },
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
            // 显示修改分类提示框
            isShowUpdateCat: false,
            // 显示添加接口提示框
            isShowAddApi: false,
            catData: {},
            // 选中的那一项的引用
            selectedItem: {},
            // 父结点
            parentItem: {}
        }
    },
    beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate')
        const interfaceId = Number(to.params.interfaceId)
        if (interfaceId === this.selectedItem._id) {
            // 说明是点击树形图切换的
        } else {
            // 浏览器前进后退切换的，需更新 selectItem
            this.selectedItem = this.getSelectedItem(interfaceId, this.catList)
            this.$set(this.parentItem, 'expand', true)
        }
        next()
    },
    methods: {
        // 点击某个api
        handleApiChange(item) {
            console.log('handleApiChange', item)
            this.selectedItem = item
            this.$router.push({
                name: 'interface',
                params: { interfaceId: `${item._id}` }
            })
        },

        getSelectedItem(interfaceId, catAndApiInfo) {
            let targetApi = {}
            for (let i = 0, len = catAndApiInfo.length; i < len; i++) {
                const api = catAndApiInfo[i]
                if (!api.children) {
                    // 说明是接口
                    if (api._id === Number(interfaceId)) {
                        targetApi = api
                        break
                    }
                } else {
                    // 说明是分类
                    this.parentItem = api
                    targetApi = this.getSelectedItem(interfaceId, api.children)
                    if (targetApi && targetApi.name) {
                        break
                    }
                }
            }
            return targetApi
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

        // 修改某个分类
        updateCat(data) {
            this.catData = data
            this.isShowUpdateCat = true
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
                    projectId: Number(this.projectId)
                })
                console.log('fetchCatAndApiInfo', res)

                if (res.code === 0) {
                    const catList = res.data
                    catList.forEach(cat => {
                        cat.children = cat.children || []
                    })
                    this.catList = catList
                    this.selectedItem = this.getSelectedItem(
                        this.interfaceId,
                        catList
                    )
                    this.$set(this.parentItem, 'expand', true)
                }
            } catch (err) {
                console.log('fetchCatAndApiInfo err', err)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.interface-list {
    display: flex;
    width: 100vw;
    .left-side-bar {
        overflow: hidden;
        flex: 0 0 20vw;
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

        .custom-tree {
            padding-left: 20px;
        }
    }
    .right-content {
        width: 80vw;
    }
}
</style>
