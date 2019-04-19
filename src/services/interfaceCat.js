// 分类相关接口
import { doPost } from './base'

// 获取所有分类及其接口列表
export function getCatAndApiInfo({ projectId }) {
    return doPost('/interface-cat/cat-api-info', { projectId })
}

// 新建分类
export function addCat({ name, desc, projectId }) {
    return doPost('/interface-cat/add', { name, desc, projectId })
}

// 删除分类
export function deleteCat({ catId }) {
    return doPost('/interface-cat/delete', { catId })
}

// 修改分类
export function updateCat({ catId, name, desc }) {
    return doPost('/interface-cat/update', { catId, name, desc })
}
