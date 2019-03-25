import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ organization }) => ({
  organization,
}))
class Layout extends Component {
  componentDidMount () {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'organization/fetch',
      payload: {
        namespace: match.params.namespace,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/clear'
    });
  }

  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'info':
        router.push(`${match.url}/info`);
        break;
      case 'requests':
        router.push(`${match.url}/requests`);
        break;
      case 'responses':
        router.push(`${match.url}/responses`);
        break;
      case 'specs':
        router.push(`${match.url}/specs`);
        break;
      case 'transactions':
        router.push(`${match.url}/transactions`);
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'info',
        tab: '基本信息',
      },
      {
        key: 'specs',
        tab: '数据接口',
      },
      {
        key: 'requests',
        tab: '请求记录',
      },
      {
        key: 'responses',
        tab: '响应记录',
      },
      {
        key: 'transactions',
        tab: '交易记录',
      },
    ];

    const { organization: { organization }, children, location } = this.props;

    return (
      <PageHeaderWrapper
        title={organization.name}
        tabList={tabList}
        tabActiveKey={location.pathname.split('/')[3]}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default Layout;
