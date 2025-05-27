import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Dropdown, Menu, Modal, message, Upload, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, RollbackOutlined, UploadOutlined, MoreOutlined, HistoryOutlined, DiffOutlined, InboxOutlined } from '@ant-design/icons';

interface VersionFile {
  key: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: '最新' | '有更新' | '历史';
  updateDate: string;
}

const statusColor: Record<string, string> = {
  '最新': 'green',
  '有更新': 'orange',
  '历史': 'blue',
};

const mockData: VersionFile[] = [
  { key: '1', name: '实验报告A.pdf', currentVersion: 'v1.0', latestVersion: 'v1.0', status: '最新', updateDate: '2024-06-01' },
  { key: '2', name: '检测记录B.docx', currentVersion: 'v2.0', latestVersion: 'v2.1', status: '有更新', updateDate: '2024-06-02' },
  { key: '3', name: '原始数据C.xlsx', currentVersion: 'v1.1', latestVersion: 'v1.2', status: '有更新', updateDate: '2024-06-03' },
  { key: '4', name: '仪器校准D.txt', currentVersion: 'v1.0', latestVersion: 'v1.0', status: '最新', updateDate: '2024-06-04' },
];

const Versions: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState('');
  const [compareModal, setCompareModal] = useState<{ open: boolean; file?: VersionFile }>({ open: false });
  const [uploadModal, setUploadModal] = useState(false);
  const [historyModal, setHistoryModal] = useState<{ open: boolean; file?: VersionFile }>({ open: false });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => item.name.includes(search));

  const handleMenuClick = (record: VersionFile, action: string) => {
    if (action === 'compare') setCompareModal({ open: true, file: record });
    if (action === 'rollback') message.success('回滚成功（mock）');
    if (action === 'upload') setUploadModal(true);
    if (action === 'history') setHistoryModal({ open: true, file: record });
    if (action === 'preview') message.info('预览功能演示');
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: '当前版本',
      dataIndex: 'currentVersion',
      key: 'currentVersion',
      render: (ver: string) => <Tag color="geekblue">{ver}</Tag>,
    },
    {
      title: '最新版本',
      dataIndex: 'latestVersion',
      key: 'latestVersion',
      render: (ver: string) => <Tag color="blue">{ver}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColor[status]}>{status}</Tag>,
      filters: [
        { text: '最新', value: '最新' },
        { text: '有更新', value: '有更新' },
        { text: '历史', value: '历史' },
      ],
      onFilter: (value: boolean | React.Key, record: VersionFile) => record.status === value,
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      sorter: (a: VersionFile, b: VersionFile) => a.updateDate.localeCompare(b.updateDate),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: VersionFile) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="preview" icon={<EyeOutlined />} onClick={() => handleMenuClick(record, 'preview')}>预览</Menu.Item>
              <Menu.Item key="compare" icon={<DiffOutlined />} onClick={() => handleMenuClick(record, 'compare')}>版本对比</Menu.Item>
              <Menu.Item key="history" icon={<HistoryOutlined />} onClick={() => handleMenuClick(record, 'history')}>历史版本</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="rollback" icon={<RollbackOutlined />} onClick={() => handleMenuClick(record, 'rollback')}>回滚</Menu.Item>
              <Menu.Item key="upload" icon={<UploadOutlined />} onClick={() => handleMenuClick(record, 'upload')}>上传新版本</Menu.Item>
            </Menu>
          }
        >
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <Space>
          <Input
            placeholder="搜索文件名"
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-56"
          />
        </Space>
        <Button icon={<UploadOutlined />} type="primary" onClick={() => setUploadModal(true)}>
          上传新版本
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        bordered
        size="middle"
      />
      {/* 版本对比弹窗 */}
      <Modal open={compareModal.open} title="版本对比" onCancel={() => setCompareModal({ open: false })} footer={null}>
        <div className="text-center text-gray-500">这里是 {compareModal.file?.name} 的版本对比内容（mock）</div>
      </Modal>
      {/* 历史版本弹窗 */}
      <Modal open={historyModal.open} title="历史版本" onCancel={() => setHistoryModal({ open: false })} footer={null}>
        <div className="text-center text-gray-500">这里是 {historyModal.file?.name} 的历史版本列表（mock）</div>
      </Modal>
      {/* 上传新版本弹窗 */}
      <Modal open={uploadModal} title="上传新版本" onCancel={() => setUploadModal(false)} footer={null}>
        <Upload.Dragger name="file" multiple={false} showUploadList={false} beforeUpload={() => { message.success('上传成功（mock）'); setUploadModal(false); return false; }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default Versions; 