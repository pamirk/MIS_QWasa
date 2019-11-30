import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {Link} from "react-router-dom";

class CreateDepartment extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.postData();
        this.department_name.value = ""
        this.department_description.value = ""
        this.department_city_name.value = ""
    };

    postData = () => {
        // const cfd = new FormData();
        // cfd.append('image', this.certificate_photo.files[0]);
        // console.log(this.certificate_photo.files[0].name);

        fetch('http://localhost:3003/api/create_department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({

                department: {
                    department_name: this.department_name.value,
                    department_description: this.department_description.value,
                    department_city_name: this.department_city_name.value,

                }


            })
        })
            .then(data => console.log(data))

    };


    render() {
        return (
            <>
                <Container>

                    <Form>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="department_name">Department Name</Label>
                                    <Input innerRef={node => this.department_name = node}
                                           type="text" name="department_name"
                                           id="department_name" placeholder="Enter your Current Address here..."/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="department_description">Department Description</Label>
                                    <Input innerRef={node => this.department_description = node}
                                           type="text" name="department_description"
                                           id="department_description"
                                           placeholder="Enter your Permanent Address here..."/>
                                </FormGroup>
                            </Col>


                        </Row>
                        <Row form>


                            <Col md={6}>
                                <FormGroup>
                                    <Label for="department_city_name">Department City Name</Label>
                                    <Input innerRef={node => this.department_city_name = node}
                                           type="text" name="department_city_name" id="department_city_name"
                                           placeholder="Enter your City here"/>
                                </FormGroup>
                            </Col>


                        </Row>


                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button onClick={this.handleSubmit}>Add Department</Button>
                                </FormGroup>
                            </Col>


                        </Row>

                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button color={'white'} ><Link to="/">Go Back </Link></Button>
                                </FormGroup>
                            </Col>


                        </Row>

                    </Form>
                </Container>
            </>
        );
    }


}


export default CreateDepartment;
