import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./pages/EmployeeDashboard"));
import Login from "./pages/Login";
const EmployeeForm = React.lazy(() =>
  import("./components/Employee/EmployeeForm")
);
const DashboardDept = React.lazy(() => import("./pages/DepartmentDashboard"));
const DepartmentForm = React.lazy(() =>
  import("./components/Department/DepartmentForm")
);
const EmployeeDepartments = React.lazy(() =>
  import("./components/Employee/EmployeeDepartments")
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/employee" element={<Dashboard />} />
          <Route path="/department" element={<DashboardDept />} />
          <Route path="/" element={<Login />} />
          <Route path="/add/emp" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
          <Route path="/add/dept" element={<DepartmentForm />} />
          <Route path="/dept/edit/:id" element={<DepartmentForm />} />
          <Route
            path="/view-departments/:id"
            element={<EmployeeDepartments />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
