import React, {Component} from 'react';
import axios from "axios";
import {Button, Col, Container, Form, FormGroup, FormText, Input, Label, Spinner} from 'reactstrap';
import {Avatar, Layout, message} from "antd";

const { Header, Footer, Sider, Content } = Layout;

const uuidv4 = require('uuid/v4');

class CreateComplain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            image: null
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.postComplain();
    };

    showErrorMessage = (mess, duration) => {
        message.error(mess, duration);
        message.error(mess, duration);
    };
    postComplain = () => {
        const complain_id = uuidv4();
        console.log('here is complain_id',complain_id);

        if (!(this.account_number.value && this.complain_body.value)) {
            this.showErrorMessage('Please provide all the Fields', 5);
        } else {
            const fd = new FormData();


            fd.append('complain_id', complain_id);
            fd.append('account_number', this.account_number.value);
            fd.append('complain_body', this.complain_body.value);
            fd.append('complain_status', "Its Very first step");
            console.log(complain_id)
            console.log(this.account_number.value)
            console.log(this.complain_body.value)
            axios.post('http://localhost:3003/api/complain_register', fd)
                .then(d => {
                    const data = d.data;
                    console.log(data);
                    this.setState({
                        loading: false,
                    });
                    if (data.err) {
                        this.showErrorMessage(data.err, 5);
                    } else if (data.status === 200) {
                        if ((this.state.image && this.state.image.name)) {
                            this.postAttachment(complain_id)
                        } else {
                            this.showErrorMessage('Successfully Register EmplOyee', 5);
                        }


                    }
                })
        }
    };


    postAttachment = (complain_id) => {
            const fd = new FormData();
            fd.append('attachment_id', uuidv4());
            fd.append('complain_id', complain_id);
            fd.append('attachment_file_type', this.state.image.type);
            fd.append('image', this.state.image, this.state.image.name);


            axios.post('http://localhost:3003/api/one_complain_register_Attachment', fd)
                .then(d => {
                    const data = d.data;
                    console.log(data);
                    this.setState({
                        loading: false,
                    });
                    if (data.err) {
                        this.showErrorMessage(data.err, 5);
                    } else if (data.status === 200) {

                        this.showErrorMessage('Successfully Register EmplOyee', 5);
                        /*this.props.history.push(`/employeeHome/${data.employee_id}`);*/
                    }

                })
    };

    onImageDataChange = (e) => {
        let files = e.target.files;
        this.setState({
            image: files[0],
        });

        if (e.target.files && e.target.files[0]) {
            this.setState({
                fimage: URL.createObjectURL(e.target.files[0])
            });
        }
    };
    showRegistrationForm = () => {
        return (
            <>
                <Container className='p-5'>
                    <Form>
                        <FormGroup row>
                            <Label for="account_number" sm={2}>Account Number</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.account_number = node}
                                       type="text" name="account_number" id="account_number"
                                       placeholder="111-111-111"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="complain_body" sm={2}>Complain Body</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.complain_body = node}
                                       type="text" name="complain_body" id="complain_body"
                                       placeholder="Enter complain here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="employee_photo" sm={2}>Upload Photo</Label>
                            <Col sm={8}>
                                <Input type="file" name="employee_photo" id="employee_photo"
                                       innerRef={node => this.employee_photo = node}
                                       onChange={this.onImageDataChange}/>
                                <FormText color="muted">Please Provide Employee Resent Passport size Photo</FormText>
                            </Col>
                            <Col sm={2}>
                                <Avatar shape="square" size={124} icon="user" src={this.state.fimage}/>
                            </Col>
                        </FormGroup>

                        <FormGroup check row>
                            <Col sm={{size: 18, offset: 2}}>
                                <Button onClick={this.handleSubmit}>Submit Complain</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>


            </>
        )
    };

    render() {
        return (
            <>
                <Container>
                    {(this.state.loading)
                        ? <Spinner style={{width: '6rem', height: '6rem'}}/>
                        : this.showRegistrationForm()}
                </Container>

                <Layout>
                    <Sider>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content>Content</Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>
            </>
        );
    }

}

export default CreateComplain;
