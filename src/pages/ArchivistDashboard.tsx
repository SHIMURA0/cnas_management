import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import { FileOutlined, FileSearchOutlined, TeamOutlined, UserOutlined, FolderOpenOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Line, Pie } from '@ant-design/charts';
import './ArchivistDashboard.css';

const quickActions = [
  {
    key: 'archives',
    icon: <FolderOpenOutlined style={{ fontSize: 32 }} />,
    label: '归档管理',
    path: '/archives',
    color: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)',
  },
  {
    key: 'archive-operations',
    icon: <FileSearchOutlined style={{ fontSize: 32 }} />,
    label: '档案操作',
    path: '/archive-operations',
    color: 'linear-gradient(135deg, #FDE68A 0%, #F59E42 100%)',
  },
  {
    key: 'files',
    icon: <FileOutlined style={{ fontSize: 32 }} />,
    label: '文件管理',
    path: '/files',
    color: 'linear-gradient(135deg, #A5B4FC 0%, #6366F1 100%)',
  },
  {
    key: 'personnel',
    icon: <TeamOutlined style={{ fontSize: 32 }} />,
    label: '人员管理',
    path: '/personnel',
    color: 'linear-gradient(135deg, #FCA5A5 0%, #F43F5E 100%)',
  },
];

const stats = [
  { title: '本月归档文件', value: 156, icon: <FileOutlined />, color: '#3B82F6', suffix: '份' },
  { title: '待处理借阅', value: 23, icon: <ClockCircleOutlined />, color: '#F59E42', suffix: '件' },
  { title: '已完成操作', value: 892, icon: <CheckCircleOutlined />, color: '#10B981', suffix: '次' },
  { title: '服务用户数', value: 45, icon: <UserOutlined />, color: '#F43F5E', suffix: '人' },
];

const recentRecords = [
  { key: '1', date: '2024-03-15 14:30', type: '归档', fileName: '2024年第一季度财务报表.pdf', status: '成功' },
  { key: '2', date: '2024-03-15 10:15', type: '借阅', fileName: '设备维护记录2023.pdf', status: '成功' },
  { key: '3', date: '2024-03-14 16:45', type: '归还', fileName: '项目验收报告.pdf', status: '成功' },
];

const recordColumns = [
  { title: '操作时间', dataIndex: 'date', key: 'date' },
  { title: '操作类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colorMap: Record<string, string> = { '归档': 'blue', '借阅': 'green', '归还': 'purple', '销毁': 'red' };
      return <Tag color={colorMap[type]}>{type}</Tag>;
    }
  },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
      const colorMap: Record<string, string> = { '成功': 'success', '处理中': 'processing', '失败': 'error' };
      return <Tag color={colorMap[status]}>{status}</Tag>;
    }
  },
];

// Mock 归档文件趋势数据
const archiveTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}月`,
  value: Math.floor(Math.random() * 80 + 40),
}));

// Mock 操作类型分布数据
const operationTypeData = [
  { type: '归档', value: 156 },
  { type: '借阅', value: 23 },
  { type: '归还', value: 45 },
  { type: '销毁', value: 12 },
];

const ArchivistDashboard: React.FC = () => {
  const navigate = useNavigate();

  // 折线图配置
  const lineConfig = {
    data: archiveTrendData,
    xField: 'month',
    yField: 'value',
    smooth: true,
    height: 220,
    color: '#3B82F6',
    point: { size: 5, shape: 'circle', style: { fill: '#fff', stroke: '#3B82F6', lineWidth: 2 } },
    area: { style: { fill: 'l(270) 0:#e0f2fe 1:#3B82F6' } },
    tooltip: { showMarkers: true },
    xAxis: { label: { style: { fill: '#64748b', fontSize: 14 } } },
    yAxis: { label: { style: { fill: '#64748b', fontSize: 14 } } },
    animation: { appear: { animation: 'path-in', duration: 1200 } },
  };

  // 饼图配置
  const pieConfig = {
    data: operationTypeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name} {percentage}',
      style: { fontSize: 16 },
    },
    legend: { position: 'bottom' },
    color: ['#3B82F6', '#F59E42', '#10B981', '#F43F5E'],
    tooltip: { formatter: (datum: any) => ({ name: datum.type, value: datum.value }) },
    animation: { appear: { animation: 'wave-in', duration: 1200 } },
  };

  return (
    <div className="dashboard-modern p-6">
      {/* 快捷操作区 */}
      <Row gutter={32} className="mb-8" justify="start">
        {quickActions.map(action => (
          <Col key={action.key} xs={12} sm={6} md={6} lg={6} xl={6} className="mb-4">
            <div
              className="dashboard-action-btn"
              style={{ background: action.color }}
              onClick={() => navigate(action.path)}
            >
              <span className="dashboard-action-icon">{action.icon}</span>
              <div className="dashboard-action-label">{action.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* 统计区 */}
      <Row gutter={24} className="mb-8">
        {stats.map(stat => (
          <Col xs={24} sm={12} md={6} key={stat.title} className="mb-4">
            <Card className="dashboard-stat-card" style={{ border: 'none', borderRadius: 18, boxShadow: '0 2px 16px 0 #e5e7eb' }}>
              <div className="flex items-center gap-4">
                <div className="dashboard-stat-icon" style={{ background: stat.color }}>
                  {stat.icon}
                </div>
                <Statistic
                  title={<span style={{ color: '#6b7280', fontWeight: 500 }}>{stat.title}</span>}
                  value={stat.value}
                  valueStyle={{ fontSize: 32, fontWeight: 700, color: stat.color }}
                  suffix={<span style={{ color: '#6b7280', fontWeight: 400 }}>{stat.suffix}</span>}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区 */}
      <Row gutter={24} className="mb-8">
        <Col xs={24} md={16}>
          <Card className="dashboard-stat-card" style={{ border: 'none', borderRadius: 18, boxShadow: '0 2px 16px 0 #e5e7eb', minHeight: 320 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#374151', marginBottom: 12 }}>归档文件趋势</div>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="dashboard-stat-card" style={{ border: 'none', borderRadius: 18, boxShadow: '0 2px 16px 0 #e5e7eb', minHeight: 320 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#374151', marginBottom: 12 }}>操作类型分布</div>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* 最近操作记录 */}
      <Card
        className="dashboard-table-card"
        title={<div className="dashboard-table-title"><span className="dashboard-table-bar" />最近操作记录</div>}
        bordered={false}
        style={{ borderRadius: 18, boxShadow: '0 2px 16px 0 #e5e7eb' }}
      >
        <Table
          columns={recordColumns}
          dataSource={recentRecords}
          pagination={false}
          rowClassName={() => 'dashboard-table-row'}
        />
      </Card>
    </div>
  );
};

export default ArchivistDashboard; 