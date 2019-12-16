import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Container} from "reactstrap";
import {Avatar, Button, Card, Divider, Icon, Layout, message, Modal, Select, Switch, Upload} from "antd";
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

        fileList: [],
        uploading: false,

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
        const reporting_id = uuidv4();
        const fd = new FormData();
        fd.append('complains_reporting_id', reporting_id);
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
                    this.handleUpload(reporting_id);

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
        this.getComplain();
    }

    getComplain = () => {
        fetch(`http://localhost:3003/api/complain/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.getConsumer_complain_list();
                this.setState({
                    complain_data: data.row,
                }, () => {
                });
            })
    };

    getEmployee = (id) => {
        fetch(`http://localhost:3003/api/show_one_employee/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    employeeAgent: data[0],
                }, () => {
                    console.log("getEmployee called: ", data[0])
                });

            })
    };
    getConsumer_complain_list = () => {
        fetch(`http://localhost:3003/api/sc/${this.id}`, {
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
                }, () => {
                    console.log("Complain_data: ", this.state.data)
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
    };

    handleUpload = (id) => {
        const {fileList} = this.state;
        if (fileList.length === 0) {
            return
        }
        this.setState({
            uploading: true,
        });

        fileList.forEach(file => {
            const formData = new FormData();
            formData.append('attachment_id', uuidv4());
            formData.append('reporting_id', id);
            formData.append('image', file);
            formData.append('attachment_file_type', file.type);


            axios.post('http://localhost:3003/api/reporting_attachment', formData)
                .then(d => {
                    const data = d.data;
                    console.log(data);

                    if (data.err) {
                        this.showErrorMessage(data.err, 5);
                    } else if (data.status === 200) {
                        Util.showSuccessMessage('Successfully sent a file!', 1);
                        this.getConsumer_complain_list()
                    }
                })
                .catch(reason => {
                    this.setState({
                        uploading: false,
                    });
                    message.error('upload failed.' + reason.toString());
                })
                .finally(() => {
                    this.setState({
                        fileList: [],
                        uploading: false,
                    });
                    message.success('upload successfully.');
                });
        });
    };

    render() {
        const {context} = this.props;
        const {complainDetails, forwards_message, status, uploading, fileList, complain_data} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        const authUser = context.authenticatedUser;
        const assignValue = (this.state.selectedEmployeeId) ? this.state.selectedEmployeeId[0].label : "None";
        if (!authUser) {
            return <Redirect to='/signin'/>
        }
        let createdDate = (complain_data && complain_data.created_us) ? moment(complain_data.created_us).fromNow() : "-";
        let lastMessageDate = (complainDetails && complainDetails.forwards_date) ? moment(complainDetails.forwards_date).fromNow() : "-";
        let complainStatus = (complainDetails && complainDetails.status) ? complainDetails.status : "-";
        let isAssigned = complainDetails && complainDetails.employee_id;
        let cards = (!this.state.loading) && (this.state.data[0].forwards_date) && this.state.data.map(v => {
            return ((authUser.user_cnic) && v.is_public === 0)
                ? ""
                : <ChatCard
                    isUser={(!authUser.user_cnic)}
                    forwards_to_name={v.full_name}
                    forwards_by_name={v.employee_name}
                    suggested_date_reply={v.suggested_date_reply}
                    status={v.status}
                    is_public={v.is_public}
                    user_name={v.employee_name}
                    created_at={v.forwards_date}
                    complain_body={v.forwards_message}
                    attachments={v.attachments}/>;


        });
        const isConsumerStyle = "p-5 " + (authUser.user_cnic ? " " : " demo-infinite-container");
        return (

            <>
                {(!this.state.loading) &&
                <>
                    <Layout>
                        <Content>
                            <Container className={isConsumerStyle}>
                                <ChatCard
                                    complaincard={true}
                                    isUser={(!authUser.user_cnic)}
                                    user_name={complain_data.user_name}
                                    created_at={complain_data.created_us}
                                    complain_body={complain_data.complain_body}
                                    attachments={complain_data.attachments}

                                />
                                {cards}
                            </Container>
                            {(!authUser.user_cnic) &&
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

                                            <div style={{paddingTop: 10}}>
                                                <Upload {...props}>
                                                    <Button>
                                                        <Icon type="upload"/> Select File
                                                    </Button>
                                                </Upload>
                                                {/* <Button
                                                    type="primary"
                                                    onClick={this.handleUpload}
                                                    disabled={fileList.length === 0}
                                                    loading={uploading}
                                                    style={{marginTop: 16}}>
                                                    {uploading ? 'Uploading' : 'Start Upload'}
                                                     </Button>*/}
                                            </div>

                                            <Divider/>

                                        </div>

                                        <div className='css-o6jqtj'>
                                            <div className='css-gg4vpm'>
                                                <div className='css-1utwezw'>
                                                    Private
                                                    <Divider type='vertical'/>
                                                    <Switch defaultChecked title='Private'
                                                            onChange={this.onPrivateSwitchChange}/>


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
                            }
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
