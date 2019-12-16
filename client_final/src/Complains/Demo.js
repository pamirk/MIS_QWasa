import React from "react";
import {Upload, Button, Icon, message} from 'antd';
import axios from "axios";
import uuidv4 from "uuid/v4";

import Util from "../components/Util";


export default class Demo extends React.Component {
    state = {
        fileList: [],
        uploading: false,
    };

    handleUpload = () => {
        const {fileList} = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        /*reqwest({
            url: 'http://localhost:3003/api/',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });*/
    };


    render() {
        const {uploading, fileList} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <div style={{paddingTop:10}}>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload"/> Select File
                    </Button>
                </Upload>
               {/* <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{marginTop: 16}}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>*/}
            </div>
        );
    }
}
