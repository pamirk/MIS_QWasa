import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';

const {Option} = Select;

export default class UserRemoteSelect extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    state = {
        data: [],
        value: [],
        fetching: false,
    };

    fetchUser = value => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({data: [], fetching: true});
        fetch('http://localhost:3003/api/employee_list')
            .then(response => response.json())
            .then(body => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return;
                }
                console.log(body);

                const data = body.map(user => ({
                    text: `${user.full_name}`,
                    value: user.employee_id,
                }));
                this.setState({data, fetching: false});
            });
    };

    handleChange = value => {
        console.log("handleChange called from userRemote", value);

        this.setState({
            value,
            data: [],
            fetching: false,
        }, function () {
            this.props.confirmBtnClicked(value);
        });
    };

    render() {
        const {fetching, data, value} = this.state;
        return (
            <>
                <Select
                    style={{leftPadding: '0 !important', width: '100%'}}
                    mode="multiple"
                    labelInValue
                    value={value}
                    placeholder="Select users"
                    notFoundContent={fetching ? <Spin size="small"/> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                >
                    {data.map(d => (
                        <Option key={d.value}>{d.text}</Option>
                    ))}
                </Select>
            </>


        );
    }
}
