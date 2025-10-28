/**
 * 用户相关 API 接口
 * 为后端数据接口对接做准备
 */

const API_BASE_URL = 'http://your-backend-api.com/api' // TODO: 修改为实际的后端API地址

/**
 * 用户登录接口
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.username - 用户名
 * @param {string} loginData.password - 密码
 * @returns {Promise<Object>} 返回用户信息
 * 
 * 示例：
 * {
 *   success: true,
 *   data: {
 *     username: 'admin',
 *     name: '管理员',
 *     email: 'admin@example.com',
 *     avatar: 'https://example.com/avatar.jpg',
 *     role: 'admin',
 *     token: 'xxx...'
 *   }
 * }
 */
export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * 用户退出登录接口
 * @param {string} token - 用户token
 * @returns {Promise<Object>} 
 */
export const logout = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    return await response.json()
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * 获取当前用户信息
 * @param {string} token - 用户token
 * @returns {Promise<Object>} 用户信息
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    return await response.json()
  } catch (error) {
    console.error('Get current user error:', error)
    throw error
  }
}

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @param {string} token - 用户token
 * @returns {Promise<Object>}
 */
export const updateUserInfo = async (userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    return await response.json()
  } catch (error) {
    console.error('Update user info error:', error)
    throw error
  }
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @param {string} token - 用户token
 * @returns {Promise<Object>}
 */
export const changePassword = async (passwordData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    })
    
    return await response.json()
  } catch (error) {
    console.error('Change password error:', error)
    throw error
  }
}

/**
 * 获取用户列表（管理员功能）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @param {string} token - 用户token
 * @returns {Promise<Object>}
 */
export const getUserList = async (params, token) => {
  try {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/user/list?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    return await response.json()
  } catch (error) {
    console.error('Get user list error:', error)
    throw error
  }
}

