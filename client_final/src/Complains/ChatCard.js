import React from 'react';
import {Card, Divider} from "antd";
import moment from "moment";
import {Link} from "react-router-dom";
import {Container} from "reactstrap";

export default class ChatCard extends React.Component {

    headerStyle = {
        fontSize: 14,
        lineHeight: '1.43em',
        minHeight: '1.43em',
        color: "white",
        background: '#007aff',
        justifyContent: 'space-between',
        borderRadius: '8px 8px 0px 0px'
    };
    bodyStyle = {
        fontSize: 15, fontStyle: 'normal', lineHeight: 1.33, overflowWrap: 'Break-word', color: "#424d57"
        , padding: "12px", borderWidth: "0px 1px 1px", borderStyle: 'solid', borderColor: "#dde2e6",
        borderImage: 'initial', borderRadius: "0px 0px 8px 8px", overflow: 'auto'
    };
    render() {
        const {user_name, created_at, complain_body} = this.props
        return (
            <>
                <Card title={user_name} headStyle={this.headerStyle} bodyStyle={this.bodyStyle}
                      extra={<span style={{color: 'white'}}>about {moment(created_at).fromNow()}</span>}
                      style={{borderRadius: 8, marginTop: 16}}>
                    {complain_body}
                    <Divider/>
                    {/*Attachments:
                    <ul style={{listStyle: 'inside', margin: '10px 25px'}}>
                        <ul><Link to={'/'}>2019-09-25.jpg</Link></ul>
                    </ul>*/}
                </Card>
            </>
        );
    }
}
