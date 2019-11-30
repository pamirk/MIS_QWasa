import React from 'react';
import {Link} from 'react-router-dom'
import {Button, Result} from "antd";

const NotFound = () => (
    <Result
        status="404"
        title="404"
        subTitle="Page Not Found"
        extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
    />
);

export default NotFound;
