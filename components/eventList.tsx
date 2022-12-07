import { useQuery, gql, useMutation,useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, Space, Tag, Table, Button, Modal, DatePicker, Form, Input,Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Router from "next/router";
const moment = require('moment');


const EVENTS = gql`
   query getProjects {
    Events {
    id
    title
    context
    begin_date
    end_date
  }
  }
`;
const FINDTASK = gql`
query findTask($id:ID!) {
  project(id:$id)
  {id
  title
  context
  tasks{id title context}
  }
  }

`
export default function projectList(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModalVisible, setIsModalVisible] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [findTask, { data: data3, refetch }] = useLazyQuery(FINDTASK, { variables: { id: "6" } });

    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
      const View = async (id: string) => {
        try {
          console.log(" typeof id =>", id);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const da: any = await findTask({ variables: { id: id } })
          
          const tasksarray= da.data.project.tasks;
          console.log(da.data.project.tasks)
          Router.push({
            pathname: "/tasks",
            query: {
              tasks: JSON.stringify(da.data.project.tasks),
            }
          })
    
        } catch (error: any) {
          console.log(error);
        }
    
      }
    interface DataType {
        key: number;
        id: string;
        title: string,
        context: string,
        begin_date: string;
        end_date: string;
      }
      interface addDataType {
        key: number;
        id: number;
        title: string,
        begin_date: Date;
        end_date: Date;
      }
      const columns: ColumnsType<DataType> = [
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
        {
          title: 'Begin_date',
          dataIndex: 'begin_date',
          key: 'begin_date',
        },
        {
          title: 'End_date',
          dataIndex: 'end_date',
          key: 'end_date',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => View(record.id)}>View</Button>
            </Space>
          ),
        }
    
      ];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { loading, error, data: data } = useQuery(EVENTS);
    
    
      if (loading) return 'Loading...';
    
      if (error) return `Error! ${error.message}`;
      var data2: DataType[] = []

      for (let index = 0; index < data?.Events.length; index++) {
        var element = data?.Events[index];
        var row: DataType = {
          key: index,
          id: element.id,
          title: element.title,
          context: element.context,
          begin_date: element.begin_date,
          end_date: element.end_date,
        }
        data2.push(row);
    
      };
    
      const onFinish = async (values: addDataType) => {
        try {
        const bd = moment(values.begin_date).format("YYYY-MM-DD")
        const ed = moment(values.end_date).format("YYYY-MM-DD")
        Router.reload()
        } catch (error:any) {
          console.log(error.graphQLErrors)
        }
        
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
      const dateFormat = 'YYYY/MM/DD';
      return (
        <>
          <Button type="primary" onClick={showModal}>
            Open Modal
          </Button>
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                label="Input"
                name="title">
                <Input />
              </Form.Item>
              <Form.Item
                label="DatePicker"
                name="begin_date">
                <DatePicker
                  format={dateFormat}
                />
              </Form.Item>
              <Form.Item
                label="DatePicker"
                name="end_date">
                <DatePicker
                  format={dateFormat}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
    
            </Form>
          </Modal>
          
          <Table columns={columns} dataSource={data2} />
        </>
     
      )

}