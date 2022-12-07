



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

const update = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modifyDemandmutation] = useMutation(UPDATEDEMAND)
  interface updateDataType {
    key: number;
    id: number;
    title: string,
    begin_date: Date;
    end_date: Date;
  }
  const { query: { id, title, begin_date, end_date } } = router
  const props = { id, title, begin_date, end_date }
  const inputs =  {title:props.title,begin_date:moment(props.begin_date),end_date:moment(props.end_date)}
  const datafomrat="YYYY-MM-DD"

  const onFinish = async (values: updateDataType) => {
   
    try {
      const bd = moment(values.begin_date).format("YYYY-MM-DD")
      const ed = moment(values.end_date).format("YYYY-MM-DD")
      await modifyDemandmutation({ variables: {id:props.id, ti: values.title, bdate:bd, edate:ed} })
      router.push("/homepage")
      console.log(values.title);
    } catch (error: any) {
      console.log("error =>", error);

    }
    
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
              <Form
                name="basic"
                onFinish={onFinish}
                initialValues={inputs}

                autoComplete="off"
              >
                <Form.Item
                  label="Input"
                  name="title"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  
                  label="DatePicker"
                  name="begin_date">
                  <DatePicker
                  format={datafomrat}
                   />
                </Form.Item>
                <Form.Item
                  label="DatePicker"
                  name="end_date">
                  <DatePicker
                  format={datafomrat}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>

              </Form>
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

export default update;
