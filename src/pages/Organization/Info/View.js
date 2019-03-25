import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './View.less';

const { Description } = DescriptionList;

@connect(({ loading, organization }) => ({
  loading: loading.effects['organization/fetch'],
  organization,
}))
class View extends PureComponent {
  render () {
    const { loading, organization: { organization } } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title="财务信息"
              bordered={false}
              className={styles.card}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="2">
                <Description term="余额">{organization.balance} DFT</Description>
                <Description
                  term="今日花费"
                >
                  {organization.expense.today} DFT
                </Description>
                <Description
                  term="本月花费"
                >
                  {organization.expense.month} DFT
                </Description>
                <Description
                  term="累计花费"
                >
                  {organization.expense.total} DFT
                </Description>
                <Description
                  term="今日收益"
                >
                  {organization.income.today} DFT
                </Description>
                <Description term="本月收益">{organization.income.month} DFT
                </Description>
                <Description
                  term="累计收益"
                >
                  {organization.income.total} DFT
                </Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default View;
