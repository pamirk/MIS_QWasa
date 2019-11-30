import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {Link} from "react-router-dom";

class CreateDesignation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            departs: [],
        };
    }

    componentDidMount() {
        this.getDepartmentList();
    }

    getDepartmentList = () => {
        let items = [];
        fetch('http://localhost:3003/api/department_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const department = data[i - 1];
                    items.push(
                        <option value={department.department_id}>{department.department_name}</option>)
                }

                this.setState({
                    departs: items
                });
            })


    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.menu.value);

        this.postData();
        this.designation_title.value = "";
        this.designation_scale.value = "";
        this.menu.value = "N/A"
    };

    postData = () => {
        // const cfd = new FormData();
        // cfd.append('image', this.certificate_photo.files[0]);
        console.log(this.menu.value);

        fetch('http://localhost:3003/api/create_designation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                designation: {
                    designation_title: this.designation_title.value,
                    designation_scale: this.designation_scale.value,
                    department_id: this.menu.value,
                }
            })
        })
            .then(data => console.log(data))

    };
    toggle = () => {
        this.setState((prevState) => ({
            dropdownOpen: !(prevState.dropdownOpen)
        }));
    };

    //setDropdownOpen(prevState => !prevState);


    render() {
        return (
            <>
                <Container>

                    <Form>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="designation_title">Designation Title</Label>
                                    <Input innerRef={node => this.designation_title = node}
                                           type="text" name="designation_title"
                                           id="designation_title" placeholder="Enter your Current Address here..."/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="designation_scale">Designation Scale</Label>
                                    <Input innerRef={node => this.designation_scale = node}
                                           type="text" name="designation_scale"
                                           id="designation_scale"
                                           placeholder="Enter your Permanent Address here..."/>
                                </FormGroup>
                            </Col>


                        </Row>

                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="designation_scale">Select Department</Label>

                                    <select id="designation_scale" ref={(input) => this.menu = input}>
                                        <option value="N/A">Select Department</option>
                                        {this.state.departs}
                                    </select>
                                </FormGroup>
                            </Col>


                        </Row>


                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button onClick={this.handleSubmit}>Add Designation</Button>
                                </FormGroup>
                            </Col>


                        </Row>


                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button color={'white'}><Link to="/">Go Back </Link></Button>
                                </FormGroup>
                            </Col>


                        </Row>

                    </Form>

                </Container>
            </>
        );
    }


}


export default CreateDesignation;
