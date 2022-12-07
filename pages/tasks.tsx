



import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import ClientOnly from "../components/ClientOnly";
import Updatedemand from '../components/updatesdemand'
import type { ColumnsType } from 'antd/es/table';
import { Breadcrumb, Layout, Menu, Space, Tag, Table, Button, Modal, DatePicker, Form, Input, Radio } from 'antd';
import { useQuery, gql, useMutation, } from "@apollo/client";
const moment = require('moment');

import Router, { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const UPDATEDEMAND = gql`
mutation modifyDemandmutation($id:ID!,$ti:String!,$bdate:Date!,$edate:Date!) {
    modifyDemand(input:{id:$id,title: $ti, begin_date: $bdate ,end_date: $edate,
    author:{
      connect:1
    }}
  )
    {id}
  }
  `;
function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    children,
    label,
  };
  
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />, []),
  getItem('Option 2', '2', <DesktopOutlined />, []),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3', <UserOutlined />, []),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6', <UserOutlined />, []),
    getItem('Team 2', '8', <UserOutlined />, [])
  ]),
  getItem('Files', '9', <FileOutlined />, []),
];

const tasks = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modifyDemandmutation] = useMutation(UPDATEDEMAND)
  interface taskdatatype {
    key: number;
    id: number,
    title: string,
    context:string
  }
  const columns: ColumnsType<taskdatatype> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Context',
      dataIndex: 'context',
      key: 'context',
    },
    ]
  const { query: { tasks} } = router
  var task:any=tasks;
  var task2=JSON.parse(task)
  console.log(task2)
  var data2: taskdatatype[] = []
  for (let index = 0; index < task2?.length; index++) {
    var element = task2[index];
    var row: taskdatatype = {
      key:index,
      id: element.id,
      title: element.title,
      context: element.context,
    }
    data2.push(row);

  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
            <Table columns={columns} dataSource={data2} />

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
export default tasks;
