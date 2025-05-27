import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Dropdown, Menu, Modal, message, Upload, Tooltip, Timeline, Avatar } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, RollbackOutlined, HistoryOutlined, UploadOutlined, MoreOutlined, InboxOutlined, UserOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons';

interface ArchiveFile {
  key: string;
  name: string;
  uploader: string;
  status: '已归档' | '已借出' | '已归还';
  date: string;
  version: string;
}

interface VersionNode {
  key: string;
  version: string;
  date: string;
  operator: string;
  operatorAvatar?: string;
  action: '上传' | '修改' | '归还';
  remark?: string;
}

const mockData: ArchiveFile[] = [
  { key: '1', name: '实验报告A.pdf', uploader: '张三', status: '已归档', date: '2024-06-01', version: 'v1.0' },
  { key: '2', name: '检测记录B.docx', uploader: '李四', status: '已借出', date: '2024-06-02', version: 'v2.1' },
  { key: '3', name: '原始数据C.xlsx', uploader: '王五', status: '已归还', date: '2024-06-03', version: 'v1.2' },
];

const actionColor: Record<string, string> = {
  '上传': 'blue',
  '修改': 'orange',
  '归还': 'green',
};
const actionIcon: Record<string, React.ReactNode> = {
  '上传': <UploadOutlined />,
  '修改': <EditOutlined />,
  '归还': <FileDoneOutlined />,
};

// mock历史版本线性数据（时间线）
const mockHistoryTimeline = (fileName: string): VersionNode[] => [
  {
    key: 'v1.0',
    version: 'v1.0',
    date: '2024-06-01',
    operator: '张三',
    action: '上传',
    remark: '首次归档',
  },
  {
    key: 'v1.1',
    version: 'v1.1',
    date: '2024-06-02',
    operator: '李四',
    action: '修改',
    remark: '补充检测数据',
  },
  {
    key: 'v1.2',
    version: 'v1.2',
    date: '2024-06-03',
    operator: '王五',
    action: '归还',
    remark: '归还实验原始数据',
  },
];

const statusColor: Record<string, string> = {
  '已归档': 'blue',
  '已借出': 'orange',
  '已归还': 'green',
};

const Archives: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState<ArchiveFile | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyFile, setHistoryFile] = useState<ArchiveFile | null>(null);
  const [uploadModal, setUploadModal] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredData = data.filter(item => item.name.includes(search));

  const handleMenuClick = (record: ArchiveFile, action: string) => {
    if (action === 'preview') setPreviewFile(record);
    if (action === 'download') message.success('下载功能演示');
    if (action === 'delete') setData(data.filter(item => item.key !== record.key));
    if (action === 'return') message.success('归还功能演示');
    if (action === 'history') {
      setHistoryFile(record);
      setHistoryVisible(true);
    }
  };

  // 美化时间线节点内容
  const renderTimelineItem = (node: VersionNode) => (
    <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3 shadow-sm">
      <Tag color={actionColor[node.action]} icon={actionIcon[node.action]} className="mr-2">{node.action}</Tag>
      <span className="font-bold text-blue-700 mr-2">{node.version}</span>
      <span className="text-gray-500 text-xs mr-2">{node.date}</span>
      <Avatar size={22} className="bg-blue-200 text-blue-700 mr-2" icon={<UserOutlined />} style={{ fontSize: 14 }}>{node.operator[0]}</Avatar>
      <span className="text-gray-700 text-sm mr-2">{node.operator}</span>
      {node.remark && <span className="text-gray-400 text-xs ml-2">{node.remark}</span>}
    </div>
  );

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: '上传人',
      dataIndex: 'uploader',
      key: 'uploader',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColor[status]}>{status}</Tag>,
      filters: [
        { text: '已归档', value: '已归档' },
        { text: '已借出', value: '已借出' },
        { text: '已归还', value: '已归还' },
      ],
      onFilter: (value: boolean | React.Key, record: ArchiveFile) => record.status === value,
    },
    {
      title: '上传日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: ArchiveFile, b: ArchiveFile) => a.date.localeCompare(b.date),
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (ver: string) => <Tag color="geekblue">{ver}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ArchiveFile) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="preview" icon={<EyeOutlined />} onClick={() => handleMenuClick(record, 'preview')}>预览</Menu.Item>
              <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleMenuClick(record, 'download')}>下载</Menu.Item>
              <Menu.Item key="history" icon={<HistoryOutlined />} onClick={() => handleMenuClick(record, 'history')}>历史版本</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="return" icon={<RollbackOutlined />} onClick={() => handleMenuClick(record, 'return')}>归还</Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleMenuClick(record, 'delete')}>删除</Menu.Item>
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
          <Button icon={<UploadOutlined />} type="primary" onClick={() => setUploadModal(true)}>
            上传归档
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button danger onClick={() => { setData(data.filter(item => !selectedRowKeys.includes(item.key))); setSelectedRowKeys([]); }}>
              批量删除
            </Button>
          )}
        </Space>
        <span className="text-gray-500">共 {filteredData.length} 条</span>
      </div>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        bordered
        size="middle"
      />
      {/* 文件预览弹窗 */}
      <Modal open={!!previewFile} title="文件预览" onCancel={() => setPreviewFile(null)} footer={null}>
        <div className="text-center text-gray-500">这里是 {previewFile?.name} 的预览内容（mock）</div>
      </Modal>
      {/* 历史版本弹窗（垂直时间线） */}
      <Modal open={historyVisible} title={historyFile ? `${historyFile.name} 历史版本` : '历史版本'} onCancel={() => { setHistoryVisible(false); setHistoryFile(null); }} footer={null} width={520}>
        {historyFile ? (
          <Timeline mode="left">
            {mockHistoryTimeline(historyFile.name).map(node => (
              <Timeline.Item
                key={node.key}
                color={actionColor[node.action]}
                dot={actionIcon[node.action]}
              >
                {renderTimelineItem(node)}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div className="text-center text-gray-500">暂无数据</div>
        )}
      </Modal>
      {/* 上传归档弹窗 */}
      <Modal open={uploadModal} title="上传归档文件" onCancel={() => setUploadModal(false)} footer={null}>
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

export default Archives; 