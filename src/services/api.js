// api.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7048/api/", // Substitua pela URL do seu backend
});

export default {
  get(endpoint) {
    return api.get(endpoint);
  },
  // Adicione outros métodos de requisição (POST, PUT, DELETE) conforme necessário
};
