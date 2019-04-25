import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { fetchTransactions } from '@/services/api';
import usePromise from '@/utils/usePromise';
import moment from 'moment';

function List(props) {
  const {
    match: {
      params: { namespace },
    },
  } = props;
  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'spec.transaction-name' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'spec.transaction-amount' }),
      key: 'amount',
      dataIndex: 'amount',
    },
    {
      title: formatMessage({ id: 'spec.transaction-status' }),
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: formatMessage({ id: 'spec.transaction-time' }),
      key: 'time',
      render: (_, record) => moment(record.timestamp * 1000).format('YYYY-MM-DD hh:mm:ss'),
    },
  ];
  const request = function request() {
    return fetchTransactions(namespace);
  };
  const { fetchUser, loading } = usePromise(request);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    fetchUser().then(data => {
      setDataSource(
        data.map(item => ({
          key: item.transaction_id,
          id: item.transaction_id,
          name: formatMessage({ id: `spec.transaction-${item.action}` }),
          amount: `${item.balance_after - item.balance_before} DFT`,
          timestamp: item.timestamp,
          state: formatMessage({ id: 'spec.transaction-success' }),
        }))
      );
    });
  }, []);

  return (
    <Card title={formatMessage({ id: 'menu.transactions' })}>
      <Table columns={columns} dataSource={dataSource} loading={loading} />
    </Card>
  );
}

export default List;
