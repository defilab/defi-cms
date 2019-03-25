import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ loading, requests }) => ({
  loading: loading.effects['requests/fetch'],
  requests,
}))
class List extends PureComponent {
  columns = [
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
      render: (_, record) => record.responed_at ? '成功' : '失败',
      key: 'state',
    },
    {
      title: '响应时间',
      render: (_, record) => record.responed_at ? moment(record.responed_at * 1000).format('YYYY-MM-DD hh:mm:ss') : '-',
      key: 'response-time',
    },
    {
      title: '交易金额',
      render: (_, record) => `${record.put_offer_tx.offer_body.price} DFT`,
      key: 'transaction-amount',
    },
  ];

  componentDidMount () {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'requests/fetch',
      payload: {
        namespace: match.params.namespace,
      },
    });
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'requests/clear'
    });
  }

  render () {
    const { requests, loading } = this.props;
    return (
      <Card title="请求记录">
        <Table
          columns={this.columns}
          dataSource={requests.requests}
          loading={loading}
          rowKey={record => record.offer_id}
        />
      </Card>);
  }
}

export default List;
