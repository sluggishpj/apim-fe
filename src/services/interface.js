import { doPost } from './base'

// 添加接口
export function addApi({ catId, name, method, path, projectId }) {
    return doPost('/interface/add', { catId, name, method, path, projectId })
}

// 修改接口
export function updateApi({
    interfaceId,
    catId,
    name,
    method,
    path,
    desc,
    reqQuery,
    reqBodyType,
    reqBodyJson,
    reqBodyForm,
    resBody
}) {
    return doPost('/interface/update', {
        interfaceId,
        catId,
        name,
        method,
        path,
        desc,
        reqQuery,
        reqBodyType,
        reqBodyJson,
        reqBodyForm,
        resBody
    })
}

// 删除接口
export function deleteApi({ interfaceId }) {
    return doPost('/interface/delete', { interfaceId })
}
