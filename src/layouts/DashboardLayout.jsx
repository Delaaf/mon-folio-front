import React from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  ProjectOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
  EyeOutlined,
  UserOutlined, 
  CustomerServiceOutlined,
  EllipsisOutlined,
  EditOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './DashboardLayout.module.css'

const { Sider, Content } = Layout

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const items = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },

    {
      key: '/mes-informations',
      icon: <UserOutlined />,
      label: 'Mes informations'
    },

    {
      key: `/public/${user?.username}`,
      icon: <EyeOutlined />,
      label: 'Voir mon portfolio'
    },
    {
      key: '/modifier-mon-portfolio',
      icon: <EditOutlined />,
      label: 'Modifier mon portfolio'
    },


    { type: 'divider' },

    {
      key: '/gerer-mes-projets',
      icon: <ProjectOutlined />,
      label: 'Gérer mes projets'
    },
    {
      key: '/gerer-mes-competences',
      icon: <StarOutlined />,
      label: 'Gérer mes compétences'
    },

    { type: 'divider' },

    {
      key: '/gerer-autres',
      icon: <EllipsisOutlined />,
      label: 'Gérer autres'
    },
    {
      key: '/parametres-du-compte',
      icon: <SettingOutlined />,
      label: 'Paramètres'
    },

    {
      key: '/aide-et-support',
      icon: <CustomerServiceOutlined />,
      label: 'Aide et support',
    },

    { type: 'divider' },

    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      danger: true
    }
  ]

  const handleClick = (e) => {
    if (e.key === 'logout') {
      logout()
    } else {
      navigate(e.key)
    }
  }

  return (
    <Layout className={styles.layout}>
      {/* Sidebar */}
      <Sider width={240} className={styles.sider}>
        <div className={styles.logo}>MonFolio</div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleClick}
        />
      </Sider>

      {/* Contenu */}
      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}