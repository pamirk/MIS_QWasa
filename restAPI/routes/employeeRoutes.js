const express = require("express");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random(100) + '-' + file.originalname + ".jpg")
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter
});


const employeeController = require("../controllers/employeeController");

const router = express.Router();
router.get("/", employeeController.index);
router.get("/employee_list", employeeController.employee_list);
router.get("/employee/:id", employeeController.showEmployee);
router.get("/show_one_employee/:id", employeeController.show_one_employee);
router.get("/show_one_employee_address/:id", employeeController.show_one_employee_address);
router.get("/designation_list/:id", employeeController.designation_list_items);
router.get("/training_list/:id", employeeController.training_list);
router.get("/search", employeeController.listSearch);
router.get("/department_list", employeeController.department_list);
router.get("/designation_list", employeeController.designation_list);
router.get("/division_list", employeeController.division_list);
router.get("/employee_designation_details/:id", employeeController.employee_designation_details);
router.get("/employee_transfer_details/:id", employeeController.employee_transfer_details);
router.get("/get_employee_status/:id", employeeController.get_employee_status);

router.post("/employee_create", upload.single('image'), employeeController.create);
router.post("/set_employee_status", upload.single('image'), employeeController.set_employee_status);
router.post("/set_employee_password", upload.single('image'), employeeController.set_employee_password);

router.post("/create_employee_designation", upload.single('image'), employeeController.create_employee_designation);
router.post("/employee_create_address", employeeController.employee_create_address);
router.post("/create_division", employeeController.create_division);
router.post("/create_department", employeeController.createDepartment);
router.post("/create_designation", employeeController.createDesignation);
router.post("/promote_emoployee", upload.single('image'), employeeController.promote_emoployee);
router.post("/add_emoployee_training", upload.single('image'), employeeController.add_emoployee_training);
router.post("/add_emoployee_transfer", upload.single('image'), employeeController.add_emoployee_transfer);
router.post("/one_employee_update", upload.single('image'), employeeController.one_employee_update);
router.post("/employee_designation_update", upload.single('image'), employeeController.employee_designation_update);
router.post("/employee_address_update", upload.single('image'), employeeController.employee_address_update);

router.get("/complain_list", employeeController.complain_list);
router.get("/consumer_complain_list/:id", employeeController.consumer_complain_list);
router.get("/single_complain/:id", employeeController.single_complain);
router.post("/complain_register", upload.single('image'), employeeController.complain_register);
router.post("/postConsumerAttachment", upload.single('image'), employeeController.postConsumerAttachment);
//router.post("/one_complain_register_Attachment", upload.single('image'), employeeController.one_complain_register_Attachment);
router.post("/create_consumer", upload.fields([{name: 'user_cnic_front_image'}, {name: 'user_cnic_back_image'}, {name: 'user_wasa_bill_image'}]), employeeController.create_consumer);

module.exports = router;

