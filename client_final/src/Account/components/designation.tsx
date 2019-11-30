import {Button, Form, Input, message, Select, Upload} from 'antd';
import React, {Component, Fragment} from 'react';
import './base.css';
import axios from "axios";
import Util from "../../components/Util";

const FormItem = Form.Item;
const {Option} = Select;

type MyProps = {hideHandler: any,  id: any, data: any, form: any };
type MyState = { divisions: any, loading: Boolean, fimage: string, image: any, departs: any, designationsItems:any, selectedDepartemnt: any };

class designation extends Component<MyProps, MyState> {
    view: HTMLDivElement | undefined = undefined;
    private menu: HTMLSelectElement | null;
    private Des_menu: any;

    constructor(props: any) {
        super(props);
        this.menu = null;
        this.Des_menu = null;
        this.state = {
            loading: true,
            fimage: '',
            image: null,
            divisions: null,
            designationsItems: null,
            selectedDepartemnt: null,
            departs: null

        };
    }

    componentDidMount() {
        this.setBaseInfo();
        this.getDepartmentList();

    }

    setBaseInfo = () => {
        const {data, form} = this.props;
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                // @ts-ignore
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };

    getViewDom = (ref: HTMLDivElement) => {
        this.view = ref;
    };

    handlerSubmit = (event: React.MouseEvent) => {
        message.success("update.success");
        message.success("update.success");
        event.preventDefault();
        const {form} = this.props;
        form.validateFields((err: any) => {
            if (err) {
                message.success("Error");
                return
            }
            this.getDataOutofForm()
        });


    };

    getDataOutofForm = () => {
        const {form} = this.props;
        console.log(form.getFieldsValue());

        const fd = new FormData();
        fd.append("employee_id", this.props.id);
        fd.append('des_id', this.Des_menu.value);

        Object.keys(form.getFieldsValue()).forEach((value, key, data) => {

            console.log(value, form.getFieldValue(value));
            fd.append(value, form.getFieldValue(value));
        });
        axios.post('http://localhost:3003/api/employee_designation_update', fd)
            .then(d => {
                if (d.status === 200) {
                    this.props.hideHandler()
                }
            })

    };

    getDepartmentList = () => {
        let items: any[] = [];
        fetch('http://localhost:3003/api/department_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const department = data[i - 1];
                    items.push(
                        <option value={department.department_id}>{department.department_name}</option>)
                }

                this.setState({
                    divisions: items
                });
            })


    };
    getDesignationsList = (id:any) => {
        let items: any[] = [];
        fetch(`http://localhost:3003/api/designation_list/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const designation = data[i - 1];
                    items.push(
                        <option value={designation.des_id}>{designation.des_title}</option>)
                }

                this.setState({
                    designationsItems: items
                });
            })


    };


    onDepartmentMenuChange = (e:any) => {
        this.setState({
            selectedDepartemnt: e.target.value,
        });

        this.getDesignationsList(e.target.value);
        console.log(" Lo G : " + e.target.value);

    };

    render() {
        const {form: {getFieldDecorator},} = this.props;
        return (
            <div className='baseView' ref={this.getViewDom}>

                <div className='left'>
                    <Form layout="vertical">
                        <FormItem label="Designation Order Date">{
                            getFieldDecorator('emp_des_order_date', {
                                rules: [{required: true, message: "Please Provide Your Date of Designation"}]
                            })(<Input type="date" name="appointment_date "
                                      id="appointment_date"
                                      placeholder="Provide your Date of Appointment"/>)}
                        </FormItem>

                        <FormItem label="Designation Appointment Date">{
                            getFieldDecorator('emp_des_appointment_date', {
                                rules: [{required: true, message: "Please Provide Designation date"}]
                            })(<Input type="date" name="appointment_date "
                                      id="appointment_date"
                                      placeholder="Provide your Date of Appointment"/>)}
                        </FormItem>

                        {/*   <FormItem label="Status">{
                            getFieldDecorator('emp_des_is_active', {
                                rules: [{required: false, message: "typo"}]
                            })(
                                <Select defaultValue="0">
                                    <Option value="1">Active</Option>
                                    <Option value="0">Not Active</Option>
                                </Select>
                            )}
                        </FormItem>*/}

                        <FormItem label="Department Name">{
                            getFieldDecorator('department_name', {
                                rules: [{required: true, message: "Please Provide Department Name"}]
                            })(
                                <select id="department_name"
                                        onChange={this.onDepartmentMenuChange}
                                        ref={(input) => this.menu = input}>
                                    <option value="N/A">Select Department</option>
                                    {this.state.departs}

                                </select>
                            )}
                        </FormItem>

                        <FormItem label="Designation Title">{
                            getFieldDecorator('des_title', {
                                rules: [{required: true, message: "Please Provide Designation Title"}]
                            })(
                                <select id="designation_scale"
                                        ref={(input) => this.Des_menu = input}>
                                    <option value="N/A">Select Department</option>
                                    {this.state.designationsItems}
                                </select>
                            )}
                        </FormItem>

                        <Button type="primary" onClick={this.handlerSubmit}>Update Information</Button>
                    </Form>
                </div>

            </div>
        );
    }
}


export default Form.create<any>()(designation);
