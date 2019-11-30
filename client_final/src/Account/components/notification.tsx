import { List, Switch } from 'antd';
import React, { Component, Fragment } from 'react';


type Unpacked<T> = T extends (infer U)[] ? U : T;

class NotificationView extends Component {
    getData = () => {
        const Action = (
            <Switch
                checkedChildren="open"
                unCheckedChildren="close"
                defaultChecked
            />
        );
        return [
            {
                title: "password",
                description: "password-description",
                actions: [Action],
            },
            {
                title: "messages",
                description: "messages-description",
                actions: [Action],
            },
            {
                title: "todo",
                description: "todo-description",
                actions: [Action],
            },
        ];
    };

    render() {
        const data = this.getData();
        return (
            <Fragment>
                <List<Unpacked<typeof data>>
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item actions={item.actions}>
                            <List.Item.Meta title={item.title} description={item.description} />
                        </List.Item>
                    )}
                />
            </Fragment>
        );
    }
}

export default NotificationView;
