import React from 'react';
import {Link} from 'react-router-dom';
import config from "../config";
import {Avatar, Button, Icon, Layout} from "antd";
import { ReactComponent as Logo } from '../logo.svg';


export default class Header extends React.PureComponent {
    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        return (
            <div className="header">
                <div className="bounds">
                    <Icon
                        className='Slidertrigger'
                        type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.props.toggle}
                    />

                    <nav>
                        {authUser ? (
                            <React.Fragment>
                                {/*<Link to='/complain_register'><Button type="ghost">Add A Complaint</Button></Link>*/}
                                {(!authUser.user_cnic) &&
                                <Avatar size={45} src={`http://localhost:3003/${authUser.employee_photo}`}/>}
                                {(!authUser.user_cnic)
                                    ?   <span>Welcome, {authUser.full_name}!</span>
                                    :   <span>Welcome, {authUser.user_name}!</span>
                                }

                                <Link to="/signout">Sign Out</Link>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Link className="signup" to="/signup">Sign Up</Link>
                                <Link className="signin" to="/signin">Sign In</Link>
                            </React.Fragment>
                        )}
                    </nav>
                </div>
            </div>
        );
    }
};
