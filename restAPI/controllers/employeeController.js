const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pk',
});
exports.index = async (req, res) => {
    res.json({status: 200})
};
exports.create_employee_designation = async (req, res) => {

    console.log(req.body);
    console.log(req.file.path);

    const employeeValues = [req.body.employee_id, req.body.des_id,
        req.body.designation_order_date, req.body.des_appointment_date, req.file.path];

    const querySting = "insert into employees_designations(employee_id, des_id, order_date, appointment_date, order_letter_photo) values (?, ?, ?, ?, ?);";

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("inside create_employee_designation");
        if (err) {
            console.log("500");
            res.json({status: 500, err: err.sqlMessage});
            return
        }

        const eemployeesDesignations_id = rows.insertId;
        res.json({status: 200, eemployeesDesignations_id})
    });
};
exports.complain_register = async (req, res) => {
    const Values = [
        req.body.complain_id,
        req.body.account_number,
        req.body.complain_body,
        req.body.complain_status,
    ];
    console.log(Values);
    const querySting = "insert into consumer_complains_table(complain_id, account_number, complain_body, complain_status) values (?, ?, ?, ?);";
    connection.query(querySting, Values, (err, rows, fields) => {
        console.log("inside complain_register");
        if (err) {
            console.log("500", err);
            res.json({status: 500, err: err.sqlMessage});
            return
        }
        console.log("200");
        res.json({status: 200})
    });
};
exports.one_complain_register_Attachment = async (req, res) => {
    console.log(req.body);
    const Values = [
        req.body.attachment_id,
        req.body.complain_id,
        req.file.path,
        req.body.attachment_file_type
    ];

    console.log(Values);
    const querySting = "insert into consumer_attachment(attachment_id, complain_id, attachment_name, attachment_file_type)" +
        " values (?, ?, ?, ?);";
    connection.query(querySting, Values, (err, rows, fields) => {
        console.log("inside complain_register_Attachment");
        if (err) {
            console.log("500");
            res.json({status: 500, err: err.sqlMessage});
            return
        }
        console.log("200");
        res.json({status: 200})
    });
};
exports.employee_designation_details = async (req, res) => {
    console.log(req.params.id);

    const querySting = "SELECT emp_des.emp_des_id, emp_des.order_date         AS emp_des_order_date,\n" +
        "       emp_des.appointment_date   AS emp_des_appointment_date,\n" +
        "       emp_des.order_letter_photo AS emp_des_order_letter_photo,\n" +
        "       emp_des.is_active          AS emp_des_is_active,\n" +
        "       des.des_title,\n" +
        "       des.des_scale,\n" +
        "       depart.department_name,\n" +
        "       depart.department_description,\n" +
        "       depart.department_city_name\n" +
        "FROM employees_designations AS emp_des\n" +
        "         INNER JOIN designations AS des ON emp_des.des_id = des.des_id\n" +
        "         INNER JOIN department AS depart ON des.department_id = depart.department_id\n" +
        "where emp_des.employee_id = ? order by emp_des.is_active DESC,  emp_des.appointment_date DESC ;";
    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log(" inside employee_designation_details");
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};

exports.training_list = async (req, res) => {
    console.log(req.params.id);

    const querySting = `SELECT * from employees_trainings where employee_id = ${req.params.id} order by train_start_date DESC ;`;
    connection.query(querySting, (err, rows, fields) => {
        console.log(" inside training_list");
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};
exports.employee_transfer_details = async (req, res) => {
    console.log(req.params.id);

    const querySting = `SELECT * from transfers where employee_id = ${req.params.id} order by joining_date, is_active DESC ;`;
    connection.query(querySting, (err, rows, fields) => {
        console.log(" inside training_list");
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};

exports.create = async (req, res) => {
    console.log(req.body);
    console.log(req.file.path);

    const employee = req.body;
    const employeeValues = [employee.cnic, employee.fullname, employee.fathername,
        employee.appointment_date, employee.birth_date, employee.gender,
        employee.email, employee.local, req.file.path];

    const querySting = "insert into employees(cnic, full_name, father_name, appointment_date, birth_date, gender, email, local, employee_photo) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("i think we did createEmployee");
        if (err) {
            console.log("500");
            res.json({status: 500, err: err.sqlMessage});

            return
        }

        const employee_id = rows.insertId;
        res.json({status: 200, employee_id})
    });


};
exports.employee_create_address = async (req, res) => {
    const addressvalues = [
        req.body.current_address,
        req.body.permanent_address,
        req.body.postal_code,
        req.body.phone_number,
        req.body.phone_number2,
        req.body.employee_id,
        1
    ];
    console.log(addressvalues);
    //employee_id, current_address, permanent_address, postal_code, phone_number, phone_number2, city_id
    const queryAddress = "insert into addresses(current_address, permanent_address, postal_code, phone_number, phone_number2, employee_id, city_id) values (?, ?, ?, ?, ?, ?, ?);";

    connection.query(queryAddress, addressvalues, (err, rows, fields) => {
        console.log("inside employee_create_address");
        console.log("rows: " + rows + "err" + err);
        if (err) {
            res.json({status: 500, err: err.sqlMessage});
            return
        }
        console.log(rows[0]);

        res.json({status: 200, row: rows[0]})
    });

};
exports.show_one_employee = async (req, res) => {
    console.log(req.params.id);
    const querySting = "SELECT * FROM employees where employee_id = ?;";

    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log(" we are in designation_list_items");
        if (err) {
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};
exports.show_one_employee_address = async (req, res) => {
    console.log(req.params.id);
    const querySting = "SELECT * FROM addresses where employee_id = ?;";
    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log(" we are in designation_list_items");
        if (err) {
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};
exports.createDepartment = async (req, res) => {
    const department = req.body.department;
    const departmentValues = [department.department_name, department.department_description, department.department_city_name];

    const querySting = "insert into department(department_name, department_description, department_city_name) values (?, ?, ?);";

    connection.query(querySting, departmentValues, (err, rows, fields) => {
        console.log("inside createDepartment");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);
        res.json(rows)

    });


};
exports.create_division = async (req, res) => {
    const division = req.body.division;
    if (division.division_name && division.division_description) {
        res.json({status: 500});
        return
    }

    const divisionValues = [division.division_name, division.division_description];

    const querySting = "insert into divisions(div_title, div_description) values (?, ?);";
    console.log(divisionValues);
    connection.query(querySting, divisionValues, (err, rows, fields) => {
        console.log("inside create_division");
        if (err) {
            res.json({status: 500, err: err});
            return
        }

        console.log("create_division: Success:", rows);
        res.json({status: 200});

    });
};
exports.createDesignation = async (req, res) => {
    const designation = req.body.designation;
    const departmentValues = [designation.designation_title, designation.designation_scale, designation.department_id];

    const querySting = "insert into designations(des_title, des_scale, department_id) values (?, ?, ?);";
    connection.query(querySting, departmentValues, (err, rows, fields) => {
        console.log("i think we create it");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);

        res.json(rows)

    });


};
exports.listSearch = async (req, res) => {


    // const pagination = req.query.pagination
    //     ? parseInt(req.query.pagination) : 10;
    // const page = req.query.page ? parseInt(req.query.page) : 1;

    try {
        if (req.query.search) {
            console.log("00-   " + req.query.search);

            const search_criteria = req.query.search;
            const querySting = `SELECT * FROM employees where full_name like '%${search_criteria}%';`;

            connection.query(querySting, (err, rows, fields) => {
                console.log("i think we search_criteria it");
                if (err) {
                    res.sendStatus(500);
                    return
                }

                console.log(rows);
                res.json(rows)

            });
        } else {
            res.status(404).send({message: "nothing"})
        }
    } catch (err) {

    }
};
exports.showEmployee = async (req, res) => {
    console.log(req.params.id);
    const querySting = "SELECT emp.employee_id, emp.cnic, emp.full_name, emp.father_name, emp.appointment_date, emp.birth_date, emp.gender, emp.email, emp.local, emp.employee_photo,\n" +
        "       adrs.current_address, adrs.permanent_address, adrs.postal_code, adrs.phone_number, adrs.phone_number2,\n" +
        "       emptrain.train_name, emptrain.train_description, emptrain.train_start_date, emptrain.train_end_date, emptrain.train_location_name, emptrain.certificate_photo AS trian_certificate_photo,\n" +
        "       emp_des.order_date AS emp_des_order_date, emp_des.appointment_date AS emp_des_appointment_date, emp_des.order_letter_photo AS emp_des_order_letter_photo, emp_des.is_active emp_des_is_active,\n" +
        "       des.des_title, des.des_scale,\n" +
        "       depart.department_name, depart.department_description, depart.department_city_name\n" +
        "FROM employees AS emp\n" +
        "INNER JOIN addresses AS adrs ON emp.employee_id = adrs.employee_id\n" +
        "INNER JOIN employees_trainings AS emptrain ON emp.employee_id = emptrain.employee_id\n" +
        "INNER JOIN employees_designations AS emp_des ON emp.employee_id = emp_des.employee_id\n" +
        "INNER JOIN designations AS des ON emp_des.des_id = des.des_id\n" +
        "INNER JOIN department AS depart ON des.department_id = depart.department_id\n" +
        "where emp.employee_id = ?;";

    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log(" we are in designation_list_items");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);
        res.json(rows)

    });
};
exports.employee_list = async (req, res) => {
    console.log("responding to employee_list route");


    const querySting = "SELECT * FROM employees";

    connection.query(querySting, (err, rows, fields) => {
        console.log("i think we dit it");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);
        res.json(rows)

    });
};
exports.department_list = async (req, res) => {
    console.log("responding to department_list route");
    const querySting = "SELECT * FROM department;";

    connection.query(querySting, (err, rows, fields) => {
        console.log("i think we dit it");
        if (err) {
            res.sendStatus(500);
            return
        }
        console.log(rows);

        res.json(rows)
    });
};
exports.division_list = async (req, res) => {
    console.log("responding to division_list route");
    const querySting = "SELECT * FROM divisions;";

    connection.query(querySting, (err, rows, fields) => {
        console.log("inside division_list");
        if (err) {
            res.sendStatus(500);
            return
        }
        console.log(rows);
        res.json(rows)
    });
};
exports.designation_list = async (req, res) => {
    console.log("responding to department_list route");

    const querySting = "SELECT * FROM designations;";
    connection.query(querySting, (err, rows, fields) => {
        console.log("i think we dit it");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);
        res.json(rows)

    });
};
exports.designation_list_items = async (req, res) => {
    console.log("responding to designation_list_items route");
    console.log(req.params.id);

    const querySting = "SELECT * FROM designations where department_id = ?;";

    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log(" we are in designation_list_items");
        if (err) {
            res.sendStatus(500);
            return
        }

        console.log(rows);
        res.json(rows)

    });
};
exports.one_employee_update = async (req, res) => {
    console.log("responding to one_employee_update route");
    console.log(req.body);

    const employee = req.body;
    const {employee_id} = req.body;
    const employeeValues = [employee.cnic, employee.full_name, employee.father_name,
        employee.appointment_date, employee.birth_date, employee.gender,
        employee.email, employee.local, parseInt(employee_id)];

    const querySting = "UPDATE employees SET cnic = ?, full_name = ?, father_name = ?, appointment_date= ?, birth_date= ? , gender= ?, email= ?, local= ? where employee_id = ?;";

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("i think we did createEmployee");
        if (err) {
            console.log("500", err);
            res.json({status: 500, err: err.sqlMessage});

            return
        }
        console.log("200", rows[0]);

        res.json({status: 200, row: rows[0]})
    });

};
exports.employee_designation_update = async (req, res) => {
    console.log("responding to employee_designation_update route");
    console.log(req.body);

    const employee = req.body;
    //res.json({status: 200})

    const {employee_id} = req.body;
    const employeeValues = [employee.des_id, employee.emp_des_order_date, employee.emp_des_appointment_date];

    const querySting = `UPDATE employees_designations SET des_id = ?, order_date = ?, appointment_date = ? where employee_id = ${employee_id} AND is_active = 1;`;

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("i think we did createEmployee");
        if (err) {
            console.warn("500", err);
            res.json({status: 500, err: err.sqlMessage});
            return
        }

        console.warn("200 : employee_designation_update");
        res.json({status: 200, row: rows[0]})
    });

};
exports.employee_address_update = async (req, res) => {
    console.log("responding to employee_designation_update route");
    console.log(req.body);

    const employee = req.body;
    //res.json({status: 200})

    const {employee_id} = req.body;
    const {address_id} = req.body;
    const employeeValues = [
        employee.current_address,
        employee.permanent_address,
        employee.postal_code,
        employee.phone_number,
        employee.phone_number2,
    ];
    //res.json({status: 200});

    const querySting = `UPDATE addresses SET current_address = ?, permanent_address = ?, postal_code = ?, phone_number = ?, phone_number2 = ?  where address_id = ${address_id};`;

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("i think we did employee_address_update");
        if (err) {
            console.warn("500", err);
            res.json({status: 500, err: err.sqlMessage});
            return
        }

        console.warn("200 : employee_address_update");
        res.json({status: 200, row: rows[0]})
    });

};
//    const querySting = "select * from consumer_complains_table as comp left join consumer_attachment ca on comp.complain_id = ca.complain_id where comp.account_number = '999-888-111';";
exports.complain_list = async (req, res) => {
    console.log("responding to complain_list route");


    const querySting = "SELECT * FROM consumer_complains_table";

    connection.query(querySting, (err, rows, fields) => {
        console.log("inside complain_list");
        if (err) {
            res.json({status: 500, err: err});
            return
        }

        console.log(rows);
        res.json({status: 200, rows});
    });
};
exports.single_complain = async (req, res) => {
    console.log("inside single_complain", req.params.id);


    const querySting = "select * from consumer_complains_table as comp left join consumer_attachment ca on comp.complain_id = ca.complain_id where comp.complain_id = ?;";

    connection.query(querySting, [req.params.id], (err, rows, fields) => {
        console.log("inside complain_list");
        if (err) {
            res.json({status: 500, err: err});
            return
        }

        console.log(rows);
        res.json({status: 200, rows});
    });
};
exports.promote_emoployee = async (req, res) => {
    console.log("inside promote_emoployee");
    console.log(req.body);

    const employeeValues = [
        req.body.employee_id,
        req.body.des_id,
        req.body.emp_des_order_date,
        req.body.emp_des_appointment_date
    ];

    console.log(employeeValues);
    const update_querySting = `UPDATE employees_designations SET is_active='0' where employee_id = ${req.body.employee_id};`;

    const querySting = "insert into employees_designations(employee_id, des_id, order_date, appointment_date) values (?, ?, ?, ?);";

    connection.query(update_querySting, (err, rows, fields) => {
        console.log("inside create_employee_designation");
        if (err) {
            console.log("500", err.sqlMessage);
            res.json({status: 500, err: err.sqlMessage});
            return
        }

        connection.query(querySting, employeeValues, (err, rows, fields) => {
            console.log("inside create_employee_designation");
            if (err) {
                console.log("500", err.sqlMessage);
                res.json({status: 500, err: err.sqlMessage});
                return
            }

            const eemployeesDesignations_id = rows.insertId;
            res.json({status: 200, eemployeesDesignations_id})
        });


    });
};
exports.add_emoployee_training = async (req, res) => {
    console.log("inside promote_emoployee");
    console.log(req.body);

    const employeeValues = [
        req.body.employee_id,
        req.body.train_name,
        req.body.train_description,
        req.body.train_start_date,
        req.body.train_end_date,
        req.body.train_location_name,
    ];

    console.log(employeeValues);
    const querySting = "insert into employees_trainings(employee_id, train_name, train_description, train_start_date,train_end_date, train_location_name ) values (?, ?, ?, ?, ?, ?);";
    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("inside create_employee_designation");
        if (err) {
            console.log("500", err.sqlMessage);
            res.json({status: 500, err: err.sqlMessage});
            return
        }

        const eemployeesDesignations_id = rows.insertId;
        res.json({status: 200, eemployeesDesignations_id})
    });


};
exports.add_emoployee_transfer = async (req, res) => {
    console.log("inside add_emoployee_transfer");
    console.log(req.body);

    const employeeValues = [
        req.body.employee_id,
        req.body.Transfer_Date,
        req.body.Joining_Date,
        req.body.Description,
        req.body.Division,
        req.body.Sub_Division,
        req.body.Tubewell,
    ];
    console.log(employeeValues);

    res.json({status: 200})
    console.log(employeeValues);

    /*
        console.log(employeeValues);
        const querySting = "insert into employees_trainings(employee_id, train_name, train_description, train_start_date,train_end_date, train_location_name ) values (?, ?, ?, ?, ?, ?);";
        connection.query(querySting, employeeValues, (err, rows, fields) => {
            console.log("inside create_employee_designation");
            if (err) {
                console.log("500", err.sqlMessage);
                res.json({status: 500, err: err.sqlMessage});
                return
            }

            const eemployeesDesignations_id = rows.insertId;
            res.json({status: 200, eemployeesDesignations_id})
        });
    */


};
