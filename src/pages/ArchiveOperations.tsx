import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Form, Select, message, Card, Tabs, Badge, Timeline } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, FileOutlined, HistoryOutlined, RollbackOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface ArchiveOperation {
  key: string;
  fileName: string;
  borrower: string;
  department: string;
  operationType: '借出' | '归还' | '归档';
  status: '待处理' | '已处理' | '已拒绝';
  requestTime: string;
  processTime?: string;
  remark?: string;
}

const mockData: ArchiveOperation[] = [
  {
    key: '1',
    fileName: '实验报告A.pdf',
    borrower: '张三',
    department: '化学分析部',
    operationType: '借出',
    status: '待处理',
    requestTime: '2024-03-15 10:00:00',
    remark: '需要查看历史数据',
  },
  {
    key: '2',
    fileName: '检测记录B.docx',
    borrower: '李四',
    department: '物理检测部',
    operationType: '归还',
    status: '已处理',
    requestTime: '2024-03-14 15:30:00',
    processTime: '2024-03-14 16:00:00',
  },
  {
    key: '3',
    fileName: '原始数据C.xlsx',
    borrower: '王五',
    department: '质量控制部',
    operationType: '归档',
    status: '已处理',
    requestTime: '2024-03-13 09:15:00',
    processTime: '2024-03-13 09:30:00',
  },
  {
    key: '4',
    fileName: '2024年第一季度检测报告.pdf',
    borrower: '赵六',
    department: '研发部',
    operationType: '借出',
    status: '待处理',
    requestTime: '2024-03-15 14:20:00',
    remark: '需要参考历史数据编写新报告',
  },
  {
    key: '5',
    fileName: '设备校准记录.docx',
    borrower: '钱七',
    department: '质量控制部',
    operationType: '归档',
    status: '已拒绝',
    requestTime: '2024-03-14 11:45:00',
    processTime: '2024-03-14 13:20:00',
    remark: '文件格式不符合归档要求，请重新整理后提交',
  },
  {
    key: '6',
    fileName: '实验室安全培训记录.pdf',
    borrower: '孙八',
    department: '化学分析部',
    operationType: '归还',
    status: '已处理',
    requestTime: '2024-03-13 16:30:00',
    processTime: '2024-03-13 16:45:00',
  },
  {
    key: '7',
    fileName: 'CNAS认证材料.zip',
    borrower: '周九',
    department: '行政部',
    operationType: '借出',
    status: '待处理',
    requestTime: '2024-03-15 09:00:00',
    remark: '准备年度认证审核',
  },
  {
    key: '8',
    fileName: '实验设备使用记录.xlsx',
    borrower: '吴十',
    department: '物理检测部',
    operationType: '归档',
    status: '已处理',
    requestTime: '2024-03-12 15:00:00',
    processTime: '2024-03-12 15:30:00',
  },
  {
    key: '9',
    fileName: '质量体系文件.pdf',
    borrower: '郑十一',
    department: '质量控制部',
    operationType: '借出',
    status: '已拒绝',
    requestTime: '2024-03-11 10:15:00',
    processTime: '2024-03-11 11:00:00',
    remark: '该文件为机密文件，需要部门主管审批',
  },
  {
    key: '10',
    fileName: '实验室环境监测报告.docx',
    borrower: '王十二',
    department: '化学分析部',
    operationType: '归档',
    status: '待处理',
    requestTime: '2024-03-15 16:00:00',
    remark: '月度环境监测报告归档',
  },
  {
    key: '11',
    fileName: '设备维护保养记录.pdf',
    borrower: '李十三',
    department: '物理检测部',
    operationType: '归还',
    status: '待处理',
    requestTime: '2024-03-15 15:30:00',
    remark: '设备维护完成，归还记录',
  },
  {
    key: '12',
    fileName: '实验室人员培训档案.zip',
    borrower: '张十四',
    department: '行政部',
    operationType: '归档',
    status: '已处理',
    requestTime: '2024-03-10 14:00:00',
    processTime: '2024-03-10 14:30:00',
  }
];

const statusColor: Record<string, string> = {
  '待处理': 'processing',
  '已处理': 'success',
  '已拒绝': 'error',
};

const operationColor: Record<string, string> = {
  '借出': 'blue',
  '归还': 'green',
  '归档': 'purple',
};

const ArchiveOperations: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<ArchiveOperation | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => 
    item.fileName.includes(search) || 
    item.borrower.includes(search) || 
    item.department.includes(search)
  );

  const handleProcess = (record: ArchiveOperation) => {
    setSelectedOperation(record);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedOperation) {
        setData(data.map(item => 
          item.key === selectedOperation.key 
            ? { 
                ...item, 
                status: values.action === 'approve' ? '已处理' : '已拒绝',
                processTime: new Date().toLocaleString(),
                remark: values.remark
              } 
            : item
        ));
        message.success(values.action === 'approve' ? '已批准' : '已拒绝');
        setModalVisible(false);
      }
    });
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '借阅人',
      dataIndex: 'borrower',
      key: 'borrower',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (type: string) => (
        <Tag color={operationColor[type]}>{type}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={statusColor[status] as any} text={status} />
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'requestTime',
      key: 'requestTime',
    },
    {
      title: '处理时间',
      dataIndex: 'processTime',
      key: 'processTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ArchiveOperation) => (
        <Space>
          {record.status === '待处理' && (
            <Button 
              type="primary"
              size="small"
              onClick={() => handleProcess(record)}
            >
              处理
            </Button>
          )}
          <Button 
            type="text" 
            icon={<HistoryOutlined />}
            onClick={() => message.info('查看操作历史')}
          />
        </Space>
      ),
    },
  ];

  const items = [
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
      key: 'processed',
      label: '已处理',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '已处理')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'rejected',
      label: '已拒绝',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '已拒绝')}
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
            placeholder="搜索文件名/借阅人/部门"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
        </Space>
        <Space>
          <Badge count={filteredData.filter(item => item.status === '待处理').length} showZero>
            <Button type="primary" icon={<ClockCircleOutlined />}>
              待处理事项
            </Button>
          </Badge>
        </Space>
      </div>

      <Tabs items={items} />

      <Modal
        title="处理档案操作"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="action"
            label="处理结果"
            rules={[{ required: true, message: '请选择处理结果' }]}
          >
            <Select
              placeholder="请选择处理结果"
              options={[
                { label: '批准', value: 'approve' },
                { label: '拒绝', value: 'reject' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label="处理备注"
            rules={[{ required: true, message: '请输入处理备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入处理备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArchiveOperations; 