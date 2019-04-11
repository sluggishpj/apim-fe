import { doPost } from './base'

// 添加项目
export function addProject({ projectName, projectDesc, groupId, projectType, basePath }) {
    return doPost('/project/add-project', {
        projectName,
        projectDesc,
        groupId,
        projectType,
        basePath
    })
}

// 获取某个组下的项目列表
export function getProjectList({ groupId }) {
    return doPost('/project/project-list', { groupId })
}

// 获取某个项目信息
export function getProjectInfo({ projectId }) {
    return doPost('/project/project-info', { projectId })
}

// 修改项目信息
export function updateProjectInfo({
    projectId,
    projectName,
    projectDesc,
    groupId,
    basePath,
    projectType
}) {
    return doPost('/project/update-info', {
        projectId,
        projectName,
        projectDesc,
        groupId,
        basePath,
        projectType
    })
}

// 添加项目成员
export function addProjectMember({ projectId, userId }) {
    return doPost('/project/add-project-member', { projectId, userId })
}

// 获取项目成员
export function getProjectMember({ projectId }) {
    return doPost('/project/project-member', { projectId })
}

// 删除项目
export function deleteProject({ projectId }) {
    return doPost('/project/delete-project', { projectId })
}

// 设置项目成员角色
export function setProjectMemberRole({ userId, projectId, role }) {
    return doPost('/project/set-project-member-role', { userId, projectId, role })
}

// 删除项目成员
export function deleteProjectMember({ userId, projectId }) {
    return doPost('/project/delete-project-member', { userId, projectId })
}
