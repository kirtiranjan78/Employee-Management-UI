import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EmployeeList from "../EmployeeList";
import { getEmployeesInBatches } from "../../../api/employeeAPI";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../api/employeeAPI", () => ({
  getEmployeesInBatches: vi.fn(),
}));

describe("EmployeeList", () => {
  it("should render the component initially", () => {
    getEmployeesInBatches.mockResolvedValue({
      data: {
        content: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            salary: 5000,
            dateOfJoining: "2021-01-01",
            departments: [{}],
          },
          {
            id: 2,
            name: "Jane Doe",
            email: "jane@example.com",
            salary: 6000,
            dateOfJoining: "2022-01-01",
            departments: [{}],
          },
        ],
        totalPages: 2,
      },
    });

    render(<EmployeeList />);
    screen.debug();
  });

  it("should show loading indicator when data is being fetched", () => {
    getEmployeesInBatches.mockResolvedValue({
      data: { content: [], totalPages: 0 },
    });

    render(<EmployeeList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display error message when fetching data fails", async () => {
    getEmployeesInBatches.mockRejectedValue(
      new Error("Error fetching employee data")
    );

    render(<EmployeeList />);

    await waitFor(() => screen.getByText("Error fetching employee data"));

    expect(
      screen.getByText("Error fetching employee data")
    ).toBeInTheDocument();
  });
});
