# API 接口文档

本目录用于存放与后端接口对接的 API 文件。

## 目录结构

```
api/
├── index.js          # API 统一导出和配置
├── user.js          # 用户相关接口
├── template.js      # 模板管理接口（待实现）
├── supplier.js      # 供应商管理接口（待实现）
├── record.js        # 修改记录管理接口（待实现）
├── download.js      # 文件下载接口（待实现）
└── role.js          # 角色管理接口（待实现）
```

## 使用说明

### 1. 配置 API 地址

在 `src/api/user.js` 中修改 `API_BASE_URL` 为实际的后端 API 地址：

```javascript
const API_BASE_URL = 'http://localhost:8080/api' // 开发环境
// 或
const API_BASE_URL = 'https://your-production-api.com/api' // 生产环境
```

### 2. 在组件中使用 API

```javascript
import { login } from '@/api/user'

// 在登录方法中调用
const handleLogin = async () => {
  try {
    const result = await login({
      username: 'admin',
      password: 'admin123'
    })
    
    if (result.success) {
      // 保存 token
      localStorage.setItem('token', result.data.token)
      // 跳转到首页
      emit('login-success', result.data)
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 3. 错误处理

可以使用统一的错误处理函数：

```javascript
import { handleApiError } from '@/api'

try {
  const result = await login(loginData)
} catch (error) {
  handleApiError(error)
}
```

## 接口规范

### 统一响应格式

```javascript
// 成功响应
{
  success: true,
  data: {
    // 实际数据
  },
  message: '操作成功'
}

// 失败响应
{
  success: false,
  message: '错误信息'
}
```

### 认证方式

所有需要认证的接口都需要在请求头中携带 token：

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 待实现接口

- [ ] 模板管理接口（template.js）
- [ ] 供应商管理接口（supplier.js）
- [ ] 修改记录管理接口（record.js）
- [ ] 文件下载接口（download.js）
- [ ] 角色管理接口（role.js）

