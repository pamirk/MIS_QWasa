const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
var fs = require('fs');
var upload = multer()


const app = express();
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.64.2',
    user: 'root',
    password: 'root',
    database: 'complaints_db'
});


app.get('/api/get_employee', (req, res) => {
    // var query = 'SELECT * FROM employees_designations INNER JOIN employees ON employees_designations.employee_id = employees.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id';
    var query = 'SELECT * FROM employees LEFT JOIN employees_designations ON employees_designations.employee_id = employees.employee_id LEFT JOIN designations ON employees_designations.des_id = designations.des_id LEFT JOIN department ON designations.department_id = department.department_id ORDER BY `employees`.`employee_id` ASC'
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.get('/api/get_department', (req, res) => {
    var query = "SELECT * FROM department";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.get('/api/get_designations', (req, res) => {
    var query = "SELECT * FROM designations";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.get('/api/get_november_complains', (req, res) => {
    var query = `SELECT *
                 FROM consumer_complains_table
                 WHERE (created_us BETWEEN '2019-11-1 00:00:00' AND '2019-11-31 23:59:00')`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.get('/api/get_december_complains', (req, res) => {
    var query = `SELECT *
                 FROM consumer_complains_table
                 WHERE (created_us BETWEEN '2019-12-1 00:00:00' AND '2019-12-31 23:59:00')`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/api/get_october_complains', (req, res) => {
    var query = `SELECT *
                 FROM consumer_complains_table
                 WHERE (created_us BETWEEN '2019-10-1 00:00:00' AND '2019-10-31 23:59:00')`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.get('/api/all_complains', (req, res) => {
    connection.query("SELECT * FROM consumer_complains_table ORDER BY created_us DESC  ", function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.get('/api/login', (req, res) => {
    connection.query("SELECT * from user_registration_table", function (error, results, fields) {
        if (error) throw error;
        res.send(results);

    })
})


app.get('/api/employee_registration', (req, res) => {
    connection.query("SELECT * FROM employees", function (error, results, fields) {
        if (error) throw error;
        res.send(results);

    })
})


app.post('/api/get_single_employee', (req, res, next) => {
    var des_id = req.body.des_id;
    // var query = `SELECT * FROM employees_designations INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id INNER JOIN employees ON employees_designations.employee_id = employees.employee_id WHERE designations.des_id like '${des_id}'`
    var query = `SELECT * FROM employees_designations INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id INNER JOIN employees ON employees_designations.employee_id = employees.employee_id WHERE employees.employee_id like '${des_id}'`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post('/api/get_forwards_complains', (req, res, next) => {
    var des_id = req.body.des_id;
    // var query = `SELECT * FROM complains_reporting_body INNER JOIN consumer_complains_table ON complains_reporting_body.complain_id = consumer_complains_table.complain_id WHERE complains_reporting_body.forwards_to = '${des_id}' GROUP BY complains_reporting_body.complain_id`;
    var query = `SELECT * FROM complains_reporting_body INNER JOIN consumer_complains_table ON complains_reporting_body.complain_id = consumer_complains_table.complain_id WHERE complains_reporting_body.forwards_to = '${des_id}' AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED' GROUP BY complains_reporting_body.complain_id`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.post('/api/get_forwards', (req, res, next) => {
    var des_id = req.body.des_id;
    // var query = `SELECT COUNT(*) AS forward FROM complains_reporting_body WHERE complains_reporting_body.forwards_to = '${des_id}'`;
    var query = `SELECT COUNT(*) AS forward FROM complains_reporting_body INNER JOIN consumer_complains_table 
                ON complains_reporting_body.complain_id = consumer_complains_table.complain_id WHERE complains_reporting_body.forwards_to = '${des_id}' 
                AND consumer_complains_table.complain_status NOT LIKE 'RESOLVED'`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results[0]);
    })
})

app.post("/api/update_is_seen", function (req, res, next) {
    var reporting_id = req.body.reporting_id;
    var query = `UPDATE complains_reporting_body SET is_seen = 1 WHERE complains_reporting_body.complains_reporting_id like '${reporting_id}'`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.post("/api/update_is_acknowledged", function (req, res, next) {
    var reporting_id = req.body.reporting_id;
    var query = `UPDATE complains_reporting_body SET is_acknowledged = 1 WHERE complains_reporting_body.complains_reporting_id like '${reporting_id}'`
    connection.query(query, function (error, results, fields) {
        if (error) throw console.log(error);
        res.send(results);
    })
})

app.post("/api/single_complain_detail", function (req, res, next) {
    var complain_id = req.body.complain_id;
    var query = `SELECT * FROM consumer_complains_table LEFT JOIN consumer_attachment ON consumer_complains_table.complain_id = consumer_attachment.complain_id WHERE consumer_complains_table.complain_id LIKE '${complain_id}' UNION SELECT * FROM consumer_complains_table RIGHT JOIN consumer_attachment ON consumer_complains_table.complain_id = consumer_attachment.complain_id WHERE consumer_complains_table.complain_id LIKE '${complain_id}'`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post("/api/update_status", function (req, res, next) {
    var success = {
        "success": "Your reporting forwarded succesfull"
    }
    var complain_id = req.body.complain_id;
    var status = req.body.status;
    var query = `UPDATE consumer_complains_table SET complain_status = '${status}' where complain_id like '${complain_id}'`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(success);
    })
})


app.post("/api/get_filter_single_complains_forwarding", function (req, res, next) {
    var complain_id = req.body.complain_id;
    var des_id = req.body.des_id;
    // var query = `SELECT * FROM complains_reporting_body LEFT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' AND complains_reporting_body.forwards_to like '${des_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' AND complains_reporting_body.forwards_to like '${des_id}' ORDER BY forwards_date DESC`
    var query = `SELECT * FROM complains_reporting_body LEFT JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id LEFT JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id LIKE '${complain_id}' AND forwards_to like '${des_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id RIGHT JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id LIKE '${complain_id}' AND forwards_to like '${des_id}' ORDER BY forwards_date DESC`;
    // var query  = `SELECT * FROM complains_reporting_body LEFT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' ORDER BY forwards_date DESC`
    // var query = `SELECT * FROM reporting_attachments LEFT JOIN complains_reporting_body ON reporting_attachments.complains_reporting_id = complains_reporting_body.complains_reporting_id UNION SELECT * FROM reporting_attachments RIGHT JOIN complains_reporting_body ON reporting_attachments.complains_reporting_id = complains_reporting_body.complains_reporting_id`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.post("/api/get_single_complains_forwarding", function (req, res, next) {
    var complain_id = req.body.complain_id;
    var queryForwardBy = `SELECT *
                          FROM complains_reporting_body
                                   INNER JOIN employees_designations ON complains_reporting_body.forwards_by =
                                                                        employees_designations.employee_id
                                   INNER JOIN employees ON employees_designations.employee_id = employees.employee_id
                                   INNER JOIN designations ON employees_designations.des_id = designations.des_id
                          WHERE complain_id like '260a6a09-4b36-4913-952c-3b72e73171f5'`

    var query = `SELECT * FROM complains_reporting_body LEFT JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id LEFT JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id LIKE '${complain_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id RIGHT JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id LIKE '${complain_id}' ORDER BY forwards_date DESC`
    // var query = `SELECT * FROM reporting_attachments LEFT JOIN complains_reporting_body ON reporting_attachments.complains_reporting_id = complains_reporting_body.complains_reporting_id UNION SELECT * FROM reporting_attachments RIGHT JOIN complains_reporting_body ON reporting_attachments.complains_reporting_id = complains_reporting_body.complains_reporting_id`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})

app.post("/api/get_forward_by", function (req, res, next) {
    var complain_id = req.body.complain_id;
    var queryForwardBy = `SELECT * FROM complains_reporting_body INNER JOIN employees_designations ON complains_reporting_body.forwards_by = employees_designations.employee_id INNER JOIN employees ON employees_designations.employee_id = employees.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id like '${complain_id}'`
    connection.query(queryForwardBy, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post("/api/get_forward_to", function (req, res, next) {
    var complain_id = req.body.complain_id;
    var qyeruForwardTo = `SELECT * FROM complains_reporting_body INNER JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id INNER JOIN employees ON employees_designations.employee_id = employees.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id WHERE complain_id like '${complain_id}'`
    connection.query(qyeruForwardTo, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post("/api/get_sorted_complains_against_date_and_status", function (req, res, next) {
    var date_to, date_from, status;
    date_to = req.body.date_to;
    date_from = req.body.date_from;
    status = req.body.status;
    var query;
    if (status === 'ALL') {
        query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN '${date_to} 00:00:00' AND '${date_from} 23:59:00' AND consumer_complains_table.complain_status like '%' ORDER BY created_us DESC`;
    } else {
        query = `SELECT * FROM consumer_complains_table WHERE consumer_complains_table.created_us BETWEEN '${date_to} 00:00:00' AND '${date_from} 23:59:00' AND consumer_complains_table.complain_status like '${status}' ORDER BY created_us DESC`;
    }
    console.log(query);
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})
// get_filter_single_complains_forwarding


app.post("/api/get_total_coplains_by_department", function (req, res, next) {
    var department_name = req.body.department_name;
    var query = `SELECT * FROM consumer_complains_table inner join complains_reporting_body ON consumer_complains_table.complain_id = complains_reporting_body.complain_id INNER JOIN employees_designations ON complains_reporting_body.forwards_to = employees_designations.employee_id INNER JOIN designations ON employees_designations.des_id = designations.des_id INNER JOIN department ON designations.department_id = department.department_id WHERE department.department_name = '${department_name}' GROUP BY consumer_complains_table.complain_id`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post("/api/get_single_complains_forwarding_with_attachment", function (req, res, next) {
    var complain_id = req.body.complain_id;
    console.log(complain_id);
    // var query  = `SELECT * FROM complains_reporting_body LEFT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN designations ON complains_reporting_body.forwards_to = designations.des_id WHERE complain_id LIKE '${complain_id}' ORDER BY forwards_date DESC`
    var query = `SELECT * FROM complains_reporting_body LEFT JOIN reporting_attachments ON complains_reporting_body.complains_reporting_id = reporting_attachments.complains_reporting_id WHERE complains_reporting_body.complains_reporting_id LIKE '${complain_id}' UNION SELECT * FROM complains_reporting_body RIGHT JOIN reporting_attachments ON complains_reporting_body.complains_reporting_id = reporting_attachments.complains_reporting_id WHERE complains_reporting_body.complains_reporting_id LIKE '${complain_id}'`
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    })
})


app.post("/api/complains", upload.none(), function (req, res, next) {
    var account_number, complain_id, complain_body, complains_status;
    account_number = req.body.account_number;
    complain_id = req.body.complain_id;
    complains_status = req.body.complain_status;
    complain_body = req.body.complain_body;
    // res.send(complain_id)
    console.log(account_number)
    console.log(complain_id)
    console.log(complain_body)
    console.log(complains_status)


    var new_id = 'new_complain_reporting' + Date.now();
    var success = {
        "success": "Your complain registered succesfull"
    }

    var queryReport = `INSERT INTO complains_reporting_body VALUES('${new_id}', '${complain_id}', '50',  '50', NOW(), 'NEW COMPLAIN', 'NOT DECIDED', 'admin', 0, 'REGISTERED', 1, 0, 0, 1)`;
    var query = `INSERT INTO consumer_complains_table VALUES('${complain_id}', '${account_number}', '${complain_body}', '${complains_status}',  NOW(), 0)`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(success);
    })
    connection.query(queryReport, function (error, results, fields) {
        if (error) throw error;
        console.log("Report submited to admin");
    })
})

app.post("/api/reporting_complains", upload.none(), function (req, res, next) {
    var complains_reporting_id, complain_id, reporting_id, forwards_to, forwards_by, forwards_message,
        suggested_date_reply, emp_name, is_reply, status, is_current;
    complains_reporting_id = req.body.complains_reporting_id;
    complain_id = req.body.complain_id;
    reporting_id = req.body.reporting_id;
    forwards_to = req.body.forwards_to;
    forwards_by = req.body.forwards_by;
    forwards_message = req.body.forwards_message;
    suggested_date_reply = req.body.suggested_date_reply;
    emp_name = req.body.emp_name;
    var is_reply = req.body.is_reply;
    var is_seen = req.body.is_seen;
    var is_acknowledged = req.body.is_acknowledged;
    var is_public = req.body.is_public;


    status = req.body.status;
    is_current = req.body.is_current;
    console.log(is_current);
    console.log(is_reply);
    console.log(reporting_id);

    console.log(is_acknowledged);
    console.log(is_public);


    if (reporting_id === "new") {
        console.log("new executes")
        var query = `INSERT INTO complains_reporting_body VALUES('${complains_reporting_id}', 
                                            '${complain_id}', '${forwards_to}', '${forwards_by}', NOW(), 
                                            '${forwards_message}', '${suggested_date_reply}', '${emp_name}', '${is_reply}', '${status}', ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public})`;
        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send(success);
        })
    } else {
        var queryCheck = `SELECT COUNT(*) FROM complains_reporting_body WHERE complain_id like '${complain_id}'`;
        connection.query(queryCheck, function (error, results, fields) {
            if (error) throw error;
            if (results > 1) {
                var queryUpdate = `UPDATE complains_reporting_body SET is_current = 0 
WHERE complains_reporting_id like ${reporting_id}`;
                connection.query(queryUpdate, function (error, results, fields) {
                    if (error) throw error;
                    console.log(success);
                })
                var query = `INSERT INTO complains_reporting_body VALUES('${complains_reporting_id}', '${complain_id}', '${forwards_to}', '${forwards_by}', NOW(), '${forwards_message}', '${suggested_date_reply}', '${emp_name}', ${is_reply}, '${status}', ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public})`;
                connection.query(query, function (error, results, fields) {
                    if (error) throw error;
                    res.send(success);
                })
            } else {
                var statusUpdateQuery = `UPDATE consumer_complains_table SET complain_status = 'INITIATED' WHERE complain_id like '${complain_id}'`;
                connection.query(statusUpdateQuery, function (error, results, fields) {
                    if (error) throw error;
                    console.log(success);
                })

                var queryUpdate = `UPDATE complains_reporting_body SET is_current = 0 WHERE complains_reporting_id like ${reporting_id}`;
                connection.query(queryUpdate, function (error, results, fields) {
                    if (error) throw error;
                    console.log(success);
                })
                var query = `INSERT INTO complains_reporting_body VALUES('${complains_reporting_id}', '${complain_id}', '${forwards_to}', '${forwards_by}', NOW(), '${forwards_message}', '${suggested_date_reply}', '${emp_name}', ${is_reply}, '${status}', ${is_current}, ${is_seen}, ${is_acknowledged}, ${is_public})`;
                connection.query(query, function (error, results, fields) {
                    if (error) throw error;
                    res.send(success);
                })
            }
        })

    }

    var success = {
        "success": "Your reporting forwarded succesfull"
    }
    // res.send(success)


})


var singleFile = upload.fields([{
    name: 'attachment'
}])
app.post("/api/reporting_attachment", singleFile, function (req, res, next) {
    var attachment_id, complains_reporting_id, attachment_name, attachment_file_type;
    attachment_id = req.body.reporting_attachments_id;
    var success = {
        "success": "attachment saved!"
    }
    complains_reporting_id = req.body.complains_reporting_id;
    attachment_name = saveFile(req.files['attachment'][0]);
    attachment_file_type = req.body.reporting_attachment_file_type;


    var query = `INSERT INTO reporting_attachments VALUES('${attachment_id}', '${complains_reporting_id}', '${attachment_name}', '${attachment_file_type}',  NOW())`;

    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(success);
    })
})


var singleFile = upload.fields([{
    name: 'attachment'
}])
app.post("/api/attachment", singleFile, function (req, res, next) {
    var attachment_id, complain_id, attachment_name, attachment_file_type;
    attachment_id = req.body.attachment_id;
    var success = {
        "success": "attachment saved!"
    }
    complain_id = req.body.complain_id;
    attachment_name = saveFile(req.files['attachment'][0]);
    attachment_file_type = req.body.attachment_file_type;


    var query = `INSERT INTO consumer_attachment VALUES('${attachment_id}', '${complain_id}', '${attachment_name}', '${attachment_file_type}',  NOW())`;

    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(success);
    })
})


var cpUpload = upload.fields([{
    name: 'front'
}, {
    name: 'back'
}, {
    name: 'wasa'
}])
app.post('/api/registeration', cpUpload, (req, res, next) => {
    var account_number, user_cnic, user_name, user_email, user_gender, user_password, user_address, user_contact;

    account_number = req.body.account_number;
    // res.send(account_number)
    user_cnic = req.body.cnic;

    connection.query("SELECT * from user_registration_table", function (error, results, fields) {
        if (error) throw error;
        // res.send(success);
        var success = {
            "success": "this user is already registered"
        }
        for (var i = 0; i < results.length; i++) {
            if (results[i]['user_cnic'] === user_cnic || results[i]['account_number'] === account_number) {
                res.send(success);
                return;
            }
        }
        user_name = req.body.name;
        user_email = req.body.email;
        user_password = req.body.pass;
        user_contact = req.body.contact;
        user_address = req.body.address;
        user_gender = req.body.gender;

        var fileWasa = saveFile(req.files['wasa'][0])
        var fileBack = saveFile(req.files['back'][0])
        var fileFront = saveFile(req.files['front'][0])
        var success = {
            "success": "new user registered"
        }

        var query = `INSERT INTO user_registration_table VALUES('${account_number}', '${user_cnic}', '${user_name}', '${user_email}', '${user_gender}', '${user_password}', '${user_address}', '${user_contact}', '${fileFront}',  '${fileBack}', '${fileWasa}', NOW())`;

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            res.send(success);
        })
    })
})
app.post("/posturl", function (req, res, next) {
    console.log(req.body);
    res.send("response");
})


function saveFile(file) {
    var fileName = file['fieldname'] + "-" + Date.now();
    var extension = file['mimetype'].split('/');
    fs.appendFile("uploads/" + fileName + "." + extension[1], file['buffer'], function (err) {
        if (err) throw err;
        console.log('Saved!');
    });


    return fileName + "." + extension[1];
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to ${port}`))
