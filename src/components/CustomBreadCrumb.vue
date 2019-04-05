<template>
    <div class="custom-bread-crumb">
        <Breadcrumb :style="{fontSize: `${fontSize}px`}">
            <BreadcrumbItem v-for="item in list" :to="item.path" :key="`bread-crumb-${item.name}`">
                <Icon style="margin-right: 4px;" :type="item.icon || ''"/>
                {{ item.title || item.name }}
            </BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>
<script>
import { Breadcrumb, BreadcrumbItem, Icon } from 'iview'

export default {
    name: 'CustomBreadCrumb',
    components: {
        Breadcrumb,
        BreadcrumbItem,
        Icon
    },
    props: {
        // 面包屑数组
        list: {
            type: Array,
            default: () => []
        },
        fontSize: {
            type: Number,
            default: 14
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-bread-crumb {
    display: inline-block;
    vertical-align: top;
}
</style>
