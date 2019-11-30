import React, {Component} from "react";
import {Avatar, Descriptions, Divider, Typography} from "antd";
import {Col, Row} from "reactstrap";

export default class EmployeeBioDataComponent extends Component {
    render() {
        const {Text} = Typography;
        const {data} = this.props;
        return(
            <>
                <div style={{background: '#F9F9FB', padding: '30px'}}>
                    <Divider  orientation="left"  type="horizontal">
                        Employee Bio Data
                    </Divider>

                    <Row>

                        <Col span={6} pull={18}>
                            <Descriptions size={'middle'}>

                                <Descriptions.Item span={12} label="Full Name"> <Text
                                    strong>{data.full_name}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Father Name"><Text
                                    strong>{data.father_name}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="CNIC"><Text
                                    strong>{data.cnic}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Date of Appointment"><Text
                                    strong>{data.appointment_date.substring(0, 10)}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Date of Birth"><Text
                                    strong>{data.birth_date.substring(0, 10)}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Gender"><Text strong>{data.gender}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Email"><Text
                                    strong>{data.email}</Text></Descriptions.Item>
                                <Descriptions.Item span={12} label="Locality"><Text
                                    strong>{data.local}</Text></Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={18} push={6}>
                            <Avatar shape="square" size={200}
                                    src={`http://localhost:3003/${data.employee_photo}`}/>
                        </Col>

                    </Row>


                </div>

            </>
        );
    }
}