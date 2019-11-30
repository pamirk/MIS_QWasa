import React, {Component} from 'react';
import {Button, Card, CardText, CardTitle, Col, Container, Row} from 'reactstrap';
import {Link} from "react-router-dom";
import {Divider} from "antd";


export default class Home extends Component {
    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col sm="3">
                            <Card body>
                                <CardTitle>New employee</CardTitle>
                                <CardText>Create New Qwasa employee</CardText>
                                <Button color={'white'}><Link to="/create_employee">Register Employee</Link></Button>
                            </Card>
                        </Col>
                        <Col sm="3">
                            <Card body>
                                <CardTitle> Employee List</CardTitle>
                                <CardText>View all the employees of Qwasa</CardText>
                                <Button color={'white'}><Link to="/employee_list"> Show All Employees</Link></Button>
                            </Card>
                        </Col>


                        <Col sm="3">
                            <Card body>
                                <CardTitle> Add Designation</CardTitle>
                                <CardText>Click to Add Designation of Qwasa</CardText>
                                <Button color={'white'}><Link to="/create_designation"> Add Designation </Link></Button>
                            </Card>
                        </Col>
                    </Row>

                    <Row>

                        <Col sm="3" className='pt-5'>
                            <Card body>
                                <CardTitle> Add Department</CardTitle>
                                <CardText>Click to Add Departments of Qwasa</CardText>
                                <Button color={'white'}><Link to="/create_department"> Add Department </Link></Button>
                            </Card>
                        </Col>

                        <Col sm="3" className='pt-5'>
                            <Card body>
                                <CardTitle> Add Division</CardTitle>
                                <CardText>Click to Add Division of Qwasa</CardText>
                                <Button color={'white'} ><Link to="/create_division"> Add Division</Link></Button>
                            </Card>
                        </Col>

                        <Col sm="3" className='pt-5'>
                            <Card body>
                                <CardTitle> Add Sub Division </CardTitle>
                                <CardText>Click to Add Sub Division of Qwasa</CardText>
                                <Button color={'white'} ><Link to="/create_sub_division"> Add Sub Division</Link></Button>
                            </Card>
                        </Col>
                    </Row>
                    <Divider/>

                    <Row>

                        <Col sm="3">
                            <Card body>
                                <CardTitle> Report Complain</CardTitle>
                                <CardText>Click to Complain related to Qwasa</CardText>
                                <Button color={'white'}><Link to="/complain_register"> Create Complain </Link></Button>
                            </Card>
                        </Col>
                        <Col sm="3">
                            <Card body>
                                <CardTitle>Complain List</CardTitle>
                                <CardText>Click to view List of All Complains</CardText>
                                <Button color={'white'}><Link to="/complain_register"> View Complains </Link></Button>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>

        )
    }
}
