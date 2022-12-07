import { useQuery, gql, useMutation, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, Space, Tag, Table, Button, Modal, DatePicker, Form, Input,Card  } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Router from "next/router";
import { useAuth } from "../pages/api/auth";
const moment = require('moment');
const DEMANDS = gql`
   query getDemands {
    demands{
        id
        title
        begin_date
        end_date
    }  
  }
`;

const ADDDEMANDS = gql`
mutation addDemandmutation($ti:String!,$bdate:Date!,$edate:Date!){
  addDemand(input:{title: $ti, begin_date: $bdate ,end_date: $edate,
    author:{
      connect:1
    }}
  )
  {id}
} 
`;

const DELETEDEMAND = gql`
mutation deleteDemandmutation($id:ID!){
  deleteDemand(id: $id) {
    id
  }
}
`
const FINDTASK = gql`
query findTask($id:ID!) {
  project(id:$id)
  {id
  title
  context
  tasks{id}
  }
  }

`

export default function ProjectTasks() {
  const [addDemandmutation] = useMutation(ADDDEMANDS)
  const [findDemand, { data: data3, refetch }] = useLazyQuery(FINDTASK, { variables: { id: "6" } });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const remove = async (id: string) => {
    try {
      console.log(" typeof id =>", id);
      await deleteDemandmutation({ variables: { id: id } })
      Router.reload()
    } catch (error: any) {
      console.log(error);
    }

  }
  const update = async (id: string) => {
    try {
      console.log(" typeof id =>", id);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const da: any = await findDemand({ variables: { id: id } })
      
     
      console.log(da.data.demand)
      Router.push({
        pathname: "/update",
        query: {
          id: da.data.demand.id,
          title: da.data.demand.title,
          begin_date: da.data.demand.begin_date,
          end_date: da.data.demand.begin_date,
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
          <Button onClick={() => update(record.id)}>update</Button>
          <Button onClick={() => remove(record.id)}>Delete</Button>
        </Space>
      ),
    }

  ];
  const { loading, error, data: data } = useQuery(DEMANDS);

  const [deleteDemandmutation] = useMutation(DELETEDEMAND);

  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;

  var data2: DataType[] = []
  for (let index = 0; index < data?.demands.length; index++) {
    var element = data?.demands[index];
    var row: DataType = {
      key: index,
      id: element.id,
      title: element.title,
      begin_date: element.begin_date,
      end_date: element.end_date,
    }
    data2.push(row);

  };

  const onFinish = async (values: addDataType) => {
    try {
    const bd = moment(values.begin_date).format("YYYY-MM-DD")
    const ed = moment(values.end_date).format("YYYY-MM-DD")
    await addDemandmutation({ variables: { ti: values.title, bdate: bd, edate: ed } })
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
    <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card size="small" title="Small size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
      </Card>
     </>

  )
}