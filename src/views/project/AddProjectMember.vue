<template>
    <div class="add-project-member">
        <h2 class="title">添加项目成员</h2>

        <Form
            class="add-member-form"
            ref="addMemberForm"
            :model="addMemberForm"
            :rules="addRules"
            :label-width="80"
        >
            <!-- 项目名，必填 -->
            <FormItem prop="projectName" label="项目名">
                <Input v-model="addMemberForm.projectName" placeholder="请输入项目名" disabled/>
            </FormItem>

            <FormItem prop="username" label="名字">
                <AutoComplete
                    v-model="addMemberForm.username"
                    :data="tipsList"
                    @on-search="handleSearchMember"
                    placeholder="输入要添加的成员名字"
                    :transfer="true"
                ></AutoComplete>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button style="margin-left: 26px" @click="cancel">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { Form, FormItem, Input, AutoComplete } from 'iview'
import { addProjectMember } from '@/services'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'AddProjectMember',
    components: {
        Form,
        FormItem,
        Input,
        AutoComplete
    },
    created() {
        const groupId = this.groupInfo && this.groupInfo.groupId
        const projectName = this.projectInfo && this.projectInfo.projectName
        if (groupId) {
            this.fetchGroupMember({ groupId })
        }
        if (projectName) {
            this.addMemberForm.projectName = projectName
        }
    },
    data() {
        const validateMember = (rule, value, callback) => {
            this.$set(this.addMemberForm, 'username', value.trim())
            if (value.trim() === '') {
                callback(new Error('用户名不能为空'))
            } else if (value.trim().length > 50) {
                callback(new Error('用户名名字数不能超过50'))
            } else {
                callback()
            }
        }
        return {
            addMemberForm: {
                projectName: '',
                username: ''
            },
            addRules: {
                projectName: [
                    {
                        required: true,
                        message: '项目名不能为空',
                        trigger: 'blur'
                    }
                ],
                username: [
                    {
                        required: true,
                        validator: validateMember,
                        trigger: 'blur'
                    }
                ]
            },
            tipsList: []
        }
    },
    computed: {
        ...mapGetters(['projectInfo', 'groupInfo', 'groupMember']),
        usernameList() {
            return this.groupMember.map(v => v.username)
        }
    },
    methods: {
        ...mapActions(['fetchGroupMember']),
        handleSearchMember(value) {
            const filterRes = this.usernameList.filter(
                v => v.indexOf(value) !== -1
            )
            this.tipsList = !value ? [] : filterRes
        },

        handleSubmit() {
            console.log('handleSubmit')
            this.$refs.addMemberForm.validate(async valid => {
                if (valid) {
                    const { userId } = this.groupMember.find(
                        user => user.username === this.addMemberForm.username
                    )

                    try {
                        const res = await addProjectMember({
                            userId,
                            projectId: this.projectInfo.projectId
                        })

                        console.log('addProjectMember', res)
                        if (res.code === 0) {
                            this.$Message.success('添加成员成功')
                        } else {
                            this.$Message.error(res.msg)
                        }
                    } catch (err) {
                        console.log('addProjectMember err', err)
                    }
                } else {
                    this.$Message.error('请按要求完善信息')
                }
            })
        },
        cancel() {
            this.$router.go(-1)
        }
    },
    watch: {
        groupInfo(info) {
            this.fetchGroupMember({ groupId: info.groupId })
        },
        projectInfo(info) {
            this.addMemberForm.projectName = info.projectName
        }
    }
}
</script>
<style scoped lang="scss">
.add-project-member {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
    .title {
        padding: 30px;
    }
}
.add-member-form {
    width: 340px;
}
</style>
