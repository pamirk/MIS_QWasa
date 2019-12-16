import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import ComplaintList from "./ComplaintList";
import './complaint.css'
import {Card, Col, Row, Statistic} from "antd";
import {Container} from "reactstrap";
import Icon from "antd/es/icon";

export default class ComplainDashboard extends Component {
    /*
    new,
    initiate or pending
    inprocess or pending
    resolve

    todo:
    date_of_reply
    */

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
        console.log("authUser", authUser);
        this.setState({
            is_admin: authUser.is_admin
        }, () => console.log("is_admin; ", this.state.is_admin));
        if (authUser.user_cnic) {
            this.getConsumer_complain_list()
        } else if (authUser.is_admin === 1) {
            this.getAllcomplain_list()
        } else {
            this.getEmployeesForwardedComplaints(authUser.employee_id);
        }
    }

    getEmployeesForwardedComplaints = (id) => {
        fetch(`http://localhost:3003/api/employee_complain_list/${id}`, {
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
                    <div style={{background: '#ECECEC', padding: '30px'}}>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Total"
                                        value={11}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix=''
                                        suffix=''
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="New"
                                        value={11}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix=""
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Pending"
                                        value={11}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix=""
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Resolved"
                                        value={11}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix=""
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Forwarded"
                                        value={11}
                                        precision={0}
                                        valueStyle={{ color: '#3f8600' }}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix=""
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col>
                            <ComplaintList complaints={this.state.consumer_complaints}/>
                        </Col>
                    </Row>
                </Container>
                }
            </>
        );
    }


}
