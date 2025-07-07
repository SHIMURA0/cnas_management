import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Card, Tabs, Badge, Modal, Form, Select, DatePicker, message, Upload, Tooltip, notification, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FileOutlined, HistoryOutlined, BellOutlined, ExportOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

interface CalibrationRecord {
  key: string;
  equipmentName: string;
  equipmentModel: string;
  serialNumber: string;
  calibrationType: '定期校准' | '首次校准' | '维修后校准';
  calibrationDate: string;
  nextCalibrationDate: string;
  status: '待校准' | '已校准' | '已过期';
  calibrator: string;
  result: '合格' | '不合格' | '待定';
  certificateNo: string;
  remark?: string;
}

const mockData: CalibrationRecord[] = [
  {
    key: '1',
    equipmentName: '高效液相色谱仪',
    equipmentModel: 'Agilent 1260',
    serialNumber: 'HPLC-2024-001',
    calibrationType: '定期校准',
    calibrationDate: '2024-02-15',
    nextCalibrationDate: '2024-05-15',
    status: '已校准',
    calibrator: '张三',
    result: '合格',
    certificateNo: 'CAL-2024-001',
    remark: '各项指标正常',
  },
  {
    key: '2',
    equipmentName: '原子吸收分光光度计',
    equipmentModel: 'PerkinElmer AA800',
    serialNumber: 'AAS-2023-002',
    calibrationType: '维修后校准',
    calibrationDate: '2024-03-10',
    nextCalibrationDate: '2024-06-10',
    status: '已校准',
    calibrator: '李四',
    result: '合格',
    certificateNo: 'CAL-2024-002',
    remark: '维修后校准合格',
  },
  {
    key: '3',
    equipmentName: '电子天平',
    equipmentModel: 'Mettler Toledo XS205',
    serialNumber: 'BAL-2024-003',
    calibrationType: '定期校准',
    calibrationDate: '2024-05-01',
    nextCalibrationDate: '2024-08-01',
    status: '待校准',
    calibrator: '',
    result: '待定',
    certificateNo: '',
  },
];

const statusColor: Record<string, string> = {
  '待校准': 'warning',
  '已校准': 'success',
  '已过期': 'error',
};

const resultColor: Record<string, string> = {
  '合格': 'success',
  '不合格': 'error',
  '待定': 'warning',
};

const Calibration: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CalibrationRecord | null>(null);
  const [form] = Form.useForm();

  // 检查校准提醒
  useEffect(() => {
    const checkCalibrationReminders = () => {
      const today = dayjs();
      const upcomingCalibrations = data.filter(record => {
        const nextDate = dayjs(record.nextCalibrationDate);
        const daysUntilCalibration = nextDate.diff(today, 'day');
        return daysUntilCalibration >= 0 && daysUntilCalibration <= 30;
      });

      upcomingCalibrations.forEach(record => {
        const nextDate = dayjs(record.nextCalibrationDate);
        const daysUntilCalibration = nextDate.diff(today, 'day');
        
        if (daysUntilCalibration <= 7) {
          notification.warning({
            message: '校准提醒',
            description: `${record.equipmentName} 将在 ${daysUntilCalibration} 天后需要校准`,
            duration: 0,
          });
        } else if (daysUntilCalibration <= 30) {
          notification.info({
            message: '校准提醒',
            description: `${record.equipmentName} 将在 ${daysUntilCalibration} 天后需要校准`,
            duration: 0,
          });
        }
      });
    };

    checkCalibrationReminders();
    // 每天检查一次
    const timer = setInterval(checkCalibrationReminders, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [data]);

  // 导出数据
  const handleExport = () => {
    const exportData = data.map(record => ({
      '设备名称': record.equipmentName,
      '设备型号': record.equipmentModel,
      '序列号': record.serialNumber,
      '校准类型': record.calibrationType,
      '校准日期': record.calibrationDate,
      '下次校准日期': record.nextCalibrationDate,
      '状态': record.status,
      '校准人员': record.calibrator,
      '校准结果': record.result,
      '证书编号': record.certificateNo,
      '备注': record.remark || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '校准记录');
    XLSX.writeFile(wb, `校准记录_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    message.success('数据导出成功');
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => 
    item.equipmentName.includes(search) || 
    item.serialNumber.includes(search) ||
    item.certificateNo.includes(search)
  );

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: CalibrationRecord) => {
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
        message.success('校准记录已更新');
      } else {
        // 添加新记录
        const newRecord = {
          key: Date.now().toString(),
          ...values,
        };
        setData([...data, newRecord]);
        message.success('新校准记录已添加');
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
          <FileOutlined />
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
      title: '校准类型',
      dataIndex: 'calibrationType',
      key: 'calibrationType',
    },
    {
      title: '校准日期',
      dataIndex: 'calibrationDate',
      key: 'calibrationDate',
    },
    {
      title: '下次校准日期',
      dataIndex: 'nextCalibrationDate',
      key: 'nextCalibrationDate',
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
      title: '校准结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string) => (
        <Tag color={resultColor[result]}>{result}</Tag>
      ),
    },
    {
      title: '证书编号',
      dataIndex: 'certificateNo',
      key: 'certificateNo',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CalibrationRecord) => (
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
            onClick={() => message.info('查看校准历史记录')}
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
      label: '待校准',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '待校准')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'completed',
      label: '已校准',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '已校准')}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ),
    },
    {
      key: 'expired',
      label: '已过期',
      children: (
        <Table
          columns={columns}
          dataSource={filteredData.filter(item => item.status === '已过期')}
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
            placeholder="搜索设备名称/序列号/证书编号"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
        </Space>
        <Space>
          <Tooltip title="导出数据">
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </Tooltip>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加校准记录
          </Button>
        </Space>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BellOutlined className="text-blue-500" />
            <span className="font-medium">校准提醒：</span>
          </div>
          <div className="flex gap-4">
            {data.filter(record => {
              const nextDate = dayjs(record.nextCalibrationDate);
              const daysUntilCalibration = nextDate.diff(dayjs(), 'day');
              return daysUntilCalibration >= 0 && daysUntilCalibration <= 30;
            }).map(record => {
              const nextDate = dayjs(record.nextCalibrationDate);
              const daysUntilCalibration = nextDate.diff(dayjs(), 'day');
              return (
                <Tag 
                  key={record.key}
                  color={daysUntilCalibration <= 7 ? 'red' : 'orange'}
                >
                  {record.equipmentName} 将在 {daysUntilCalibration} 天后校准
                </Tag>
              );
            })}
          </div>
        </div>
      </Card>

      <Tabs items={items} />

      <Modal
        title={selectedRecord ? '编辑校准记录' : '添加校准记录'}
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
          {/* 第一行：设备基本信息 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="equipmentName"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="equipmentModel"
                label="设备型号"
                rules={[{ required: true, message: '请输入设备型号' }]}
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
          </Row>

          {/* 第二行：序列号和校准类型 */}
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
                name="calibrationType"
                label="校准类型"
                rules={[{ required: true, message: '请选择校准类型' }]}
              >
                <Select
                  placeholder="请选择校准类型"
                  options={[
                    { label: '定期校准', value: '定期校准' },
                    { label: '首次校准', value: '首次校准' },
                    { label: '维修后校准', value: '维修后校准' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 第三行：校准日期 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="calibrationDate"
                label="校准日期"
                rules={[{ required: true, message: '请选择校准日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nextCalibrationDate"
                label="下次校准日期"
                rules={[{ required: true, message: '请选择下次校准日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* 第四行：状态和校准人员 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select
                  placeholder="请选择状态"
                  options={[
                    { label: '待校准', value: '待校准' },
                    { label: '已校准', value: '已校准' },
                    { label: '已过期', value: '已过期' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="calibrator"
                label="校准人员"
                rules={[{ required: true, message: '请输入校准人员' }]}
              >
                <Input placeholder="请输入校准人员" />
              </Form.Item>
            </Col>
          </Row>

          {/* 第五行：校准结果和证书编号 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="result"
                label="校准结果"
                rules={[{ required: true, message: '请选择校准结果' }]}
              >
                <Select
                  placeholder="请选择校准结果"
                  options={[
                    { label: '合格', value: '合格' },
                    { label: '不合格', value: '不合格' },
                    { label: '待定', value: '待定' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="certificateNo"
                label="证书编号"
                rules={[{ required: true, message: '请输入证书编号' }]}
              >
                <Input placeholder="请输入证书编号" />
              </Form.Item>
            </Col>
          </Row>

          {/* 第六行：备注 */}
          <Row>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>

          {/* 第七行：校准证书上传 */}
          <Row>
            <Col span={24}>
              <Form.Item
                label="校准证书"
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
                  <Button icon={<UploadOutlined />}>上传证书</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Calibration; 