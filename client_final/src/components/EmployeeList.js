import React, {Component} from 'react';
import {Container} from 'reactstrap';
import EmployeeTable from "../Account/components/EmployeeTable";

export default class EmployeeList extends Component {

    componentDidMount() {
        this.getData();
    }

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true
        };
    }

    getData = () => {
        fetch('http://localhost:3003/api/employee_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);
                this.setState({
                    data: data,
                    loading: false
                });
            })
    };
    handleEmployeeClicked = (index) => {


        console.log(index);
        this.setState(() => {
            return {};
        });
    };

    performSearch = (query) => {
        let url = `search?search=${query}`;

        fetch(`http://localhost:3003/api/${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({
                    data: data,
                    loading: false
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    };

    render() {
        return (
            <>
                <Container>
                    {/*<SearchForm onSearch={this.performSearch}/>*/}

                    {(this.state.loading) ? "" :
                        <EmployeeTable data={this.state.data} history={this.props.history} />
                    }
                    {/*{(this.state.loading) ? "" :
                        <EMenuList handleEmployeeClicked={this.handleEmployeeClicked} data={this.state.data}
                                   history={this.props.history}/>}*/}
                </Container>

            </>
        );
    }
}
