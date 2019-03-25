<template>
    <div class="edit">
        <div class="show-mode" v-if="value">
            <span class="label">{{label}}</span>
            <span class="show-text">{{val}}</span>
            <span class="btn edit-btn" @click="edit">修改</span>
        </div>

        <div class="edit-mode" v-if="!value">
            <span class="label">{{label}}</span>
            <input
                ref="editInput"
                class="edit-input"
                type="text"
                :maxlength="maxlength"
                v-model="newVal"
                autofocus
            >

            <span class="btn cancel-btn " @click="cancel">取消</span>
            <span class="btn confirm-btn" @click="confirm">确定</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseEdit',
    props: {
        value: {
            type: Boolean,
            default: true
        },
        val: {
            type: String,
            default: ''
        },
        maxlength: {
            type: Number,
            default: 50
        },
        label: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.newVal = this.val
    },
    data: () => ({
        newVal: ''
    }),
    methods: {
        // 点击修改
        edit() {
            this.$emit('input', false)
        },

        // 点击确定
        confirm() {
            this.$emit('confirm', this.newVal)
        },

        // 点击取消
        cancel() {
            this.$emit('input', true)
            this.newVal = this.val
            this.$emit('cancel', this.newVal)
        }
    },
    watch: {
        value(newVal) {
            if (newVal === false) {
                this.$nextTick(() => {
                    this.$refs.editInput.focus()
                })
            }
        },
        val(newVal) {
            this.newVal = newVal
        }
    }
}
</script>

<style scoped lang="scss">
.show-mode,
.edit-mode {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.label {
    font-size: 16px;
    font-weight: bold;
    margin-right: 6px;
}

.show-text,
.edit-input {
    box-sizing: border-box;
    color: #515a6e;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    min-width: 100px;
}

.edit-input {
    height: 100%;
    border: 1px solid #dcdee2;
    background-color: #fff;
    cursor: text;
    outline: none;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
    &:focus {
        box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
}

.btn {
    background: #2d8cf0;
    color: #fff;
    font-size: 12px;
    padding: 5px 15px;
    border-radius: 4px;
    transition: color 0.2s linear, background-color 0.2s linear;
    line-height: 1.5;
    cursor: pointer;
    user-select: none;

    &:hover {
        background: #57a3f3;
    }
}

.edit-btn,
.cancel-btn,
.confirm-btn {
    margin-left: 24px;
}
</style>
