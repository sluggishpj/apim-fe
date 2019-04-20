<template>
    <div class="custom-tree">
        <Tree v-if="treeContent" :data="treeContent" :render="renderContent"></Tree>
    </div>
</template>
<script>
import { Tree } from 'iview'

export default {
    name: 'CustomTree',
    components: {
        Tree
    },
    props: {
        // treeContent 对象结构为
        // {
        //     name|title: '展示的文字（必须）',
        //     xx: '自定义字段（可选）',
        //     children: [] //（可选，里面的元素也为 treeContent 对象
        // }
        treeContent: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        buttonProps: {
            type: 'default',
            size: 'small'
        },
        selectedItem: {},
        hoverItem: null,
        filterTreeContent: []
    }),
    created() {
        if (this.treeContent) {
            this.addParentRender(this.treeContent)
        }
    },
    methods: {
        // 新增子结点
        appendChild(data) {
            this.$emit('appendChild', data)
        },

        // 删除父结点
        removeParent(data) {
            this.$emit('removeParent', data)
        },

        clickChildHandler(data) {
            if (this.selectedItem !== data) {
                this.selectedItem = data
                this.$emit('change', data)
            }
        },

        // 渲染父结点
        renderParent(h, { data }) {
            return h(
                'span',
                {
                    class: ['tree-parent'],
                    on: {
                        mouseenter: () => {
                            this.handleHover(data)
                        },
                        mouseleave: () => {
                            this.handleHover(null)
                        }
                    }
                },
                [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-folder-outline'
                            },
                            style: {
                                marginRight: '8px',
                                marginLeft: '8px'
                            }
                        }),
                        h('span', data.name || data.title)
                    ]),
                    h(
                        'span',
                        {
                            class: {
                                'menu-btn': true,
                                show: this.hoverItem === data // 是否显示按钮
                            }
                        },
                        [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'md-add'
                                }),
                                style: {
                                    width: '32px'
                                },
                                on: {
                                    click: () => {
                                        this.appendChild(data)
                                    }
                                }
                            }),
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'md-trash'
                                }),
                                style: {
                                    width: '32px'
                                },
                                on: {
                                    click: () => {
                                        this.removeParent(data)
                                    }
                                }
                            })
                        ]
                    )
                ]
            )
        },

        // 渲染子结点
        renderContent(h, { data }) {
            return h(
                'span',
                {
                    class: {
                        // 类名
                        'tree-child': true,
                        'child-selected': this.selectedItem === data
                    },
                    on: {
                        click: () => {
                            this.clickChildHandler(data)
                        },
                        mouseenter: () => {
                            this.handleHover(data)
                        },
                        mouseleave: () => {
                            this.handleHover(null)
                        }
                    }
                },
                [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', {
                            domProps: {
                                innerText: data.name || data.title
                            }
                        })
                    ]),
                    h(
                        'span',
                        {
                            class: {
                                'menu-btn': true,
                                show: this.hoverItem === data // 是否显示按钮
                            }
                        },
                        [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'md-trash'
                                }),
                                style: {
                                    width: '32px'
                                },
                                on: {
                                    click: e => {
                                        this.removeChild(e, data)
                                    }
                                }
                            })
                        ]
                    )
                ]
            )
        },

        addParentRender(arr) {
            for (let i = 0, len = arr.length; i < len; i++) {
                if (arr[i].children) {
                    this.$set(
                        arr[i],
                        'render',
                        arr[i].render || this.renderParent
                    )
                    this.$set(arr[i], 'expand', !!arr[i].expand)
                    this.addParentRender(arr[i].children)
                }
            }
        },

        removeChild(e, data) {
            this.$emit('removeChild', data)
            e.stopPropagation()
        },

        handleHover(data) {
            this.hoverItem = data
        }
    },
    watch: {
        treeContent(newContent) {
            this.addParentRender(newContent)
        }
    }
}
</script>
<style lang="scss">
.tree-child {
    &:hover {
        cursor: pointer;
        background: #eaf4fe;
    }
}
.child-selected {
    background: #d5e8fc;
}

.tree-parent,
.tree-child {
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}

.tree-parent {
    height: 28px;
}

.tree-child {
    height: 26px;
}

.menu-btn {
    float: right;
    display: none;
    margin-right: 24px;
}

.show {
    display: block;
}
</style>
