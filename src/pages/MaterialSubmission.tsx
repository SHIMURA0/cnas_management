import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Upload,
  message,
  Tag,
  Space,
  Card,
  Select,
  DatePicker,
  Descriptions,
  Tabs,
  Statistic,
  Row,
  Col,
  Timeline,
  Divider,
  Tooltip,
  Badge,
  Dropdown,
  Menu,
  Popconfirm,
  Alert,
  Steps,
  Progress,
  notification,
  Radio,
  Tree,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  MoreOutlined,
  ExportOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileExcelOutlined,
  WarningOutlined,
  BellOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { Pie, Bar, Line } from '@ant-design/plots';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface MaterialSubmission {
  key: string;
  title: string;
  type: string;
  submitDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submitter: string;
  reviewer?: string;
  reviewDate?: string;
  comment?: string;
  files: UploadFile[];
  description?: string;
  priority: 'low' | 'medium' | 'high';
  department: string;
  history: {
    date: string;
    action: string;
    operator: string;
    comment?: string;
  }[];
}

interface Template {
  id: number;
  name: string;
  type: string;
  description: string;
}

const mockData: MaterialSubmission[] = [
  {
    key: '1',
    title: '设备校准报告',
    type: '校准报告',
    submitDate: '2024-03-15',
    status: 'approved',
    submitter: '设备管理员',
    reviewer: '档案管理员',
    reviewDate: '2024-03-16',
    comment: '材料完整，已归档',
    files: [],
    description: '高效液相色谱仪年度校准报告',
    priority: 'high',
    department: '实验室',
    history: [
      {
        date: '2024-03-15 10:00',
        action: '提交材料',
        operator: '设备管理员',
      },
      {
        date: '2024-03-15 14:30',
        action: '开始审核',
        operator: '档案管理员',
      },
      {
        date: '2024-03-16 09:15',
        action: '审核通过',
        operator: '档案管理员',
        comment: '材料完整，已归档',
      },
    ],
  },
  {
    key: '2',
    title: '设备维护记录',
    type: '维护记录',
    submitDate: '2024-03-14',
    status: 'reviewing',
    submitter: '设备管理员',
    files: [],
    description: '原子吸收分光光度计季度维护记录',
    priority: 'medium',
    department: '实验室',
    history: [
      {
        date: '2024-03-14 09:00',
        action: '提交材料',
        operator: '设备管理员',
      },
      {
        date: '2024-03-14 15:20',
        action: '开始审核',
        operator: '档案管理员',
      },
    ],
  },
  {
    key: '3',
    title: '设备使用说明',
    type: '使用说明',
    submitDate: '2024-03-13',
    status: 'pending',
    submitter: '设备管理员',
    files: [],
    description: '电子天平使用说明更新',
    priority: 'low',
    department: '实验室',
    history: [
      {
        date: '2024-03-13 11:30',
        action: '提交材料',
        operator: '设备管理员',
      },
    ],
  },
];

const statusColors = {
  pending: 'default',
  reviewing: 'processing',
  approved: 'success',
  rejected: 'error',
};

const statusText = {
  pending: '待审核',
  reviewing: '审核中',
  approved: '已通过',
  rejected: '已拒绝',
};

const priorityColors = {
  low: 'blue',
  medium: 'orange',
  high: 'red',
};

const priorityText = {
  low: '低',
  medium: '中',
  high: '高',
};

// 材料分类数据
const categories = [
  {
    key: 'all',
    title: '全部材料',
  },
  {
    key: 'calibration',
    title: '校准相关',
    children: [
      { key: 'calibration-report', title: '校准报告' },
      { key: 'calibration-certificate', title: '校准证书' },
    ],
  },
  {
    key: 'maintenance',
    title: '维护相关',
    children: [
      { key: 'maintenance-record', title: '维护记录' },
      { key: 'maintenance-plan', title: '维护计划' },
    ],
  },
  {
    key: 'documentation',
    title: '文档资料',
    children: [
      { key: 'manual', title: '使用手册' },
      { key: 'procedure', title: '操作规程' },
    ],
  },
];

const MaterialSubmission: React.FC = () => {
  const [data, setData] = useState<MaterialSubmission[]>(mockData);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaterialSubmission | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [templates] = useState<Template[]>([
    { id: 1, name: '校准报告模板', type: '校准报告', description: '标准校准报告格式' },
    { id: 2, name: '维护记录模板', type: '维护记录', description: '设备维护记录标准格式' },
    { id: 3, name: '使用说明模板', type: '使用说明', description: '设备使用说明标准格式' },
  ]);
  const [showCharts, setShowCharts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 统计数据
  const getChartData = () => {
    // 按类型统计
    const typeData = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 按状态统计
    const statusData = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 按时间统计
    const timeData = data.reduce((acc, item) => {
      const month = dayjs(item.submitDate).format('YYYY-MM');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      typeData: Object.entries(typeData).map(([type, count]) => ({
        type,
        count,
      })),
      statusData: Object.entries(statusData).map(([status, count]) => ({
        status: statusText[status as keyof typeof statusText],
        count,
      })),
      timeData: Object.entries(timeData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
          month,
          count,
        })),
    };
  };

  const chartData = getChartData();

  // 渲染统计图表
  const renderCharts = () => (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="材料类型分布" className="h-[400px]">
            <Pie
              data={chartData.typeData}
              angleField="count"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              interactions={[
                {
                  type: 'element-active',
                },
              ]}
              legend={{
                position: 'bottom',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="材料状态分布" className="h-[400px]">
            <Bar
              data={chartData.statusData}
              xField="count"
              yField="status"
              seriesField="status"
              label={{
                position: 'right',
              }}
              legend={{
                position: 'bottom',
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card title="材料提交趋势" className="h-[400px]">
            <Line
              data={chartData.timeData}
              xField="month"
              yField="count"
              point={{
                size: 5,
                shape: 'diamond',
              }}
              label={{
                style: {
                  fill: '#aaa',
                },
              }}
              legend={{
                position: 'bottom',
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      (item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase())) &&
      (activeTab === 'all' || item.status === activeTab)
  );

  const handleAddClick = () => {
    setIsTemplateModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newSubmission: MaterialSubmission = {
        key: Date.now().toString(),
        title: values.title,
        type: values.type,
        submitDate: dayjs().format('YYYY-MM-DD'),
        status: 'pending',
        submitter: '设备管理员',
        files: fileList,
        description: values.description,
        priority: values.priority,
        department: values.department,
        history: [
          {
            date: dayjs().format('YYYY-MM-DD HH:mm'),
            action: '提交材料',
            operator: '设备管理员',
          },
        ],
      };

      setData([newSubmission, ...data]);
      message.success('材料提交成功');
      handleCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleViewDetails = (record: MaterialSubmission) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // 批量删除
  const handleBatchDelete = () => {
    const newData = data.filter(item => !selectedRowKeys.includes(item.key));
    setData(newData);
    setSelectedRowKeys([]);
    message.success('批量删除成功');
  };

  // 导出Excel
  const handleExportExcel = () => {
    const exportData = data.map(item => ({
      '标题': item.title,
      '类型': item.type,
      '优先级': priorityText[item.priority],
      '提交日期': item.submitDate,
      '状态': statusText[item.status],
      '提交人': item.submitter,
      '审核人': item.reviewer || '-',
      '审核日期': item.reviewDate || '-',
      '部门': item.department,
      '描述': item.description || '-',
      '备注': item.comment || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '材料提交记录');
    XLSX.writeFile(wb, `材料提交记录_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  // 使用模板
  const handleUseTemplate = (template: Template) => {
    form.setFieldsValue({
      type: template.type,
      description: template.description,
    });
    setIsTemplateModalVisible(false);
    setIsModalVisible(true);
  };

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 更多操作菜单
  const getMoreActions = (record: MaterialSubmission) => (
    <Menu>
      <Menu.Item key="copy" icon={<CopyOutlined />} onClick={() => {
        const newRecord: MaterialSubmission = {
          ...record,
          key: Date.now().toString(),
          title: `${record.title} - 副本`,
          submitDate: dayjs().format('YYYY-MM-DD'),
          status: 'pending' as const,
          history: [{
            date: dayjs().format('YYYY-MM-DD HH:mm'),
            action: '提交材料',
            operator: '设备管理员',
          }],
        };
        setData([newRecord, ...data]);
        message.success('复制提交成功');
      }}>
        复制提交
      </Menu.Item>
      <Menu.Item key="export" icon={<ExportOutlined />} onClick={() => {
        const exportData = {
          '标题': record.title,
          '类型': record.type,
          '优先级': priorityText[record.priority],
          '提交日期': record.submitDate,
          '状态': statusText[record.status],
          '提交人': record.submitter,
          '审核人': record.reviewer || '-',
          '审核日期': record.reviewDate || '-',
          '部门': record.department,
          '描述': record.description || '-',
          '备注': record.comment || '-',
        };
        const ws = XLSX.utils.json_to_sheet([exportData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '材料详情');
        XLSX.writeFile(wb, `${record.title}_${dayjs().format('YYYY-MM-DD')}.xlsx`);
      }}>
        导出详情
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: keyof typeof priorityColors) => (
        <Tag color={priorityColors[priority]}>{priorityText[priority]}</Tag>
      ),
    },
    {
      title: '提交日期',
      dataIndex: 'submitDate',
      key: 'submitDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 120,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 120,
    },
    {
      title: '审核日期',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: MaterialSubmission) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.files.length > 0 && (
            <Tooltip title="下载附件">
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => message.info('下载附件')}
              />
            </Tooltip>
          )}
          <Dropdown overlay={getMoreActions(record)} trigger={['click']}>
            <Button type="link" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={4.8}>
          <Card className="h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-lg" />
                  <span>总提交数</span>
                </div>
              }
              value={data.length}
              valueStyle={{ fontSize: '24px', marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col span={4.8}>
          <Card className="h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-lg" />
                  <span>待审核</span>
                </div>
              }
              value={data.filter(item => item.status === 'pending').length}
              valueStyle={{ color: '#1890ff', fontSize: '24px', marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col span={4.8}>
          <Card className="h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <SyncOutlined spin className="text-lg" />
                  <span>审核中</span>
                </div>
              }
              value={data.filter(item => item.status === 'reviewing').length}
              valueStyle={{ color: '#faad14', fontSize: '24px', marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col span={4.8}>
          <Card className="h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-lg" />
                  <span>已通过</span>
                </div>
              }
              value={data.filter(item => item.status === 'approved').length}
              valueStyle={{ color: '#52c41a', fontSize: '24px', marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col span={4.8}>
          <Card className="h-full">
            <Statistic
              title={
                <div className="flex items-center gap-2">
                  <CloseCircleOutlined className="text-lg" />
                  <span>已拒绝</span>
                </div>
              }
              value={data.filter(item => item.status === 'rejected').length}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px', marginTop: '8px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Input
              placeholder="搜索标题或类型"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setActiveTab(value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待审核</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
            <Radio.Group
              value={showCharts ? 'charts' : 'list'}
              onChange={(e) => setShowCharts(e.target.value === 'charts')}
            >
              <Radio.Button value="list">
                <FileTextOutlined /> 列表视图
              </Radio.Button>
              <Radio.Button value="charts">
                <BarChartOutlined /> 统计图表
              </Radio.Button>
            </Radio.Group>
          </Space>
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="确定要删除选中的记录吗？"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            )}
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
            >
              导出Excel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClick}
            >
              提交材料
            </Button>
          </Space>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Card
              title="材料分类"
              className="h-full"
              bodyStyle={{ padding: '12px' }}
            >
              <Tree
                treeData={categories}
                defaultExpandAll
                selectedKeys={[selectedCategory]}
                onSelect={(keys) => setSelectedCategory(keys[0] as string)}
              />
            </Card>
          </Col>
          <Col span={18}>
            {showCharts ? (
              renderCharts()
            ) : (
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1500 }}
              />
            )}
          </Col>
        </Row>
      </Card>

      {/* 模板选择模态框 */}
      <Modal
        title="选择提交模板"
        open={isTemplateModalVisible}
        onCancel={() => setIsTemplateModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-4">
          <Alert
            message="提示"
            description="选择一个模板可以快速开始提交材料，也可以直接创建新的提交。"
            type="info"
            showIcon
          />
          <div className="grid grid-cols-2 gap-4">
            {templates.map(template => (
              <Card
                key={template.id}
                hoverable
                className="cursor-pointer"
                onClick={() => handleUseTemplate(template)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileTextOutlined className="text-lg" />
                  <span className="font-medium">{template.name}</span>
                </div>
                <p className="text-gray-500 text-sm">{template.description}</p>
              </Card>
            ))}
            <Card
              hoverable
              className="cursor-pointer"
              onClick={() => {
                setIsTemplateModalVisible(false);
                setIsModalVisible(true);
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <PlusOutlined className="text-lg" />
                <span className="font-medium">新建提交</span>
              </div>
              <p className="text-gray-500 text-sm">不使用模板，直接创建新的材料提交</p>
            </Card>
          </div>
        </div>
      </Modal>

      {/* 提交材料模态框 */}
      <Modal
        title="提交材料"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入材料标题" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择材料类型">
              <Option value="校准报告">校准报告</Option>
              <Option value="维护记录">维护记录</Option>
              <Option value="使用说明">使用说明</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              rows={4}
              placeholder="请输入材料描述"
            />
          </Form.Item>

          <Form.Item
            label="附件"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情查看模态框 */}
      <Modal
        title="材料详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="标题" span={2}>
                {selectedRecord.title}
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                {selectedRecord.type}
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={priorityColors[selectedRecord.priority]}>
                  {priorityText[selectedRecord.priority]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交日期">
                {selectedRecord.submitDate}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColors[selectedRecord.status]}>
                  {statusText[selectedRecord.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交人">
                {selectedRecord.submitter}
              </Descriptions.Item>
              <Descriptions.Item label="审核人">
                {selectedRecord.reviewer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核日期">
                {selectedRecord.reviewDate || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="部门" span={2}>
                {selectedRecord.department}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {selectedRecord.description || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {selectedRecord.comment || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">处理历史</Divider>
            <Timeline>
              {selectedRecord.history.map((item, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    item.action === '提交材料' ? 'blue' :
                    item.action === '开始审核' ? 'orange' :
                    item.action === '审核通过' ? 'green' :
                    item.action === '审核拒绝' ? 'red' : 'gray'
                  }
                >
                  <p className="font-medium">{item.action}</p>
                  <p className="text-gray-500 text-sm">
                    {item.date} - {item.operator}
                  </p>
                  {item.comment && (
                    <p className="text-gray-600 mt-1">{item.comment}</p>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>

            {selectedRecord.files.length > 0 && (
              <>
                <Divider orientation="left">附件列表</Divider>
                <div className="space-y-2">
                  {selectedRecord.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{file.name}</span>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => message.info('下载文件')}
                      >
                        下载
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MaterialSubmission; 