<template>
    <!-- 添加分类表单 -->
    <Modal
        title="添加分类"
        v-model="isShowAddCat"
        :mask-closable="false"
        :loading="loading"
        @on-ok="doAddCat"
    >
        <Form ref="catForm" :model="catForm" class="cat-form" :rules="catRules" :label-width="80">
            <FormItem prop="name" label="分类名">
                <Input type="text" v-model="catForm.name" placeholder="请输入分类名" :maxlength="NAME_MAX_LEN"></Input>
            </FormItem>
            <FormItem prop="desc" label="描述">
                <Input
                    v-model="catForm.desc"
                    placeholder="请输入描述"
                    type="textarea"
                    :autosize="true"
                    :maxlength="DESC_MAX_LEN"
                ></Input>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import { Modal, Form, FormItem, Input } from 'iview'
import { addCat } from '@/services'
import { NAME_MAX_LEN, DESC_MAX_LEN } from '@/constant/len'

export default {
    name: 'AddCat',
    props: {
        projectId: {
            type: Number,
            required: true
        },
        value: {
            type: Boolean,
            required: true
        }
    },
    components: {
        Modal,
        Form,
        FormItem,
        Input
    },
    data() {
        const validateCatName = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('分类名不能为空'))
            } else if (value.trim().length > NAME_MAX_LEN) {
                callback(new Error(`分类名长度不能超过${NAME_MAX_LEN}`))
            } else {
                callback()
            }
            this.$set(this.catForm, 'name', value.trim())
        }
        return {
            NAME_MAX_LEN,
            DESC_MAX_LEN,
            loading: true,
            catForm: {
                name: '',
                desc: ''
            },
            catRules: {
                name: [
                    {
                        validator: validateCatName,
                        required: true,
                        trigger: 'blur'
                    }
                ],
                desc: [
                    {
                        max: DESC_MAX_LEN,
                        trigger: 'blur',
                        message: `字数不能超过${DESC_MAX_LEN}`
                    }
                ]
            }
        }
    },
    computed: {
        isShowAddCat: {
            get() {
                return this.value
            },
            set(newVal) {
                this.$emit('input', newVal)
            }
        }
    },
    methods: {
        // 执行添加分类
        async doAddCat() {
            this.$refs.catForm.validate(async valid => {
                if (valid) {
                    try {
                        const res = await addCat({
                            projectId: this.projectId,
                            ...this.catForm
                        })
                        console.log('addCat', res)
                        this.isShowAddCat = false

                        if (res.code === 0) {
                            this.$Message.success('添加成功')
                            this.$emit('success')
                        } else {
                            this.$Message.error(res.msg)
                            this.$nextTick(() => {
                                this.isShowAddCat = true
                            })
                        }
                    } catch (err) {
                        console.log('addCat err', err)
                        this.isShowAddCat = false
                    }
                } else {
                    this.isShowAddCat = false
                    this.$Message.error('请按要求完善信息')
                    this.$nextTick(() => {
                        this.isShowAddCat = true
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
</style>
