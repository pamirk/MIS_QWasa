import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {Link} from "react-router-dom";

export default class CreateSubDivision extends Component {

    constructor(props) {
        super(props);
        this.state = {
            departs: [],
        };
    }

    componentDidMount() {
        this.getDivisionList();
    }

    getDivisionList = () => {
        let items = [];
        fetch('http://localhost:3003/api/division_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const division = data[i - 1];
                    items.push(
                        <option value={division.div_id}>{division.div_title}</option>)
                }

                this.setState({
                    divisions: items
                });
            })


    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.menu.value);

        this.postData();
        this.sub_div_name.value = "";
        this.description.value = "";
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
                sub_division: {
                    sub_div_name: this.sub_div_name.value,
                    description: this.description.value,
                    div_id: this.menu.value,
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
                                    <Label for="sub_div_name">Sub Division Name:</Label>
                                    <Input innerRef={node => this.sub_div_name = node}
                                           type="text" name="sub_div_name"
                                           id="sub_div_name" placeholder="Enter Sub Division Name here..."/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="description">Sub Division Description</Label>
                                    <Input innerRef={node => this.description = node}
                                           type="text" name="description"
                                           id="description"
                                           placeholder="Enter description here..."/>
                                </FormGroup>
                            </Col>


                        </Row>

                        <Row form>

                            <Col md={6}>
                                <FormGroup>
                                    <Label for="division">Select Main Division</Label>

                                    <select id="division" ref={(input) => this.menu = input}>
                                        <option value="N/A">Main Division</option>
                                        {this.state.departs}
                                    </select>
                                </FormGroup>
                            </Col>


                        </Row>


                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Button onClick={this.handleSubmit}>Add Sub Division</Button>
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

