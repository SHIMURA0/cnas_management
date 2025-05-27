import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Form, Select, message, Avatar, Tooltip, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';

interface StaffMember {
  key: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: '在职' | '休假' | '离职';
  joinDate: string;
  avatar?: string;
}

const mockData: StaffMember[] = [
  {
    key: '1',
    name: '张三',
    position: '实验室主任',
    department: '化学分析部',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    status: '在职',
    joinDate: '2020-01-01',
  },
  {
    key: '2',
    name: '李四',
    position: '高级实验员',
    department: '物理检测部',
    email: 'lisi@example.com',
    phone: '13800138001',
    status: '在职',
    joinDate: '2021-03-15',
  },
  {
    key: '3',
    name: '王五',
    position: '质量主管',
    department: '质量控制部',
    email: 'wangwu@example.com',
    phone: '13800138002',
    status: '休假',
    joinDate: '2019-06-01',
  },
];

const positions = [
  { label: '实验室主任', value: '实验室主任' },
  { label: '技术主管', value: '技术主管' },
  { label: '质量主管', value: '质量主管' },
  { label: '高级实验员', value: '高级实验员' },
  { label: '实验员', value: '实验员' },
  { label: '助理实验员', value: '助理实验员' },
  { label: '行政人员', value: '行政人员' },
];

const departments = [
  { label: '化学分析部', value: '化学分析部' },
  { label: '物理检测部', value: '物理检测部' },
  { label: '质量控制部', value: '质量控制部' },
  { label: '研发部', value: '研发部' },
  { label: '行政部', value: '行政部' },
];

const statusColor: Record<string, string> = {
  '在职': 'success',
  '休假': 'warning',
  '离职': 'error',
};

const Personnel: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => 
    item.name.includes(search) || 
    item.position.includes(search) || 
    item.department.includes(search)
  );

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setEditingStaff(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setData(data.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingStaff) {
        // 编辑现有员工
        setData(data.map(item => 
          item.key === editingStaff.key ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        // 添加新员工
        const newStaff: StaffMember = {
          key: Date.now().toString(),
          ...values,
          status: '在职',
          joinDate: new Date().toISOString().split('T')[0],
        };
        setData([...data, newStaff]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StaffMember) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      render: (text: string) => (
        <Tag color="blue" icon={<TeamOutlined />}>
          {text}
        </Tag>
      ),
      filters: positions.map(p => ({ text: p.label, value: p.value })),
      onFilter: (value: boolean | React.Key, record: StaffMember) => record.position === value,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(d => ({ text: d.label, value: d.value })),
      onFilter: (value: boolean | React.Key, record: StaffMember) => record.department === value,
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (record: StaffMember) => (
        <Space direction="vertical" size="small">
          <Space>
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </Space>
          <Space>
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={statusColor[status] as any} text={status} />
      ),
      filters: [
        { text: '在职', value: '在职' },
        { text: '休假', value: '休假' },
        { text: '离职', value: '离职' },
      ],
      onFilter: (value: boolean | React.Key, record: StaffMember) => record.status === value,
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a: StaffMember, b: StaffMember) => a.joinDate.localeCompare(b.joinDate),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: StaffMember) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <Space>
          <Input
            placeholder="搜索姓名/职位/部门"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加人员
          </Button>
        </Space>
        <span className="text-gray-500">共 {filteredData.length} 人</span>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />

      <Modal
        title={editingStaff ? '编辑人员信息' : '添加人员'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: '请选择职位' }]}
          >
            <Select
              placeholder="请选择职位"
              options={positions}
            />
          </Form.Item>
          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select
              placeholder="请选择部门"
              options={departments}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input placeholder="请输入电话" />
          </Form.Item>
          {editingStaff && (
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select
                placeholder="请选择状态"
                options={[
                  { label: '在职', value: '在职' },
                  { label: '休假', value: '休假' },
                  { label: '离职', value: '离职' },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Personnel; 