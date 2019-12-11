import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Container} from "reactstrap";
import {Avatar, Button, Card, Divider, Icon, Layout, message, Modal, Select, Switch} from "antd";
import UserRemoteSelect from "./UserRemoteSelect";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import ChatCard from "./ChatCard";
import axios from "axios";
import Util from "../components/Util";

const uuidv4 = require('uuid/v4');

const {Header, Footer, Sider, Content} = Layout;
const {Option} = Select;

export default class ComplainDetails extends Component {
    id = this.props.match.params.id;

    state = {
        username: '',
        password: '',
        role: 'admin',
        loading: true,
        errors: [],
        privateSwitchValue: true,
        forwards_message: '',
        status: '',

    };

    onStatusChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            status: value
        })
    };
    onsubmit = () => {
        const {context} = this.props;
        const authUser = context.authenticatedUser;

        const {forwards_message, status, complainDetails, employeeAgent, privateSwitchValue} = this.state;
        const is_public = (privateSwitchValue) ? 1 : 0;
        const forwards_to = (employeeAgent && employeeAgent.employee_id) ? employeeAgent.employee_id : complainDetails.forwards_to;
        const fd = new FormData();
        fd.append('complains_reporting_id', uuidv4());
        fd.append('reporting_id', complainDetails.complain_id);
        fd.append('complain_id', this.id);
        fd.append('forwards_to', forwards_to);
        fd.append('forwards_by', authUser.employee_id);
        fd.append('forwards_date', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('suggested_date_reply', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('forwards_message', forwards_message);
        fd.append('emp_name', authUser.full_name);
        fd.append('is_reply', 1);
        fd.append('status', status);
        fd.append('is_public', is_public);


        axios.post('http://localhost:3003/api/reporting_complains', fd)
            .then(response => {
                console.log("hi htere", response.data.status);
                if (response.data.status === 201) {
                    message.success("Register Successfully");
                    this.getConsumer_complain_list()

                } else if (response.data.status === 400) {
                    Util.showErrorMessage("error");
                }
            });
    };

    //unused func
    wonsubmit = () => {
        const {context} = this.props;
        const authUser = context.authenticatedUser;

        const {forwards_message, status, employeeAgent} = this.state;
        const fd = new FormData();
        fd.append('complains_reporting_id', uuidv4());
        fd.append('reporting_id', this.state.complainDetails.complain_id);
        fd.append('complain_id', this.id);
        fd.append('forwards_to', employeeAgent.employee_id);
        fd.append('forwards_by', authUser.employee_id);
        fd.append('forwards_date', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('suggested_date_reply', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('forwards_message', forwards_message);
        fd.append('emp_name', authUser.full_name);
        fd.append('is_reply', 1);
        fd.append('status', status);
        fd.append('is_public', 1);


        axios.post('http://localhost:3003/api/wreporting_complains', fd)
            .then(response => {
                console.log("hi htere", response.data.status);
                if (response.data.status === 201) {
                    message.success("Register Successfully");
                    this.getConsumer_complain_list()

                } else if (response.data.status === 400) {
                    Util.showErrorMessage("error");

                }
            });
    };
    onPrivateSwitchChange = (checked) => {
        this.setState({
            privateSwitchValue: checked
        }, () => console.log(`switch to ${this.state.privateSwitchValue}`));
    };

    componentDidMount() {
        this.getConsumer_complain_list()
    }

    getEmployee = (id) => {
        fetch(`http://localhost:3003/api/employee/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                        employeeAgent: data[0],
                    },
                    function () {
                        console.log("getEmployee called: ", data[0])

                    });

            })
    };

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
                    data: data.rows,
                    complainDetails: data.rows[data.rows.length - 1],
                    loading: false
                }, function () {
                    console.log(this.state.complainDetails.is_current, this.state.complainDetails.status, "getConsumer_complain_list Called", this.state.complainDetails.complain_id)
                });
            })
    };

    showpromoteModal = () => {
        this.setState({
            visible_showpromoteModal: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible_showpromoteModal: false,

        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible_showpromoteModal: false,
        });
    };

    confirmBtnClicked = (value) => {
        /*this.setState({
            selectedEmployeeId: value,
        });*/
        console.log("confirmBtnClicked", value);
        this.getEmployee(value[0].key)
    };

    handleConfirm = () => {
        if (this.state.employeeAgent) {
            console.log("Here is value", this.state.employeeAgent)

            this.setState({
                visible_showpromoteModal: false,
            });
        } else {
            message.warning('Please select an employee to reply report')
        }
    };
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    render() {
        const {context} = this.props;
        const {complainDetails, forwards_message, status} = this.state;
        const authUser = context.authenticatedUser;
        const assignValue = (this.state.selectedEmployeeId) ? this.state.selectedEmployeeId[0].label : "None";
        if (!authUser) {
            return <Redirect to='/signin'/>
        }

        /*new initailed
        * unresolvedt this.state.complainDetails
        * resolved*/
        let createdDate = (complainDetails && complainDetails.created_us) ? moment(complainDetails.created_us).fromNow() : "-";
        let lastMessageDate = (complainDetails && complainDetails.forwards_date) ? moment(complainDetails.forwards_date).fromNow() : "-";
        let complainStatus = (complainDetails && complainDetails.status) ? complainDetails.status : "-";
        let isAssigned = complainDetails && complainDetails.employee_id;
        let cards = (!this.state.loading) && (this.state.data[0].forwards_date) && this.state.data.map(v => (
            <ChatCard user_name={v.employee_name} created_at={v.forwards_date} complain_body={v.forwards_message}/>
        ));
        return (
            <>
                {(!this.state.loading) &&
                <>
                    <Layout>
                        <Content>
                            <Container className="p-5 demo-infinite-container">
                                <ChatCard user_name={complainDetails.user_name} created_at={complainDetails.created_us}
                                          complain_body={complainDetails.complain_body}/>
                                {cards}
                            </Container>

                            <div className='css-1panmox'>
                                <div className='css-fqbvdm'>
                                    <div className='css-1zftos'>
                                        <div className='css-8l8s0b'>
                                            <TextArea
                                                id="forwards_message"
                                                name="forwards_message"
                                                onChange={this.change}
                                                allowClear={true}
                                                autoSize={{minRows: 3, maxRows: 5}}
                                                className='textAreaStyle'
                                                placeholder="Type a message…"/>
                                        </div>


                                        <div className='css-o6jqtj'>
                                            <div className='css-gg4vpm'>
                                                <div className='css-1utwezw'>
                                                    <Switch defaultChecked title='Private'
                                                            onChange={this.onPrivateSwitchChange}/>{'  '} Private
                                                    {/*<Divider type='vertical'/>*/}
                                                    {/*<Icon type="upload"/>*/}

                                                </div>
                                                <div className='css-u4p24i'>
                                                    <div className='css-11lt5zu'>
                                                        <span className='css-7ngqza'>Complaint status</span>
                                                        <Select defaultValue="Open" style={{width: 120}}
                                                                onChange={this.onStatusChange}>
                                                            <Option value="open">Open</Option>
                                                            <Option value="pending">Pending</Option>
                                                            <Option value="solved">Solved</Option>
                                                            <Option value="closed">Closed</Option>
                                                            <Option value="spam">Spam</Option>
                                                        </Select>

                                                        <Button className='ml-2'
                                                                onClick={this.showpromoteModal}>
                                                            {(this.state.employeeAgent)
                                                                ? this.state.employeeAgent.full_name
                                                                : "Forward To"}
                                                        </Button>

                                                        <Button className='ml-2' type="primary"
                                                                onClick={this.onsubmit}>submit</Button>


                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Content>
                        <Sider width={320} style={{height: '100hv', backgroundColor: "#f3f7f9", color: 'white'}}>
                            <Card title='Complaint Info' bordered={false} style={{borderRadius: 8, marginTop: 16}}>
                                <span>Created: </span> <strong>{createdDate}</strong><Divider/>
                                <span>Last message: </span> <strong>{lastMessageDate}</strong><Divider/>
                                <span>Status: </span> <strong>{complainStatus}</strong>

                            </Card>
                            <Divider/>
                            <Card title='Responsibility' bordered={false} style={{borderRadius: 8, marginTop: 16}}>
                                <Card bordered={false} title='Agent'>
                                    {(isAssigned)
                                        ? <Card.Meta
                                            avatar={<Avatar
                                                src={"http://localhost:3003/" + this.state.complainDetails.employee_photo}/>}
                                            title={this.state.complainDetails.full_name}
                                            description={this.state.complainDetails.email}/>
                                        : <Card.Meta description="No agent assigned to this ticket."/>
                                    }
                                </Card>

                            </Card>
                        </Sider>
                    </Layout>

                    {/*<PageHeaderWrapper style={{fontSize: "small"}}>
                        <Card bordered={false} style={{backgroundColor: "#F9F9FB", fontSize: 5, fontWeight: 750}}>

                            <Row gutter={[48, 8]}>
                                <Col span={12}>
                                    <Descriptions title="" style={{marginBottom: 32}}>
                                        <Descriptions.Item
                                            label="Status">{complainDetails.complain_status}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Complain body">{complainDetails.complain_body}</Descriptions.Item>
                                        <br/><br/>
                                        <Descriptions.Item
                                            label="Last updated">{complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Created at">{complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/>
                                    </Descriptions>
                                    <h4 style={{fontSize: '1rem'}}>Complaint Attachments</h4>
                                    <Avatar shape="square" size={200}
                                            src={`http://localhost:3003/${complainDetails.attachment_name}`}/>
                                </Col>
                                <Col span={6} style={{marginLeft: 100}}>
                                    <div>
                                        <h6 style={{fontSize: '1rem'}}>Type</h6>
                                        <Select defaultValue="Problem" style={{width: '100%'}}>
                                            <Option value="question">Question</Option>
                                            <Option value="incident">Incident</Option>
                                            <Option value="problem">Problem</Option>
                                            <Option value="request">Feature Request</Option>
                                            <Option value="refund">Refund</Option>
                                        </Select>
                                        <Divider/>
                                        <h6 style={{fontSize: '1rem'}}>Status</h6>
                                        <Select defaultValue="Pending" style={{width: '100%'}}>
                                            <Option value="pending">Pending</Option>
                                            <Option value="resolved">Resolved</Option>
                                            <Option value="closed">Closed</Option>
                                            <Option value="waiting_consumer">Waiting on Consumer</Option>
                                            <Option value="waiting_third_party">Waiting on Third Party</Option>
                                        </Select>
                                        <Divider/>


                                        <h6 style={{fontSize: '1rem'}}>Priority</h6>
                                        <Select defaultValue="low" style={{width: '100%'}}>
                                            <Option value="low">Low</Option>
                                            <Option value="medium">Medium</Option>
                                            <Option value="high">High</Option>
                                            <Option value="urgent">Urgent</Option>
                                        </Select>
                                        <Divider/>

                                        <h6 onClick={this.showpromoteModal} style={{width: '100%'}}>Assign to</h6>


                                        <Select onDropdownVisibleChange={this.showpromoteModal} defaultValue='ds' style={{width: '100%'}}>
                                            <Option value='ds'>
                                                    <span onClick={this.showpromoteModal}>{assignValue}</span>
                                            </Option>
                                        </Select>
                                        <Divider/>
                                        <Button style={{width: '100%'}}>Update</Button>

                                    </div>


                                    <Button type={"primary"} onClick={this.showpromoteModal}>Reply
                                        Report</Button><br/><br/>
                                    <Button type={"primary"}>Forword Report</Button>

                                    <h3 style={{fontSize: '1rem'}}>Complaint Timeline history</h3>
                                    <Timeline mode="alternate">
                                        <Timeline.Item>
                                            <p>Complaint sumbited on</p>
                                            {complainDetails.created_us.substring(0, 10)}
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>Current Status:</p>
                                            {complainDetails.complain_status}
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


                                </Col>
                            </Row>

                        </Card>
                    </PageHeaderWrapper>*/}

                    <Modal
                        style={{width: "100%", height: "100%"}}
                        destroyOnClose={true}
                        title="Assign to"
                        visible={this.state.visible_showpromoteModal}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}

                        footer={[
                            <Button key="back" type="danger" onClick={this.handleOk}>
                                close
                            </Button>,
                            <Button key="back" type="primary" onClick={this.handleConfirm}>
                                Confirm
                            </Button>
                        ]}>

                        <UserRemoteSelect confirmBtnClicked={this.confirmBtnClicked}/>

                    </Modal>
                </>


                }
            </>
        );
    }


}
