const breadCrumbLevel = {
    home: { parent: null },
    'user-info': { parent: 'home' },
    group: { parent: 'home' },
    'add-group': { parent: 'home' },
    'add-group-member': { parent: 'home' },
    project: { parent: 'group' },
    'add-project': { parent: 'home' },
    'add-project-member': { parent: 'project' }
}

// 路由描述对象
const breadCrumbDesc = {
    home: { title: '首页', path: '/group/0', icon: 'md-home' },
    'user-info': { title: '个人信息', icon: 'md-person' },
    'add-group': { title: '添加组', path: '/add-group' },
    'add-group-member': { title: '添加组成员', path: '/add-group-member' },
    'add-project': { title: '添加项目', path: '/add-project' },
    'add-project-member': { title: '添加项目成员' }
}

// 初始化路由描述对象
Object.keys(breadCrumbLevel).forEach(key => {
    breadCrumbDesc[key] = breadCrumbDesc[key] || {}
    const desc = breadCrumbDesc[key]
    desc.name = key
    desc.title = desc.title || ''
    desc.path = desc.path || ''
    desc.icon = desc.icon || ''
})

// 获取面包屑对应的路由名列表
function getBreadNameList(name) {
    const res = []
    while (name) {
        if (breadCrumbLevel[name]) {
            res.unshift(name)
            name = breadCrumbLevel[name].parent
        } else {
            break
        }
    }
    return res
}

export { breadCrumbDesc, getBreadNameList }
