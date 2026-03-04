
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.999luckytoad.site/api/v1",
  withCredentials:true
});
export default api;