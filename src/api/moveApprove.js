/**
 * 移模审批 API 预留
 */

const API_BASE_URL = 'http://your-backend-api.com/api' // TODO: 替换为真实地址

// 指标：待审批、已审批数量
export const fetchMoveApproveStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/move-approve/stats`)
    return await res.json()
  } catch (e) {
    console.error('fetchMoveApproveStats error:', e)
    return { success: false, message: e.message }
  }
}

// 图表：审批数据统计（可多折线）
export const fetchMoveApproveChart = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`${API_BASE_URL}/move-approve/chart?${qs}`)
    return await res.json()
  } catch (e) {
    console.error('fetchMoveApproveChart error:', e)
    return { success: false, message: e.message }
  }
}

// 列表：导出/导入（预留）
export const exportMoveApprove = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`${API_BASE_URL}/move-approve/export?${qs}`)
    const type = res.headers.get('content-type') || ''
    if (type.includes('application/json')) return await res.json()
    const blob = await res.blob()
    return { success: true, blob }
  } catch (e) {
    console.error('exportMoveApprove error:', e)
    return { success: false, message: e.message }
  }
}

export const importMoveApprove = async (file) => {
  try {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE_URL}/move-approve/import`, { method: 'POST', body: form })
    return await res.json()
  } catch (e) {
    console.error('importMoveApprove error:', e)
    return { success: false, message: e.message }
  }
}



