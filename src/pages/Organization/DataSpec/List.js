import React, { Fragment, PureComponent } from 'react';
import { Card, Divider, Table } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ dataSpecs, loading }) => ({
  dataSpecs,
  loading: loading.effects['dataSpecs/fetch'],
}))
class List extends PureComponent {
  columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '数据接口名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据规范名',
      dataIndex: 'canonical_name',
      key: 'canonical-name',
    },
    {
      title: '创建时间',
      render: (_, record) => moment(record.created_at).format('YYYY-MM-DD'),
      key: 'created-at',
    },
    {
      title: '响应状态',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: '公开',
      render: (_, record) => record.public ? '公开' : '私有',
      key: 'public',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Link to={`/organizations/${record.namespace}/specs/${record.canonical_name}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`/organizations/${record.namespace}/specs/${record.canonical_name}/edit`}>编辑</Link>
        </Fragment>
      ),
      key: 'operations',
    },
  ];

  componentDidMount () {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataSpecs/fetch',
      payload: { namespace: match.params.namespace },
    });
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSpecs/clear',
    });
  }

  render () {
    const { dataSpecs: { dataSpecs }, loading } = this.props;
    return (
      <Card title="数据接口">
        <Table columns={this.columns} dataSource={dataSpecs} loading={loading} rowKey={record => record.id} />
      </Card>);
  }
}

export default List;
