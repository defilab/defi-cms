import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const { Description } = DescriptionList;

@connect(({ loading, dataSpec }) => ({
  loading: loading.effects['dataSpec/fetch'],
  dataSpec,
}))
class View extends PureComponent {
  componentDidMount () {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataSpec/fetch',
      payload: { namespace: match.params.namespace, spec: match.params.spec },
    });
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSpec/clear',
    });
  }

  render () {
    const { dataSpec: { dataSpec }, loading } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={dataSpec.name}
              bordered={false}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term="ID">{dataSpec.id}</Description>
                <Description term={formatMessage({ id: 'spec.name' })}>{dataSpec.name}</Description>
                <Description term={formatMessage({ id: 'spec.canonical-name' })}>{dataSpec.canonical_name}</Description>
                <Description term={formatMessage({ id: 'spec.price' })}>{dataSpec.price} DFT</Description>
                <Description term={formatMessage({ id: 'spec.description' })}>
                  {dataSpec.properties.description}
                </Description>
                <Description term={formatMessage({ id: 'spec.scenario' })}>
                  {dataSpec.properties.scenario}
                </Description>
                <Description term={formatMessage({ id: 'spec.scale' })}>
                  {dataSpec.properties.scale ? formatMessage({ id: `spec.scale-${dataSpec.properties.scale}` }) : ''}
                </Description>
                <Description term={formatMessage({ id: 'spec.update-frequency' })}>
                  {dataSpec.properties.updateFrequency}
                </Description>
                <Description term={formatMessage({ id: 'spec.public' })}>{dataSpec.public ?
                  formatMessage({ id: 'yes' }) :
                  formatMessage({ id: 'no' })}
                </Description>
                <Description term={formatMessage({ id: 'spec.status' })}>
                  {dataSpec.state ? formatMessage({ id: `spec.status-${dataSpec.state}`}) : ''}
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
