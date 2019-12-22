import React from 'react';
import ComplaintSummary from './ComplaintSummary';
import {Link} from 'react-router-dom'
import {render} from "react-dom";
import {Button, Divider, Icon, Input, Table, Tag, Tooltip} from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";
import Statuses from '../status'


export default class ComplaintList extends React.Component {

    statusColorsMap = {
        'REGISTERED': "#425A70",
        'INITIATED': "#108ee9",
        'IN PROCESS': "#084B8A",
        'RESOLVED': "#47B881",
    };

    constructor(props) {

        super(props);
        let mydata = [];
        for (let i = 0; i < this.props.complaints.length; i++) {
            const complain = this.props.complaints[i];
            mydata.push({
                key: complain.complain_id,
                Customer: <Link to={'/complaint/' + complain.complain_id} key={complain.complain_id}>
                    {complain.user_name}</Link>,
                Account_Number: complain.account_number,
                Complaint: complain.complain_body,
                Status: [complain.status],
                Last_Activity: (complain.forwards_date) ?  moment(complain.forwards_date).from() : moment(complain.created_us).from(),
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
                ellipsis: true,
                title: 'Customer',
                dataIndex: 'Customer',
                key: 'Customer',
                width: '15%',
            },
            {
                title: 'Account Number',
                dataIndex: 'Account_Number',
                ellipsis: true,
                key: 'Account_Number',
                width: '15%',
                ...this.getColumnSearchProps('Account_Number'),
            },
            {
                ellipsis: true,
                title: 'Complaint body',
                dataIndex: 'Complaint',
                key: 'Complaint',
                width: '25%',
                ...this.getColumnSearchProps('Complaint'),
            },
            {
                ellipsis: true,
                title: 'Status',
                dataIndex: 'Status',
                key: 'Status',
                width: '10%',
                render: (text, record) => (
                    <span>
                      {record.Status.map(tag => (
                          <Tag color={this.statusColorsMap[tag]} key={tag}>
                              {tag}
                          </Tag>
                      ))}
                     </span>
                ),
            },
            {
                ellipsis: true,
                title: 'Last Activity',
                dataIndex: 'Last_Activity',
                key: 'Last_Activity',
                width: '14%',
                ...this.getColumnSearchProps('Last_Activity'),
            }

        ];
        return (
            <>
                <Table style={{backgroundColor: "white"}} loading={this.state.loading} columns={columns} dataSource={this.state.data}/>

                {/*   {(this.state.loading) ? "" :
                }*/}

                {/* { complaints && complaints.map(complaint => {
                    return (
                        <Link to={'/complaint/' + complaint.complain_id} key = {complaint.complain_id}>
                            <ComplaintSummary complaint={complaint}  />
                        </Link>
                    )
                })}*/}
            </>
        );
    }
}

