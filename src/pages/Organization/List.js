import React, { Fragment, PureComponent } from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import { connect } from 'dva';

@connect(({ loading, organizations }) => ({
  loading: loading.effects['organizations/fetch'],
  organizations,
}))
class List extends PureComponent {
  columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '英文简称',
      dataIndex: 'namespace',
      key: 'namespace',
    },
    {
      title: '角色',
      render: (_, record) => this.roleToString(record.role),
      key: 'role',
    },
    {
      title: '注册时间',
      render: (_, record) => moment(record.created_at).format('YYYY-MM-DD'),
      key: 'created-at',
    },
    {
      title: '操作',
      render: (text, record) =>
        <Fragment>
          <Link to={`/organizations/${record.namespace}`}>
            查看
          </Link>
        </Fragment>,
      key: 'operations',
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'organizations/fetch',
    });
  }

  roleToString = (role) => {
    switch (role) {
      case 'requester':
        return '请求方';
      case 'responder':
        return '提供方';
      case 'both':
        return '请求方，提供方';
      default:
        return '';
    }
  };

  render () {
    const { organizations, loading } = this.props;
    return (
      <Card title='企业列表'>
        <Table
          columns={this.columns}
          dataSource={organizations.organizations}
          rowKey={record => record.id}
          loading={loading}
        />
      </Card>);
  }
}

export default List;
