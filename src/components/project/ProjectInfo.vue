<template>
    <div class="project-info">
        <Form
            class="update-project-form"
            ref="updateProjectForm"
            :model="updateProjectForm"
            :rules="projectRules"
            :label-width="80"
        >
            <!-- 项目名，必填 -->
            <FormItem prop="projectName" label="项目名">
                <Input v-model="updateProjectForm.projectName" placeholder="请输入项目名" :maxlength="50"></Input>
            </FormItem>

            <!-- 项目描述 -->
            <FormItem prop="projectDesc" label="项目描述">
                <Input
                    v-model="updateProjectForm.projectDesc"
                    placeholder="请输入项目描述"
                    type="textarea"
                    :autosize="true"
                    :maxlength="200"
                ></Input>
            </FormItem>

            <!-- 所属分组，必填 -->
            <FormItem prop="groupId" label="所属分组">
                <Select v-model="updateProjectForm.groupId" v-if="groupList">
                    <Option
                        v-for="group in groupList"
                        :value="group.groupId"
                        :key="group.groupId"
                    >{{ group.groupName }}</Option>
                </Select>
            </FormItem>

            <!-- 基本路径 -->
            <FormItem prop="basePath" label="基本路径">
                <Input v-model="updateProjectForm.basePath" placeholder="请输入基本路径" :maxlength="50"></Input>
            </FormItem>

            <!-- 权限，必填 -->
            <FormItem prop="projectType" label="权限">
                <RadioGroup v-model="updateProjectForm.projectType">
                    <Radio label="private">私有</Radio>
                    <Radio label="public">公开</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSubmit">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { Form, FormItem, Input, Select, Option, RadioGroup, Radio } from 'iview'
import { mapGetters } from 'vuex'
import { updateProjectInfo } from '@/services'

export default {
    name: 'ProjectInfo',
    props: {
        projectId: {
            type: String,
            required: true
        },
        projectInfo: {
            type: Object,
            required: true
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
    data() {
        // 验证项目名
        const validateProjectName = (rule, value, callback) => {
            this.$set(this.updateProjectForm, 'projectName', value.trim())
            if (value.trim().length > 50) {
                callback(new Error('字数不能超过50'))
            } else {
                callback()
            }
        }

        // 验证项目描述
        const validateProjectDesc = (rule, value, callback) => {
            this.$set(this.updateProjectForm, 'projectDesc', value.trim())
            if (value.trim().length > 200) {
                callback(new Error('字数不能超过200'))
            } else {
                callback()
            }
        }

        const validateBasePath = (rule, value, callback) => {
            if (value.indexOf('/') !== 0) {
                this.$set(
                    this.updateProjectForm,
                    'basePath',
                    '/' + value.trim()
                )
            }
            if (value.trim().length > 100) {
                callback(new Error('字数不能超过100'))
            } else {
                callback()
            }
        }

        return {
            updateProjectForm: {
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
                    { required: true, message: '请选择组', trigger: 'change' }
                ],
                projectType: [
                    { required: true, message: '请选择权限', trigger: 'change' }
                ],
                basePath: [{ validator: validateBasePath, trigger: 'blur' }]
            }
        }
    },
    mounted() {
        console.log('mounted')
        this.updateProjectForm = this.projectInfo
        this.$store.dispatch('fetchGroupList')
    },
    methods: {
        handleSubmit() {
            this.$refs.updateProjectForm.validate(async valid => {
                if (valid) {
                    const res = await updateProjectInfo({
                        project: this.projectId,
                        ...this.updateProjectForm
                    })
                    console.log('updateProjectInfo', res)

                    if (res.code === 0) {
                        this.$Message.success('修改成功')
                        this.$emit('on-update')
                    } else {
                        this.$Message.error(res.msg)
                    }
                } else {
                    this.$Message.error('请按要求完善信息')
                }
            })
        }
    },
    computed: {
        ...mapGetters(['groupList'])
    }
}
</script>
<style scoped lang="scss">
.project-info {
    display: flex;
    padding-top: 20px;
    justify-content: center;

    .update-project-form {
        width: 340px;
    }
}
</style>