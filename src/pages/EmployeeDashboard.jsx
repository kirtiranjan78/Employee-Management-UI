import React, { useState } from "react";
import EmployeeList from "../components/Employee/EmployeeList";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "250px",
          backgroundColor: "#212529",
          color: "white",
          padding: "20px",
          position: "fixed",
          top: "0",
          bottom: "0",
          left: "0",
        }}
      >
        <h4 className="text-center mb-4">Employee-Management-UI</h4>
        <Nav className="flex-column">
          <Link to={`/employee`} className="nav-link text-white">
            Employees
          </Link>

          <Link to={`/department`} className="nav-link text-white">
            Departments
          </Link>
        </Nav>
      </div>

      <div
        style={{
          marginLeft: "250px",
          padding: "20px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#">Employees</Navbar.Brand>
            <Nav className="ms-auto">
              <Link to={`/add/emp`} className="btn btn-outline-light me-2">
                Add New
              </Link>

              <Link to={`/`} className="btn btn-outline-light">
                Logout
              </Link>
            </Nav>
          </Container>
        </Navbar>

        <div style={{ marginTop: "20px" }}>
          <EmployeeList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
