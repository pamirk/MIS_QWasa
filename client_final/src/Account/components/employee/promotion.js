import React, {Component} from "react";
import {Badge, Button, Col, Icon, Input, Modal, Table, Typography} from "antd";
import {Link} from "react-router-dom";
import PromoteDesignation from "./PromoteDesignation";
import Highlighter from "react-highlight-words";
export default class Promotion extends Component {
    componentDidMount() {
        this.getDesignationData()
    }

    getDesignationData = () => {
        fetch(`http://localhost:3003/api/employee_designation_details/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    data: data,
                    tabledata: this.getformateData(data),
                    loading: false
                });
            })
    };

    getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const des = data[i];
            mydata.push({
                key: des.emp_des_id,
                duration: des.emp_des_appointment_date.substring(0, 10),
                title: des.des_title,
                scale: des.des_scale,
                department_name: des.department_name,
                department_location: des.department_city_name,
                status: des.emp_des_is_active,
            })
        }
        return mydata
    };

    constructor(props) {
        super(props);
        this.state = {
            tabledata: null,
            loading: false,
            visible_showpromoteModal: false,
        };
    }

    showpromoteModal = () => {
        this.setState({
            visible_showpromoteModal: true,
        });

    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible_showpromoteModal: false,

        });


    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible_showpromoteModal: false,
        });


    };
    hideHandler = () => {
        this.setState({
            visible_showpromoteModal: false,
            loading: true,
            tabledata: null,


        });
       this.getDesignationData();
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input ref={node => {
                    this.searchInput = node;
                }}
                       placeholder={`Search ${dataIndex}`}
                       value={selectedKeys[0]}
                       onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                       onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                       style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({searchText: selectedKeys[0]});
    };
    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };
    columns = [
        {
            title: 'Join Date',
            dataIndex: 'duration',
            ...this.getColumnSearchProps('duration'),

        },
        {
            title: 'Title',
            dataIndex: 'title',
            ...this.getColumnSearchProps('title'),

        },
        {
            title: 'Scale',
            dataIndex: 'scale',
            ...this.getColumnSearchProps('scale'),

        },
        {
            title: 'Department Name',
            dataIndex: 'department_name',
            ...this.getColumnSearchProps('department_name'),

        },
        {
            title: 'Department Location',
            dataIndex: 'department_location',
            ...this.getColumnSearchProps('department_location'),

        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <span>
                   {(record.status === 0) ? <Badge status="default" text="Not Active"/> :
                       <Badge status="processing" text="Active"/>}
                </span>
            ),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>

                        <Link onClick={() => {

                            this.setState({
                                visible_showpromoteModal: true,
                                Indexkey: record.key
                            });
                        }}>
                          Edit
                      </Link>
                    </span>
            ),

        },
    ];

    render() {

        return (
            <>
                {(!this.state.loading) &&
                <>
                    <Col className='p-5'>
                        <Button type="primary" size='large' onClick={this.showpromoteModal}>
                            Give Employee Promotion
                        </Button>

                        <div className='pt-3'>
                            <Table columns={this.columns} dataSource={this.state.tabledata} pagination={false}/>
                        </div>

                        <Modal
                            title="Promote Employee"
                            visible={this.state.visible_showpromoteModal}
                            onOk={this.handleOk}
                            destroyOnClose={true}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" type="danger" onClick={this.handleOk}>
                                    close
                                </Button>
                            ]}>



                            <PromoteDesignation Indexkey={this.state.Indexkey} hideHandler={this.hideHandler} id={this.props.id}
                                                data={this.state.data}/>


                        </Modal>
                    </Col>

                </>
                }
            </>
        );
    }
}
