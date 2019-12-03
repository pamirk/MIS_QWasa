import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Form from './Form';
import {Col, Input} from "reactstrap";
import Util from "./Util";
import axios from "axios";

export default class UserSignUp extends Component {
    state = {
        account_number: '',
        user_cnic: '',
        user_name: '',
        user_email: '',
        user_password: '',
        user_address: '',
        user_contact: '',
        user_cnic_front_image: '',
        user_cnic_back_image: '',
        user_wasa_bill_image: '',
        errors: [],
    }
    onFrontIDImageChange = (e) => {
        let files = e.target.files;
        this.setState({
            user_cnic_front_image: files[0],
        });
    };
    onBackIDImageChange = (e) => {
        let files = e.target.files;
        this.setState({
            user_cnic_back_image: files[0],
        });
    };
    onWasabillImageChange = (e) => {
        let files = e.target.files;
        this.setState({
            user_wasa_bill_image: files[0],
        });
    };

    render() {
        const {
            account_number, user_cnic, user_name, user_email, user_password, user_address, user_contact, user_cnic_front_image,
            user_cnic_back_image, user_wasa_bill_image, errors,
        } = this.state;

        return (
            <div>
                <div className="grid-33 centered signin">
                    <h1>Consumer Sign Up</h1>
                    <Form
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Sign Up"
                        elements={() => (
                            <React.Fragment>
                                <input
                                    id="account_number"
                                    name="account_number"
                                    type="text"
                                    value={account_number}
                                    onChange={this.change}
                                    placeholder="account_number"/>
                                <input
                                    id="user_cnic"
                                    name="user_cnic"
                                    type="number"
                                    value={user_cnic}
                                    onChange={this.change}
                                    placeholder="user_cnic"/>
                                <input
                                    id="user_name"
                                    name="user_name"
                                    type="text"
                                    value={user_name}
                                    onChange={this.change}
                                    placeholder="user_name"/>
                                <input
                                    id="user_email"
                                    name="user_email"
                                    type="email"
                                    value={user_email}
                                    onChange={this.change}
                                    placeholder="user_email"/>
                                <input
                                    id="user_password"
                                    name="user_password"
                                    type="password"
                                    value={user_password}
                                    onChange={this.change}
                                    placeholder="User Password"/>
                                <input
                                    id="user_address"
                                    name="user_address"
                                    type="text"
                                    value={user_address}
                                    onChange={this.change}
                                    placeholder="User Address"/>
                                <input
                                    id="user_contact"
                                    name="user_contact"
                                    type="number"
                                    value={user_contact}
                                    onChange={this.change}
                                    placeholder="User Contact"/>
                                <input
                                    onChange={this.onFrontIDImageChange}
                                    id="user_cnic_front_image"
                                    name="user_cnic_front_image"
                                    type="file"
                                    placeholder="User cnic front image"/>
                                <input
                                    onChange={this.onBackIDImageChange}
                                    id="user_cnic_back_image"
                                    name="user_cnic_back_image"
                                    type="file"
                                    placeholder="User cnic back image"/>
                                <input
                                    onChange={this.onWasabillImageChange}
                                    id="user_wasa_bill_image"
                                    name="user_wasa_bill_image"
                                    type="file"
                                    placeholder="User Wasa bil image"/>
                            </React.Fragment>
                        )}/>
                    <p>
                        Already have a user account? <Link to="/signin">Click here</Link> to sign in!
                    </p>
                </div>
            </div>
        );
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    submit = () => {
        const {context} = this.props;
        const {
            account_number, user_cnic, user_name, user_email, user_password, user_address, user_contact,
            user_cnic_front_image, user_cnic_back_image, user_wasa_bill_image,
        } = this.state;

        // Create user
        const user = {
            account_number, user_cnic, user_name, user_email, user_password, user_address, user_contact,
            user_cnic_front_image, user_cnic_back_image, user_wasa_bill_image,
        };

        //error checking temporary trick
        let e = null;
        Object.entries(user).forEach(([key, val]) => {
            if (!val) {
                Util.showErrorMessage("provide value of" + key, 5);
                e = "err"
            }
        });

        if (e !== null) return

        console.log(user);


        const fd = new FormData();
        fd.append('account_number', user.account_number);
        fd.append('user_cnic', user.user_cnic);
        fd.append('user_name', user.user_name);
        fd.append('user_email', user.user_email);
        fd.append('user_password', user.user_password);
        fd.append('user_address', user.user_address);
        fd.append('user_contact', user.user_contact);
        fd.append('user_cnic_front_image', user.user_cnic_front_image, user.user_cnic_front_image);
        fd.append('user_cnic_back_image', user.user_cnic_back_image, user.user_cnic_back_image);
        fd.append('user_wasa_bill_image', user.user_wasa_bill_image, user.user_wasa_bill_image);


        axios.post('http://localhost:3003/api/create_consumer', fd)
            .then(response => {
                console.log("hi htere", response.data.status);
                if (response.data.status === 201) {
                    Util.showSuccessMessage("Register Successfully");
                    context.actions.consumerSignIn(user.user_cnic, user.user_password)
                        .then(() => {
                            this.props.history.push('/complain_dashboard');
                        });

                } else if (response.data.status === 400) {
                    return response.data.json().then(data => {
                        this.setState({errors: data.errors});
                    });
                } else {
                    this.props.history.push('/error');
                }
            });

    };

    cancel = () => {
        this.props.history.push('/');
    }
}
