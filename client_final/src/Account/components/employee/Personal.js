import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {Badge, Button, Card, Col, Descriptions, Divider, Icon, Modal, Row, Table, Typography} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import BaseView from "../base";
import Address from "./Address";
const { Text } = Typography;

export default class Personal extends Component {

    componentDidMount() {
        this.getBasicData();
    }

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
            confirmLoading: true,
            visible_showEditBasicModal: false,
            visible_showEditAddressModal: false,
        };
    }

    showEditBasicModal = () => {
        this.setState({
            visible_showEditBasicModal: true,
        });
    };

    showEditAddressModal = () => {
        this.setState({
            visible_showEditAddressModal: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible_showEditBasicModal: false,
            visible_showEditAddressModal: false,

        });


    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible_showEditBasicModal: false,
            visible_showEditAddressModal: false,
        });


    };

    getBasicData = () => {
        fetch(`http://localhost:3003/api/show_one_employee/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.warn(data[0]);
                let cd = data[0];
                cd.appointment_date = cd.appointment_date.toString().substring(0, 10);
                cd.birth_date = cd.birth_date.toString().substring(0, 10);
                this.setState({
                    data: cd
                });
                this.getaddressData();
            })
    };
    getaddressData = () => {
        fetch(`http://localhost:3003/api/show_one_employee_address/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.warn(data[0]);
                let cd = data[0];
                if (cd !== undefined && cd.city_id !== undefined) cd.city_id = 'Quetta';
                this.setState({
                    address_data: cd,
                    loading: false
                });
            })
    };
    render() {
        return (
            <>
                <Container>
                    {(!this.state.loading) &&
                        <>
                            <PageHeaderWrapper>
                                <Card bordered={false}  style={{backgroundColor:"#F9F9FB"}}>

                                    <Row>
                                        <Col span={20}>
                                            <Descriptions title="Basics" style={{marginBottom: 32}}>
                                                <Descriptions.Item label="Full Name">{this.state.data.full_name}</Descriptions.Item>
                                                <Descriptions.Item label="Father Name">{this.state.data.father_name}</Descriptions.Item> <br/>
                                                <Descriptions.Item label="CNIC Number">{this.state.data.cnic}</Descriptions.Item>
                                                <Descriptions.Item label="Email">{this.state.data.email}</Descriptions.Item><br/>
                                                <Descriptions.Item label="Birthday">{this.state.data.birth_date}</Descriptions.Item>
                                                <Descriptions.Item label="Service Join Date">{this.state.data.appointment_date}</Descriptions.Item>
                                                <Descriptions.Item label="Gender">{this.state.data.gender}</Descriptions.Item>
                                            </Descriptions>

                                        </Col>
                                        <Col span={4}>
                                            <Icon style={{fontSize: 30}} onClick={this.showEditBasicModal} type="edit" theme="twoTone"
                                                  title='Edit Basics of Employee'/>
                                        </Col>
                                    </Row>

                                    <Divider style={{marginBottom: 32}}/>

                                    <Row>
                                        <Col span={20}>

                                            <Descriptions title="Home Address" style={{marginBottom: 32}}>
                                                <Descriptions.Item label="Current Address">{this.state.address_data.current_address}</Descriptions.Item><br/>
                                                <Descriptions.Item label="Permanent Address">{this.state.address_data.permanent_address}</Descriptions.Item>
                                                <Descriptions.Item label="Postal Code">{this.state.address_data.postal_code}</Descriptions.Item>
                                                <Descriptions.Item label="City">Quetta</Descriptions.Item>
                                                <Descriptions.Item label="Phone 1">{this.state.address_data.phone_number}</Descriptions.Item>
                                                <Descriptions.Item label="Phone 2">{(this.state.address_data.phone_number2 !== "") ? this.state.address_data.phone_number2 : "None" }</Descriptions.Item>
                                            </Descriptions>

                                        </Col>
                                        <Col span={4}>
                                            <Icon style={{fontSize: 30}} onClick={this.showEditAddressModal} type="menu"
                                                  title='Manage Employee address'/>
                                        </Col>
                                    </Row>

                                    <Divider style={{marginBottom: 32}}/>
                                    <Descriptions title="Emergency Contact" style={{marginBottom: 32}}>
                                        <Descriptions.Item label="Full Name">Amir khan</Descriptions.Item>
                                        <Descriptions.Item label="Relationship">Friend</Descriptions.Item><br/>
                                        <Descriptions.Item label="Phone Number 1">923337906856</Descriptions.Item>
                                        <Descriptions.Item label="Phone Number 2">923337906856</Descriptions.Item>
                                        <Descriptions.Item label="Email">Amir@gmail.com</Descriptions.Item>
                                    </Descriptions>
                                    <Divider style={{marginBottom: 32}}/>
                                </Card>
                            </PageHeaderWrapper>
                            <Modal
                                title="Basics"
                                visible={this.state.visible_showEditBasicModal}
                                onOk={this.handleOk}
                                confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}
                                okButtonProps={{disabled: false}}
                                cancelButtonProps={{disabled: false}}
                                footer={[
                                    <Button key="back" type="danger"  onClick={this.handleOk}>
                                        close
                                    </Button>
                                ]}>
                                <p>This information is used for all HR related tasks, so please make sure it’s
                                    accurate.</p>

                                <BaseView id={this.props.id} data={this.state.data}/>
                            </Modal>
                            <Modal
                                title="Home Address History"
                                visible={this.state.visible_showEditAddressModal}
                                onOk={this.handleOk}
                                confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}
                                okButtonProps={{disabled: false}}
                                cancelButtonProps={{disabled: false}}
                                width={850}
                                footer={[
                                    <Button key="back" type="danger"  onClick={this.handleOk}>
                                        close
                                    </Button>
                                ]}
                            >
                                <p>{`This is a list of all of ${this.state.data.full_name}’s, current and previous addresses. .`}</p>

                                <Address id={this.props.id} address_data={this.props.address_data}/>


                            </Modal>

                        </>


                    }

                </Container>

            </>
        );
    }
}
