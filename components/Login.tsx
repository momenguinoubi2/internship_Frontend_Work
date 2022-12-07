import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState, useContext, createContext } from "react";
import client from "../pages/api/client";
import { Button, Checkbox, Form, Input } from 'antd';
const LOGIN = gql`
  mutation loginmutation ($email: String!,$pw: String!) {
  login(input:{username:$email, password:$pw}) {
    access_token
    refresh_token
    expires_in
    token_type
    user {
      id
      email
      name
      created_at
      updated_at
    }
  }
}
`;

interface LoginInterface{
  username : string,
  password : string,
}

export default function Login() {
  const [authToken, setAuthToken] = useState(null)
  const [loginmutation, {data}] = useMutation(LOGIN);

  const onFinish = async (values: LoginInterface) =>  {
    console.log('Success:', values);
   try {
    await loginmutation({variables:{email:values.username, pw:values.password}});
    console.log(data?.login?.user?.id);
   } catch (error) {
    console.log(error)
   }
    

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  
  return (
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);
}

// onSubmit={e => {

//   e.preventDefault();

//    loginmutation({variables:{email:input1.value, pw:input2.value}});
  
  
//   input1 = '';
//   input2 = '';
//   console.log(data?.login?.access_token);
// }

// }