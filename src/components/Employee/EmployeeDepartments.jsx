import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../../api/employeeAPI";
import { Card, Button, Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployeeDepartments = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeById(id);
        setEmployee(response.data);
      } catch (error) {
        setError("Error fetching employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">Employee Management</Navbar.Brand>
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
      <Container>
        <h2 className="mt-4">Departments of {employee.name}</h2>
        <Card className="mt-4">
          <Card.Body>
            <h4>Departments</h4>
            <ul>
              {employee.departments.map((dept) => (
                <li key={dept.id}>{dept.name}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
        <Button variant="dark" className="mt-3" href="/employee">
          Back
        </Button>
      </Container>
    </div>
  );
};

export default EmployeeDepartments;
