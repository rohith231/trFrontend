import axios from "axios";
import config from "../config";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const instance = axios.create({
  baseURL: config.WS_BASE_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? token : "";
  config.headers.ContentType = "application/json";
  return config;
});

//usersAPI
//query completed
export const getAllWithRole = async () => await instance.get("users/all");

export const getDbUsersWithRole = async () =>
  await instance.get("users/dbusers");

export const getDbUsersWithRoleByClient = async (clientId) =>
  await instance.get(`users/dbusers/${clientId}`);

export const getAllByRole = async (roleId) =>
  await instance.get(`users/${roleId}`);

//mutation completed
export const register = async (userDetails) =>
  await instance.post("users/register", userDetails);

export const confirmRegister = async (id) =>
  await instance.post(`users/confirm/${id}`);
//mutation completed
export const forgotPassword = async (email) =>
  await instance.post("users/forgotpassword", { email });
//mutation completed
export const confirmReset = async ({ id, password }) =>
  await instance.post(`users/resetpass/${id}`, { password });
//mutation completed
export const login = async (userCreds) =>
  await instance.post("users/login", userCreds);
//mutation completed
export const logout = async (token) =>
  await instance.post("users/logout", { token });
//mutation completed
export const edit = async (userDetails) =>
  await instance.post("/users/edit", userDetails);

export const deleteUser = async (userId) => {
  return await instance.delete(`/users/delete/${userId}`);
};

//rolesAPI

export const getRoleById = async (roleId) => {
  return await instance.get(`/roles/${roleId}`);
};

export const editRoleById = async ({ roleId, roleName }) => {
  return await instance.put(`/roles/edit/${roleId}`, { roleName });
};

export const getAllRoles = async () => {
  return await instance.get("/roles/all");
};

export const getDbRoles = async () => {
  return await instance.get("/roles/dbroles");
};

export const getDbRolesByClient = async (clientId) => {
  return await instance.get(`/roles/dbroles/${clientId}`);
};

export const createNewRole = async ({ roleName, clientId }) => {
  return await instance.post("/roles/new", { roleName, clientId });
};

export const deleteRole = async (roleId) => {
  return await instance.delete(`/roles/delete/${roleId}`);
};

//teams API
export const getAllTeams = async () => {
  return await instance.get("/teams/all");
};

export const getAllTeamsByClient = async (clientId) => {
  return await instance.get(`/teams/all/${clientId}`);
};

export const createNewTeam = async ({ teamName, userIds, clientId }) => {
  return await instance.post("/teams/new", { teamName, userIds, clientId });
};

export const editTeamById = async ({ teamId, teamName, userIds, clientId }) => {
  return await instance.put(`/teams/edit/${teamId}`, {
    teamName,
    userIds,
    clientId,
  });
};

export const deleteTeam = async (teamId) => {
  return await instance.delete(`/teams/delete/${teamId}`);
};

export const getUserTeamById = async (teamId) => {
  return await instance.get(`/teams/${teamId}`);
};

//functionality API
export const getAllFunctionalities = async () => {
  return await instance.get(`/functionalities/all`);
};

export const getAllFuncsFuncgroups = async () => {
  return await instance.get(`/functionalities/funcsfuncgroups/all`);
};

export const createNewFunctionality = async ({
  funcName,
  funcLabel,
  sectorId,
}) => {
  return await instance.post("/functionalities/new", {
    funcName,
    funcLabel,
    sectorId,
  });
};

export const createNewGroupFunctionality = async ({
  groupName,
  funcNames,
  sectorId,
}) => {
  return await instance.post("/functionalities/group/new", {
    groupName,
    funcNames,
    sectorId,
  });
};

export const createRoleFunctionalities = async ({ roleId, funcIds }) => {
  return await instance.post("/functionalities/setfunc", {
    roleId,
    funcIds,
  });
};

export const deleteFunctionality = async (funcId) => {
  return await instance.delete(`/functionalities/delete/${funcId}`);
};

export const getFuncWithSectorId = async () => {
  return await instance.get(`/functionalities/funcWithSecId`);
};

export const getFuncFuncgroupsWithSectorId = async () => {
  return await instance.get(`/functionalities/funcFuncgroupsWithSecId`);
};

export const getFuncWithRoleId = async () => {
  return await instance.get(`/functionalities/funcWithRoleId`);
};

export const getFuncByRoleId = async (roleId) => {
  return await instance.get(`/functionalities/funcByRoleId/${roleId}`);
};

export const getFuncsFuncgroupsByRoleId = async (roleId) => {
  return await instance.get(`/functionalities/funcsfuncgroups/${roleId}`);
};

export const getFuncFuncgroupsBySectorId = async (clientId) => {
  return await instance.get(
    `/functionalities/funcFuncgroupsBySecId/${clientId}`
  );
};

//sectors
export const getAllSectors = async () => {
  return await instance.get("/sectors/all");
};

export const editSectorById = async ({ sectorId, sectorName, sectorCode }) => {
  return await instance.put(`/sectors/edit/${sectorId}`, {
    sectorName,
    sectorCode,
  });
};

export const createNewSector = async ({ sectorName, sectorCode }) => {
  return await instance.post("/sectors/new", { sectorName, sectorCode });
};

export const deleteSector = async (sectorId) => {
  return await instance.delete(`/sectors/delete/${sectorId}`);
};

//clients
export const getAllClients = async () => {
  return await instance.get("/clients/all");
};

export const editClientById = async ({ clientId, clientName, sectorId }) => {
  return await instance.put(`/clients/edit/${clientId}`, {
    clientName,
    sectorId,
  });
};

export const getBanner = async (clientId) => {
  return await instance.get(`/clients/banner/${clientId}`);
};

export const getAllClientsWithSector = async () => {
  return await instance.get("/clients/cliWithSec");
};

export const createNewClient = async ({ clientName, sectorId }) => {
  return await instance.post("/clients/new", { clientName, sectorId });
};

export const updateBanner = async ({ clientId, banner }) => {
  return await instance.put(`/clients/update/banner/${clientId}`, banner);
};

export const deleteClient = async (clientId) => {
  return await instance.delete(`/clients/delete/${clientId}`);
};

//webmap API
export const createNewWebmap = async (webmapDetails) => {
  return await instance.post("/webmaps/new", webmapDetails);
};

export const getActiveWebmap = async (roleId) => {
  return await instance.get(`/webmaps/active/${roleId}`);
};

//portal API
export const createNewPortal = async (portalDetails) => {
  return await instance.post("/portal/new", portalDetails);
};

export const getActivePortal = async (roleId) => {
  return await instance.get(`/portal/active/${roleId}`);
};

//test API
export const getExtData = async (webUrl) => {
  return await instance.get(webUrl);
};

//charts API
export const createChart = async (chartDetails) => {
  return await instance.post("/charts/new", chartDetails);
};

export const getChartsByRole = async (roleId) => {
  return await instance.get(`/charts/chartsByRole/${roleId}`);
};

export const getAllCharts = async () => {
  return await instance.get("/charts/all");
};

export const createRoleCharts = async ({ roleId, chartIds }) => {
  return await instance.post("/charts/chartRole", { roleId, chartIds });
};

//files API
export const fileUpload = async (files) => {
  return await instance.post("/files/new", files);
};

export const getFilesByParent = async (parentId) => {
  return await instance.get(`/files/filesByParent/${parentId}`);
};

//avatar API
export const updateDp = async ({ formData, userId }) => {
  return await instance.post(`/avatars/new/${userId}`, formData);
};

export const getActiveAvatar = async (userId) => {
  return await instance.get(`/avatars/active/${userId}`);
};

//folders API
export const getRootFolderByClient = async (clientId) => {
  return await instance.get(`/folders/root/${clientId}`);
};

export const getFoldersByParent = async (folderId) => {
  return await instance.get(`/folders/foldbyParent/${folderId}`);
};

export const createNewFolder = async ({ folderPath, parentId }) => {
  return await instance.post("/folders/new", { folderPath, parentId });
};

export const createRootFolder = async (clientId) => {
  return await instance.post("/folders/newRoot", { clientId });
};
