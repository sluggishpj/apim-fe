// 添加组成员
<template>
    <div class="add-group-member">
        <h2 class="title">添加组成员</h2>
        <Form
            class="add-member-form"
            ref="addMemberForm"
            :model="addMemberForm"
            :rules="addRules"
            :label-width="80"
        >
            <FormItem class="add-group-form" prop="group_id" label="组名">
                <Select v-model="addMemberForm.group_id" v-if="groupList">
                    <Option
                        v-for="group in groupList"
                        :value="group._id"
                        :key="group._id"
                    >{{ group.group_name }}</Option>
                </Select>
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
                <Button style="margin-left: 26px" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Form, FormItem, Input, AutoComplete, Select, Option } from 'iview'
import { addGroupMember, getAllUser } from '@/services'
import { mapGetters } from 'vuex'

export default {
    name: 'add-group-member',
    components: {
        Form,
        FormItem,
        Input,
        AutoComplete,
        Select,
        Option
    },
    async created() {
        try {
            const res = await getAllUser()
            console.log('getAllUser', res)
            if (res.code === 0) {
                this.userList = res.data
                this.userNameList = res.data.map(v => v.username)
            } else {
                this.$Message.error(res.msg)
            }
        } catch (err) {
            console.log('getAllUser', err)
        }
    },

    data() {
        const validateGroupName = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('组名不能为空'))
            } else {
                callback()
            }
        }

        const validateMember = (rule, value, callback) => {
            this.$set(this.addMemberForm, 'username', value.trim())
            if (value.trim() === '') {
                callback(new Error('用户名不能为空'))
            } else if (value.trim().length > 20) {
                callback(new Error('用户名名字数不能超过20'))
            } else {
                callback()
            }
        }
        return {
            addMemberForm: {
                group_id: '',
                username: ''
            },
            addRules: {
                group_id: [{ validator: validateGroupName, trigger: 'blur' }],
                username: [{ validator: validateMember, trigger: 'blur' }]
            },
            tipsList: [],
            userList: [],
            userNameList: []
        }
    },

    methods: {
        handleSearchMember(value) {
            const filterRes = this.userNameList.filter(v => {
                return v.indexOf(value) !== -1
            })
            this.tipsList = !value ? [] : filterRes
        },
        handleSubmit() {
            console.log('handleSubmit')
            this.$refs.addMemberForm.validate(async valid => {
                console.log('valid', valid)
                if (valid) {
                    const user_id = this.userList.find(user => {
                        return user.username === this.addMemberForm.username
                    })._id

                    console.log('user_id', user_id)

                    const res = await addGroupMember({
                        group_id: this.addMemberForm.group_id,
                        user_id
                    })

                    console.log('addGroupMember', res)
                    if (res.code === 0) {
                        this.$Message.success('Success!')
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
    },

    computed: {
        ...mapGetters(['groupList'])
    }
}
</script>
<style lang="scss" scoped>
.add-group-member {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
    .title {
        padding-bottom: 30px;
    }
}
.add-member-form {
    width: 340px;
}
</style>
