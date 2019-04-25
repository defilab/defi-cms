import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { fetchOrganization } from '@/services/api';
import usePromise from '@/utils/usePromise';
import styles from './View.less';

const { Description } = DescriptionList;

function View(props) {
  const { match } = props;
  const request = function request() {
    return fetchOrganization(match.params.namespace);
  };
  const { fetchUser, loading } = usePromise(request);
  const [organization, setOrganization] = useState([]);
  useEffect(() => {
    fetchUser().then(data => {
      setOrganization(data);
    });
  }, []);

  return (
    <GridContent>
      <Row gutter={24}>
        <Col>
          <Card title="财务信息" bordered={false} className={styles.card} loading={loading}>
            <DescriptionList style={{ marginBottom: 24 }} col="2">
              <Description term="余额">{organization.balance}DFT</Description>
              <Description term="今日花费">
                {organization.expense ? organization.expense.today : ''} DFT
              </Description>
              <Description term="本月花费">
                {organization.expense ? organization.expense.month : ''} DFT
              </Description>
              <Description term="累计花费">
                {organization.expense ? organization.expense.total : ''} DFT
              </Description>
              <Description term="今日收益">
                {organization.income ? organization.income.today : ''} DFT
              </Description>
              <Description term="本月收益">
                {organization.income ? organization.income.month : null} DFT
              </Description>
              <Description term="累计收益">
                {organization.income ? organization.income.total : ''} DFT
              </Description>
            </DescriptionList>
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
}

export default View;
