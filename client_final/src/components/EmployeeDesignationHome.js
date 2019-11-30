import React, {Component} from "react";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";
import { Container} from "reactstrap";
import ProgressStepper from "./ProgressStepper";
import EmployeeAddressComponent from "./EmployeeAddressComponent";
import EmployeeDesignationComponent from "./EmployeeDesignationComponent";
import {Divider, Result, Button, Modal} from "antd";
import {Link} from "react-router-dom";

export default class EmployeeDesignationHome extends Component {
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
                    loading: false
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
    render() {
        return (
            <>
                <Container>
                    <ProgressStepper curr={10}/>
                    {(!this.state.loading) ?
                        <Container className="pt-5">
                            <div className='pt-5'>
                                <Result
                                    status="success"
                                    title="Employee Successfully Added "
                                    subTitle=""
                                    extra={[
                                        <Button onClick={this.showModal} type="primary">View Added Employee</Button>,

                                        <Button href='/'   >
                                            Go back to Main Page
                                        </Button>,
                                        <Button ><Link to='/create_employee'> Add another Employee </Link></Button>,
                                    ]}
                                />
                            </div>



                            <Modal
                                width={window.innerWidth/2}
                                title="Basic Modal"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}>
                                <EmployeeBioDataComponent data={this.state.data}/><Divider />
                                <EmployeeAddressComponent data={this.state.address_data}/><Divider />
                                <EmployeeDesignationComponent data={this.state.designation_data}/>

                            </Modal>


                        </Container>

                        : ""
                    }
                </Container>s

            </>
        );
    }


}
