import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// 全局样式
import "@/styles/global.scss"
// 全局功能类
import "@/styles/base.scss"
// 全局css变量
import "@/styles/variable.scss"
// 引入转换为css后的图标icon
import './assets/icon/icon.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
