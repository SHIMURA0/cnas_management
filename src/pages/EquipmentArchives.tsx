import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Card, Tabs, Badge, Modal, Form, Select, DatePicker, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined, ExperimentOutlined, HistoryOutlined } from '@ant-design/icons';

interface Equipment {
  key: string;
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  status: '正常' | '维修中' | '报废';
  location: string;
  department: string;
  lastCalibration: string;
  nextCalibration: string;
}

const mockData: Equipment[] = [
  {
    key: '1',
    name: '高效液相色谱仪',
    model: 'Agilent 1260',
    serialNumber: 'HPLC-2024-001',
    manufacturer: 'Agilent',
    purchaseDate: '2024-01-15',
    status: '正常',
    location: '化学分析室A',
    department: '化学分析部',
    lastCalibration: '2024-02-15',
    nextCalibration: '2024-05-15',
  },
  {
    key: '2',
    name: '原子吸收分光光度计',
    model: 'PerkinElmer AA800',
    serialNumber: 'AAS-2023-002',
    manufacturer: 'PerkinElmer',
    purchaseDate: '2023-06-20',
    status: '维修中',
    location: '物理检测室B',
    department: '物理检测部',
    lastCalibration: '2024-01-20',
    nextCalibration: '2024-04-20',
  },
  {
    key: '3',
    name: '电子天平',
    model: 'Mettler Toledo XS205',
    serialNumber: 'BAL-2024-003',
    manufacturer: 'Mettler Toledo',
    purchaseDate: '2024-02-10',
    status: '正常',
    location: '质量控制室C',
    department: '质量控制部',
    lastCalibration: '2024-02-10',
    nextCalibration: '2024-05-10',
  },
];

const statusColor: Record<string, string> = {
  '正常': 'success',
  '维修中': 'warning',
  '报废': 'error',
};

const EquipmentArchives: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => 
    item.name.includes(search) || 
    item.model.includes(search) || 
    item.serialNumber.includes(search) ||
    item.department.includes(search)
  );

  const handleAdd = () => {
    setSelectedEquipment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Equipment) => {
    setSelectedEquipment(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedEquipment) {
        // 编辑现有设备
        setData(data.map(item => 
          item.key === selectedEquipment.key ? { ...item, ...values } : item
        ));
        message.success('设备信息已更新');
      } else {
        // 添加新设备
        const newEquipment = {
          key: Date.now().toString(),
          ...values,
        };
        setData([...data, newEquipment]);
        message.success('新设备已添加');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ToolOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '序列号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColor[status]}>{status}</Tag>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '最近校准',
      dataIndex: 'lastCalibration',
      key: 'lastCalibration',
    },
    {
      title: '下次校准',
      dataIndex: 'nextCalibration',
      key: 'nextCalibration',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Equipment) => (
        <Space>
          <Button 
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            icon={<HistoryOutlined />}
            onClick={() => message.info('查看设备历史记录')}
          />
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 'all',
      label: '全部设备',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'normal',
      label: '正常',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '正常')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'maintenance',
      label: '维修中',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '维修中')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'scrapped',
      label: '报废',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '报废')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <Space>
          <Input
            placeholder="搜索设备名称/型号/序列号/部门"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
        </Space>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加设备
          </Button>
        </Space>
      </div>

      <Tabs items={items} />

      <Modal
        title={selectedEquipment ? '编辑设备信息' : '添加新设备'}
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
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            name="model"
            label="型号"
            rules={[{ required: true, message: '请输入设备型号' }]}
          >
            <Input placeholder="请输入设备型号" />
          </Form.Item>
          <Form.Item
            name="serialNumber"
            label="序列号"
            rules={[{ required: true, message: '请输入序列号' }]}
          >
            <Input placeholder="请输入序列号" />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="制造商"
            rules={[{ required: true, message: '请输入制造商' }]}
          >
            <Input placeholder="请输入制造商" />
          </Form.Item>
          <Form.Item
            name="purchaseDate"
            label="购买日期"
            rules={[{ required: true, message: '请选择购买日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择设备状态' }]}
          >
            <Select
              placeholder="请选择设备状态"
              options={[
                { label: '正常', value: '正常' },
                { label: '维修中', value: '维修中' },
                { label: '报废', value: '报废' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入设备位置' }]}
          >
            <Input placeholder="请输入设备位置" />
          </Form.Item>
          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select
              placeholder="请选择部门"
              options={[
                { label: '化学分析部', value: '化学分析部' },
                { label: '物理检测部', value: '物理检测部' },
                { label: '质量控制部', value: '质量控制部' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="lastCalibration"
            label="最近校准日期"
            rules={[{ required: true, message: '请选择最近校准日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="nextCalibration"
            label="下次校准日期"
            rules={[{ required: true, message: '请选择下次校准日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentArchives; 