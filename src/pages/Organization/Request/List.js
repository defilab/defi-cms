import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import { fetchRequests } from '@/services/api';
import usePromise from '@/utils/usePromise';
import moment from 'moment';

function List(props) {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'offer_id',
      key: 'offer-id',
    },
    {
      title: '数据接口名称',
      render: (_, record) => record.put_offer_tx.offer_body.data_spec,
      key: 'data-spec',
    },
    {
      title: '数据类型',
      render: () => '黑名单',
      key: 'data-type',
    },
    {
      title: '请求时间',
      render: (_, record) => moment(record.created_at * 1000).format('YYYY-MM-DD hh:mm:ss'),
      key: 'request-time',
    },
    {
      title: '请求状态',
      render: (_, record) => (record.responed_at ? '成功' : '失败'),
      key: 'state',
    },
    {
      title: '响应时间',
      render: (_, record) =>
        record.responed_at ? moment(record.responed_at * 1000).format('YYYY-MM-DD hh:mm:ss') : '-',
      key: 'response-time',
    },
    {
      title: '交易金额',
      render: (_, record) => `${record.put_offer_tx.offer_body.price} DFT`,
      key: 'transaction-amount',
    },
  ];

  const { match } = props;
  const request = function request() {
    return fetchRequests(match.params.namespace);
  };
  const { fetchUser, loading } = usePromise(request);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    fetchUser().then(data => {
      setDataSource(data);
    });
  }, []);

  return (
    <Card title="请求记录">
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={record => record.offer_id}
      />
    </Card>
  );
}

export default List;
