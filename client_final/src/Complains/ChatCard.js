import React from 'react';
import {Avatar, Card, Carousel, Divider, Modal, Upload} from "antd";
import moment from "moment";
import {Link} from "react-router-dom";
import {Container} from "reactstrap";
import config from '../config'

export default class ChatCard extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
    };
    handleCancel = () => this.setState({ previewVisible: false });
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

    handlePreview = async file => {
        this.setState({
            previewImage: file,
            previewVisible: true,
        });
    };

    render() {
        const {
            attachments, complaincard, user_name, created_at, complain_body, forwards_to_name, forwards_by_name,
            suggested_date_reply, status, is_public, isUser
        } = this.props;
        const {
            previewVisible, previewImage
        } = this.state;
        const imagesList = (attachments) && attachments.split(',');
        return (
            <>
                <Card title={user_name} headStyle={this.headerStyle} bodyStyle={this.bodyStyle}
                      extra={<span style={{color: 'white'}}>about {moment(created_at).fromNow()}</span>}
                      style={{borderRadius: 8, marginTop: 16}}>
                    {complain_body}
                    <Divider/>

                    {(!complaincard) &&
                    <ul style={{listStyle: 'inside', margin: '10px 25px'}}>
                        <ul>{(forwards_by_name && forwards_to_name) ? `${forwards_by_name} assigned Complaint to ${forwards_to_name}` : ''}</ul>
                        <ul>{(status) ? `${forwards_by_name} changed complaint status to ${status}` : ""}</ul>
                    </ul>
                    }


                    {(imagesList && imagesList.length > 0) &&
                       <>
                           <Divider/>

                           {imagesList.map(v => (
                               <span onClick={() => this.handlePreview(config.hostUrl + `${v}`)}>
                                 <Avatar src={config.hostUrl + `${v}`}
                                         className='ml-2'
                                         shape="square"
                                         size={140}
                                         icon="user"/>
                             </span>
                           ))
                           }
                       </>
                    }


                </Card>

                <Modal
                    visible={previewVisible}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>

            </>
        );
    }
}
