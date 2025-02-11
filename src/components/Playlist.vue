<template>
  <div class="container-principal">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid w-100">
        <div class="collapse navbar-collapse d-flex justify-content-center w-100">
          <ul class="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
            <button class="btn btn-outline-secondary me-3" type="button" @click="buscarHistorico">
              Histórico
            </button>
            <button class="btn btn-outline-secondary me-3" type="button" @click="listarGeneros">
              Gêneros musicais
            </button>
            <button class="btn btn-outline-secondary me-3" type="button" @click="alternarOrdenacao">
              Ordenar artistas
            </button>
          </ul>
          <form class="d-flex ms-3" @submit.prevent="buscar">
            <input v-model="termoBusca" class="form-control me-2" type="search" placeholder="Buscar artista/música" />
            <button class="btn btn-outline-success" type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </nav>

    <div v-if="exibirHistorico" class="container mt-4">
      <h3>Histórico de Buscas</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Tipo de Busca</th>
            <th>Data</th>
            <th>Artista/Música</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historico" :key="item.id">
            <td>{{ item.tipo }}</td>
            <td>{{ new Date(item.dataConsulta).toLocaleString() }}</td>
            <td>{{ item.termoPesquisa }}</td>
            <td>{{ item.resultadoJson }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container d-flex justify-content-center mt-5" v-if="!exibirHistorico && !exibirGeneros">
      <table class="table table-striped table-bordered w-75">
        <thead>
          <tr>
            <th v-if="!exibirGeneros">Nome do Artista</th>
            <th v-if="!exibirGeneros">Música</th>
            <th>Gênero</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(artista, index) in artistasExibidos" :key="index">
            <td v-if="!exibirGeneros">{{ artista.artist || 'Desconhecido' }}</td>
            <td v-if="!exibirGeneros">{{ artista.song || 'Desconhecida' }}</td>
            <td>{{ artista.genre || 'Desconhecido' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="exibirGeneros" class="container mt-4">
      <h3>Gêneros Musicais</h3>
      <ul class="list-group">
        <li v-for="(genero, index) in generos" :key="index" class="list-group-item">
          {{ genero }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "PlaylistComponent",
  data() {
    return {
      historico: [],           
      artistas: [],            
      artistasOrdenados: [],   
      artistasFiltrados: [],   
      generos: [],             
      exibirGeneros: false,    
      estaOrdenado: false,     
      exibirHistorico: false,
      termoBusca: ""  
    };
  },
  computed: {
   
    artistasExibidos() {
      if (this.exibirGeneros) return this.generos; 
      if (this.artistasFiltrados.length) return this.artistasFiltrados; 
      return this.estaOrdenado ? this.artistasOrdenados : this.artistas;
    },
  },
  methods: {
    
    async buscarPlaylists() {
      try {
        const response = await api.get("playlists");
        this.artistas = response.data;
        this.artistasOrdenados = [...this.artistas].sort((a, b) => a.artist.localeCompare(b.artist));

      } catch (error) {
        console.error("Erro ao carregar artistas:", error);
      }
    },

   
    alternarOrdenacao() {
      this.estaOrdenado = !this.estaOrdenado;
      this.artistasFiltrados = [];
      this.exibirGeneros = false;
      this.exibirHistorico = false;
    },

    async listarGeneros() {
      try {
        const response = await api.get("playlists/generos");
        this.generos = response.data;
        this.exibirGeneros = !this.exibirGeneros;
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      }
    },

    async buscarHistorico() {
      try {
        const response = await api.get("playlists/historico");
        this.historico = response.data;
        this.exibirHistorico = !this.exibirHistorico; 
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    },

    async buscar() {
      if (!this.termoBusca.trim()) {
        this.artistasFiltrados = [];
        return;
      }
      try {
        const response = await api.get(`playlists/buscar/${this.termoBusca}`);
        this.artistasFiltrados = response.data;
      } catch (error) {
        console.error("Erro ao buscar artista ou música:", error);
      }
    },
  },
  mounted() {
    this.buscarPlaylists();
  },
};
</script>
