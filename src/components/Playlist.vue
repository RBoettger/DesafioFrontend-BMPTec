<template>
  <div class="container-principal">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid w-100">
        <div class="collapse navbar-collapse d-flex justify-content-center w-100">
          <ul class="navbar-nav mb-2 mb-lg-0 d-flex align-items-center">
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
    <div class="container d-flex justify-content-center mt-5">
      <table class="table table-striped table-bordered w-75">
        <thead>
          <tr>
            <th v-if="!exibirGeneros">Nome do Artista</th>
            <th v-if="!exibirGeneros">Música</th>
            <th>Gênero</th>
            <th v-if="!exibirGeneros">Ano</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(artista, index) in artistasExibidos" :key="index">
            <td v-if="!exibirGeneros">{{ artista.artist || '' }}</td>
            <td v-if="!exibirGeneros">{{ artista.song || '' }}</td>
            <td>{{ artista.genre || artista }}</td>
            <td v-if="!exibirGeneros">{{ artista.year || '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaylistComponent",
  data() {
    return {
      artistas: [],
      artistasOrdenados: [],
      artistasFiltrados: [],
      generos: [],
      exibirGeneros: false,
      termoBusca: "",
      estaOrdenado: false,
    };
  },
  computed: {
    artistasExibidos() {
      if (this.exibirGeneros) {
        return this.generos;
      }
      return this.artistasFiltrados.length
        ? this.artistasFiltrados
        : this.estaOrdenado
        ? this.artistasOrdenados
        : this.artistas;
    },
  },
  methods: {
    async buscarPlaylists() {
      try {
        const response = await fetch("https://guilhermeonrails.github.io/api-csharp-songs/songs.json");
        const data = await response.json();
        this.artistas = [...data];
        this.artistasOrdenados = [...data].sort((a, b) => a.artist.localeCompare(b.artist));
        this.gerarGeneros();
      } catch (error) {
        console.error("Erro ao carregar artistas:", error);
      }
    },
    alternarOrdenacao() {
      this.estaOrdenado = !this.estaOrdenado;
      this.artistasFiltrados = [];
      this.exibirGeneros = false;
    },
    listarGeneros() {
      if (this.artistas.length === 0) return;
      this.exibirGeneros = !this.exibirGeneros;
    },
    gerarGeneros() {
      const generos = this.artistas.map(artista => artista.genre).join(", ").split(", ");
      this.generos = [...new Set(generos)];
    },
    buscar() {
      const termo = this.termoBusca.toLowerCase().trim();
      if (!termo) {
        this.artistasFiltrados = [];
        return;
      }
      this.artistasFiltrados = this.artistas.filter(a => 
        a.artist.toLowerCase().includes(termo) || a.song.toLowerCase().includes(termo)
      );
    }
  },
  mounted() {
    this.buscarPlaylists();
  },
};
</script>