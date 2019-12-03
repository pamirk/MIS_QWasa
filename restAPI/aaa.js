/**/

/*

--waqas api

const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
var fs = require('fs');
var upload = multer()

const app = express();
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.64.2',
  user     : 'root',
  password : 'root',
  database: 'complaints_db'
});



app.get('/api/get_designations', (req, res) => {
  var query = "SELECT * FROM designations";
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  })
})



app.get('/api/all_complains', (req, res) => {
  connection.query("SELECT * FROM consumer_complains_table ORDER BY created_us DESC  ",function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  })
})



app.get('/api/login', (req, res) => {
  connection.query("SELECT * from user_registration_table",function (error, results, fields) {
    if (error) throw error;
    res.send(results);

  })
})



app.post("/api/single_complain_detail",function(req,res,next){
  var complain_id = req.body.complain_id;
  var query = `SELECT * FROM consumer_complains_table LEFT JOIN consumer_attachment ON consumer_complains_table.complain_id = consumer_attachment.complain_id WHERE consumer_complains_table.complain_id LIKE '${complain_id}' UNION SELECT * FROM consumer_complains_table RIGHT JOIN consumer_attachment ON consumer_complains_table.complain_id = consumer_attachment.complain_id WHERE consumer_complains_table.complain_id LIKE '${complain_id}'`
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  })
})



app.post("/api/complains", upload.none() ,function(req,res,next){
  var account_number, complain_id,  complain_body, complains_status;
  account_number = req.body.account_number;
  complain_id = req.body.complain_id;
  complains_status = req.body.complain_status;
  complain_body = req.body.complain_body;
  // res.send(complain_id)
  console.log(account_number)
  console.log(complain_id)
  console.log(complain_body)
  console.log(complains_status)


  var success = {
    "success" : "Your complain registered succesfull"
  }

  var query = `INSERT INTO consumer_complains_table VALUES('${complain_id}', '${account_number}', '${complain_body}', '${complains_status}',  NOW())`;
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send(success);
  })
})

var singleFile = upload.fields([{ name: 'attachment'}])
app.post("/api/attachment", singleFile, function(req,res,next){
  var attachment_id, complain_id, attachment_name, attachment_file_type;
  attachment_id = req.body.attachment_id;
  var success = {
    "success" : "attachment saved!"
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



var cpUpload = upload.fields([{ name: 'front'}, { name: 'back'}, {name: 'wasa'}])
app.post('/api/registeration', cpUpload, (req, res, next) => {
  var account_number, user_cnic, user_name, user_email, user_gender, user_password, user_address, user_contact;

  account_number = req.body.account_number;
  // res.send(account_number)
  user_cnic = req.body.cnic;

  connection.query("SELECT * from user_registration_table",function (error, results, fields) {
    if (error) throw error;
    // res.send(success);
    var success = {
      "success" : "this user is already registered"
    }
    for(var i =0; i < results.length; i++){
      if(results[i]['user_cnic'] === user_cnic ||  results[i]['account_number'] === account_number){
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
      "success" : "new user registered"
    }

    var query = `INSERT INTO user_registration_table VALUES('${account_number}', '${user_cnic}', '${user_name}', '${user_email}', '${user_gender}', '${user_password}', '${user_address}', '${user_contact}', '${fileFront}',  '${fileBack}', '${fileWasa}', NOW())`;

    connection.query(query,function (error, results, fields) {
      if (error) throw error;
      res.send(success);
    } )
  } )
})
app.post("/posturl",function(req,res,next){
  console.log(req.body);
  res.send("response");
})





function saveFile(file) {
  var fileName = file['fieldname'] +"-"+ Date.now();
  var extension = file['mimetype'].split('/');
  fs.appendFile("uploads/"+fileName+"."+extension[1], file['buffer'], function (err) {
    if (err) throw err;
    console.log('Saved!');
  });


  return fileName+"."+extension[1];
}




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to ${port}`))

--waqas api end

exports.create = async (req, res) => {
    console.log(req.body);

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'pk',
    });

    const employee = req.body.employee;
    const address = req.body.address;
    const training = req.body.training;
    const designation = req.body.designation;

    const employeeValues = [
        employee.cnic, employee.fullname, employee.fathername, employee.appointment_date,
        employee.birth_date, employee.gender, employee.email, employee.local, employee.employee_photo
    ];

    const addressvalues = [
        address.current_address,
        address.permanent_address,
        address.postal_code,
        address.phone_number,
        address.phone_number2,
        1
    ];

    const trainingValues = [
        training.train_name,
        training.train_description,
        training.train_start_date,
        training.train_end_date,
        training.train_location_name,
        training.certificate_photo,
    ];

    const designationValues = [
        designation.des_id,
        designation.designation_order_date ,
        designation.des_appointment_date ,
        designation.des_copy];

    const querySting = "insert into employees(cnic, full_name, father_name, appointment_date, birth_date, gender, email, local, employee_photo) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";

    connection.query(querySting, employeeValues, (err, rows, fields) => {
        console.log("i think we dit it");
        if (err) {
            res.sendStatus(500);
            return
        }

        const employee_id = rows.insertId;


        const querySting2 = "insert into " +
            "employees_trainings(employee_id, train_name, train_description, train_start_date, train_end_date, train_location_name, certificate_photo) " +
            "values (?, ?, ?, ?, ?, ?, ?);";

        console.log([employee_id, ...trainingValues]);

        connection.query(querySting2, [employee_id, ...trainingValues], (err, rows, fields) => {
            console.log("i think we dit it");
            if (err) {
                res.sendStatus(500);
                return
            }

            console.log(rows);


            const querySting3 = "insert into " +
                "addresses(employee_id, current_address, permanent_address, postal_code, phone_number, phone_number2, city_id) " +
                "values (?, ?, ?, ?, ?, ?, ?);";
            connection.query(querySting3, [employee_id, ...addressvalues], (err, rows, fields) => {
                console.log("i think we dit it");
                if (err) {
                    res.sendStatus(500);
                    return
                }
                const querySting4 = "insert into " +
                    "employees_designations(employee_id, des_id, order_date, appointment_date, order_letter_photo) values (?, ?, ?, ?, ?);";
                connection.query(querySting4, [employee_id, ...designationValues], (err, rows, fields) => {
                    console.log("");
                    if (err) {res.sendStatus(500);return}



                    console.log(rows);

                    res.json(rows)

                });

            });
        });

    });


};*/
/*


    const querySting3 = "insert into addresses(employee_id, current_address, permanent_address, postal_code, phone_number, phone_number2, city_id) values (?, ?, ?, ?, ?, ?, ?);";
            connection.query(querySting3, [employee_id, ...addressvalues], (err, rows, fields) => {
                console.log("i think we dit it");
                if (err) {
                    res.sendStatus(500);
                    return
                }
                res.json(rows);
            });


*  const querySting4 = "insert into employees_designations(employee_id, des_id, order_date, appointment_date, order_letter_photo) values (?, ?, ?, ?, ?);";
                connection.query(querySting4, [designationValues], (err, rows, fields) => {
                    console.log("");
                    if (err) {res.sendStatus(500);return}



                    console.log(rows);

                    res.json(rows)

                });
                * */
