import React, { useState, useEffect } from "react";
import { getEmployeesInBatches, deleteEmployee } from "../../api/employeeAPI";
import { Link } from "react-router-dom";
import { Button, Table, Form } from "react-bootstrap";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployeesInBatches(page, itemsPerPage);
        setEmployees(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError("Error fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, itemsPerPage]);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      setError("Error deleting employee");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleItemsPerPageChange = (e) => {
    if (e.key === "Enter") {
      setItemsPerPage(Number(e.target.value));
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Date of Joining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.salary}</td>
                  <td>{formatDate(employee.dateOfJoining)}</td>
                  <td>
                    <Link
                      to={`/edit/${employee.id}`}
                      className="btn btn-secondary me-2"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/view-departments/${employee.id}`}
                      className="btn btn-dark me-2"
                    >
                      View
                    </Link>
                    <Button
                      aria-label="Delete"
                      role="button"
                      variant="danger"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>

            <div>
              <Form.Control
                type="number"
                value={page + 1}
                onChange={(e) =>
                  setPage(
                    Math.min(totalPages - 1, Math.max(0, e.target.value - 1))
                  )
                }
                min={1}
                max={totalPages}
                className="d-inline-block w-auto text-center"
                style={{ width: "80px" }}
              />
              <span> of {totalPages}</span>
            </div>

            <Button
              variant="secondary"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
            >
              Next
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Group
              controlId="itemsPerPage"
              className="d-flex align-items-center"
            >
              <Form.Label className="me-2">Page size:</Form.Label>
              <Form.Control
                type="number"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                onKeyDown={handleItemsPerPageChange}
                min={1}
                className="w-auto"
                style={{ width: "80px" }}
              />
            </Form.Group>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
