/**
 * 历史验收记录 API 预留
 */

const API_BASE_URL = 'http://your-backend-api.com/api' // TODO: 替换为真实服务地址

/**
 * 获取历史验收列表
 * @param {Object} params
 * @param {string} [params.projectCode]
 * @param {string} [params.owner]
 * @param {string} [params.progress]
 * @param {string} [params.purchase]
 * @param {string} [params.startDate]
 * @param {string} [params.endDate]
 * @param {number} [params.page]
 * @param {number} [params.size]
 */
export const fetchAcceptHistory = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`${API_BASE_URL}/accept/history?${qs}`)
    return await res.json()
  } catch (error) {
    console.error('fetchAcceptHistory error:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 导出历史验收记录
 */
export const exportAcceptHistory = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`${API_BASE_URL}/accept/history/export?${qs}`)
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return await res.json() // 可能返回 { url }
    }
    const blob = await res.blob()
    return { success: true, blob }
  } catch (error) {
    console.error('exportAcceptHistory error:', error)
    return { success: false, message: error.message }
  }
}



