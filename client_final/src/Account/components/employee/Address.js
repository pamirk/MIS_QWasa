import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {Button, Icon, Modal, Table} from 'antd';
import AddressComponent from "../address";
import {Link} from "react-router-dom";


export default class Address extends Component {
    data = this.props.address_data;

    componentDidMount() {
    }

    getaddressData = () => {
        fetch(`http://localhost:3003/api/show_one_employee_address/${this.props.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                this.setState({
                    data: this.getformateData(data),
                    loading: false
                });
            })
    };

    getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const address = data[i];
            mydata.push({
                key: address.address_id,
                date: address.last_update_ts.substring(0, 10),
                address: address.current_address + "\n" + address.permanent_address + address.postal_code,
            })
        }
        return mydata
    };
    constructor(props) {
        super(props);
        this.state = {
            data: this.getformateData(this.data),
            loading: false,
            visible_showAddAddressModal: false,

        };

    }

    columns = [
        {
            title: 'Move-in Date',
            dataIndex: 'date',
        },
        {
            title: 'Home Address',
            dataIndex: 'address',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>

                        <Link onClick={() => {
                            console.log(record.key);
                            this.setState({
                                itemkey: record.key,
                                visible_showAddAddressModal: true,
                            });
                        }}>
                          Edit
                      </Link>
                    </span>
            ),

        },
    ];
    showAddAddressModal = () => {
        this.setState({
            visible_showAddAddressModal: true,
        });

    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible_showAddAddressModal: false,

        });


    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible_showAddAddressModal: false,
        });
    };

    hideHandler = () => {
        this.setState({
            visible_showAddAddressModal: false,
            loading: true,
            tabledata: null,
        });
        this.getaddressData();
    };
    render() {
        return (
            <>
                <Container>
                    {(!this.state.loading) &&
                    <>
                        <Table pagination={false} columns={this.columns} dataSource={this.state.data} size="small"/>

                        <Icon onClick={this.showAddAddressModal} type="plus-circle"/> {'  '}
                        <span className='pt-5 strong'>add address</span>

                        <Modal
                            title="Update Home Address"
                            visible={this.state.visible_showAddAddressModal}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            width={750}

                            footer={[
                                <Button key="back" type="danger" onClick={this.handleOk}>
                                    close
                                </Button>
                            ]}>
                            <p>This information is used for all HR related tasks, so please make sure it’s
                                accurate.</p>

                            <AddressComponent hideHandler={this.hideHandler} id={this.props.id} itemkey={this.state.itemkey} data={this.state.data[0]}/>


                        </Modal>
                    </>
                    }
                </Container>

            </>
        );
    }
}
