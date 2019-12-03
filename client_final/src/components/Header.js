import React from 'react';
import {Link} from 'react-router-dom';
import config from "../config";
import {Avatar, Button} from "antd";

export default class Header extends React.PureComponent {
    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo"><Link to="/">Home</Link></h1>
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
