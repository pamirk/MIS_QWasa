import React from 'react';
import moment from 'moment';
import departments from './departments'
import {Card, Col, Row, Tag} from "antd";
import Container from "reactstrap/es/Container";
const { Meta } = Card;

const ComplaintSummary = ({complaint}) => {
  /*  var department = departments.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(complaint.department)
        );
    });
    if(department.length < 1){
        department = [{name: 'No Department'}]
    }*/

    var department = "No Department";
    var status = 'Pending';
    if(false){
        status = complaint.status === 0 ?
                    <span className="new badge blue" data-badge-caption="">Pending</span> :
                    complaint.status === 1 ?
                    <span className="new badge" data-badge-caption="">Resolved</span> :
                    <span className="new badge red" data-badge-caption="">Rejected</span>;
    }
    return (
            <Container>
                <Card title={"Account Number: "+ complaint.account_number} style={{ width: 300, marginTop: 16 }}>
                    <Row>
                        <Col sm={20}>
                            <Meta description={complaint.complain_body}/>
                        </Col>
                        <Col sm={4}>
                            <Tag>{status}</Tag>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                    <br/>
                    <Row>
                        <Col sm={18}>
                            <Tag>No Department</Tag>
                        </Col>
                        <Col sm={6}>
                            <Tag>{complaint.created_us.substring(0,10)}</Tag>
                        </Col>

                    </Row>
                </Card>
            </Container>
    );
}

export default ComplaintSummary;
