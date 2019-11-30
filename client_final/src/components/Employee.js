import React, {Component} from 'react';
import {Button, Container} from "reactstrap";
import ProgressStepper from "./ProgressStepper";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";

export default class Employee extends Component {
    id = this.props.match.params.id;

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
                    data: data[0],
                    loading: false
                });
            })
    };


    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            data: null,
            loading: true,
        };
    }

    gotoEmployeeAddress = () => {
        this.props.history.push(`/employeeAddress/${this.state.data.employee_id}`);
    };

    render() {
        return (
            <>
                <Container>
                    <ProgressStepper curr={1}/>

                    {(!this.state.loading) ?
                        <Container className="pt-5">
                            <EmployeeBioDataComponent data={this.state.data}/>
                            <div className='pt-5'>
                                <Button color="primary" size="lg" onClick={this.gotoEmployeeAddress}>Add Employee
                                    Address</Button>
                            </div>
                        </Container>
                        : ""}
                </Container>
            </>

        )
    }
}
