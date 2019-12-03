import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Container} from "reactstrap";
import {Avatar, Card, Col, Descriptions, Divider, Icon, Row, Tag, Timeline} from "antd";

export default class ComplainDetails extends Component {
    id = this.props.match.params.id;

    state = {
        username: '',
        password: '',
        role: 'admin',
        loading: true,
        errors: [],
    };

    componentDidMount() {
        this.getConsumer_complain_list()
    }

    getConsumer_complain_list = () => {
        fetch(`http://localhost:3003/api/single_complain/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    complainDetails: data.rows[0],
                    loading: false
                });
                console.log("Consumer complaints", data.rows)
            })
    };

    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;

        if (!authUser) {
            return <Redirect to='/signin'/>
        }
        return (
            <>
                {(!this.state.loading) &&
                <Container className='p-5'>
                    <PageHeaderWrapper style={{fontSize: "small"}}>
                        <Card bordered={false} style={{backgroundColor: "#F9F9FB", fontSize: 5, fontWeight: 750}}>

                            <Row>
                                <Col sm={20}>
                                    <Descriptions title="" style={{marginBottom: 32}}>
                                        <Descriptions.Item
                                            label="Status">{this.state.complainDetails.complain_status}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Complain body">{this.state.complainDetails.complain_body}</Descriptions.Item>
                                        <br/><br/>
                                        <Descriptions.Item
                                            label="Last updated">{this.state.complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Created at">{this.state.complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/>
                                    </Descriptions>
                                </Col>

                                <Col sm={4}>

                                </Col>

                            </Row>

                            <Row>
                                <h4 style={{fontSize: '1rem'}}>Complaint Attachments</h4>

                                <Avatar shape="square" size={200}
                                        src={`http://localhost:3003/${this.state.complainDetails.attachment_name}`}/>
                            </Row>

                            <Divider style={{marginBottom: 32}}/>

                            <h3 style={{fontSize: '1rem'}}>Complaint Timeline history</h3>
                            <Timeline mode="alternate">
                                <Timeline.Item>
                                    <p>Complaint sumbited on</p>
                                    {this.state.complainDetails.created_us.substring(0, 10)}
                                </Timeline.Item>
                                <Timeline.Item>
                                    <p>Current Status:</p>
                                    {this.state.complainDetails.complain_status}
                                </Timeline.Item>
                                <Timeline.Item color="green">
                                    <Row>
                                        <Col sm={20}>
                                            <p> Remarks:</p>
                                            <h6>New Complain</h6>
                                        </Col>
                                        <Col sm={4}>
                                            <Icon type="check-circle" theme="twoTone"/>
                                        </Col>
                                    </Row>
                                    <Tag color="green">Forworded to: admin</Tag><br/>
                                    <Tag color="blue">Forworded from: admin</Tag><br/><br/><br/>
                                    <Tag>Suggested Date: NotDECIDED</Tag>
                                </Timeline.Item>
                            </Timeline>

                            <Divider style={{marginBottom: 32}}/>


                        </Card>
                    </PageHeaderWrapper>


                </Container>
                }
            </>
        );
    }


}
