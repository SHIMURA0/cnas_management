import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { users } from '../config/roles';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = (values: LoginForm) => {
    // 在实际应用中，这里应该调用后端API进行验证
    const user = users.find(u => u.username === values.username);
    if (user) {
      // 模拟密码验证
      if (values.password === '123456') {
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('username', values.username);
        message.success('登录成功');
        
        // 获取重定向地址
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        message.error('密码错误');
      }
    } else {
      message.error('用户不存在');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <div className="text-center mb-8">
          <img src="/logo192.png" alt="logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">CNAS实验室管理系统</h1>
          <p className="text-gray-500 mt-2">请登录您的账号</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>

          <div className="text-center text-gray-500 text-sm">
            <p>测试账号：</p>
            <p>管理员：admin / 123456</p>
            <p>档案管理员：archivist / 123456</p>
            <p>设备管理员：equipment / 123456</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 