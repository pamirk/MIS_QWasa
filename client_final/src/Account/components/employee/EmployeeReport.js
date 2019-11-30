import React, {Component} from "react";
import {Container} from "reactstrap";
import {Avatar, Badge, Button, Card, Col, Descriptions, Divider, Modal, Result, Row, Table} from "antd";
import {Link} from "react-router-dom";
import EmployeeBioDataComponent from "../../../components/EmployeeBioDataComponent";
import EmployeeAddressComponent from "../../../components/EmployeeAddressComponent";
import EmployeeDesignationComponent from "../../../components/EmployeeDesignationComponent";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import './EmployeeReport.css'

export default class EmployeeReport extends Component {
    id = this.props.match.params.id;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        fetch(`http://localhost:3003/api/show_one_employee/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data[0]);
                this.setState({
                    data: data[0]
                });
                this.getEmployeeAddress()
            })
    };
    getEmployeeAddress = () => {
        fetch(`http://localhost:3003/api/show_one_employee_address/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data[0]);
                this.setState({
                    address_data: data[0],
                });
                this.getEmployeeDesignation()
            })
    };
    getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const des = data[i];
            mydata.push({
                key: des.emp_des_id,
                duration: des.emp_des_appointment_date.substring(0, 10),
                title: des.des_title,
                scale: des.des_scale,
                department_name: des.department_name,
                department_location: des.department_city_name,
                status: des.emp_des_is_active,
            })
        }
        return mydata
    };

    getEmployeeDesignation = () => {
        fetch(`http://localhost:3003/api/employee_designation_details/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data[0]);
                this.setState({
                    designation_data: data[0],
                    tabledata: this.getformateData(data),
                });
                this.getTrainingData()
            })
    };
    getTrainformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            mydata.push({
                key: d.training_id,
                Name: d.train_name.substring(0, 10),
                Description: d.train_description,
                Start: d.train_start_date.substring(0, 10),
                End: d.train_end_date.substring(0, 10),
                Location: d.train_location_name,
            })
        }
        return mydata
    };
    getTrainingData = () => {
        fetch(`http://localhost:3003/api/training_list/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    loading: false,
                    traintabledata: this.getTrainformateData(data),
                });
            })
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    designation_columns = [
        {
            title: 'Join Date',
            dataIndex: 'duration',

        },
        {
            title: 'Title',
            dataIndex: 'title',

        },
        {
            title: 'Scale',
            dataIndex: 'scale',

        },
        {
            title: 'Department Name',
            dataIndex: 'department_name',

        },
        {
            title: 'Department Location',
            dataIndex: 'department_location',

        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <span>
                   {(record.status === 0) ? <Badge status="default" text="Not Active"/> :
                       <Badge status="processing" text="Active"/>}
                </span>
            ),

        },
    ];
    trainingcolumns = [
        {
            title: 'Name',
            dataIndex: 'Name',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
        },
        {
            title: 'Start',
            dataIndex: 'Start',
        },
        {
            title: 'End',
            dataIndex: 'End',
        },
        {
            title: 'Location',
            dataIndex: 'Location',
        },
    ];
    transfercolumns = [
        {
            title: 'Transfer Date',
            dataIndex: 'Transfer_Date',
        },
        {
            title: 'Joining Date',
            dataIndex: 'Joining_Date',
        },
        {
            title: 'Description ',
            dataIndex: 'Description',
        },
        {
            title: 'Division',
            dataIndex: 'Division',
        },
        {
            title: 'Sub Division',
            dataIndex: 'Sub_Division',
        },
        {
            title: 'Tubewell',
            dataIndex: 'Tubewell',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <span>
                   {(record.status === 0) ? <Badge status="default" text="Not Active"/> :
                       <Badge status="processing" text="Active"/>}
                </span>
            ),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>

                        <Link onClick={() => {
                            this.setState({
                                visible_showpromoteModal: true,
                                key: record.key
                            });
                        }}>
                          Edit
                      </Link>
                    </span>
            ),

        },
    ];

    reportView = () => {
        return (
            <Container id='print-it' className="pt-5">
                <div className='pt-5 example-screen'>
                    <Result
                        title="View Employee Summary "
                        subTitle=""
                        extra={[
                            <Button onClick={this.showModal} type="primary">View Details of Employee</Button>,

                            <Button href='/'>
                                Go back to Main Page
                            </Button>,
                            <Button><Link to='/create_employee'> Add another Employee </Link></Button>,
                        ]}
                    />
                </div>

                <PageHeaderWrapper style={{fontSize: "xx-large"}}>
                    <Card bordered={false} style={{backgroundColor: "#F9F9FB", fontSize: 5, fontWeight: 750}}>
                        {/*Basics*/}
                        <Row>
                            <Col sm={20}>
                                <Descriptions title="Basics" style={{marginBottom: 32}}>
                                    <Descriptions.Item
                                        label="Full Name">{this.state.data.full_name}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Father Name">{this.state.data.father_name}</Descriptions.Item>
                                    <br/>
                                    <Descriptions.Item
                                        label="CNIC Number">{this.state.data.cnic}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{this.state.data.email}</Descriptions.Item><br/>
                                    <Descriptions.Item
                                        label="Birthday">{this.state.data.birth_date.substring(0, 10)}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Service Join Date">{this.state.data.appointment_date.substring(0, 10)}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Gender">{this.state.data.gender}</Descriptions.Item>
                                </Descriptions>
                            </Col>

                            <Col sm={4}>
                                <Avatar shape="square" size={200}
                                        src={`http://localhost:3003/${this.state.data.employee_photo}`}/>
                            </Col>

                        </Row>
                        <Divider style={{marginBottom: 32}}/>
                        {/*Home Address*/}
                        <Row>

                            <Descriptions title="Home Address" style={{marginBottom: 32}}>
                                <Descriptions.Item
                                    label="Current Address">{this.state.address_data.current_address}</Descriptions.Item><br/>
                                <Descriptions.Item
                                    label="Permanent Address">{this.state.address_data.permanent_address}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Postal Code">{this.state.address_data.postal_code}</Descriptions.Item>
                                <Descriptions.Item label="City">Quetta</Descriptions.Item>
                                <Descriptions.Item
                                    label="Phone 1">{this.state.address_data.phone_number}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Phone 2">{(this.state.address_data.phone_number2 !== "") ? this.state.address_data.phone_number2 : "None"}</Descriptions.Item>
                            </Descriptions>


                        </Row>

                        <Divider style={{marginBottom: 32}}/>
                        {/*Emergency Contact*/}
                        <Descriptions title="Emergency Contact" style={{marginBottom: 32}}>
                            <Descriptions.Item label="Full Name">Amir khan</Descriptions.Item>
                            <Descriptions.Item label="Relationship">Friend</Descriptions.Item><br/>
                            <Descriptions.Item label="Phone Number 1">923337906856</Descriptions.Item>
                            <Descriptions.Item label="Phone Number 2">923337906856</Descriptions.Item>
                            <Descriptions.Item label="Email">Amir@gmail.com</Descriptions.Item>
                        </Descriptions>
                        <Divider style={{marginBottom: 32}}/>
                        {/*Employment Details*/}
                        <Descriptions title="Employment Details" style={{marginBottom: 32}}>
                            <Descriptions.Item
                                label="Start Date">{this.state.designation_data.emp_des_appointment_date.substring(0, 10)}</Descriptions.Item>
                            <Descriptions.Item
                                label="Designation Title">{this.state.designation_data.des_title}</Descriptions.Item>
                            <Descriptions.Item
                                label="Designation Scale">{this.state.designation_data.des_scale}</Descriptions.Item>
                            <Descriptions.Item
                                label="Department Name">{this.state.designation_data.department_name}</Descriptions.Item>
                            <Descriptions.Item label="Department Location">Quetta</Descriptions.Item>
                        </Descriptions>
                        <Divider style={{marginBottom: 32}}/>

                        {/*Work Address*/}
                        <Descriptions title="Work Address" style={{marginBottom: 32}}>
                            <Descriptions.Item label="Current Address">912 Silver St., Suite 1966</Descriptions.Item>
                            <Descriptions.Item label="Postal Code">94107</Descriptions.Item>
                            <Descriptions.Item label="City">Quetta</Descriptions.Item>
                            <Descriptions.Item label="Phone 1">416-000-0000</Descriptions.Item>
                            <Descriptions.Item label="Phone 2">416-000-0000</Descriptions.Item>
                        </Descriptions>
                        <Divider style={{marginBottom: 32}}/>


                        <div className='pt-3'>
                            <h4>Employee Designation History</h4>
                            <Table columns={this.designation_columns} dataSource={this.state.tabledata}
                                   pagination={false}/>
                        </div>
                        <Divider style={{marginBottom: 32}}/>

                        <div className='pt-3'>
                            <h4>Employee Training History</h4>
                            <Table columns={this.trainingcolumns} dataSource={this.state.traintabledata}
                                   pagination={false}/>
                        </div>

                        <Divider style={{marginBottom: 32}}/>

                        <div className='pt-3'>
                            <h4>Employee Attachment/Transfer History</h4>
                            <Table columns={this.transfercolumns} dataSource={this.state.transferdata}
                                   pagination={false}/>
                        </div>

                    </Card>
                </PageHeaderWrapper>
                <Modal
                    width={window.innerWidth / 2}
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <EmployeeBioDataComponent data={this.state.data}/><Divider/>
                    <EmployeeAddressComponent data={this.state.address_data}/><Divider/>
                    <EmployeeDesignationComponent data={this.state.designation_data}/>

                </Modal>
            </Container>
        );
    };

    printClicked = () => {
        let printContents = document.getElementById('print-it').innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;


    };

    render() {
        return (
            <>
                <Container>
                    {(!this.state.loading) ?
                        <>
                            <Button type="primary" onClick={() => {
                                this.printClicked()
                            }}>Download PDF</Button>

                            {this.reportView()}
                        </>
                        : "Loading"
                    }
                </Container>

            </>
        );
    }


}
