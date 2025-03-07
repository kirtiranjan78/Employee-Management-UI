import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:2200/employee",
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized access - redirecting to login");
      } else {
        console.log("Error occurred: ", error.response.status);
      }
    } else {
      console.error("Network Error or Server is down.");
    }
    return Promise.reject(error);
  }
);

// Get list of employees
export const getEmployees = () => {
  return axiosInstance.get("/get");
};

// Get a single employee by ID
export const getEmployeeById = (id) => {
  return axiosInstance.get(`/getById/${id}`);
};

// Create a new employee
export const createEmployee = (employeeData) => {
  return axiosInstance.post("/add", employeeData);
};

// Update an existing employee
export const updateEmployee = (id, employeeData) => {
  return axiosInstance.put(`/update/${id}`, employeeData);
};

// Delete an employee
export const deleteEmployee = (id) => {
  return axiosInstance.delete(`/delete/${id}`);
};

// Get Employees in batches (Pagination)
export const getEmployeesInBatches = (pageNo, itemsPerPage) => {
  return axiosInstance.get(`/get-in-batches/${pageNo}/${itemsPerPage}`);
};
