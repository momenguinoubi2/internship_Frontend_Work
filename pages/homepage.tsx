
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import { Breadcrumb, Layout, Menu,Space,Tag ,Table } from 'antd';
  import React, { useState } from 'react';
  import ClientOnly from "../components/ClientOnly";
  import DemandList from '../components/DemandList'
  import Athentification from '../components/Authentication';

  import type { ColumnsType } from 'antd/es/table';
  import { useAuth } from './api/auth';

  const { Header, Content, Footer, Sider } = Layout;
  
  function getItem(label:any, key:any, icon:any, children:any) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem('Option 1', '1', <PieChartOutlined />,[]),
    getItem('Option 2', '2', <DesktopOutlined />,[]),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Tom', '3',<UserOutlined/>,[]),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [
        getItem('Team 1', '6',<UserOutlined/>,[]),
        getItem('Team 2', '8',<UserOutlined/>,[])
    ]),
    getItem('Files', '9', <FileOutlined />,[]),
  ];
  
  const App = () => {
    const { isSignedIn } = useAuth()
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
            }}
          />
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
            >
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
           <ClientOnly>

                { isSignedIn( )&& <DemandList/>}
           </ClientOnly>
           </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  };
  
  export default App;
  