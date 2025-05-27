import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Dropdown, Menu, Modal, message, Upload, Tooltip, Tree, Breadcrumb } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, FolderOpenOutlined, FileOutlined, UploadOutlined, MoreOutlined, InboxOutlined, FolderAddOutlined } from '@ant-design/icons';

interface FileItem {
  key: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  uploader?: string;
  date: string;
}

const mockTreeData = [
  {
    title: '全部文件',
    key: 'root',
    icon: <FolderOpenOutlined />,
    children: [
      {
        title: '报告',
        key: 'folder1',
        icon: <FolderOpenOutlined />,
        children: [
          {
            title: '实验报告A.pdf',
            key: 'file1',
            icon: <FileOutlined />,
            isLeaf: true,
          },
        ],
      },
      {
        title: '原始数据C.xlsx',
        key: 'file2',
        icon: <FileOutlined />,
        isLeaf: true,
      },
    ],
  },
];

const mockFiles: FileItem[] = [
  { key: 'file1', name: '实验报告A.pdf', type: 'file', size: '2MB', uploader: '张三', date: '2024-06-01' },
  { key: 'file2', name: '原始数据C.xlsx', type: 'file', size: '1MB', uploader: '王五', date: '2024-06-03' },
];

const Files: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [renameModal, setRenameModal] = useState<{ open: boolean; file?: FileItem }>({ open: false });
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumb, setBreadcrumb] = useState([{ key: 'root', name: '全部文件' }]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredFiles = files.filter(item => item.name.includes(search));

  const handleMenuClick = (record: FileItem, action: string) => {
    if (action === 'preview') setPreviewFile(record);
    if (action === 'download') message.success('下载功能演示');
    if (action === 'delete') setFiles(files.filter(item => item.key !== record.key));
    if (action === 'rename') setRenameModal({ open: true, file: record });
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FileItem) => (
        <span className="font-medium flex items-center gap-2">
          {record.type === 'folder' ? <FolderOpenOutlined /> : <FileOutlined />} {text}
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type === 'file' ? <Tag color="blue">文件</Tag> : <Tag color="gold">文件夹</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: string) => size || '--',
    },
    {
      title: '上传人',
      dataIndex: 'uploader',
      key: 'uploader',
      render: (uploader: string) => uploader || '--',
    },
    {
      title: '上传日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FileItem) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="preview" icon={<EyeOutlined />} onClick={() => handleMenuClick(record, 'preview')}>预览</Menu.Item>
              <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleMenuClick(record, 'download')}>下载</Menu.Item>
              <Menu.Item key="rename" icon={<EditOutlined />} onClick={() => handleMenuClick(record, 'rename')}>重命名</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleMenuClick(record, 'delete')}>删除</Menu.Item>
            </Menu>
          }
        >
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  // 文件夹树点击
  const onTreeSelect = (keys: React.Key[], info: any) => {
    setCurrentFolder(keys[0] as string);
    // 面包屑
    const path: { key: string; name: string }[] = [];
    let node = info.node;
    while (node) {
      path.unshift({ key: node.key, name: node.title });
      node = node.parent;
    }
    setBreadcrumb(path);
  };

  return (
    <div className="flex gap-6">
      {/* 文件夹树 */}
      <div className="w-65 bg-gray-50 p-4 rounded-lg shadow-sm">
        <Tree
          showIcon
          defaultExpandAll
          treeData={mockTreeData}
          onSelect={onTreeSelect}
        />
      </div>
      {/* 文件列表区 */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <Space>
            <Breadcrumb>
              {breadcrumb.map(b => <Breadcrumb.Item key={b.key}>{b.name}</Breadcrumb.Item>)}
            </Breadcrumb>
            <Input
              placeholder="搜索文件名"
              prefix={<SearchOutlined />}
              allowClear
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-56"
            />
            <Button icon={<UploadOutlined />} type="primary" onClick={() => setUploadModal(true)}>
              上传文件
            </Button>
            <Button icon={<FolderAddOutlined />} onClick={() => message.success('新建文件夹（mock）')}>
              新建文件夹
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button danger onClick={() => { setFiles(files.filter(item => !selectedRowKeys.includes(item.key))); setSelectedRowKeys([]); }}>
                批量删除
              </Button>
            )}
          </Space>
          <span className="text-gray-500">共 {filteredFiles.length} 条</span>
        </div>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={filteredFiles}
          pagination={{ pageSize: 5 }}
          bordered
          size="middle"
        />
      </div>
      {/* 文件预览弹窗 */}
      <Modal open={!!previewFile} title="文件预览" onCancel={() => setPreviewFile(null)} footer={null}>
        <div className="text-center text-gray-500">这里是 {previewFile?.name} 的预览内容（mock）</div>
      </Modal>
      {/* 重命名弹窗 */}
      <Modal open={renameModal.open} title="重命名文件" onCancel={() => setRenameModal({ open: false })} onOk={() => { message.success('重命名成功（mock）'); setRenameModal({ open: false }); }}>
        <Input defaultValue={renameModal.file?.name} />
      </Modal>
      {/* 上传文件弹窗 */}
      <Modal open={uploadModal} title="上传文件" onCancel={() => setUploadModal(false)} footer={null}>
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

export default Files; 