import React, {Component} from "react";
import {Button, Divider, Icon, Input, Table} from 'antd';
import Highlighter from 'react-highlight-words';
import {Jumbotron} from "reactstrap";
import {Link} from "react-router-dom";


export default class EmployeeTable extends Component {
    data = this.props.data;

    componentDidMount() {}

    constructor(props) {
        super(props);
        let mydata = [];
        for (let i = 0; i < this.data.length; i++) {
            const employee = this.data[i];
            mydata.push({
                key: employee.employee_id,
                name: employee.full_name,
                fathername: employee.father_name,
                email: employee.email,
                cnic: employee.cnic,
                local: employee.local,
                birth_date: employee.birth_date.substring(0, 10),
            })
        }
        this.state = {
            data: mydata,
            loading: false
        };
    }


    state = {
        searchText: '',
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

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Father Name',
                dataIndex: 'fathername',
                key: 'fathername',
                width: '15%',
                ...this.getColumnSearchProps('fathername'),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: '20%',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: 'CNIC',
                dataIndex: 'cnic',
                key: 'cnic',
                width: '13%',
                ...this.getColumnSearchProps('cnic'),
            },
            {
                title: 'Local',
                dataIndex: 'local',
                key: 'local',
                width: '10%',
                ...this.getColumnSearchProps('local'),
            },
            {
                title: 'Birth Date',
                dataIndex: 'birth_date',
                key: 'birth_date',
                width: '10%',
                ...this.getColumnSearchProps('birth_date'),
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <span>
                       <Link onClick={() => {this.props.history.push(`employee/${record.key}`)}}>
                          View
                      </Link>

                      <Divider type="vertical"/>
                      <Link onClick={() => {this.props.history.push(`employee_report/${record.key}`)}}>
                          Report
                      </Link>

                      <Divider type="vertical"/>
                      <Link onClick={() => {this.props.history.push(`permissions/${record.key}`)}}>
                          Permissions
                      </Link>

                    </span>
                )
            }

        ];

        return (

            <>
                <Jumbotron>
                    <h6 className="display-4">List of All Employees</h6>
                </Jumbotron>

                {(this.state.loading) ? "" :
                    <Table columns={columns} dataSource={this.state.data}/>
                }
            </>
        );
    }
}
