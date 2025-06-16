const API_URL = 'http://localhost:5000/api/'
import axios from "axios";


export const makeHTTPGETFetch = async (endpointTemplate, pathParams = {}, queryParams = {}) => {
  const token = localStorage.getItem("token");

  // 插入路径参数，例如 "/api/employee/profile/:userId"
  let endpoint = endpointTemplate;
  for (const [key, value] of Object.entries(pathParams)) {
    endpoint = endpoint.replace(`:${key}`, encodeURIComponent(value));
  }

  // 构造完整 URL（含 query）
  const url = new URL(API_URL + endpoint);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  // 发请求
  const response = await axios.get(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
