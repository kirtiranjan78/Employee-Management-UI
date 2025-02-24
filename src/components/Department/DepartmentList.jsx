import React, { useState, useEffect } from "react";
import {
  deleteDepartment,
  getDepartmentsInBatches,
} from "../../api/departmentAPI";
import { Link } from "react-router-dom";
import { Button, Table, Form } from "react-bootstrap";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartmentsInBatches(page, itemsPerPage);
        setDepartments(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
        setError("Error fetching Department data");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [page, itemsPerPage]);

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((department) => department.id !== id));
    } catch (error) {
      console.log(error);
      setError("Error deleting department");
    }
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
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.location}</td>
                  <td>
                    <Link
                      to={`/dept/edit/${department.id}`}
                      className="btn btn-dark me-2"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(department.id)}
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

export default DepartmentList;
