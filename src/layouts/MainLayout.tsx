import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Divider, Modal, Descriptions } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  FileSearchOutlined,
  ToolOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { menuConfig } from '../config/roles';

const { Header, Sider, Content } = Layout;

const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />, label: '个人信息',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />, label: '系统设置',
  },
  { type: 'divider' as const },
  {
    key: 'logout',
    icon: <LogoutOutlined />, label: '退出登录',
  },
];

const mockArchivistInfo = {
  name: '张档案',
  employeeId: 'AR2024001',
  department: '档案管理部',
  position: '高级档案管理员',
  email: 'archivist@example.com',
  phone: '13800138000',
  joinDate: '2020-01-01',
  avatar: '',
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || 'archivist';
  const userName = localStorage.getItem('userName') || '档案管理员';
  const [profileVisible, setProfileVisible] = useState(false);

  // 根据用户角色过滤菜单项
  const filteredMenuItems = menuConfig
    .filter(item => item.roles.includes(userRole as any))
    .map(item => ({
      key: item.key,
      icon: React.createElement(
        item.icon === 'FileOutlined' ? FileOutlined :
        item.icon === 'TeamOutlined' ? TeamOutlined :
        item.icon === 'FileSearchOutlined' ? FileSearchOutlined :
        item.icon === 'ToolOutlined' ? ToolOutlined :
        item.icon === 'ExperimentOutlined' ? ExperimentOutlined :
        FileOutlined
      ),
      label: item.label,
    }));

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('isLogin');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      navigate('/login');
    } else if (key === 'profile') {
      setProfileVisible(true);
    }
  };

  return (
    <Layout className="h-screen bg-gray-100">
      <Layout>
        <Sider
          width={220}
          collapsedWidth={64}
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          className="bg-white shadow-lg flex flex-col h-[calc(100vh-64px)] sticky top-6"
          style={{ background: '#fff' }}
        >
          {/* Logo区，只保留logo */}
          <div className="flex items-center justify-center h-16 mb-2">
            <img
              src="/logo192.png"
              alt="logo"
              className={`transition-all duration-300 ${collapsed ? 'w-8' : 'w-12'} h-8 rounded-full`}
            />
          </div>
          {/* 菜单区，flex-1 */}
          <div className="flex-1 flex flex-col">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={filteredMenuItems}
              onClick={handleMenuClick}
              className="border-none bg-transparent custom-sider-menu flex-1"
              style={{ background: '#fff' }}
              theme="light"
            />
          </div>
          {/* 头像区固定底部，mt-auto */}
          <div className="mt-auto mb-4 px-2">
            <Divider className="my-2" />
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="topRight"
              overlayClassName="min-w-[160px]"
            >
              <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                <Avatar size={collapsed ? 32 : 40} icon={<UserOutlined />} />
                {!collapsed && <span className="text-gray-700 font-medium">{userName}</span>}
              </div>
            </Dropdown>
          </div>
        </Sider>
        <Content className="p-8">
          <div className="bg-white rounded-xl shadow p-8 min-h-[600px]">
            <Outlet />
          </div>
        </Content>
      </Layout>
      {/* 个人信息弹框 */}
      <Modal
        title="个人信息"
        open={profileVisible}
        onCancel={() => setProfileVisible(false)}
        footer={null}
        width={480}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} src={mockArchivistInfo.avatar} />
        </div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="姓名">{mockArchivistInfo.name}</Descriptions.Item>
          <Descriptions.Item label="工号">{mockArchivistInfo.employeeId}</Descriptions.Item>
          <Descriptions.Item label="部门">{mockArchivistInfo.department}</Descriptions.Item>
          <Descriptions.Item label="职位">{mockArchivistInfo.position}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{mockArchivistInfo.email}</Descriptions.Item>
          <Descriptions.Item label="电话">{mockArchivistInfo.phone}</Descriptions.Item>
          <Descriptions.Item label="入职日期">{mockArchivistInfo.joinDate}</Descriptions.Item>
        </Descriptions>
      </Modal>
      {/* 自定义选中项灰色样式 */}
      <style>{`
        .custom-sider-menu .ant-menu-item-selected {
          background: #f3f4f6 !important;
          color: #1677ff !important;
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout; 