import React, { Component, Fragment } from 'react';

import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
    strong: (
        <span className="strong">Strong</span>
    ),
    medium: (
        <span className="medium">Medium</span>
    ),
    weak: (
        <span className="weak">
      Weak
    </span>
    ),
};

class SecurityView extends Component {
    getData = () => [
        {
            title: "password",
            description: (
                <Fragment>
                    "password-description"：
                    {passwordStrength.strong}
                </Fragment>
            ),
            actions: [
                <a key="Modify">Modify</a>,
            ],
        },
        {
            title: "phone",
            description: `phone-description：138****8293`,
            actions: [
                <a key="Modify">Modify</a>,
            ],
        },
        {
            title: "question",
            description: "question-description",
            actions: [
                <a key="Set">Set</a>,
            ],
        },
        {
            title: "email",
            description: `email-description ：ant***sign.com`,
            actions: [
                <a key="Modify">Modify</a>,
            ],
        },
        {
            title: "mfa",
            description: "mfa-description",
            actions: [
                <a key="bind">Bind</a>,
            ],
        },
    ];

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

export default SecurityView;
