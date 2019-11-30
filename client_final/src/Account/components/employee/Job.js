import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {Button, Card, Col, Descriptions, Divider, Icon, Modal, Row} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import Address from "./Address";
import Designation from "../designation";

export default class Job extends Component {

    componentDidMount() {
    }

    constructor(props) {
        super(props);

        let cd = this.props.des_data;
        if (cd !== undefined && cd.emp_des_order_date !== undefined && cd.emp_des_appointment_date !== undefined) {
            cd.emp_des_order_date = cd.emp_des_order_date.toString().substring(0, 10);
            cd.emp_des_appointment_date = cd.emp_des_appointment_date.toString().substring(0, 10);
        }

        this.state = {
            des_data: cd,
            data: null,
            loading: false
        };
    }

    handleEmployeeClicked = (index) => {


        console.log(index);
        this.setState(() => {
            return {};
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
            visible_showEditAddressModal: false,
            visible_showEditDesignationModal: false,

        });


    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible_showEditAddressModal: false,
            visible_showEditDesignationModal: false,

        });
    };
    showEditDesignationModal = () => {
        this.setState({
            visible_showEditDesignationModal: true,
        });
    };

    hideHandler = () => {
        this.setState({
            visible_showEditDesignationModal: false,
            loading: true,
        });
        this.getDesignationData();
    };

    getDesignationData = () => {
        fetch(`http://localhost:3003/api/employee_designation_details/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    des_data: data[0] ,
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
                                <Card bordered={false} style={{backgroundColor:"#F9F9FB"}}>

                                    <Row>
                                        <Col span={20}>
                                            <Descriptions title="Employment Details"  style={{marginBottom: 32}}>
                                                <Descriptions.Item label="Start Date">{this.state.des_data.emp_des_appointment_date.substring(0,10)}</Descriptions.Item>
                                                <Descriptions.Item label="Designation Title">{this.state.des_data.des_title}</Descriptions.Item>
                                                <Descriptions.Item label="Designation Scale">{this.state.des_data.des_scale}</Descriptions.Item>
                                                <Descriptions.Item label="Department Name">{this.state.des_data.department_name}</Descriptions.Item>
                                                <Descriptions.Item label="Department Location">Quetta</Descriptions.Item>
                                            </Descriptions>


                                        </Col>
                                        <Col span={4}>
                                            <Icon style={{fontSize: 30}} onClick={this.showEditDesignationModal} type="edit" theme="twoTone"
                                                  title='Edit Basics of Employee'/>
                                        </Col>
                                    </Row>
                                    <Divider style={{marginBottom: 32}}/>


                                    <Row>
                                        <Col span={20}>
                                            <Descriptions title="Work Address" style={{marginBottom: 32}}>
                                                <Descriptions.Item label="Current Address">912 Silver St., Suite 1966</Descriptions.Item>
                                                <Descriptions.Item label="Postal Code">94107</Descriptions.Item>
                                                <Descriptions.Item label="City">Quetta</Descriptions.Item>
                                                <Descriptions.Item label="Phone 1">416-000-0000</Descriptions.Item>
                                                <Descriptions.Item label="Phone 2">416-000-0000</Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                        <Col span={4}>
                                            <Icon style={{fontSize: 30}} onClick={this.showEditAddressModal} type="menu"
                                                  title='Manage Employee address'/>
                                        </Col>
                                    </Row>

                                    <Divider style={{marginBottom: 32}}/>

                                </Card>

                            </PageHeaderWrapper>

                            <Modal
                                title="Edit Employment Details"
                                visible={this.state.visible_showEditDesignationModal}
                                onOk={this.handleOk}
                                confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}
                                okButtonProps={{disabled: false}}
                                cancelButtonProps={{disabled: false}}
                                width={550}
                                footer={[
                                    <Button key="back" type="danger"  onClick={this.handleOk}>
                                        close
                                    </Button>
                                ]}
                            >

                                <Designation hideHandler={this.hideHandler} id={this.props.id} data={this.state.des_data}/>

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
                                <p>{`This is a list of all of current and previous addresses of Employee`}</p>

                                <Address id={this.props.id} address_data={this.props.address_data}/>


                            </Modal>

                        </>
                    }

                </Container>

            </>
        );
    }
}
