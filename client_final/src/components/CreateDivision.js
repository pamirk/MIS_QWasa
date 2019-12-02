import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {Link} from "react-router-dom";
import Util from "./Util";

export default class CreateDivision extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.postData();
        this.division_name.value = "";
        this.division_description.value = "";
    };

    postData = () => {
        // const cfd = new FormData();
        // cfd.append('image', this.certificate_photo.files[0]);
        // console.log(this.certificate_photo.files[0].name);

        fetch('http://localhost:3003/api/create_division', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                division: {
                    division_name: this.division_name.value,
                    division_description: this.division_description.value,
                }
            })
        }) .then(data => data.json())
            .then(data => {
                if (data.status === 200) {
                    Util.showSuccessMessage("Division Submited")
                } else if (data.status === 500) {
                    Util.showErrorMessage("Error. try again")
                }
            })

    };


    render() {
        return (
            <div style={{height: '100 vh'}}>
                <Container>

                    <Form>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="division_name">Division Name</Label>
                                    <Input innerRef={node => this.division_name = node}
                                           type="text" name="division_name"
                                           id="division_name" placeholder="Enter Division Name here..."/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="division_description">Division Description</Label>
                                    <Input innerRef={node => this.division_description = node}
                                           type="text" name="division_description"
                                           id="division_description"
                                           placeholder="Enter Division Description here..."/>
                                </FormGroup>
                            </Col>


                        </Row>
                        <Row form>


                            <Col md={6}>
                                <FormGroup disabled={true}>
                                    <Label for="division_city_name">Division City</Label>
                                    <Input readonly="readonly" innerRef={node => this.division_city_name = node}
                                           type="text" name="division_city_name"
                                           id="division_city_name"
                                           placeholder="Quetta"/>
                                </FormGroup>
                            </Col>


                        </Row>


                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button onClick={this.handleSubmit}>Add Division</Button>
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
            </div>
        );
    }


}
