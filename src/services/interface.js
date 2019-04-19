import { doPost } from './base'

// 添加接口
export function addApi({ catId, name, method, path, projectId }) {
    return doPost('/interface/add', { catId, name, method, path, projectId })
}

// 修改接口
export function updateApi({ catId, name, method, path, projectId }) {
    return doPost('/interface/update', { catId, name, method, path, projectId })
}

// 删除接口
export function deleteApi({ catId, name, method, path, projectId }) {
    return doPost('/interface/delete', { catId, name, method, path, projectId })
}
