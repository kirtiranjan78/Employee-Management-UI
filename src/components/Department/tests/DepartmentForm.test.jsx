import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import DepartmentForm from "../DepartmentForm";
import {
  createDepartment,
  getDepartmentById,
} from "../../../api/departmentAPI";

vi.mock("../../../api/departmentAPI", () => ({
  createDepartment: vi.fn(),
  getDepartmentById: vi.fn(),
}));

describe("DepartmentForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders form with inputs", () => {
    render(
      <MemoryRouter initialEntries={["/department/form"]}>
        <Routes>
          <Route path="/department/form" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Department Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  test("submits form successfully when fields are filled", async () => {
    createDepartment.mockResolvedValue({ data: { id: 1 } });

    render(
      <MemoryRouter initialEntries={["/department/form"]}>
        <Routes>
          <Route path="/department/form" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Department Name/i), {
      target: { value: "HR" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "New York" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(createDepartment).toHaveBeenCalledWith({
        name: "HR",
        location: "New York",
      });
    });
  });

  test("prepopulates form fields when editing an existing department", async () => {
    const mockDepartment = { name: "IT", location: "San Francisco" };
    getDepartmentById.mockResolvedValue({ data: mockDepartment });

    render(
      <MemoryRouter initialEntries={["/department/form/123"]}>
        <Routes>
          <Route path="/department/form/:id" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Department Name/i).value).toBe(
        mockDepartment.name
      );
      expect(screen.getByLabelText(/Location/i).value).toBe(
        mockDepartment.location
      );
    });
  });

  test("displays error message if department data fetch fails", async () => {
    getDepartmentById.mockRejectedValue(
      new Error("Error fetching Department data")
    );

    render(
      <MemoryRouter initialEntries={["/department/form/123"]}>
        <Routes>
          <Route path="/department/form/:id" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Error fetching Department data/i)
    ).toBeInTheDocument();
  });

  test("handles form submission error", async () => {
    createDepartment.mockRejectedValue(new Error("Error saving department"));

    render(
      <MemoryRouter initialEntries={["/department/form"]}>
        <Routes>
          <Route path="/department/form" element={<DepartmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Department Name/i), {
      target: { value: "Finance" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Los Angeles" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(screen.getByText(/Error saving department/i)).toBeInTheDocument();
    });
  });
});
