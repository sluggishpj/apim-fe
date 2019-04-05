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
            <FormItem class="add-group-form" prop="groupId" label="组名">
                <Select v-model="addMemberForm.groupId" v-if="filterGroupList">
                    <Option
                        v-for="group in filterGroupList"
                        :value="group.groupId"
                        :key="group.groupId"
                    >{{ group.groupName }}</Option>
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
                <Button style="margin-left: 26px" @click="cancel">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Form, FormItem, AutoComplete, Select, Option } from 'iview'
import { addGroupMember, getAllUser } from '@/services'
import { mapGetters } from 'vuex'

export default {
    name: 'add-group-member',
    props: {
        groupId: {
            type: String,
            default: ''
        }
    },
    components: {
        Form,
        FormItem,
        AutoComplete,
        Select,
        Option
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.groupId) {
                vm.addMemberForm.groupId = to.params.groupId
            }
        })
    },

    async created() {
        this.fetchUser()
        this.$store.dispatch('fetchGroupList')
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
                groupId: '',
                username: ''
            },
            addRules: {
                groupId: [{ validator: validateGroupName, trigger: 'blur' }],
                username: [{ validator: validateMember, trigger: 'blur' }]
            },
            tipsList: [],
            userList: [],
            userNameList: []
        }
    },

    methods: {
        async fetchUser() {
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
        handleSearchMember(value) {
            const filterRes = this.userNameList.filter(
                v => v.indexOf(value) !== -1
            )
            this.tipsList = !value ? [] : filterRes
        },
        handleSubmit() {
            console.log('handleSubmit')
            this.$refs.addMemberForm.validate(async valid => {
                console.log('valid', valid)
                if (valid) {
                    const { userId } = this.userList.find(
                        user => user.username === this.addMemberForm.username
                    )

                    console.log('userId', userId)

                    try {
                        const res = await addGroupMember({
                            userId,
                            groupId: this.addMemberForm.groupId
                        })

                        console.log('addGroupMember', res)
                        if (res.code === 0) {
                            this.$Message.success('添加成员成功')
                        } else {
                            this.$Message.error(res.msg)
                        }
                    } catch (err) {
                        console.log('addGroupMember err', err)
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
        ...mapGetters(['userInfo', 'groupList']),

        // 如果是从从组员信息那里跳转过来的，只展示那个组
        filterGroupList() {
            const groupId = this.addMemberForm.groupId
            if (this.addMemberForm.groupId === '') {
                return this.groupList
            } else {
                return [
                    this.groupList.find(
                        group => group.groupId === this.addMemberForm.groupId
                    )
                ]
            }
        }
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
