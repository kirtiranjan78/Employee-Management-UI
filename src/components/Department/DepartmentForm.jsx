import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../../api/departmentAPI";
import { Link } from "react-router-dom";
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

const DepartmentForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchDepartment();
    }
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const response = await getDepartmentById(id);
      const { name, location } = response.data;
      setName(name);
      setLocation(location);
    } catch (error) {
      console.log(error);
      setError("Error fetching Department data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      setError("Please fill out all fields");
      return;
    }

    const departmentData = {
      name,
      location,
    };
    try {
      if (id) {
        await updateDepartment(id, departmentData);
      } else {
        await createDepartment(departmentData);
      }
      navigate("/department");
    } catch (error) {
      console.log(error);
      setError("Error saving department");
    }
  };

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand href="#">Department Management</Navbar.Brand>
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
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Department Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6}>
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Department Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="dark" type="submit">
            Save
          </Button>

          <Button
            variant="secondary"
            className="bottom-0 end-0 m-3"
            onClick={() => navigate("/department")}
          >
            Back
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default DepartmentForm;
