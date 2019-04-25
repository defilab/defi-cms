import React, { useEffect, useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Form, Input, Button, Card, Radio, InputNumber, Select, message } from 'antd';
import styles from './Edit.less';
import { fetchDataSpec, fetchPlatformDataSpecs, updateDataSpec } from '@/services/api';
import usePromise from '@/utils/usePromise';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const DataSpecForm = Form.create()(props => {
  const { match, form } = props;
  const {
    form: { getFieldDecorator },
  } = props;
  const requestData = function requestData() {
    return fetchDataSpec({ namespace: match.params.namespace, spec: match.params.spec });
  };
  const requestForm = function requestForm() {
    return fetchPlatformDataSpecs();
  };

  const [platformSpecs, setPlatformSpecs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const resultData = usePromise(requestData);
  const resultForm = usePromise(requestForm);

  useEffect(() => {
    resultData.fetchUser().then(data => {
      form.setFieldsValue({
        name: data.name,
        public: data.public,
        state: data.state,
        price: data.price,
        canonicalName: data.canonical_name,
        description: data.properties ? data.properties.description : '',
        scenario: data.properties ? data.properties.scenario : '',
        scale: data.properties ? data.properties.scale : '',
        scaleUnit: data.properties ? data.properties.scaleUnit : '1000',
        updateFrequency: data.properties ? data.properties.updateFrequency : '',
      });
    });
    resultForm.fetchUser().then(data => {
      setPlatformSpecs(data);
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true);
        updateDataSpec({
          name: values.name,
          canonical_name: values.canonicalName,
          public: values.public,
          state: values.state,
          price: values.price,
          properties: {
            description: values.description,
            scenario: values.scenario,
            scale: values.scale,
            scaleUnit: values.scaleUnit,
            updateFrequency: values.updateFrequency,
          },
          reference: values.canonical_name,
        })
          .then(() => {
            setSubmitting(false);
            message.success('编辑成功');
            router.goBack();
          })
          .catch(() => {
            setSubmitting(false);
            message.error('编辑失败');
          });
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const scales = getFieldDecorator('scaleUnit')(
    <Select style={{ width: '160px' }}>
      <Option value="1000">{formatMessage({ id: 'spec.scale-1000' })}</Option>
      <Option value="1000000">{formatMessage({ id: 'spec.scale-1000000' })}</Option>
      <Option value="1000000000">{formatMessage({ id: 'spec.scale-1000000000' })}</Option>
    </Select>
  );

  return (
    <Card bordered={false} title={formatMessage({ id: 'spec.edit' })}>
      <Form onSubmit={handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.name' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'required',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.canonical-name' })}>
          {getFieldDecorator('canonicalName', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select>
              {platformSpecs.map(item => (
                <Option value={item.canonical_name} key={item.id}>
                  {item.canonical_name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.price" />
            </span>
          }
        >
          {getFieldDecorator('price')(<InputNumber />)} DFT
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.description" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('description')(
            <TextArea
              style={{ minHeight: 32 }}
              rows={4}
              placeholder={formatMessage({ id: 'spec.description-hint' })}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.scenario" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('scenario')(
            <TextArea
              style={{ minHeight: 32 }}
              rows={4}
              placeholder={formatMessage({ id: 'spec.scenario-hint' })}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.scale" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('scale')(<Input addonAfter={scales} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.update-frequency" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('updateFrequency')(<InputNumber />)}{' '}
          {formatMessage({ id: 'spec.every-n-days' })}
        </FormItem>
        <FormItem {...formItemLayout} label="State">
          {getFieldDecorator('state')(
            <Radio.Group>
              <Radio value="online">{formatMessage({ id: 'spec.status-online' })}</Radio>
              <Radio value="offline">{formatMessage({ id: 'spec.status-offline' })}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.public' })}>
          {getFieldDecorator('public')(
            <Radio.Group>
              <Radio value>{formatMessage({ id: 'yes' })}</Radio>
              <Radio value={false}>{formatMessage({ id: 'no' })}</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.submit" />
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
});

export default DataSpecForm;
