import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4f8eff',
          colorBgBase: '#0a0a0f',
          colorBgContainer: '#111118',
          colorBgElevated: '#16161f',
          colorBorder: 'rgba(255,255,255,0.07)',
          colorText: '#f0f0f8',
          colorTextSecondary: '#8a8aa8',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
