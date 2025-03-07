import axios from "axios";

const API_URL = "http://localhost:2200/department";
// Get list of departments
export const getDepartments = () => {
  return axios.get(`${API_URL}/get`);
};
//add a new department
export const createDepartment = (departmentData) => {
  return axios.post(`${API_URL}/add`, departmentData);
};
// Delete a department
export const deleteDepartment = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};
//Get Department in Batches
export const getDepartmentsInBatches = (page, itemsPerPage) => {
  return axios.get(`${API_URL}/get-in-batches/${page}/${itemsPerPage}`);
};
// Get a single department by ID
export const getDepartmentById = (id) => {
  return axios.get(`${API_URL}/getById/${id}`);
};
// Update an existing department
export const updateDepartment = (id, departmentData) => {
  return axios.put(`${API_URL}/update/${id}`, departmentData);
};
