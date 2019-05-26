<template>
    <div class="add-group">
        <h2 class="title">新增组</h2>
        <Form ref="addGroupForm" :model="addGroupForm" :rules="groupRules" :label-width="80">
            <FormItem class="add-group-form" prop="groupName" label="组名">
                <Input v-model="addGroupForm.groupName" placeholder="请输入组名" :maxlength="NAME_MAX_LEN"></Input>
            </FormItem>

            <FormItem prop="groupDesc" label="组描述">
                <Input
                    v-model="addGroupForm.groupDesc"
                    placeholder="请输入组描述"
                    type="textarea"
                    :autosize="true"
                    :maxlength="DESC_MAX_LEN"
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
import { NAME_MAX_LEN, DESC_MAX_LEN, PATH_MAX_LEN } from '@/constant/len'

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
            } else if (value.trim().length > NAME_MAX_LEN) {
                callback(new Error(`组名字数不能超过${NAME_MAX_LEN}`))
            } else {
                callback()
            }
        }

        const validateGroupDesc = (rule, value, callback) => {
            this.$set(this.addGroupForm, 'groupDesc', value.trim())
            if (value.trim().length > DESC_MAX_LEN) {
                callback(new Error(`描述字数不能超过${DESC_MAX_LEN}`))
            } else {
                callback()
            }
        }
        return {
            NAME_MAX_LEN, DESC_MAX_LEN, PATH_MAX_LEN,
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
                if (valid) {
                    const res = await addGroup(this.addGroupForm)
                    console.log('addGroup', res)

                    if (res.code === 0) {
                        this.$Message.success('添加成功')
                        // 添加进 vuex
                        this.$store.commit('addGroup', res.data)
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
