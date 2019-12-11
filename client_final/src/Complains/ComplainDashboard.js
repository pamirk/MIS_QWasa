import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import ComplaintList from "./ComplaintList";
import './complaint.css'
import {Card, Col, Row} from "antd";
import {Container} from "reactstrap";

export default class ComplainDashboard extends Component {
    state = {
        username: '',
        password: '',
        role: 'admin',
        loading: true,
        errors: [],
        consumer_complaints: null,

    };

    componentDidMount() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        this.state = {
            username: '',
            password: '',
            role: 'admin',
            loading: true,
            errors: [],
            consumer_complaints: null,
        };
        if (authUser.user_cnic) {
            this.getConsumer_complain_list()
        } else {
            this.getAllcomplain_list()
        }
    }

    getAllcomplain_list = () => {
        fetch(`http://localhost:3003/api/complain_list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    consumer_complaints: data.rows,
                    loading: false
                });
                console.log("Consumer complaints", data.rows)
            })
    };
    getConsumer_complain_list = () => {
        fetch(`http://localhost:3003/api/consumer_complain_list/${this.props.context.authenticatedUser.account_number}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    consumer_complaints: data.rows,
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
                <Container>
                    <div style={{padding: '30px' }}>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Card title="Total" bordered={false}>
                                    0
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card title="New" bordered={false}>
                                    0
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card title="Pending" bordered={false}>
                                    0
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card title="Resolved" bordered={false}>
                                    0
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card title="Forwarded" bordered={false}>
                                    0
                                </Card>
                            </Col>
                        </Row>
                    </div>


                    <Row >
                        <Col>
                            <>
                                <ComplaintList complaints={this.state.consumer_complaints}/>
                            </>
                        </Col>
                    </Row>
                </Container>
                }
            </>
        );
    }


}
