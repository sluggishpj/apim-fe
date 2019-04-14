// 直接使用 vue-monaco 组件
<template>
    <div class="test">
        <div id="monacoEditorContainer"></div>
        <button @click="getValue">getValue</button>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { throttle } from '@/util'

export default {
    name: 'MonacoEditor',
    mounted() {
        const container = document.getElementById('monacoEditorContainer')
        const editor = monaco.editor.create(container, {
            value: ['{', '}'].join('\n'),
            language: 'json'
        })
        this.editor = editor

        const handleKeyUp = throttle(this.handleKeyUp)
        editor.onKeyUp(handleKeyUp)
    },
    data: () => ({
        editor: null
    }),

    methods: {
        handleKeyUp(e) {
            console.log('keyUp')
            this.getValue()
        },
        getValue() {
            let val = this.editor.getValue()
            console.log('val', val)
        },
        setValue(str) {
            this.editor.setValue(str)
        }
    }
}
</script>

<style lang="scss" scoped>
#monacoEditorContainer {
    width: 100vw;
    height: 50vh;
    text-align: left;
}
</style>
