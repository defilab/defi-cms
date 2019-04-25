import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { fetchDataSpec } from '@/services/api';
import usePromise from '@/utils/usePromise';

const { Description } = DescriptionList;

function View(props) {
  const { match } = props;
  const request = function request() {
    return fetchDataSpec({ namespace: match.params.namespace, spec: match.params.spec });
  };
  const { fetchUser, loading } = usePromise(request);
  const [dataSpec, setDataSpec] = useState([]);

  useEffect(() => {
    fetchUser().then(data => {
      setDataSpec(data);
    });
  }, []);

  return (
    <GridContent>
      <Row gutter={24}>
        <Col>
          <Card title={dataSpec.name} bordered={false} loading={loading}>
            <DescriptionList style={{ marginBottom: 24 }} col="1">
              <Description term="ID">{dataSpec.id}</Description>
              <Description term={formatMessage({ id: 'spec.name' })}>{dataSpec.name}</Description>
              <Description term={formatMessage({ id: 'spec.canonical-name' })}>
                {dataSpec.canonical_name}
              </Description>
              <Description term={formatMessage({ id: 'spec.price' })}>
                {dataSpec.price} DFT
              </Description>
              <Description term={formatMessage({ id: 'spec.description' })}>
                {dataSpec.properties ? dataSpec.properties.description : ''}
              </Description>
              <Description term={formatMessage({ id: 'spec.scenario' })}>
                {dataSpec.properties ? dataSpec.properties.scenario : ''}
              </Description>
              <Description term={formatMessage({ id: 'spec.scale' })}>
                {dataSpec.properties && dataSpec.properties.scale
                  ? formatMessage({ id: `spec.scale-${dataSpec.properties.scale}` })
                  : ''}
              </Description>
              <Description term={formatMessage({ id: 'spec.update-frequency' })}>
                {dataSpec.properties ? dataSpec.properties.updateFrequency : ''}
              </Description>
              <Description term={formatMessage({ id: 'spec.public' })}>
                {dataSpec.public ? formatMessage({ id: 'yes' }) : formatMessage({ id: 'no' })}
              </Description>
              <Description term={formatMessage({ id: 'spec.status' })}>
                {dataSpec.state ? formatMessage({ id: `spec.status-${dataSpec.state}` }) : ''}
              </Description>
            </DescriptionList>
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
}

export default View;
