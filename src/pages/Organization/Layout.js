import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { fetchOrganization } from '@/services/api';
import usePromise from '@/utils/usePromise';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

function Layout(props) {
  const { match } = props;
  const handleTabChange = key => {
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

  const request = function request() {
    return fetchOrganization(match.params.namespace);
  };
  const { fetchUser } = usePromise(request);
  const [organization, setOrganization] = useState([]);

  useEffect(() => {
    fetchUser().then(data => {
      setOrganization(data);
    });
  }, []);

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

  const { children, location } = props;

  return (
    <PageHeaderWrapper
      title={organization.name}
      tabList={tabList}
      tabActiveKey={location.pathname.split('/')[3]}
      onTabChange={handleTabChange}
    >
      {children}
    </PageHeaderWrapper>
  );
}

export default Layout;
