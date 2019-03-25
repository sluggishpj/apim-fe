<template>
    <div class="add-group">
        <h2 class="title">新增组</h2>
        <Form ref="addGroupForm" :model="addGroupForm" :rules="groupRules" :label-width="80">
            <FormItem class="add-group-form" prop="groupName" label="组名">
                <Input v-model="addGroupForm.groupName" placeholder="请输入组名" :maxlength="20"></Input>
            </FormItem>

            <FormItem prop="groupDesc" label="组描述">
                <Input
                    v-model="addGroupForm.groupDesc"
                    placeholder="请输入组描述"
                    type="textarea"
                    :autosize="true"
                    :maxlength="50"
                ></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button style="margin-left: 26px" @click="cancel">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Form, FormItem, Input } from 'iview'
import { addGroup } from '@/services'
import { mapGetters } from 'vuex'

export default {
    name: 'add-group',
    components: {
        Form,
        FormItem,
        Input
    },
    data() {
        const validateGroupName = (rule, value, callback) => {
            this.$set(this.addGroupForm, 'groupName', value.trim())
            if (value.trim() === '') {
                callback(new Error('组名不能为空'))
            } else if (value.trim().length > 20) {
                callback(new Error('组名字数不能超过20'))
            } else {
                callback()
            }
        }

        const validateGroupDesc = (rule, value, callback) => {
            this.$set(this.addGroupForm, 'groupDesc', value.trim())
            if (value.trim().length > 50) {
                callback(new Error('描述字数不能超过50'))
            } else {
                callback()
            }
        }
        return {
            addGroupForm: {
                groupName: '',
                groupDesc: ''
            },
            groupRules: {
                groupName: [{ validator: validateGroupName, trigger: 'blur' }],
                groupDesc: [{ validator: validateGroupDesc, trigger: 'blur' }]
            }
        }
    },
    computed: {
        ...mapGetters(['groupList'])
    },
    methods: {
        handleSubmit() {
            console.log('handleSubmit')
            this.$refs.addGroupForm.validate(async valid => {
                console.log('valid', valid)
                if (valid) {
                    const res = await addGroup(this.addGroupForm)
                    console.log('addGroup', res)
                    if (res.code === 0) {
                        this.$Message.success('添加成功')
                        this.$store.commit('setGroupList', [
                            ...this.groupList,
                            res.data
                        ])
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
.add-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
    .title {
        padding-bottom: 30px;
    }
    .add-group-form {
        width: 340px;
    }
}
</style>
