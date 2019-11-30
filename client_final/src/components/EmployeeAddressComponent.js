import React, {Component} from "react";
import {Descriptions, Divider, Typography} from "antd";
import {Col, Row} from "reactstrap";

export default class EmployeeAddressComponent extends Component {
    render() {
        const {Text} = Typography;
        const {data} = this.props;
        return (
            <>
                <div style={{background: '#F9F9FB', padding: '30px'}}>
                    <Divider orientation="left" type="horizontal">
                        Employee Address
                    </Divider>
                    <Row>

                        <Col span={6} pull={18}>
                            <Descriptions size={'middle'}>

                                <Descriptions.Item span={12} label="Current Address"> <Text
                                    strong>{data.current_address}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Permanent Address"><Text
                                    strong>{data.permanent_address}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Postal Code"><Text
                                    strong>{data.postal_code}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Phone number 1"><Text
                                    strong>{data.phone_number}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Phone Number 2"><Text
                                    strong>{data.phone_number2}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="City"><Text strong>Quetta</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Country"><Text
                                    strong>Pakistan</Text></Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>


                </div>

            </>
        );
    }
}
