<template>
    <div class="interface-preview">
        <Divider class="heading" orientation="left">基本信息</Divider>
        <div class="basic-info">
            <div class="item">
                <span class="title">接口名称：</span>
                <span class="val">{{apiInfo.name}}</span>
            </div>
            <div class="item">
                <span class="title">接口路径：</span>
                <span class="val">{{apiInfo.path}}</span>
            </div>
            <div class="item">
                <span class="title">Mock地址：</span>
                <span class="val">{{`/mock/${projectId}${apiInfo.path}`}}</span>
            </div>
            <div class="item">
                <span class="title">创建时间：</span>
                <span class="val">{{addTime}}</span>
            </div>
        </div>

        <Divider class="heading" orientation="left">返回数据：</Divider>

        <monaco-editor class="editor" v-model="code" language="json" :options="{readOnly: true}"></monaco-editor>
    </div>
</template>
<script>
import { Divider } from 'iview'
import MonacoEditor from 'vue-monaco'

export default {
    props: {
        apiInfo: {
            type: Object,
            required: true
        },
        projectId: {
            type: Number,
            required: true
        }
    },
    components: {
        Divider,
        MonacoEditor
    },
    data: () => ({
        code: '{\n\t"name": "xpj", \n\t"gender":"boy"\n}'
    }),
    computed: {
        addTime() {
            const date = new Date(this.apiInfo.addTime)
            return `${date.getFullYear()}/${date.getMonth() +
                1}/${date.getDate()}`
        }
    }
}
</script>
<style lang="scss" scoped>
.heading {
    font-size: 18px;
    font-weight: 400;
}
.basic-info {
    display: flex;
    flex-wrap: wrap;
}
.item {
    width: 50%;
    text-align: left;
    padding-left: 80px;
    font-size: 15px;
    padding: 10px 80px;
    .title {
        font-weight: bold;
        padding-right: 10px;
    }
}
.editor {
    width: 100%;
    height: 300px;
    text-align: left;
    border-top: 1px solid #fedfe1;
    border-bottom: 1px solid #fedfe1;
    margin-bottom: 10px;
}
</style>
