<template>
    <div class="add-project">
        <h2 class="title">新增项目</h2>
        <Form ref="addProjectForm" :model="addProjectForm" :rules="projectRules" :label-width="80">
            <!-- 项目名，必填 -->
            <FormItem class="add-project-form" prop="projectName" label="项目名">
                <Input v-model="addProjectForm.projectName" placeholder="请输入项目名" :maxlength="50"></Input>
            </FormItem>

            <!-- 项目描述 -->
            <FormItem prop="projectDesc" label="项目描述">
                <Input
                    v-model="addProjectForm.projectDesc"
                    placeholder="请输入项目描述"
                    type="textarea"
                    :autosize="true"
                    :maxlength="200"
                ></Input>
            </FormItem>

            <!-- 所属分组，必填 -->
            <FormItem prop="groupId" label="所属分组">
                <Select v-model="addProjectForm.groupId" v-if="filterGroupList">
                    <Option
                        v-for="group in filterGroupList"
                        :value="group.groupId"
                        :key="group.groupId"
                    >{{ group.groupName }}</Option>
                </Select>
            </FormItem>

            <!-- 基本路径 -->
            <FormItem prop="basePath" class="add-project-form" label="基本路径">
                <Input v-model="addProjectForm.basePath" placeholder="请输入基本路径" :maxlength="50"></Input>
            </FormItem>

            <!-- 权限，必填 -->
            <FormItem prop="projectType" label="权限">
                <RadioGroup v-model="addProjectForm.projectType">
                    <Radio label="private">私有</Radio>
                    <Radio label="public">公开</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button style="margin-left: 26px" @click="cancel">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Form, FormItem, Input, Select, Option, RadioGroup, Radio } from 'iview'
import { addProject } from '@/services'
import { mapGetters } from 'vuex'

export default {
    name: 'add-project',
    props: {
        groupId: {
            type: Number
        }
    },
    components: {
        Form,
        FormItem,
        Input,
        Select,
        Option,
        RadioGroup,
        Radio
    },
    async created() {
        this.$store.dispatch('fetchGroupList')
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.groupId) {
                vm.addProjectForm.groupId = to.params.groupId
            }
        })
    },
    data() {
        // 验证项目名
        const validateProjectName = (rule, value, callback) => {
            this.$set(this.addProjectForm, 'projectName', value.trim())
            if (value.trim().length > 50) {
                callback(new Error('字数不能超过50'))
            } else {
                callback()
            }
        }

        // 验证项目描述
        const validateProjectDesc = (rule, value, callback) => {
            this.$set(this.addProjectForm, 'projectDesc', value.trim())
            if (value.trim().length > 200) {
                callback(new Error('字数不能超过200'))
            } else {
                callback()
            }
        }

        const validateBasePath = (rule, value, callback) => {
            let path = value.trim()
            if (value.trim() !== '') {
                // 非空
                if (path.indexOf('/') !== 0) {
                    path = `/${path}`
                }
                // 以 '/' 结尾，则去掉结尾的 '/'
                while (path[path.length - 1] === '/') {
                    path = path.slice(0, path.length - 1)
                }
                this.$set(this.updateProjectForm, 'basePath', path)
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
            addProjectForm: {
                projectName: '',
                projectDesc: '',
                groupId: '',
                projectType: '',
                basePath: ''
            },
            projectRules: {
                projectName: [
                    { required: true, message: '项目名不能为空' },
                    { validator: validateProjectName, trigger: 'blur' }
                ],
                projectDesc: [
                    { validator: validateProjectDesc, trigger: 'blur' }
                ],
                groupId: [
                    { required: true, type: 'number', message: '请选择组', trigger: 'change' }
                ],
                projectType: [
                    { required: true, message: '请选择权限', trigger: 'change' }
                ],
                basePath: [{ validator: validateBasePath, trigger: 'blur' }]
            }
        }
    },
    computed: {
        ...mapGetters(['groupList']),
        // 如果是从从项目列表那里跳转过来的，只展示那个组
        filterGroupList() {
            const groupId = this.addProjectForm.groupId
            if (groupId === '') {
                return this.groupList
            }
            const targetGroup = this.groupList.find(
                group => group.groupId === groupId
            )
            return targetGroup && [targetGroup]
        }
    },
    methods: {
        handleSubmit() {
            console.log('handleSubmit')
            this.$refs.addProjectForm.validate(async valid => {
                if (valid) {
                    const res = await addProject(this.addProjectForm)
                    console.log('addProject', res)

                    if (res.code === 0) {
                        this.$Message.success('添加成功')
                    } else {
                        this.$Message.error(res.msg)
                    }
                } else {
                    this.$Message.error('请按要求完善信息')
                }
            })
        },
        cancel() {
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.add-project {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
    .title {
        padding-bottom: 30px;
    }
    .add-project-form {
        width: 340px;
    }
}
</style>
