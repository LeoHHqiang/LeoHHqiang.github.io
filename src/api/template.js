/**
 * 模板管理 API 预留（仅定义，不强依赖后端即可本地跑通）
 */

const API_BASE_URL = 'http://your-backend-api.com/api' // TODO: 替换为真实地址

export const fetchTemplates = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  try {
    const res = await fetch(`${API_BASE_URL}/templates?${qs}`)
    return await res.json()
  } catch (error) {
    console.error('fetchTemplates error:', error)
    return { success: false, message: error.message }
  }
}

export const createTemplate = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (error) {
    console.error('createTemplate error:', error)
    return { success: false, message: error.message }
  }
}

export const updateTemplate = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (error) {
    console.error('updateTemplate error:', error)
    return { success: false, message: error.message }
  }
}

export const deleteTemplate = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}`, { method: 'DELETE' })
    return await res.json()
  } catch (error) {
    console.error('deleteTemplate error:', error)
    return { success: false, message: error.message }
  }
}

export const duplicateTemplate = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}/duplicate`, { method: 'POST' })
    return await res.json()
  } catch (error) {
    console.error('duplicateTemplate error:', error)
    return { success: false, message: error.message }
  }
}



