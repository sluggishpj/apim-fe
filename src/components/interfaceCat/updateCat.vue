<template>
    <!-- 修改分类表单 -->
    <Modal
        title="修改分类"
        v-model="isShowUpdateCat"
        :mask-closable="false"
        :loading="loading"
        @on-ok="doUpdateCat"
    >
        <Form ref="catForm" :model="catForm" class="cat-form" :rules="catRules" :label-width="80">
            <FormItem prop="name" label="分类名">
                <Input
                    type="text"
                    v-model="catForm.name"
                    placeholder="请输入分类名"
                    :maxlength="NAME_MAX_LEN"
                ></Input>
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
import { updateCat } from '@/services'
import { NAME_MAX_LEN, DESC_MAX_LEN } from '@/constant/len'

export default {
    name: 'UpdateCat',
    props: {
        catData: {
            type: Object,
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
                catId: NaN,
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
        isShowUpdateCat: {
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
        async doUpdateCat() {
            this.$refs.catForm.validate(async valid => {
                if (valid) {
                    try {
                        const res = await updateCat({
                            ...this.catForm
                        })
                        console.log('updateCat', res)
                        this.isShowUpdateCat = false

                        if (res.code === 0) {
                            this.$Message.success('修改成功')
                            this.$emit('success')
                        } else {
                            this.$Message.error(res.msg)
                            this.$nextTick(() => {
                                this.isShowUpdateCat = true
                            })
                        }
                    } catch (err) {
                        console.log('addCat err', err)
                        this.isShowUpdateCat = false
                    }
                } else {
                    this.isShowUpdateCat = false
                    this.$Message.error('请按要求完善信息')
                    this.$nextTick(() => {
                        this.isShowUpdateCat = true
                    })
                }
            })
        }
    },
    watch: {
        catData(data) {
            this.catForm.catId = data._id
            this.catForm.name = data.name
            this.catForm.desc = data.desc
        }
    }
}
</script>
<style lang="scss">
</style>
