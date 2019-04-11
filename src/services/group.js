import { doPost } from './base'

// 添加组
export function addGroup({ groupName, groupDesc }) {
    return doPost('/group/add-group', { groupName, groupDesc })
}

// 获取本人加入的所有组
export function getGroupList() {
    return doPost('/group/group-list')
}

// 获取所有组员id及名字
export function getAllUser() {
    return doPost('/user/all-user')
}

// 添加组成员
export function addGroupMember({ groupId, userId }) {
    return doPost('/group/add-group-member', { groupId, userId })
}

// 修改组名
export function updateGroupName({ groupId, groupName }) {
    return doPost('/group/update-group-name', { groupId, groupName })
}

// 修改组描述
export function updateGroupDesc({ groupId, groupDesc }) {
    return doPost('/group/update-group-desc', { groupId, groupDesc })
}

// 删除分组
export function deleteGroup({ groupId }) {
    return doPost('/group/delete-group', { groupId })
}

// 获取组成员
export function getGroupMember({ groupId }) {
    return doPost('/group/group-member', { groupId })
}

// 设置组员角色
export function setGroupMemberRole({ groupId, userId, role }) {
    return doPost('/group/set-group-member-role', { groupId, userId, role })
}

// 删除组成员
export function deleteGroupMember({ groupId, userId }) {
    return doPost('/group/delete-group-member', { groupId, userId })
}

// 根据组id获取组信息
export function getGroupInfo({ groupId }) {
    return doPost('/group/group-info', { groupId })
}
