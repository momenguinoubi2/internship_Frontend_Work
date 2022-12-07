import { useQuery, gql, useMutation, } from "@apollo/client";
import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, Space, Tag, Table, Button, Modal, DatePicker, Form, Input, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Router from "next/router";


import { useAuth } from "../pages/api/auth";


export default function athentification() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [username, setUsername] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [password, setPassword] = useState('')

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { signIn, signOut } = useAuth()

  const onFinish=async(e: any)=> {
    await signIn({ username, password })
    Router.push('/homepage')
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <Form  
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinishFailed={onFinishFailed}
      autoComplete="off">
        <Form.Item
          label="Username"
          name="username">
          <Input

            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password">
          <Input.Password onChange={(e) => setPassword(e.target.value)}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}









