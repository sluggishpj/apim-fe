<template>
    <div class="home">
        <div class="header">
            <div class="nav">
                <div class="group-name">个人空间</div>
                <div class="icon-split">/</div>
                <div class="project-name">项目名称</div>
            </div>
            <div class="menu-list">
                <div class="search">
                    <Input search placeholder="搜索..."/>
                </div>

                <div class="add-menu">
                    <Poptip trigger="hover" placement="bottom" padding="0px 0px">
                        <Icon type="ios-add-circle-outline" class="icon-add" size="30"/>
                        <div slot="content">
                            <div class="poptip-item add-group">新建分组</div>
                            <div class="poptip-item add-project">新建项目</div>
                        </div>
                    </Poptip>
                </div>

                <div class="self">
                    <Poptip trigger="hover" placement="bottom-end" padding="0px 0px">
                        <div class="avatar">
                            <img src="http://yapi.demo.qunar.com/api/user/avatar?uid=80629">
                        </div>
                        <!-- <Icon type="ios-add-circle-outline" class="icon-add" size="30"/> -->
                        <div slot="content">
                            <div class="poptip-item person-info">个人信息</div>
                            <div class="poptip-item logout" @click="doLogout">退出</div>
                        </div>
                    </Poptip>
                </div>
            </div>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
// @ is an alias to /src
import { Input, Icon, Poptip } from 'iview'
import { logout } from '@/services/index'

export default {
    name: 'home',
    components: {
        Input,
        Icon,
        Poptip
    },
    data: () => ({}),
    methods: {
        async doLogout() {
            const res = await logout()
            if (res.code === 0) {
                this.$store.commit('setUsername', null)
                this.$router.replace({ name: 'login' })
            } else {
                this.$Message.error(res.msg)
            }
        }
    }
}
</script>
<style lang="scss">
.header {
    display: flex;
    height: 56px;
    justify-content: space-between;
    border-bottom: 1px solid;
    align-items: center;
    background: #0f2540;
    color: #fff;
    .nav {
        display: flex;
        font-size: 16px;
        padding-left: 20px;
        .icon-split {
            width: 10px;
        }
    }

    .menu-list {
        display: flex;
        align-items: center;
        .add-menu {
            margin: 0 20px;
            .icon-add {
                padding: 2px;
            }
        }

        .self {
            margin-right: 30px;
            display: flex;
            align-items: center;
            line-height: 0;
            .avatar {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                overflow: hidden;
                img {
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }

    .poptip-item {
        color: #0f2540;
        cursor: pointer;
        padding: 8px 0;
        &:hover {
            color: #fff;
            background: #2b85e4;
        }
    }

    .person-info,
    .add-group {
        border-bottom: 1px solid #e8eaec;
    }
}
</style>
