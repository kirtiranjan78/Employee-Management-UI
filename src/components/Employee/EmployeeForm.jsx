import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "../../api/employeeAPI";
import { getDepartments } from "../../api/departmentAPI";
import {
  Button,
  Form,
  Alert,
  Row,
  Col,
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployeeForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
    fetchDepartments();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await getEmployeeById(id);
      const { name, email, salary, dateOfJoining, departments } = response.data;
      setName(name);
      setEmail(email);
      setSalary(salary);
      setDateOfJoining(dateOfJoining);
      setSelectedDepartments(departments);
    } catch (error) {
      console.log(error);
      setError("Error fetching employee data");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
      setError("Error fetching departments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !email ||
      !salary ||
      !dateOfJoining ||
      selectedDepartments.length === 0
    ) {
      setError("Please fill out all fields");
      return;
    }

    const employeeData = {
      name,
      email,
      salary,
      dateOfJoining,
      departments: selectedDepartments,
    };
    try {
      if (id) {
        await updateEmployee(id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      navigate("/employee");
    } catch (error) {
      console.log(error);
      setError("Error saving employee");
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => {
      const dept = departments.find((d) => d.id === parseInt(option.value));
      return dept;
    });
    setSelectedDepartments(selectedValues);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">Employee Management</Navbar.Brand>
          <Nav className="ms-auto">
            <Link to={`/`} className="btn btn-outline-light">
              Logout
            </Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="container mt-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col sm={12} md={6}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12} md={6}>
              <Form.Group controlId="salary">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6}>
              <Form.Group controlId="dateOfJoining">
                <Form.Label>Date of Joining</Form.Label>
                <Form.Control
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12} md={6}>
              <Form.Group controlId="departments">
                <Form.Label>Departments</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={selectedDepartments.map((dept) => dept.id)}
                  onChange={handleDepartmentChange}
                  required
                >
                  <option value="">Select Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="dark" type="submit">
            Save
          </Button>
          <Button
            variant="secondary"
            className="bottom-0 end-0 m-3"
            onClick={() => navigate("/employee")}
          >
            Back
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeForm;
