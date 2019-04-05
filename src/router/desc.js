let breadCrumbLevel = {
    home: { parent: null },
    group: { parent: 'home' },
    'add-group': { parent: 'home' },
    'add-group-member': { parent: 'home' },
    'add-project': { parent: 'home' },
    project: { parent: 'group' }
}

// 路由描述对象
let breadCrumbDesc = {
    home: { title: '首页', path: '/group/0', icon: 'md-home' },
    'add-group': { title: '添加组', path: '/add-group' },
    'add-group-member': { title: '添加组成员', path: '/add-group-member' },
    'add-project': { title: '添加项目', path: '/add-project' }
}

// 初始化路由描述对象
for (let key of Object.keys(breadCrumbLevel)) {
    breadCrumbDesc[key] = breadCrumbDesc[key] || {}
    let desc = breadCrumbDesc[key]
    desc.name = key
    desc.title = desc.title || ''
    desc.path = desc.path || ''
    desc.icon = desc.icon || ''
}

// 获取面包屑对应的路由名列表
function getBreadNameList(name) {
    let res = []
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

export {
    breadCrumbDesc,
    getBreadNameList
}
