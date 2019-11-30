import React, {Component} from "react";
import {Avatar, Badge, Descriptions, Divider, Typography} from "antd";
import {Col, Row} from "reactstrap";

export default class EmployeeDesignationComponent extends Component {
    render() {
        const {Text} = Typography;
        const {data} = this.props;
        const isActive = ((data.emp_des_is_active === 1) ? "Active" : "UnActive");
        return (
            <>
                <div style={{background: '#F9F9FB', padding: '30px'}}>
                    <Divider orientation="left" type="horizontal">
                        Employee Designation Details
                    </Divider>
                    <Row>

                        <Col span={6} pull={18}>
                            <Descriptions size={'middle'}>
                                <Descriptions.Item span={12} label="Designation Date">
                                    <Text strong>{data.emp_des_order_date.substring(0, 10)}
                                    </Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Appointment date">
                                    <Text
                                        strong>{data.emp_des_appointment_date.substring(0, 10)}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Designation Status">
                                    <Text strong> <Badge status="processing" text={isActive}/></Text>
                                </Descriptions.Item>
                                <Descriptions.Item span={12} label="Designation Title">
                                    <Text strong>{data.des_title}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Designation Scale">
                                    <Text strong>{data.des_scale}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Department Name">
                                    <Text strong>{data.department_name}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Department Description">
                                    <Text strong>{data.department_description}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Department City ">
                                    <Text strong>{data.department_city_name}</Text></Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Row>
                        <Avatar shape="square" size={200}
                                src={`http://localhost:3003/${data.emp_des_order_letter_photo}`}/>
                    </Row>


                </div>

            </>
        );
    }
}
