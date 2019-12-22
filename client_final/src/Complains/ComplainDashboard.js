import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import ComplaintList from "./ComplaintList";
import './complaint.css'
import {Card, Col, Row, Statistic} from "antd";
import {Container} from "reactstrap";
import Icon from "antd/es/icon";
import Statuses from '../status'

export default class ComplainDashboard extends Component {
    /*
    registered,
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

        s_total: 0,
        s_new: 0,
        s_pending: 0,
        s_resolved: 0,
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
                }, () => this.calculateStatuses(data.rows));
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
                    loading: false,
                }, () => this.calculateStatuses(data.rows));
                console.log("Consumer complaints", data.rows)
            })
    };
    calculateStatuses = (complaints) => {
        let s_total = 0, s_new = 0 , s_pending = 0 , s_resolved = 0;
        let c;
        s_total = complaints.length;
        for (let i = 0; i < complaints.length; i++) {
            c = complaints[i];
            if (c.complain_status === Statuses.initiated || c.complain_status === Statuses.inProcess) {
                s_pending += 1;
            } else if (c.complain_status === Statuses.registered) {
                s_new += 1
            } else if (c.complain_status === Statuses.resolved) {
                s_resolved += 1
            }
        }

        this.setState({
            s_total: s_total,
            s_new: s_new,
            s_pending: s_pending,
            s_resolved: s_resolved,
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
                }, () => this.calculateStatuses(data.rows));
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
                    <div style={{fontSize:'1em', background: '#ECECEC', padding: '30px'}}>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                                    <Statistic
                                        title="Total"
                                        value={this.state.s_total}
                                        precision={0}
                                        suffix={<img width={30} src="https://img.icons8.com/color/96/000000/total-sales-1.png" />}

                                    />

                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                                    <Statistic
                                        title="New"
                                        value={this.state.s_new}
                                        precision={0}
                                        suffix={<img width={30} src="https://img.icons8.com/nolan/64/000000/fire-element.png" />}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                                    <Statistic
                                        title="In Process"
                                        value={this.state.s_pending}
                                        precision={0}
                                        suffix={<img width={30} src="https://img.icons8.com/office/80/000000/road-worker.png" />}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                                    <Statistic
                                        title="Resolved"
                                        value={this.state.s_pending}
                                        precision={0}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix={<img width={30} src="https://img.icons8.com/bubbles/50/000000/checkmark.png" />}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                                    <Statistic
                                        title="Forwarded"
                                        value={this.state.s_total}
                                        precision={0}
                                        suffix={<img width={30} src="https://img.icons8.com/cute-clipart/64/000000/forward-message.png" />}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                                    <Statistic
                                        title="Delay"
                                        value={0}
                                        precision={0}
                                        suffix={<img width={30} src="https://img.icons8.com/color/96/000000/timetable.png" />}
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
