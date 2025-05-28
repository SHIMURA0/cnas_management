import React, { useState } from 'react';
import { Card, Row, Col, Avatar, Statistic, Table, Tag, Button, Descriptions, Space, Divider, Modal, Form, Input, Upload, message } from 'antd';
import { UserOutlined, FileOutlined, ClockCircleOutlined, CheckCircleOutlined, TeamOutlined, UploadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

interface ArchivistInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar?: string;
}

interface OperationRecord {
  key: string;
  date: string;
  type: '归档' | '借阅' | '归还' | '销毁';
  fileName: string;
  status: '成功' | '处理中' | '失败';
}

const mockArchivistInfo: ArchivistInfo = {
  name: '张档案',
  employeeId: 'AR2024001',
  department: '档案管理部',
  position: '高级档案管理员',
  email: 'archivist@example.com',
  phone: '13800138000',
  joinDate: '2020-01-01',
};

const mockOperationRecords: OperationRecord[] = [
  {
    key: '1',
    date: '2024-03-15 14:30',
    type: '归档',
    fileName: '2024年第一季度财务报表.pdf',
    status: '成功',
  },
  {
    key: '2',
    date: '2024-03-15 10:15',
    type: '借阅',
    fileName: '设备维护记录2023.pdf',
    status: '成功',
  },
  {
    key: '3',
    date: '2024-03-14 16:45',
    type: '归还',
    fileName: '项目验收报告.pdf',
    status: '成功',
  },
];

const ArchivistProfile: React.FC = () => {
  const [archivistInfo] = useState<ArchivistInfo>(mockArchivistInfo);
  const [operationRecords] = useState<OperationRecord[]>(mockOperationRecords);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleAvatarClick = () => {
    console.log('Avatar clicked');
    setProfileModalVisible(true);
    form.setFieldsValue(archivistInfo);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 调用API保存更新后的信息
      message.success('个人信息更新成功');
      setIsEditing(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
      }
      return isImage && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
        // TODO: 调用API更新头像
      } else if (info.file.status === 'error') {
        message.error('头像上传失败');
      }
    },
  };

  const operationColumns = [
    {
      title: '操作时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '归档': 'blue',
          '借阅': 'green',
          '归还': 'purple',
          '销毁': 'red',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '成功': 'success',
          '处理中': 'processing',
          '失败': 'error',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        {/* 个人信息卡片 */}
        <Col span={24}>
          <Card>
            <div className="flex items-center gap-6">
              <div 
                onClick={handleAvatarClick}
                className="cursor-pointer hover:opacity-80"
              >
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  src={archivistInfo.avatar}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{archivistInfo.name}</h2>
                <Descriptions column={2}>
                  <Descriptions.Item label="工号">{archivistInfo.employeeId}</Descriptions.Item>
                  <Descriptions.Item label="部门">{archivistInfo.department}</Descriptions.Item>
                  <Descriptions.Item label="职位">{archivistInfo.position}</Descriptions.Item>
                  <Descriptions.Item label="入职日期">{archivistInfo.joinDate}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{archivistInfo.email}</Descriptions.Item>
                  <Descriptions.Item label="电话">{archivistInfo.phone}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>

        {/* 工作统计卡片 */}
        <Col span={24}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="本月归档文件"
                  value={156}
                  prefix={<FileOutlined />}
                  suffix="份"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="待处理借阅"
                  value={23}
                  prefix={<ClockCircleOutlined />}
                  suffix="件"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成操作"
                  value={892}
                  prefix={<CheckCircleOutlined />}
                  suffix="次"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="服务用户数"
                  value={45}
                  prefix={<TeamOutlined />}
                  suffix="人"
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 最近操作记录 */}
        <Col span={24}>
          <Card
            title="最近操作记录"
            extra={
              <Button type="link">查看全部</Button>
            }
          >
            <Table
              columns={operationColumns}
              dataSource={operationRecords}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* 个人信息详情弹框 */}
      <Modal
        title="个人信息详情"
        open={profileModalVisible}
        onCancel={() => {
          setProfileModalVisible(false);
          setIsEditing(false);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <div className="flex flex-col items-center mb-6">
          <Upload {...uploadProps}>
            <div className="relative group">
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={archivistInfo.avatar}
                className="cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full">
                <UploadOutlined className="text-white text-2xl" />
              </div>
            </div>
          </Upload>
          <div className="mt-4 text-gray-500">点击头像可更换</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          disabled={!isEditing}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="工号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[
                  { required: true, message: '请输入电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="joinDate"
            label="入职日期"
          >
            <Input disabled />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            {isEditing ? (
              <>
                <Button onClick={() => {
                  setIsEditing(false);
                  form.resetFields();
                }}>
                  取消
                </Button>
                <Button type="primary" onClick={handleSave} icon={<SaveOutlined />}>
                  保存
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEdit} icon={<EditOutlined />}>
                编辑
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ArchivistProfile; 