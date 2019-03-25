import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  Button,
  Card,
  Radio, InputNumber,
  Select,
} from 'antd';
import styles from './Edit.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading, dataSpec }) => ({
  loading: loading.effects['dataSpec/fetch'] && loading.effects['dataSpec/fetchPlatformSpecs'],
  submitting: loading.effects['dataSpec/patch'],
  dataSpec,
}))
@Form.create()
class DataSpecForm extends PureComponent {
  state = {
    platformSpecs: []
  };

  componentDidMount () {
    const { dispatch, match, form } = this.props;
    dispatch({
      type: 'dataSpec/fetch',
      payload: {
        namespace: match.params.namespace,
        spec: match.params.spec,
      },
      callback: (data) => {
        form.setFieldsValue({
          name: data.name,
          public: data.public,
          state: data.state,
          price: data.price,
          canonicalName: data.canonical_name,
          description: data.properties ? data.properties.description : null,
          scenario: data.properties ? data.properties.scenario : null,
          scale: data.properties ? data.properties.scale : null,
          scaleUnit: data.properties ? data.properties.scaleUnit : '1000',
          updateFrequency: data.properties ? data.properties.updateFrequency: null
        });
      },
    });
    dispatch({
      type: 'dataSpec/fetchPlatformSpecs',
      callback: (platformSpecs) => this.setState({
        platformSpecs
      })
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataSpec/patch',
          payload: {
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
          },
          callback: () => router.goBack(),
        });
      }
    });
  };

  render () {
    const {
      submitting,
      form: { getFieldDecorator },
    } = this.props;

    const { platformSpecs } = this.state;

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

    const scales = (
      getFieldDecorator('scaleUnit')(
        <Select
          style={{ width: '160px' }}
        >
          <Option value="1000">{formatMessage({ id: 'spec.scale-1000' })}</Option>
          <Option value="1000000">{formatMessage({ id: 'spec.scale-1000000' })}</Option>
          <Option value="1000000000">{formatMessage({ id: 'spec.scale-1000000000' })}</Option>
        </Select>,
      )
    );

    return (
      <Card bordered={false} title={formatMessage({ id: 'spec.edit' })}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
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
                {
                  platformSpecs.map(
                    (item) => (<Option value={item.canonical_name} key={item.id}>{item.canonical_name}</Option>))
                }
              </Select>,
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
            {getFieldDecorator('description')(<TextArea
              style={{ minHeight: 32 }}
              rows={4}
              placeholder={formatMessage({ id: 'spec.description-hint' })}
            />)}
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
            {getFieldDecorator('scenario')(<TextArea
              style={{ minHeight: 32 }}
              rows={4}
              placeholder={formatMessage({ id: 'spec.scenario-hint' })}
            />)}
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
            {getFieldDecorator('updateFrequency')(<InputNumber />)} {formatMessage({ id: 'spec.every-n-days' })}
          </FormItem>
          <FormItem {...formItemLayout} label="State">
            {getFieldDecorator('state')
            (
              <Radio.Group>
                <Radio value="online">{formatMessage({ id: 'spec.status-online' })}</Radio>
                <Radio value="offline">{formatMessage({ id: 'spec.status-offline' })}</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.public' })}>
            {getFieldDecorator('public')
            (
              <Radio.Group>
                <Radio value>{formatMessage({ id: 'yes' })}</Radio>
                <Radio value={false}>{formatMessage({ id: 'no' })}</Radio>
              </Radio.Group>,
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
  }
}

export default DataSpecForm;
