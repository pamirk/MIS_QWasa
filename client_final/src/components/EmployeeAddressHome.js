import React, {Component} from "react";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";
import {Button, Container} from "reactstrap";
import ProgressStepper from "./ProgressStepper";
import EmployeeAddressComponent from "./EmployeeAddressComponent";

export default class Employee extends Component {
    id = this.props.match.params.id;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
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
                    loading: false
                });
            })
    };

    gotoEmployeeDesignationForm = () => {
        this.props.history.push(`/employeeDesignation/${this.state.data.employee_id}`);
    };

    render() {
        return (
            <>
                <Container>
                    <ProgressStepper curr={2}/>
                    {(!this.state.loading) ?
                        <Container className="pt-5">
                            <EmployeeBioDataComponent data={this.state.data}/>
                            <EmployeeAddressComponent data={this.state.address_data}/>

                            <div className='pt-5'>
                                <Button color="primary" size="lg" onClick={this.gotoEmployeeDesignationForm} >Add Employee Designation</Button>
                            </div>
                        </Container>

                        : ""
                    }
                </Container>

            </>
        );
    }


}