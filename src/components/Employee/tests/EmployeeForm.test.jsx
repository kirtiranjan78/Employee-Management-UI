import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EmployeeForm from "../EmployeeForm";
import * as employeeAPI from "../../../api/employeeAPI";
import * as departmentAPI from "../../../api/departmentAPI";

vi.mock("../../../api/employeeAPI");
vi.mock("../../../api/departmentAPI");

describe("EmployeeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the component and load department options", async () => {
    departmentAPI.getDepartments.mockResolvedValue({
      data: [
        { id: 1, name: "HR", location: "MUM" },
        { id: 2, name: "Engineering", location: "CHE" },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/add-employee"]}>
        <Routes>
          <Route path="/add-employee" element={<EmployeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("HR"));
    await waitFor(() => screen.getByText("Engineering"));

    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  test("should display an error message when fetching departments fails", async () => {
    departmentAPI.getDepartments.mockRejectedValue(
      new Error("Failed to fetch departments")
    );

    render(
      <MemoryRouter initialEntries={["/add-employee"]}>
        <Routes>
          <Route path="/add-employee" element={<EmployeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Error fetching departments"));
    expect(screen.getByText("Error fetching departments")).toBeInTheDocument();
  });

  test("should fetch and fill employee data when editing an existing employee", async () => {
    employeeAPI.getEmployeeById.mockResolvedValue({
      data: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        salary: "5000",
        dateOfJoining: "2020-01-01",
        departments: [{ id: 1, name: "Engineering", location: "CHE" }],
      },
    });
    departmentAPI.getDepartments.mockResolvedValue({
      data: [
        { id: 1, name: "HR", location: "MUM" },
        { id: 2, name: "Engineering", location: "CHE" },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/edit-employee/1"]}>
        <Routes>
          <Route path="/edit-employee/:id" element={<EmployeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("John Doe"));
    await waitFor(() => screen.getByDisplayValue("john.doe@example.com"));

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  test("should submit the form and create a new employee", () => {
    departmentAPI.getDepartments.mockResolvedValue({
      data: [
        { id: 1, name: "HR", location: "MUM" },
        { id: 2, name: "Engineering", location: "CHE" },
      ],
    });
    employeeAPI.createEmployee.mockResolvedValue({ data: {} });

    render(
      <MemoryRouter initialEntries={["/add/emp"]}>
        <Routes>
          <Route path="/add/emp" element={<EmployeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Salary"), {
      target: { value: "6000" },
    });
    fireEvent.change(screen.getByLabelText("Date of Joining"), {
      target: { value: "2022-05-10" },
    });
    fireEvent.change(screen.getByLabelText("Departments"), {
      target: { value: [1] },
    });

    fireEvent.click(screen.getByText("Save"));

    waitFor(() => expect(employeeAPI.createEmployee).toHaveBeenCalled(1));
  });
});
