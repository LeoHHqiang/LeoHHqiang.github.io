/**
 * 操作记录 API 预留
 */

const API_BASE_URL = 'http://your-backend-api.com/api' // TODO: 替换为真实服务地址

/**
 * 获取操作记录列表
 * @param {Object} params
 * @param {number} [params.page] - 页码，默认 1
 * @param {number} [params.size] - 每页数量，默认 10
 * @param {string} [params.date] - 操作日期
 * @param {string} [params.role] - 操作角色 (admin/auditor/member)
 * @param {string} [params.type] - 操作类型 (create/update/delete/transfer)
 * @param {string} [params.project] - 关联项目
 * @returns {Promise<{success: boolean, data: {list: Array, total: number}}>}
 */
export const fetchOperationRecords = async (params = {}) => {
  const queryParams = {
    page: params.page || 1,
    size: params.size || 10,
    ...(params.date && { date: params.date }),
    ...(params.role && { role: params.role }),
    ...(params.type && { type: params.type }),
    ...(params.project && { project: params.project })
  }
  const qs = new URLSearchParams(queryParams).toString()
  
  try {
    const res = await fetch(`${API_BASE_URL}/operation/records?${qs}`)
    return await res.json()
  } catch (error) {
    console.error('fetchOperationRecords error:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 导出操作记录
 * @param {Object} params - 筛选参数（同 fetchOperationRecords）
 * @returns {Promise<{success: boolean, url?: string, blob?: Blob}>}
 */
export const exportOperationRecords = async (params = {}) => {
  const queryParams = {}
  if (params.date) queryParams.date = params.date
  if (params.role) queryParams.role = params.role
  if (params.type) queryParams.type = params.type
  if (params.project) queryParams.project = params.project
  
  const qs = new URLSearchParams(queryParams).toString()
  
  try {
    const res = await fetch(`${API_BASE_URL}/operation/records/export?${qs}`)
    const contentType = res.headers.get('content-type') || ''
    
    // 如果返回 JSON，可能是下载链接
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (data.url) {
        return { success: true, url: data.url }
      }
    }
    
    // 否则返回文件流
    const blob = await res.blob()
    return { success: true, blob }
  } catch (error) {
    console.error('exportOperationRecords error:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 刷新操作记录缓存
 * @returns {Promise<{success: boolean}>}
 */
export const refreshOperationRecords = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/operation/records/refresh`, {
      method: 'POST'
    })
    return await res.json()
  } catch (error) {
    console.error('refreshOperationRecords error:', error)
    return { success: false, message: error.message }
  }
}

