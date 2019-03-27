<template>
    <div class="home">
        <div class="header">
            <div class="nav">
                <div class="group-name">个人空间</div>
                <div class="icon-split">/</div>
                <div class="project-name">项目名称</div>
            </div>
            <div class="menu-list">
                <!-- 搜索 -->
                <div class="search">
                    <Input search placeholder="搜索..."/>
                </div>

                <!-- 添加功能 -->
                <div class="add-menu" v-if="isAdmin">
                    <Poptip trigger="hover" placement="bottom" padding="0px 0px">
                        <Icon type="ios-add-circle-outline" class="icon-add" size="30"/>
                        <div slot="content">
                            <div class="poptip-item add-group" @click="goAddGroup">新建分组</div>
                            <div
                                class="poptip-item add-group-member"
                                @click="goAddGroupMember"
                            >添加组成员</div>
                        </div>
                    </Poptip>
                </div>

                <!-- 头像 -->
                <div class="self">
                    <Poptip trigger="hover" placement="bottom-end" padding="0px 0px">
                        <div class="avatar">
                            <img src="http://yapi.demo.qunar.com/api/user/avatar?uid=80629">
                        </div>
                        <div slot="content">
                            <div class="poptip-item person-info" @click="goUserInfo">个人信息</div>
                            <div class="poptip-item logout" @click="doLogout">退出</div>
                        </div>
                    </Poptip>
                </div>
            </div>
        </div>

        <router-view class="main"></router-view>
    </div>
</template>

<script>
// @ is an alias to /src
import { Input, Icon, Poptip } from 'iview'
import { logout } from '@/services/index'
import { mapGetters } from 'vuex'

export default {
    name: 'home',
    components: {
        Input,
        Icon,
        Poptip
    },
    data: () => ({}),
    computed: {
        ...mapGetters(['userInfo']),
        isAdmin() {
            return this.userInfo.role === 'admin'
        }
    },
    methods: {
        async doLogout() {
            const res = await logout()
            console.log('logout', res)
            if (res.code === 0) {
                this.$store.commit('setUserInfo', {})
                this.$store.commit('setGroupList', [])
                this.$router.replace({ name: 'login' })
            } else {
                this.$Message.error(res.msg)
            }
        },
        goAddGroup() {
            if (this.$route.name !== 'add-group') {
                this.$router.push({ name: 'add-group' })
            }
        },
        goAddGroupMember() {
            if (this.$route.name !== 'add-group-member') {
                this.$router.push({ name: 'add-group-member' })
            }
        },
        goAddProject() {
            if (this.$route.name !== 'add-project') {
                this.$router.push({ name: 'add-project' })
            }
        },
        goUserInfo() {
            if (this.$route.name !== 'user-info') {
                this.$router.push({
                    name: 'user-info',
                    params: { userId: this.userInfo.userId }
                })
            }
        }
    }
}
</script>
<style lang="scss">
.main {
    height: calc(100vh - 56px);
}
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
            margin-left: 30px;
            .icon-add {
                padding: 2px;
            }
        }

        .self {
            margin: 0 30px;
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
