import {Avatar, Menu, Row} from 'antd';
import React from "react";
import Address from "./components/address";
import Promotion from "./components/employee/promotion";
import SecurityView from "./components/security";
import BindingView from "./components/binding";
import NotificationView from "./components/notification";
import {GridContent} from "@ant-design/pro-layout";
import {Container} from "reactstrap";
import './Menu.css';
import Label from "reactstrap/es/Label";
import Job from "./components/employee/Job";
import Personal from "./components/employee/Personal";
import ETraining from "./components/employee/ETraining.js";
import Transfer from "./components/employee/Transfer";

const {Item} = Menu;

export default class MyMenu extends React.Component {
    main = undefined;
    id = this.props.match.params.id;

    constructor(props) {
        super(props);
        const menuMap = {
            job: "Job",
            Personal: "Personal",
            promotion: "Promotion",
            training: "Trainings",
            transfer: "Transfer",
            binding: "Account Settings",
            notification: "Notifications",
        };
        this.state = {
            mode: 'inline',
            menuMap,
            selectKey: 'job',
            collapsed: false,
            loading: true,

        };
    }

    componentDidMount() {
        this.getData();
        window.addEventListener('resize', this.resize);
        this.resize();

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    getData = () => {
        fetch(`http://localhost:3003/api/show_one_employee/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.warn(data[0]);
                let cd = data[0];
                cd.appointment_date = cd.appointment_date.toString().substring(0, 10);
                cd.birth_date = cd.birth_date.toString().substring(0, 10);
                this.setState({
                    data: cd
                });
                this.getaddressData();
            })
    };
    getaddressData = () => {
        fetch(`http://localhost:3003/api/show_one_employee_address/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                let cd = data;
                this.setState({
                    address_data: cd,
                });
                this.getDesignationData()
            })
    };
    getDesignationData = () => {
        fetch(`http://localhost:3003/api/employee_designation_details/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
             /*   Object.keys(data).map(cd => {
                    if (cd !== undefined && cd.emp_des_order_date !== undefined && cd.emp_des_appointment_date !== undefined) {
                        cd.emp_des_order_date = cd.emp_des_order_date.toString().substring(0, 10);
                        cd.emp_des_appointment_date = cd.emp_des_appointment_date.toString().substring(0, 10);
                    }
                });*/


                this.setState({
                    des_data: data,
                    loading: false
                });


            })
    };
    getMenu = () => {
        const {menuMap} = this.state;
        return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
    };
    getRightTitle = () => {
        const {selectKey, menuMap} = this.state;
        return menuMap[selectKey];
    };
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    selectKey = (key) => {
        this.setState({
            selectKey: key,
        });
    };
    resize = () => {
        if (!this.main) {
            return;
        }
        requestAnimationFrame(() => {
            if (!this.main) {
                return;
            }
            let mode = 'horizontal';
            const {offsetWidth} = this.main;
            if (this.main.offsetWidth < 641 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            if (window.innerWidth < 768 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            this.setState({
                mode,
            });
        });
    };
    tablecolumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Start Date',
            key: 'StartDate',
            dataIndex: 'StartDate',
        },
        {
            title: 'End Date',
            key: 'EndDate',
            dataIndex: 'StartDate',
        },
    ];
    tabledata = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }
    ];

    renderChildren = () => {
        const {selectKey} = this.state;
        switch (selectKey) {
            case 'job':
                return <Job id={this.id} data={this.state.data} address_data={this.state.address_data} des_data={this.state.des_data[0]} />;
            case 'Personal':
                return <Personal id={this.id} data={this.state.data} address_data={this.state.address_data}/>;
            case 'training':
                return <ETraining id={this.id}/>;
            case 'promotion':
                return <Promotion selectKey={this.selectKey} id={this.id} data={this.state.des_data}/>;
            case 'transfer':
                return <Transfer id={this.id} />;
            case 'security':
                return <SecurityView/>;
            case 'binding':
                return <BindingView/>;
            case 'notification':
                return <NotificationView/>;
            default:
                break;
        }

        return null;
    };

    render() {

        const {mode, selectKey} = this.state;
        return (
            <Container>
                <GridContent>
                    <div className='main' ref={ref => {
                        if (ref) {
                            this.main = ref;
                        }
                    }}>

                        {(!this.state.loading)

                            ? <Row>
                                <Avatar size={100} src={`http://localhost:3003/${this.state.data.employee_photo}`}/>

                                <Label className='small text-md-center p-3'> {this.state.data.full_name} </Label>
                            </Row>

                            : ""
                        }

                        <div className='leftMenu'>
                            <Menu
                                mode={mode}
                                selectedKeys={[selectKey]}
                                onClick={({key}) => this.selectKey(key)}>
                                {this.getMenu()}
                            </Menu>
                        </div>
                        <div className='right'>
                            {/*<div className='title'>{this.getRightTitle()}</div>*/}
                            {(!this.state.loading)
                                ? this.renderChildren()
                                : ""
                            }

                        </div>
                    </div>
                </GridContent>
            </Container>
        );
    }

}
