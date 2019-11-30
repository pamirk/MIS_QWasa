import React, {Component} from "react";
import {Button, Col, Icon, Input, Modal, Table, Typography} from "antd";
import {Link} from "react-router-dom";
import Highlighter from "react-highlight-words";
import TrainingComponent from "./TrainingComponent";

export default class ETraining extends Component {
    componentDidMount() {
        this.getDesignationData()
    }

    getDesignationData = () => {
        fetch(`http://localhost:3003/api/training_list/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    tabledata: this.getformateData(data),
                    loading: false
                });
            })
    };

    getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            mydata.push({
                key: d.training_id,
                Name: d.train_name.substring(0, 10),
                Description: d.train_description,
                Start: d.train_start_date.substring(0, 10),
                End: d.train_end_date.substring(0, 10),
                Location: d.train_location_name,
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
            title: 'Name',
            dataIndex: 'Name',
            ...this.getColumnSearchProps('Name'),

        },
        {
            title: 'Description',
            dataIndex: 'Description',
            ...this.getColumnSearchProps('Description'),

        },
        {
            title: 'Start',
            dataIndex: 'Start',
            ...this.getColumnSearchProps('Start'),

        },
        {
            title: 'End',
            dataIndex: 'End',
            ...this.getColumnSearchProps('End'),

        },
        {
            title: 'Location',
            dataIndex: 'Location',
            ...this.getColumnSearchProps('department_location'),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>

                        <Link onClick={() => {
                            this.setState({
                                visible_showpromoteModal: true,
                                key: record.key
                            });
                        }}>
                          Edit
                      </Link>
                    </span>
            ),

        },
    ];

    render() {
        const {Text} = Typography;
        const {data} = this.props;

        return (
            <>
                {(!this.state.loading) &&
                <>
                    <Col className='p-5'>
                        <Button type="primary" size='large' onClick={this.showpromoteModal}>
                            Add Employee Training
                        </Button>

                        <div className='pt-3'>
                            <Table columns={this.columns} dataSource={this.state.tabledata} pagination={false}/>
                        </div>

                        <Modal
                            title="Promote Employee"
                            visible={this.state.visible_showpromoteModal}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" type="danger" onClick={this.handleOk}>
                                    close
                                </Button>
                            ]}>

                            <TrainingComponent hideHandler={this.hideHandler} id={this.props.id}
                                                data={this.state.tabledata}/>

                        </Modal>
                    </Col>

                </>
                }
            </>
        );
    }
}
