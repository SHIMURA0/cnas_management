export type Role = 'admin' | 'archivist' | 'equipment_manager';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  roles: Role[];
}

export interface User {
  username: string;
  role: Role;
  name: string;
  avatar?: string;
}

// 模拟用户数据
export const users: User[] = [
  {
    username: 'admin',
    role: 'admin',
    name: '系统管理员',
  },
  {
    username: 'archivist',
    role: 'archivist',
    name: '档案管理员',
  },
  {
    username: 'equipment',
    role: 'equipment_manager',
    name: '设备管理员',
  },
];

// 菜单配置
export const menuConfig: MenuItem[] = [
  {
    key: '/files',
    icon: 'FileOutlined',
    label: '文件管理',
    roles: ['admin'],
  },
  {
    key: '/versions',
    icon: 'FileOutlined',
    label: '版本控制',
    roles: ['admin'],
  },
  {
    key: '/archives',
    icon: 'FileOutlined',
    label: '归档管理',
    roles: ['admin', 'archivist'],
  },
  {
    key: '/personnel',
    icon: 'TeamOutlined',
    label: '人员管理',
    roles: ['admin'],
  },
  {
    key: '/archive-operations',
    icon: 'FileSearchOutlined',
    label: '档案操作',
    roles: ['archivist'],
  },
  {
    key: '/equipment-archives',
    icon: 'ToolOutlined',
    label: '设备档案',
    roles: ['equipment_manager'],
  },
  {
    key: '/calibration',
    icon: 'ExperimentOutlined',
    label: '校准管理',
    roles: ['equipment_manager'],
  },
  {
    key: '/maintenance',
    icon: 'ToolOutlined',
    label: '维护管理',
    roles: ['equipment_manager'],
  },
  {
    key: '/material-submission',
    icon: 'FileOutlined',
    label: '材料提交',
    roles: ['equipment_manager'],
  },
]; 