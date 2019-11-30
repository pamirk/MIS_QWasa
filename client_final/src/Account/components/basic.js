import {Button, Form, Input, DatePicker, Select, Upload, message} from 'antd';
import React, {Component, Fragment} from 'react';


import  './base.css';

const FormItem = Form.Item;
const {Option} = Select;

const AvatarView = ({avatar}) => (
    <Fragment>
        <div className='avatar_title'>
            Avatar
        </div>
        <div className='avatar'>
            <img src={avatar} alt="avatar"/>
        </div>
        <Upload fileList={[]}>
            <div className='button_view'>
                <Button icon="upload">
                    Change avatar
                </Button>
            </div>
        </Upload>
    </Fragment>
);


export default class MYBaseView extends Component {
    view = undefined;

    componentDidMount() {
        this.setBaseInfo();
        console.warn(this.props.data)
    }

    constructor(props) {
        super(props);
        this.state = {
            cnic: this.props.cnic,
            loading: true,

        };
    }

    setBaseInfo = () => {
        const {data, form} = this.props;
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                // @ts-ignore
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };

    getAvatarURL() {
        const {currentUser} = this.props;
        if (!currentUser) {
            const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
            return url;
        }
        return '';

        const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
        return url;
    }

    getViewDom = (ref) => {
        this.view = ref;
    };

    handlerSubmit = (event) => {
        event.preventDefault();
        const {form} = this.props;
        form.validateFields(err => {
            if (!err) {
                message.success("update.success");
            }
        });
    };

    render() {
        const {
            form
        } = this.props;
        return (
            <div className='baseView' ref={this.getViewDom}>

                <div className='left'>
                    <Input placeholder="Basic usage" />

                    <Form layout="vertical" hideRequiredMark>
                        <FormItem label="CNIC">
                            <Input cnic={this.props.data.cnic} placeholder={this.props.data.cnic} />
                        </FormItem>
                        <FormItem label="Full Name">
                            <Input/>
                        </FormItem>
                        <FormItem label="Father Name"><Input/>
                        </FormItem>
                        <FormItem label="Date of Appointment"><DatePicker/>
                        </FormItem>
                        <FormItem label="Date of Birth"><DatePicker/>
                        </FormItem>
                        <FormItem label="Email"><Input/>
                        </FormItem>
                        <FormItem label="Local"><Input/>
                        </FormItem>
                        <FormItem label="gender">
                            <Select defaultValue="male">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                        </Select>


                        </FormItem>
                        <Button type="primary" onClick={this.handlerSubmit}>Update Information</Button>
                    </Form>
                </div>
                <div className='right'>
                    <AvatarView avatar={this.getAvatarURL()}/>
                </div>
            </div>
        );
    }
}
