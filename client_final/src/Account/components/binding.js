import {Icon, List, Switch} from 'antd';
import React, {Component, Fragment} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label} from "reactstrap";
import axios from "axios";
import Util from "../../components/Util";

class BindingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        this.getData()

    }

    onStatusChange = (checked) => {
        this.setState({
            status: checked
        });

        console.log(`switch to ${checked}`);
        this.postStatusData(checked);
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('password', this.password.value);

        axios.post('http://localhost:3003/api/set_employee_password', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err || data.status === 500) {
                    Util.showErrorMessage("Sorry, Try again")
                } else if (data.status === 200) {
                    Util.showSuccessMessage("Password Changed")
                }

            });
        this.password.value = ''
    };
    postStatusData = (checked) => {
        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('status', checked);

        axios.post('http://localhost:3003/api/set_employee_status', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err) {
                    Util.showErrorMessage("Sorry, Try again")
                } else if (data.status === 200) {
                    Util.showSuccessMessage("Status Changed")
                }

            })
    };

    getData = () => {
        this.setState({loading: true,});


        fetch(`http://localhost:3003/api/get_employee_status/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.warn(data);
                if (data.status === 200) {
                    console.warn(data);
                    this.setState({
                        active: (data.is_active === 1),
                        loading: false,
                        ploading: false,
                    });
                }
            })
    };

    render() {
        return (
            <Container>

                <Form>
                    <FormGroup row>
                        <Col sm={{size: 18, offset: 2}}>
                            {(!this.state.ploading) &&
                            <Switch loading={this.state.loading} title='Status '
                                    onChange={this.onStatusChange}
                                    checkedChildren={<Icon type="check"/>}
                                    unCheckedChildren={<Icon type="close"/>}/>
                            }
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={{size: 18, offset: 2}}>
                            <Input innerRef={node => this.password = node}
                                   type="password" name="password"
                                   id="password" placeholder="Enter New password here"/>
                        </Col>
                    </FormGroup>

                    <FormGroup check row>
                        <Col sm={{size: 18, offset: 2}}>
                            <Button onClick={this.handleSubmit}>Save</Button>
                        </Col>
                    </FormGroup>
                </Form>

            </Container>
        );
    }
}

export default BindingView;
