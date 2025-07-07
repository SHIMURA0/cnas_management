import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Card, Tabs, Badge, Modal, Form, Select, DatePicker, message, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ToolOutlined, HistoryOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface MaintenanceRecord {
  key: string;
  equipmentName: string;
  equipmentModel: string;
  serialNumber: string;
  maintenanceType: '定期维护' | '故障维修' | '预防性维护';
  maintenanceDate: string;
  nextMaintenanceDate: string;
  status: '待处理' | '进行中' | '已完成';
  maintainer: string;
  cost: number;
  description: string;
  solution?: string;
  parts?: string;
  remark?: string;
}

const mockData: MaintenanceRecord[] = [
  {
    key: '1',
    equipmentName: '高效液相色谱仪',
    equipmentModel: 'Agilent 1260',
    serialNumber: 'HPLC-2024-001',
    maintenanceType: '定期维护',
    maintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-06-01',
    status: '已完成',
    maintainer: '王兴',
    cost: 5000,
    description: '更换色谱柱，清洗系统',
    solution: '更换新色谱柱，使用甲醇清洗系统',
    parts: '色谱柱 x1',
    remark: '维护后设备运行正常',
  },
  {
    key: '2',
    equipmentName: '原子吸收分光光度计',
    equipmentModel: 'PerkinElmer AA800',
    serialNumber: 'AAS-2023-002',
    maintenanceType: '故障维修',
    maintenanceDate: '2024-03-10',
    nextMaintenanceDate: '2024-04-10',
    status: '进行中',
    maintainer: '王兴',
    cost: 8000,
    description: '光源不稳定，需要更换',
    solution: '更换氘灯',
    parts: '氘灯 x1',
    remark: '等待配件到货',
  },
  {
    key: '3',
    equipmentName: '电子天平',
    equipmentModel: 'Mettler Toledo XS205',
    serialNumber: 'BAL-2024-003',
    maintenanceType: '预防性维护',
    maintenanceDate: '2024-04-01',
    nextMaintenanceDate: '2024-07-01',
    status: '待处理',
    maintainer: '王兴',
    cost: 0,
    description: '定期清洁和校准',
    solution: '',
    parts: '',
  },
];

const statusColor: Record<string, string> = {
  '待处理': 'warning',
  '进行中': 'processing',
  '已完成': 'success',
};

const Maintenance: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => 
    item.equipmentName.includes(search) || 
    item.serialNumber.includes(search) ||
    item.maintainer.includes(search)
  );

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedRecord) {
        // 编辑现有记录
        setData(data.map(item => 
          item.key === selectedRecord.key ? { ...item, ...values } : item
        ));
        message.success('维护记录已更新');
      } else {
        // 添加新记录
        const newRecord = {
          key: Date.now().toString(),
          ...values,
        };
        setData([...data, newRecord]);
        message.success('新维护记录已添加');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      render: (text: string) => (
        <Space>
          <ToolOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '型号',
      dataIndex: 'equipmentModel',
      key: 'equipmentModel',
    },
    {
      title: '序列号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: '维护类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
    },
    {
      title: '维护日期',
      dataIndex: 'maintenanceDate',
      key: 'maintenanceDate',
    },
    {
      title: '下次维护日期',
      dataIndex: 'nextMaintenanceDate',
      key: 'nextMaintenanceDate',
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
      title: '维护人员',
      dataIndex: 'maintainer',
      key: 'maintainer',
    },
    {
      title: '维护费用',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `¥${cost.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaintenanceRecord) => (
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
            onClick={() => message.info('查看维护历史记录')}
          />
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 'all',
      label: '全部记录',
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
      key: 'pending',
      label: '待处理',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '待处理')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'inProgress',
      label: '进行中',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '进行中')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'completed',
      label: '已完成',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '已完成')}
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
            placeholder="搜索设备名称/序列号/维护人员"
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
            添加维护记录
          </Button>
        </Space>
      </div>

      <Tabs items={items} />

      <Modal
        title={selectedRecord ? '编辑维护记录' : '添加维护记录'}
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
            name="equipmentName"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            name="equipmentModel"
            label="设备型号"
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
            name="maintenanceType"
            label="维护类型"
            rules={[{ required: true, message: '请选择维护类型' }]}
          >
            <Select
              placeholder="请选择维护类型"
              options={[
                { label: '定期维护', value: '定期维护' },
                { label: '故障维修', value: '故障维修' },
                { label: '预防性维护', value: '预防性维护' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="maintenanceDate"
            label="维护日期"
            rules={[{ required: true, message: '请选择维护日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="nextMaintenanceDate"
            label="下次维护日期"
            rules={[{ required: true, message: '请选择下次维护日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={[
                { label: '待处理', value: '待处理' },
                { label: '进行中', value: '进行中' },
                { label: '已完成', value: '已完成' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="maintainer"
            label="维护人员"
            rules={[{ required: true, message: '请输入维护人员' }]}
          >
            <Input placeholder="请输入维护人员" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="维护费用"
            rules={[{ required: true, message: '请输入维护费用' }]}
          >
            <Input type="number" placeholder="请输入维护费用" />
          </Form.Item>
          <Form.Item
            name="description"
            label="维护描述"
            rules={[{ required: true, message: '请输入维护描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入维护描述" />
          </Form.Item>
          <Form.Item
            name="solution"
            label="解决方案"
          >
            <Input.TextArea rows={4} placeholder="请输入解决方案" />
          </Form.Item>
          <Form.Item
            name="parts"
            label="更换配件"
          >
            <Input.TextArea rows={4} placeholder="请输入更换的配件" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item
            label="维护报告"
          >
            <Upload {...{
              name: 'file',
              action: '/api/upload',
              headers: {
                authorization: 'authorization-text',
              },
              onChange(info) {
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`);
                }
              },
            }}>
              <Button icon={<UploadOutlined />}>上传报告</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Maintenance; 