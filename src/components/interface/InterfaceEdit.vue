<template>
    <div class="interface-edit">
        <Form
            class="interface-form"
            ref="apiForm"
            :model="apiForm"
            :rules="apiRules"
            :label-width="100"
        >
            <Divider class="heading" orientation="left">基本设置</Divider>

            <!-- 接口名，必填 -->
            <FormItem class="form-item" prop="name" label="接口名称：">
                <Input v-model="apiForm.name" placeholder="请输入接口名" :maxlength="50"></Input>
            </FormItem>

            <!-- 分类 -->
            <FormItem class="form-item" prop="catId" label="所属分类：">
                <Select v-model="apiForm.catId">
                    <Option v-for="cat in catList" :key="cat._id" :value="cat._id">{{cat.name}}</Option>
                </Select>
            </FormItem>

            <!-- 接口路径 -->
            <FormItem class="form-item" prop="path" label="接口路径：">
                <Input v-model="apiForm.path">
                    <Select v-model="apiForm.method" slot="prepend" style="width: 80px">
                        <Option value="get">GET</Option>
                        <Option value="post">POST</Option>
                    </Select>
                    <Select v-model="basePath" slot="prepend" style="width: auto">
                        <Option :value="basePath">{{basePath}}</Option>
                    </Select>
                </Input>
            </FormItem>

            <Divider class="heading" orientation="left">请求参数设置设置</Divider>

            <!-- Query 参数 -->
            <FormItem prop="reqQuery" class="edit-form-item">
                <monaco-editor
                    class="editor"
                    v-model="apiForm.reqQuery"
                    language="javascript"
                    :options="{theme: 'vs-dark', minimap: {enabled: false}, automaticLayout: true, scrollBeyondLastLine: false}"
                ></monaco-editor>
            </FormItem>

            <Divider class="heading" orientation="left">返回数据设置</Divider>

            <!-- 返回数据设置-->
            <FormItem prop="resBody" class="edit-form-item">
                <monaco-editor
                    class="editor"
                    v-model="apiForm.resBody"
                    language="json"
                    :options="{theme: 'vs-dark', minimap: {enabled: false}, automaticLayout: true, scrollBeyondLastLine: false}"
                ></monaco-editor>
            </FormItem>

            <FormItem>
                <Button type="primary" class="btn save-btn" @click="handleSubmit">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { Divider, Form, FormItem, Input, Select, Option } from 'iview'
import { updateApi } from '@/services'
import MonacoEditor from 'vue-monaco'
import { mapActions } from 'vuex'

export default {
    props: {
        apiInfo: {
            type: Object,
            required: true
        },
        catList: {
            type: Array,
            required: true
        },
        basePath: {
            type: String,
            required: true
        }
    },
    mounted() {
        console.log('mounted')
        // 不允许 JSON 注释，否则报错
        window.monaco.languages.json.jsonDefaults.diagnosticsOptions.allowComments = false
        this.initApiForm(this.apiInfo)
    },
    components: {
        Divider,
        Form,
        FormItem,
        Input,
        Select,
        Option,
        MonacoEditor
    },
    data() {
        // 验证项目名
        const validateName = (rule, value, callback) => {
            this.$set(this.apiForm, 'name', value.trim())
            if (value.trim().length > 50) {
                callback(new Error('字数不能超过50'))
            } else {
                callback()
            }
        }

        const validatePath = (rule, value, callback) => {
            let path = value.trim()
            if (value.trim() !== '') {
                // 非空
                if (path.indexOf('/') !== 0) {
                    path = `/${path}`
                }
                // 以 '/' 结尾，则去掉结尾的 '/'
                while (path.length > 1 && path[path.length - 1] === '/') {
                    path = path.slice(0, path.length - 1)
                }

                this.$set(this.apiForm, 'path', path)

                if (path.length > 100) {
                    callback(new Error('字数不能超过100'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }

        return {
            apiForm: {
                name: '',
                catId: '',
                path: '',
                method: '',
                reqBodyForm: {},
                reqQuery: 'reqQuery',
                resBody: JSON.stringify(
                    { name: 'xpj', gender: 'boy', age: 22 },
                    null,
                    4
                )
            },
            apiRules: {
                name: [
                    { required: true, message: '接口名不能为空' },
                    { validator: validateName, trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '接口路径不能为空' },
                    { validator: validatePath, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapActions(['fetchApiInfo']),
        handleSubmit() {
            this.$refs.apiForm.validate(async valid => {
                console.log('this.apiForm', this.apiForm)
                if (valid) {
                    if (this.isValidJson(this.apiForm.resBody)) {
                        const interfaceId = this.apiInfo._id
                        const res = await updateApi({
                            interfaceId,
                            ...this.apiForm
                        })
                        console.log('updateApi', res)

                        if (res.code === 0) {
                            this.$Message.success('修改成功')
                            this.fetchApiInfo(interfaceId)
                        } else {
                            this.$Message.error(res.msg)
                        }
                    } else {
                        this.$Message.error('返回数据设置 不符合 JSON 格式')
                    }
                } else {
                    this.$Message.error('请按要求完善信息')
                }
            })
        },
        initApiForm(info) {
            if (info && info._id) {
                this.apiForm = { ...info }
                this.apiForm.resBody = info.resBody || ''
                this.apiForm.reqQuery = info.reqQuery || ''
            }
        },
        isValidJson(str) {
            if (str.length) {
                try {
                    JSON.parse(str)
                    return true
                } catch (err) {
                    return false
                }
            }
            return true
        }
    },
    watch: {
        apiInfo(info) {
            this.initApiForm(info)
        }
    }
}
</script>
<style lang="scss" scoped>
.interface-edit {
    padding-top: 40px;
}
.heading {
    font-size: 18px;
    font-weight: 400;
}
.editor {
    width: 74vw;
    height: 300px;
    text-align: left;
    margin-bottom: 10px;
}
.interface-form {
    width: 78vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.form-item {
    width: 500px;
}
.edit-form-item {
    width: 100%;
    margin-left: -140px;
}
</style>
