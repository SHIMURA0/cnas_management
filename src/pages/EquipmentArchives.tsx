import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Card, Tabs, Badge, Modal, Form, Select, DatePicker, message, Row, Col, Statistic, Upload, Descriptions, Divider, Drawer, List, Avatar, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined, ExperimentOutlined, HistoryOutlined, FileTextOutlined, PhoneOutlined, MailOutlined, GlobalOutlined, UserOutlined, BookOutlined, SettingOutlined, DownloadOutlined, EyeOutlined, ContactsOutlined, CheckCircleOutlined, ExclamationCircleOutlined, UploadOutlined, BankOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import MaintenanceManualViewer from '../components/MaintenanceManualViewer';



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
  supplier: {
    id: string;
    name: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  maintenanceManual: {
    id: string;
    title: string;
    version: string;
    uploadDate: string;
    fileUrl: string;
    description: string;
    content: {
      overview: string;
      safety: string[];
      operation: string[];
      maintenance: string[];
      troubleshooting: string[];
      specifications: Record<string, string>;
    };
  };
  specifications: {
    power: string;
    dimensions: string;
    weight: string;
    operatingTemperature: string;
    accuracy: string;
  };
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  equipmentCount: number;
  rating: number;
  status: '活跃' | '暂停' | '终止';
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: '安捷伦科技有限公司',
    contact: '张经理',
    phone: '400-820-3278',
    email: 'service@agilent.com',
    address: '北京市朝阳区建国门外大街1号',
    website: 'www.agilent.com',
    equipmentCount: 15,
    rating: 4.8,
    status: '活跃',
  },
  {
    id: '2',
    name: '珀金埃尔默企业管理有限公司',
    contact: '李工程师',
    phone: '400-820-3279',
    email: 'support@perkinelmer.com',
    address: '上海市浦东新区张江高科技园区',
    website: 'www.perkinelmer.com',
    equipmentCount: 8,
    rating: 4.6,
    status: '活跃',
  },
  {
    id: '3',
    name: '梅特勒-托利多国际贸易有限公司',
    contact: '王技术员',
    phone: '400-820-3280',
    email: 'info@mt.com',
    address: '广州市天河区珠江新城',
    website: 'www.mt.com',
    equipmentCount: 12,
    rating: 4.7,
    status: '活跃',
  },
];

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
    supplier: mockSuppliers[0],
    maintenanceManual: {
      id: '1',
      title: 'Agilent 1260 维护手册',
      version: 'v2.1',
      uploadDate: '2024-01-20',
      fileUrl: '/manuals/agilent-1260-manual.pdf',
      description: '包含设备操作、维护、故障排除等详细信息',
      content: {
        overview: 'Agilent 1260高效液相色谱仪是一款高精度分析仪器，适用于药物分析、环境监测、食品安全等领域。本手册提供详细的操作指南和维护说明。',
        safety: [
          '操作前请确保设备接地良好，避免静电干扰',
          '使用有机溶剂时请佩戴防护手套和护目镜',
          '设备运行时请勿触摸高压部件',
          '定期检查管路连接，防止泄漏',
          '废液请按环保要求处理，不得随意排放'
        ],
        operation: [
          '开机前检查电源和管路连接',
          '启动系统软件，进行系统初始化',
          '设置流动相比例和流速参数',
          '平衡色谱柱，确保基线稳定',
          '进样分析，监控色谱图',
          '分析完成后清洗系统，关机'
        ],
        maintenance: [
          '每日检查流动相液位和压力',
          '每周清洗进样器和检测器',
          '每月更换色谱柱保护柱',
          '每季度校准检测器',
          '每年进行系统全面维护'
        ],
        troubleshooting: [
          '基线漂移：检查流动相纯度和温度',
          '峰形异常：检查色谱柱和进样器',
          '压力异常：检查管路堵塞和泵密封',
          '检测器异常：检查光源和流通池',
          '软件故障：重启系统和软件'
        ],
        specifications: {
          '检测器类型': 'DAD二极管阵列检测器',
          '波长范围': '190-950nm',
          '流速范围': '0.001-10mL/min',
          '压力范围': '0-600bar',
          '温度范围': '室温+5°C至80°C',
          '进样体积': '0.1-100μL'
        }
      }
    },
    specifications: {
      power: '220V/50Hz',
      dimensions: '600×450×200mm',
      weight: '25kg',
      operatingTemperature: '15-35°C',
      accuracy: '±0.1%',
    },
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
    supplier: mockSuppliers[1],
    maintenanceManual: {
      id: '2',
      title: 'PerkinElmer AA800 操作手册',
      version: 'v1.8',
      uploadDate: '2023-06-25',
      fileUrl: '/manuals/perkinelmer-aa800-manual.pdf',
      description: '原子吸收分光光度计操作和维护指南',
      content: {
        overview: 'PerkinElmer AA800原子吸收分光光度计是一款高灵敏度元素分析仪器，适用于环境、食品、药品等样品中微量元素的测定。',
        safety: [
          '使用前检查通风系统，确保实验室通风良好',
          '操作时佩戴防护眼镜和手套',
          '注意乙炔气体的安全使用',
          '定期检查气体管路，防止泄漏',
          '废液和废渣按危险废物处理'
        ],
        operation: [
          '开机预热，等待光源稳定',
          '设置分析参数和标准曲线',
          '调节燃气和助燃气比例',
          '进行样品测定',
          '记录数据并保存结果',
          '关机前清洗雾化器'
        ],
        maintenance: [
          '每日检查气体压力和流量',
          '每周清洗雾化器和燃烧头',
          '每月校准波长和能量',
          '每季度更换空心阴极灯',
          '每年进行系统全面校准'
        ],
        troubleshooting: [
          '灵敏度低：检查光源和光路',
          '基线不稳：检查燃气比例和温度',
          '雾化器堵塞：清洗雾化器',
          '燃烧头积碳：更换燃烧头',
          '软件故障：重启仪器和软件'
        ],
        specifications: {
          '光源类型': '空心阴极灯',
          '波长范围': '185-900nm',
          '检测限': 'ppb级别',
          '精密度': 'RSD≤1%',
          '线性范围': '3-4个数量级',
          '样品处理量': '50-100个/小时'
        }
      }
    },
    specifications: {
      power: '220V/50Hz',
      dimensions: '800×600×300mm',
      weight: '45kg',
      operatingTemperature: '18-30°C',
      accuracy: '±0.5%',
    },
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
    supplier: mockSuppliers[2],
    maintenanceManual: {
      id: '3',
      title: 'Mettler Toledo XS205 使用手册',
      version: 'v3.0',
      uploadDate: '2024-02-15',
      fileUrl: '/manuals/mettler-xs205-manual.pdf',
      description: '高精度电子天平操作和维护说明',
      content: {
        overview: 'Mettler Toledo XS205是一款高精度电子天平，具有0.01mg的读数精度，适用于实验室精密称量需求。',
        safety: [
          '使用前检查天平水平，确保稳定',
          '避免在天平附近产生气流和振动',
          '称量时关闭防风门',
          '定期清洁称量盘',
          '避免超载使用天平'
        ],
        operation: [
          '开机预热30分钟',
          '检查天平水平',
          '校准天平',
          '放置容器并去皮',
          '加入样品进行称量',
          '记录数据并清洁'
        ],
        maintenance: [
          '每日清洁称量盘和防风罩',
          '每周检查天平水平',
          '每月进行内部校准',
          '每季度进行外部校准',
          '每年进行专业维护'
        ],
        troubleshooting: [
          '显示异常：检查电源和传感器',
          '精度偏差：重新校准天平',
          '不稳定：检查环境因素',
          '按键无响应：重启天平',
          '数据传输错误：检查接口连接'
        ],
        specifications: {
          '最大称量': '220g',
          '读数精度': '0.01mg',
          '重复性': '0.01mg',
          '线性误差': '±0.1mg',
          '稳定时间': '≤3秒',
          '工作温度': '10-40°C'
        }
      }
    },
    specifications: {
      power: '220V/50Hz',
      dimensions: '300×200×150mm',
      weight: '8kg',
      operatingTemperature: '20-25°C',
      accuracy: '±0.01mg',
    },
  },
];

const statusColor: Record<string, string> = {
  '正常': 'success',
  '维修中': 'warning',
  '报废': 'error',
};

const supplierStatusColor: Record<string, string> = {
  '活跃': 'success',
  '暂停': 'warning',
  '终止': 'error',
};

const EquipmentArchives: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [manualViewerVisible, setManualViewerVisible] = useState(false);
  const [selectedManual, setSelectedManual] = useState<any>(null);
  const [form] = Form.useForm();
  const [supplierForm] = Form.useForm();

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

  const handleViewDetail = (record: Equipment) => {
    setSelectedEquipment(record);
    setDetailDrawerVisible(true);
  };

  const handleViewManual = (record: Equipment) => {
    setSelectedManual(record.maintenanceManual);
    setManualViewerVisible(true);
  };

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    supplierForm.resetFields();
    setSupplierModalVisible(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    supplierForm.setFieldsValue(supplier);
    setSupplierModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedEquipment) {
        setData(data.map(item => 
          item.key === selectedEquipment.key ? { ...item, ...values } : item
        ));
        message.success('设备信息已更新');
      } else {
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

  const handleSupplierModalOk = () => {
    supplierForm.validateFields().then(values => {
      if (selectedSupplier) {
        setSuppliers(suppliers.map(item => 
          item.id === selectedSupplier.id ? { ...item, ...values } : item
        ));
        message.success('供应商信息已更新');
      } else {
        const newSupplier = {
          id: Date.now().toString(),
          equipmentCount: 0,
          rating: 5.0,
          status: '活跃',
          ...values,
        };
        setSuppliers([...suppliers, newSupplier]);
        message.success('新供应商已添加');
      }
      setSupplierModalVisible(false);
    });
  };

  const uploadProps: UploadProps = {
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
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier: any) => (
        <Space>
          <BankOutlined />
          <span>{supplier.name}</span>
        </Space>
      ),
    },
    {
      title: '维护手册',
      key: 'maintenanceManual',
      render: (record: Equipment) => (
        <Space>
          <Button 
            type="link" 
            icon={<BookOutlined />}
            onClick={() => handleViewManual(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<DownloadOutlined />}
            onClick={() => message.success('开始下载维护手册')}
          >
            下载
          </Button>
        </Space>
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
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
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

  const supplierColumns = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <BankOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '设备数量',
      dataIndex: 'equipmentCount',
      key: 'equipmentCount',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Tag color="blue">{rating.toFixed(1)}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={supplierStatusColor[status]}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space>
          <Button 
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            icon={<ContactsOutlined />}
            onClick={() => message.info('查看供应商详情')}
          />
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 'equipment',
      label: '设备档案',
      children: (
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

          <Tabs items={[
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
          ]} />
        </div>
      ),
    },
    {
      key: 'suppliers',
      label: '供应商管理',
      children: (
        <div>
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <Space>
              <Input
                placeholder="搜索供应商名称/联系人"
                prefix={<SearchOutlined />}
                allowClear
                className="w-64"
              />
            </Space>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddSupplier}
              >
                添加供应商
              </Button>
            </Space>
          </div>

          <Table
            columns={supplierColumns}
            dataSource={suppliers}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 统计概览 */}
      <Row gutter={24} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="设备总数"
              value={data.length}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#3B82F6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="正常设备"
              value={data.filter(item => item.status === '正常').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="维修中设备"
              value={data.filter(item => item.status === '维修中').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#F59E42' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="供应商数量"
              value={suppliers.length}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs items={items} />

      {/* 设备详情抽屉 */}
      <Drawer
        title="设备详细信息"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedEquipment && (
          <div>
            <Descriptions title="基本信息" bordered column={1}>
              <Descriptions.Item label="设备名称">{selectedEquipment.name}</Descriptions.Item>
              <Descriptions.Item label="型号">{selectedEquipment.model}</Descriptions.Item>
              <Descriptions.Item label="序列号">{selectedEquipment.serialNumber}</Descriptions.Item>
              <Descriptions.Item label="制造商">{selectedEquipment.manufacturer}</Descriptions.Item>
              <Descriptions.Item label="购买日期">{selectedEquipment.purchaseDate}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColor[selectedEquipment.status]}>{selectedEquipment.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="位置">{selectedEquipment.location}</Descriptions.Item>
              <Descriptions.Item label="部门">{selectedEquipment.department}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="校准信息" bordered column={1}>
              <Descriptions.Item label="最近校准">{selectedEquipment.lastCalibration}</Descriptions.Item>
              <Descriptions.Item label="下次校准">{selectedEquipment.nextCalibration}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="供应商信息" bordered column={1}>
              <Descriptions.Item label="供应商名称">{selectedEquipment.supplier.name}</Descriptions.Item>
              <Descriptions.Item label="联系人">{selectedEquipment.supplier.contact}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedEquipment.supplier.phone}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{selectedEquipment.supplier.email}</Descriptions.Item>
              <Descriptions.Item label="地址">{selectedEquipment.supplier.address}</Descriptions.Item>
              <Descriptions.Item label="网站">{selectedEquipment.supplier.website}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="维护手册" bordered column={1}>
              <Descriptions.Item label="手册标题">{selectedEquipment.maintenanceManual.title}</Descriptions.Item>
              <Descriptions.Item label="版本">{selectedEquipment.maintenanceManual.version}</Descriptions.Item>
              <Descriptions.Item label="上传日期">{selectedEquipment.maintenanceManual.uploadDate}</Descriptions.Item>
              <Descriptions.Item label="描述">{selectedEquipment.maintenanceManual.description}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="技术规格" bordered column={1}>
              <Descriptions.Item label="功率">{selectedEquipment.specifications.power}</Descriptions.Item>
              <Descriptions.Item label="尺寸">{selectedEquipment.specifications.dimensions}</Descriptions.Item>
              <Descriptions.Item label="重量">{selectedEquipment.specifications.weight}</Descriptions.Item>
              <Descriptions.Item label="工作温度">{selectedEquipment.specifications.operatingTemperature}</Descriptions.Item>
              <Descriptions.Item label="精度">{selectedEquipment.specifications.accuracy}</Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <Space>
                <Button type="primary" icon={<DownloadOutlined />}>
                  下载维护手册
                </Button>
                <Button icon={<BookOutlined />}>
                  查看在线手册
                </Button>
                <Button icon={<ContactsOutlined />}>
                  联系供应商
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>

      {/* 设备表单模态框 */}
      <Modal
        title={selectedEquipment ? '编辑设备信息' : '添加新设备'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入设备型号' }]}
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serialNumber"
                label="序列号"
                rules={[{ required: true, message: '请输入序列号' }]}
              >
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="制造商"
                rules={[{ required: true, message: '请输入制造商' }]}
              >
                <Input placeholder="请输入制造商" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="purchaseDate"
                label="购买日期"
                rules={[{ required: true, message: '请选择购买日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="位置"
                rules={[{ required: true, message: '请输入设备位置' }]}
              >
                <Input placeholder="请输入设备位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lastCalibration"
                label="最近校准日期"
                rules={[{ required: true, message: '请选择最近校准日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nextCalibration"
                label="下次校准日期"
                rules={[{ required: true, message: '请选择下次校准日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="维护手册"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传维护手册</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 供应商表单模态框 */}
      <Modal
        title={selectedSupplier ? '编辑供应商信息' : '添加新供应商'}
        open={supplierModalVisible}
        onOk={handleSupplierModalOk}
        onCancel={() => setSupplierModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={supplierForm}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <Input placeholder="请输入供应商名称" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入地址" />
          </Form.Item>
          <Form.Item
            name="website"
            label="网站"
          >
            <Input placeholder="请输入网站地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 维护手册查看器 */}
      <MaintenanceManualViewer
        visible={manualViewerVisible}
        onClose={() => setManualViewerVisible(false)}
        manual={selectedManual}
      />
    </div>
  );
};

export default EquipmentArchives; 