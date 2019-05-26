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
                <span class="val">{{`${basePath}${apiInfo.path}`}}</span>
            </div>
            <div class="item">
                <span class="title">Mock地址：</span>
                <span class="val">
                    <span class="req-method">{{apiInfo.method && apiInfo.method.toUpperCase()}}</span>
                    <a :href="mockPath" target="_blank">{{mockPath}}</a>
                </span>
            </div>
            <div class="item">
                <span class="title">创建时间：</span>
                <span class="val">{{addTime}}</span>
            </div>
        </div>

        <Divider class="heading" orientation="left">请求参数：</Divider>
        <monaco-editor
            class="editor"
            v-model="reqQuery"
            language="javascript"
            :options="{readOnly: true, theme: 'vs-dark', minimap: {enabled: false},  automaticLayout: true, scrollBeyondLastLine: false}"
        ></monaco-editor>

        <Divider class="heading" orientation="left">返回数据：</Divider>
        <monaco-editor
            class="editor"
            v-model="resBody"
            language="json"
            :options="{readOnly: true, theme: 'vs-dark', minimap: {enabled: false},  automaticLayout: true, scrollBeyondLastLine: false}"
        ></monaco-editor>
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
        },
        basePath: {
            type: String,
            required: true
        }
    },
    components: {
        Divider,
        MonacoEditor
    },
    data: () => ({}),
    mounted() {
        console.log('mounted')
        // 不允许 JSON 注释，否则报错
        window.monaco.languages.json.jsonDefaults.diagnosticsOptions.allowComments = false
    },
    computed: {
        addTime() {
            const date = new Date(this.apiInfo.addTime)
            return `${date.getFullYear()}/${date.getMonth() +
                1}/${date.getDate()}`
        },
        reqQuery() {
            return this.apiInfo.reqQuery || ''
        },
        resBody() {
            return this.apiInfo.resBody || ''
        },
        mockPath() {
            return `/mock/${this.projectId}${this.basePath}${this.apiInfo.path}`
        }
    }
}
</script>
<style lang="scss" scoped>
.interface-preview {
    position: relative;
    width: 100%;
    // min-height: 400px;
}

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
.req-method {
    display: inline-block;
    margin-right: 5px;
    padding: 0 5px;
    background: #0f2540;
    color: #fff;
}
.editor {
    width: 78vw;
    height: 300px;
    text-align: left;
    margin-bottom: 10px;
}
</style>
