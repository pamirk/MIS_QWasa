import React from 'react';
import {Avatar, Card, Divider, Modal} from "antd";
import moment from "moment";
import config from '../config'

export default class ChatCard extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
    };
    handleCancel = () => this.setState({previewVisible: false});
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
                    <span className="css-1trnuga">
                            {(forwards_by_name && forwards_to_name)
                                ? <>{forwards_by_name} assigned Complaint to <strong>{forwards_to_name}</strong></>
                                : ''}<br/>
                        {(status)
                            ? <>{forwards_by_name} changed complaint status to <strong> {status} </strong></>
                            : ""}
                        </span>


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
