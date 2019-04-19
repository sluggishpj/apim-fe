<template>
    <!-- 添加接口表单 -->
    <Modal
        title="添加接口"
        v-model="isShowAddApi"
        :mask-closable="false"
        :loading="loading"
        @on-ok="doAddApi"
    >
        <Form ref="apiForm" :model="apiForm" class="api-form" :rules="apiRules" :label-width="80">
            <FormItem prop="catId" label="接口分类">
                <Select v-model="apiForm.catId">
                    <Option :value="catData._id">{{catData.name}}</Option>
                </Select>
            </FormItem>

            <FormItem prop="name" label="接口名称">
                <Input type="text" v-model="apiForm.name" placeholder="请输入接口名"></Input>
            </FormItem>

            <FormItem prop="path" label="接口路径">
                <Input v-model="apiForm.path">
                    <Select v-model="apiForm.method" slot="prepend" style="width: 80px">
                        <Option value="get">GET</Option>
                        <Option value="post">POST</Option>
                    </Select>
                </Input>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview'
import { addApi } from '@/services'

export default {
    name: 'AddInterface',
    components: {
        Modal,
        Form,
        FormItem,
        Input,
        Select,
        Option
    },
    props: {
        projectId: {
            type: Number,
            required: true
        },
        catData: {
            type: Object,
            required: true
        },
        value: {
            type: Boolean,
            required: true
        }
    },
    data() {
        // 验证接口名
        const validateName = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('接口名不能为空'))
            } else if (value.trim().length > 50) {
                callback(new Error('接口名长度不能超过50'))
            } else {
                callback()
            }
            this.$set(this.apiForm, 'name', value.trim())
        }

        // 验证接口路径
        const validatePath = (rule, value, callback) => {
            if (value.indexOf('/') !== 0) {
                this.$set(this.apiForm, 'path', `/${value.trim()}`)
            }
            if (value.trim().length > 100) {
                callback(new Error('字数不能超过100'))
            } else {
                callback()
            }
        }
        return {
            apiForm: {
                catId: '',
                name: '',
                method: '',
                path: '',
                projectId: this.projectId
            },
            apiRules: {
                catId: [{ type: 'number', required: true, trigger: 'blur' }],
                name: [
                    {
                        validator: validateName,
                        required: true,
                        trigger: 'blur'
                    }
                ],
                method: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请求方法不能为空'
                    }
                ],
                path: [
                    {
                        validator: validatePath,
                        required: true,
                        trigger: 'blur'
                    }
                ]
            },
            loading: true
        }
    },
    created() {
        this.init(this.catData)
    },
    watch: {
        catData(data) {
            this.init(data)
        }
    },
    methods: {
        doAddApi() {
            this.$refs.apiForm.validate(async valid => {
                if (valid) {
                    try {
                        const res = await addApi(this.apiForm)
                        console.log('addApi', res)
                        this.isShowAddApi = false

                        if (res.code === 0) {
                            this.$Message.success('添加成功')
                            this.$emit('success')
                        } else {
                            this.$Message.error(res.msg)
                            this.$nextTick(() => {
                                this.isShowAddApi = true
                            })
                        }
                    } catch (err) {
                        console.log('addCat err', err)
                        this.isShowAddApi = false
                    }
                } else {
                    this.isShowAddApi = false
                    this.$Message.error('请按要求完善信息')
                    this.$nextTick(() => {
                        this.isShowAddApi = true
                    })
                }
            })
        },

        // 初始化相关参数
        init(catData) {
            if (catData.name) {
                this.apiForm.catId = catData._id
                this.apiForm.method = 'get'
            }
        }
    },
    computed: {
        isShowAddApi: {
            get() {
                return this.value
            },
            set(newVal) {
                this.$emit('input', newVal)
            }
        }
    }
}
</script>
<style lang="scss">
</style>
