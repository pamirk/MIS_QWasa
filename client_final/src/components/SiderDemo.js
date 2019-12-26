import React from 'react';
import withContext from '../Context';
import Header from '../components/Header';


import {Layout, Menu, Icon} from 'antd';
import {Link, NavLink} from "react-router-dom";
import {ReactComponent as Logo} from "../logo.svg";

const {Sider, Content} = Layout;
const HeaderWithContext = withContext(Header);

export default class SiderDemo extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const menulinks = (authUser && authUser.user_cnic)
            ?
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['100']}>
                <Menu.Item key="8">
                    <Icon type="user"/>
                    <span>
                       <NavLink activeStyle={{color: 'white'}} to="/complain_register">Add Complaint</NavLink>
                    </span>

                </Menu.Item>
                <Menu.Item key="9">
                    <Icon type="user"/>
                    <span>
                       <NavLink activeStyle={{color: 'white'}} to="/complain_dashboard">View Complaints</NavLink>
                    </span>
                </Menu.Item>
            </Menu>
            :
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['100']}>


                <Menu.Item key="1">

                    <Icon type="user"/>
                    <span>
                        <NavLink className="nav-text"
                                 activeStyle={{color: 'white'}}
                                 to="/create_employee">
                        Register Employee
                        </NavLink>
                    </span>


                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="user"/>
                    <span>
                        <NavLink activeStyle={{color: 'white'}} to="/employee_list">All Employees</NavLink>
                    </span>
                </Menu.Item>
                <Menu.Item key="4">
                    <Icon type="user"/>
                    <span>
                        <NavLink activeStyle={{color: 'white'}} to="/create_designation">Add
                        Designation</NavLink>
                    </span>

                </Menu.Item>
                <Menu.Item key="5">
                    <Icon type="user"/>
                    <span>
                      <NavLink activeStyle={{color: 'white'}} to="/create_department">Add
                        Department</NavLink>
                    </span>
                </Menu.Item>
                <Menu.Item key="6">
                    <Icon type="user"/>
                    <span>
                      <NavLink activeStyle={{color: 'white'}} to="/create_division">Add Division</NavLink>
                    </span>
                </Menu.Item>
                <Menu.Item key="7">
                    <Icon type="user"/>
                    <span>
                        <NavLink activeStyle={{color: 'white'}} to="/create_sub_division">Add Sub
                        Division</NavLink>
                    </span>
                </Menu.Item>
                <Menu.Item key="8">
                    <Icon type="user"/>
                    <span>
                        <NavLink activeStyle={{color: 'white'}} to="/complain_dashboard">View Complaints</NavLink>
                    </span>
                </Menu.Item>
                {/*<Menu.Item key="9">
                    <NavLink activeStyle={{color: 'white'}} to="/complain_reports">Complaint Reports</NavLink>
                </Menu.Item>*/}
            </Menu>;

        return (
            <Layout>
                <Sider style={{minHeight: '100vh'}}
                       trigger={null}
                       collapsible collapsed={this.state.collapsed}>
                    <div className="header--logo">
                        <Link to="/"><Logo width={50} height={50}/></Link></div>

                    {menulinks}

                </Sider>
                <Layout>
                    <HeaderWithContext collapsed={this.state.collapsed} toggle={this.toggle}/>
                    <Content
                        style={{
                            margin: '24px 16px',
                            background: '#f0f2f',
                        }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
