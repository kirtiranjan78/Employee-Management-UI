import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import DepartmentList from "../DepartmentList";
import {
  deleteDepartment,
  getDepartmentsInBatches,
} from "../../../api/departmentAPI";

vi.mock("../../../api/departmentAPI", () => ({
  deleteDepartment: vi.fn(),
  getDepartmentsInBatches: vi.fn(),
}));

describe("DepartmentList", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/department/list"]}>
        <Routes>
          <Route path="/department/list" element={<DepartmentList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays departments and pagination controls", () => {
    const mockDepartments = {
      data: {
        content: [
          { id: 1, name: "HR", location: "New York" },
          { id: 2, name: "Finance", location: "London" },
        ],
        totalPages: 3,
      },
    };

    getDepartmentsInBatches.mockResolvedValue(mockDepartments);

    render(
      <MemoryRouter initialEntries={["/department/list"]}>
        <Routes>
          <Route path="/department/list" element={<DepartmentList />} />
        </Routes>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText(/HR/i)).toBeInTheDocument();
      expect(screen.getByText(/Finance/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 3/i)).toBeInTheDocument();
    });
  });

  test("displays error message when fetching departments fails", async () => {
    getDepartmentsInBatches.mockRejectedValue(
      new Error("Error fetching Department data")
    );

    render(
      <MemoryRouter initialEntries={["/department/list"]}>
        <Routes>
          <Route path="/department/list" element={<DepartmentList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error fetching Department data/i)
      ).toBeInTheDocument();
    });
  });

  test("handles department deletion", async () => {
    const mockDepartments = {
      data: {
        content: [
          { id: 1, name: "HR", location: "New York" },
          { id: 2, name: "Finance", location: "London" },
        ],
        totalPages: 3,
      },
    };

    getDepartmentsInBatches.mockResolvedValue(mockDepartments);
    deleteDepartment.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={["/department/list"]}>
        <Routes>
          <Route path="/department/list" element={<DepartmentList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/HR/i)).toBeInTheDocument();
      expect(screen.getByText(/Finance/i)).toBeInTheDocument();
    });

    const deleteButtonHR = screen.getAllByRole("button", {
      name: /delete/i,
    })[0];

    fireEvent.click(deleteButtonHR);

    await waitFor(() => {
      expect(deleteDepartment).toHaveBeenCalledWith(1);
      expect(screen.queryByText(/HR/i)).not.toBeInTheDocument();
    });
  });

  test("changes items per page when the value is entered", async () => {
    const mockDepartments = {
      data: {
        content: [
          { id: 1, name: "HR", location: "New York" },
          { id: 2, name: "Finance", location: "London" },
        ],
        totalPages: 3,
      },
    };

    getDepartmentsInBatches.mockResolvedValue(mockDepartments);

    render(
      <MemoryRouter initialEntries={["/department/list"]}>
        <Routes>
          <Route path="/department/list" element={<DepartmentList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/HR/i)).toBeInTheDocument();
    });

    const itemsPerPageInput = screen.getByLabelText(/Page size:/i);
    fireEvent.change(itemsPerPageInput, { target: { value: "10" } });
    fireEvent.keyDown(itemsPerPageInput, { key: "Enter" });

    await waitFor(() => {
      expect(getDepartmentsInBatches).toHaveBeenCalledWith(0, 10);
    });
  });
});
