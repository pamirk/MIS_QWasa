import React, {Fragment} from "react";
import {Button, Upload} from "antd";


export default class Avatar extends React.Component {
    state = {
        loading: false,
    };

    handleChange = info => {

    };

    render() {

        return (
            <>
                <Fragment>
                    <div className='avatar_title'>Profile Photo</div>
                    <div className='avatar'><img src={this.props.avatar} alt="avatar"/></div>
                    <Upload fileList={[]}>
                        <div className='button_view'><Button icon="upload">Change avatar</Button></div>
                    </Upload>
                </Fragment>
            </>
        );
    }
}
