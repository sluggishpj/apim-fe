<template>
    <div class="login-wrapper">
        <!-- 切换选项 -->
        <div class="menu">
            <span :class="['item go-login', {'active': type==='login'}]" @click="goLogin">登录</span>
            <span
                :class="['item go-register', {'active': type==='register'} ]"
                @click="goRegister"
            >注册</span>
        </div>

        <!-- 表单 -->
        <Form ref="userForm" :model="userForm" class="user-form" :rules="userRules">
            <FormItem prop="username" label="用户名">
                <Input type="text" v-model="userForm.username" placeholder="请输入用户名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password" label="密码">
                <Input
                    type="password"
                    v-model="userForm.password"
                    placeholder="请输入密码"
                    @keyup.enter.native="handleSubmit"
                >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem v-if="type==='register'" prop="repeatPass" label="重复密码">
                <Input
                    type="password"
                    v-model="userForm.repeatPass"
                    placeholder="请重复输入密码"
                    @keyup.enter.native="handleSubmit"
                >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button
                    class="btn"
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit"
                >{{type==='login'?'登录':'注册'}}</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { login, register } from '@/services'
import { Form, FormItem, Input, Icon } from 'iview'
import { NAME_MAX_LEN, PASS_MAX_LEN } from '@/constant/len'

export default {
    name: 'Login',
    components: {
        Form,
        FormItem,
        Input,
        Icon
    },
    data() {
        const validateUserName = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('用户名不能为空'))
            } else if (value.trim().length > NAME_MAX_LEN) {
                callback(new Error(`用户名长度不能超过${NAME_MAX_LEN}`))
            } else {
                callback()
            }
            this.$set(this.userForm, 'username', value.trim())
        }
        const validatePass = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('密码不能为空'))
            } else if (value.trim().length > PASS_MAX_LEN) {
                callback(new Error(`密码长度不能超过${PASS_MAX_LEN}`))
            } else {
                if (
                    this.type === 'register' &&
                    this.userForm.repeatPass !== ''
                ) {
                    // 注册状态下，对第二个密码框单独验证
                    this.$refs.userForm.validateField('repeatPass')
                }
                callback()
            }
            this.$set(this.userForm, 'password', value.trim())
        }
        const validateRepeatPass = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.userForm.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
            this.$set(this.userForm, 'repeatPass', value.trim())
        }
        return {
            userForm: {
                username: '',
                password: '',
                repeatPass: ''
            },
            userRules: {
                username: [{ validator: validateUserName, trigger: 'blur' }],
                password: [{ validator: validatePass, trigger: 'blur' }],
                repeatPass: [
                    {
                        validator: validateRepeatPass,
                        trigger: 'blur'
                    }
                ]
            },
            type: 'login', // 默认进行登录
            loading: false
        }
    },
    methods: {
        goLogin() {
            if (this.type === 'register') {
                this.type = 'login'
            }
        },
        goRegister() {
            if (this.type === 'login') {
                this.type = 'register'
            }
        },
        handleSubmit() {
            this.$refs.userForm.validate(valid => {
                if (valid) {
                    // 数据格式正确
                    this.loading = true
                    if (this.type === 'login') {
                        this.doLogin()
                    } else if (this.type === 'register') {
                        this.doRegister()
                    }
                } else {
                    this.$Message.error('请完善信息')
                }
            })
        },

        async doLogin() {
            const { username, password } = this.userForm
            try {
                const res = await login({ username, password })
                console.log('login res', res)
                if (res.code === 0) {
                    this.$Message.success('登录成功！')
                    this.$store.commit('setUserInfo', res.data)
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('login err', err)
            }
            this.loading = false
        },
        async doRegister() {
            const { username, password } = this.userForm
            try {
                const res = await register({ username, password })
                console.log('register res', res)
                if (res.code === 0) {
                    this.$Message.success('注册成功！')
                    this.$store.commit('setUserInfo', res.data)
                } else {
                    this.$Message.error(res.msg)
                }
            } catch (err) {
                console.log('register err', err)
            }
            this.loading = false
        }
    }
}
</script>

<style scoped lang="scss">
.menu {
    font-size: 20px;
    color: #ccc;
    .item {
        padding: 0 10px;
        &.active {
            color: #0f2540;
            font-weight: bold;
            cursor: not-allowed !important;
        }
        &:hover {
            cursor: pointer;
        }
        &:first-child {
            border-right: 2px solid #0f2540;
        }
    }
}
.login-wrapper {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.user-form {
    width: 300px;
}

.btn {
    width: 80px;
    font-size: 14px;
    margin: 20px;
    margin-top: 14px;
}
</style>
