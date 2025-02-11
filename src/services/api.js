// api.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7048/api/",
});

export default {
  get(endpoint) {
    return api.get(endpoint);
  },
};
