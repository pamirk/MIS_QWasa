import React from 'react';

import {Divider, Layout, Menu} from 'antd';
import {NavLink} from "react-router-dom";

const {Header, Content, Footer, Sider} = Layout;


const {SubMenu} = Menu;
const sliderStyle ={backgroundColor:"#3e474f"};
export default class MySider extends React.Component {
    // submenu keys of first level
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    state = {
        openKeys: ['sub1'],
    };

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };


    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const menulinks = (authUser && authUser.user_cnic)
            ?
            <Menu theme="dark" mode="vertical" defaultSelectedKeys={['100']}>
                <Menu.Item key="8">
                    <NavLink activeStyle={{color: 'white'}} to="/complain_register">Add Complaint</NavLink>
                </Menu.Item>
                <Menu.Item key="9">
                    <NavLink activeStyle={{color: 'white'}} to="/complain_dashboard">View
                        Complaints</NavLink>
                </Menu.Item>
            </Menu>
            :
            <Menu theme="dark" style={sliderStyle} mode="vertical" defaultSelectedKeys={['100']}>


                <Menu.Item key="1">
                    <NavLink activeStyle={{color: 'white'}}
                             to="/create_employee" className="nav-text"> Register Employee </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink activeStyle={{color: 'white'}} to="/employee_list">All Employees</NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                    <NavLink activeStyle={{color: 'white'}} to="/create_designation">Add
                        Designation</NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                    <NavLink activeStyle={{color: 'white'}} to="/create_department">Add
                        Department</NavLink>
                </Menu.Item>
                <Menu.Item key="6">
                    <NavLink activeStyle={{color: 'white'}} to="/create_division">Add Division</NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                    <NavLink activeStyle={{color: 'white'}} to="/create_sub_division">Add Sub
                        Division</NavLink>
                </Menu.Item>
                <Menu.Item key="8">
                    <NavLink activeStyle={{color: 'white'}} to="/complain_dashboard">View Complaints</NavLink>
                </Menu.Item>
                {/*<Menu.Item key="9">
                    <NavLink activeStyle={{color: 'white'}} to="/complain_reports">Complaint Reports</NavLink>
                </Menu.Item>*/}
            </Menu>;

        return (
            <Layout>

                {authUser ? (
                    <>
                        <Sider
                            style={sliderStyle}
                            breakpoint="lg"
                            collapsedWidth="0"
                            onBreakpoint={broken => {
                                console.log(broken);
                            }}
                            onCollapse={(collapsed, type) => {
                                console.log(collapsed, type);
                            }}>
                            {menulinks}
                        </Sider>
                    </>
                ) : (
                    <>

                    </>
                )}


                <Layout style={{height: "100%"}}>
                    {this.props.children}
                </Layout>
            </Layout>
        );
    }
}
