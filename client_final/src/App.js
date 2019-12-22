import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Menu from "./Account/Menu";

import Header from './components/Header';
import Public from './components/Public';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';

import withContext from './Context';
import PrivateRoute from './PrivateRoute';
import Home from "./DashboardAnalysis/Home";
import TESTHOME from "./DashboardAnalysis/TESTHOME.tsx";
import CreateEmployee from "./components/CreateEmployee";
import CreateDepartment from "./components/CreateDepartment";
import CreateDesignation from "./components/CreateDesignation";
import EmployeeReport from "./Account/components/employee/EmployeeReport";
import Employee from "./components/Employee";
import EmployeeAddressForm from "./components/EmployeeAddressForm";
import EmployeeAddressHome from "./components/EmployeeAddressHome";
import EmployeeDesignationHome from "./components/EmployeeDesignationHome";
import EmployeeDesignationForm from "./components/EmployeeDesignationForm";
import EmployeeList from "./components/EmployeeList";
import CreateComplain from "./Complains/CreateComplain";
import CreateDivision from "./components/CreateDivision";
import CreateSubDivision from "./components/CreateSubDivision";
import Sider from "./components/Sider";
import ComplainDashboard from "./Complains/ComplainDashboard";
import ComplaintDetails from "./Complains/ComplaintDetails";

const HeaderWithContext = withContext(Header);
const SiderWithContext = withContext(Sider);
const HomeWithContext = withContext(Home);
const TESTHOMEWithContext = withContext(TESTHOME);
const AuthWithContext = withContext(Authenticated);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const ComplainDashboardWithContext = withContext(ComplainDashboard);
const CreateComplainWithContext = withContext(CreateComplain);
const ComplaintDetailsWithContext = withContext(ComplaintDetails);

export default () => (
    <Router>
        <div>
            <HeaderWithContext/>
            <SiderWithContext>
                <Switch>

                    <Route exact path="/" component={HomeWithContext}/>
                    <Route exact path="/test" component={TESTHOMEWithContext}/>
                    <PrivateRoute path="/create_employee" component={CreateEmployee}/>
                    <PrivateRoute path="/create_department" component={CreateDepartment}/>
                    <PrivateRoute path="/create_designation" component={CreateDesignation}/>
                    <PrivateRoute path="/create_division" component={CreateDivision}/>
                    <PrivateRoute path="/create_sub_division" component={CreateSubDivision}/>

                    <PrivateRoute exact path="/employee/:id" component={Menu}/>
                    <PrivateRoute exact path="/employee_report/:id" component={EmployeeReport}/>
                    <PrivateRoute exact path="/permissions/:id" component={NotFound}/>
                    <PrivateRoute exact path="/employeeHome/:id" component={Employee}/>
                    <PrivateRoute exact path="/employeeAddress/:id" component={EmployeeAddressForm}/>
                    <PrivateRoute exact path="/employeeAddressHome/:id" component={EmployeeAddressHome}/>
                    <PrivateRoute exact path="/employee_designationHome/:id" component={EmployeeDesignationHome}/>
                    <PrivateRoute exact path="/employeeDesignation/:id" component={EmployeeDesignationForm}/>
                    <PrivateRoute path="/employee_list" component={EmployeeList}/>

                    <PrivateRoute path="/complain_register" component={CreateComplainWithContext}/>
                    <PrivateRoute path="/complain_dashboard" component={ComplainDashboardWithContext}/>
                    <PrivateRoute path="/complaint/:id" component={ComplaintDetailsWithContext}/>
                    <PrivateRoute path="/complain_reports" component={ComplaintDetailsWithContext}/>


                    <PrivateRoute path="/authenticated" component={AuthWithContext}/>
                    <Route path="/signin" component={UserSignInWithContext}/>
                    <Route path="/signup" component={UserSignUpWithContext}/>
                    <Route path="/signout" component={UserSignOutWithContext}/>

                    <Route component={NotFound}/>
                </Switch>
            </SiderWithContext>
        </div>
    </Router>
);
