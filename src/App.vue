<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import YAML from 'yaml'

  import GameCore from './GameCore.vue';
  import GameSelector from './GameSelector.vue';

  const selectedGame = ref();
  const sidebarOpen = ref(false);
  const gamesList = [
    {id: 'mission-pedago', title: "Mission pédago", definitionFile: "mission-pedago.yaml"}, 
    {id: 'sos-citoyen', title: "SOS Citoyen", definitionFile: "sos-citoyen.yaml"},
    {id: 'malaise-dating', title: "Malaise Dating", definitionFile: "malaise-dating.yaml"}
  ]

  onMounted(() => {
    const selectedGameId = localStorage.getItem("selected_game");
    if (selectedGameId != null) {
      try {
        loadGame(selectedGameId)
      } catch (e) {
        console.error(e)
      }
    }
  })

  function loadGame(gameId: string) {
    const game = gamesList.find(game => game.id === gameId)
    if (game) {
      fetchCardsDefinitions(new URL(game.definitionFile, window.location.toString())).then((value) => {
        selectedGame.value = value
      })
    } else {
      throw new Error("Game not found")
    }
  }

  function unloadGame() {
    selectedGame.value = undefined
    localStorage.removeItem("selected_game")
  }

  function selectGame(gameId: string) {
    localStorage.setItem("selected_game", gameId)
    loadGame(gameId)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function fetchCardsDefinitions(definitionFile: URL) {
    return fetch(definitionFile)
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return YAML.parse(await response.text());
      });
  }

</script>

<template>
  <!-- Sidebar Toggle Button -->
  <button class="sidebar-toggle" @click="toggleSidebar" :class="{ active: sidebarOpen }" aria-label="Toggle sidebar menu">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <!-- Sidebar Navigation -->
  <nav class="sidebar" :class="{ open: sidebarOpen }" aria-label="Main navigation">
    <header class="sidebar-header">
      <h2>Menu</h2>
      <button class="close-btn" @click="toggleSidebar" aria-label="Close sidebar">&times;</button>
    </header>
    <section class="sidebar-content">
      <button @click="unloadGame">Retour au choix de jeu</button>
    </section>
  </nav>

  <!-- Sidebar Overlay -->
  <div class="sidebar-overlay" :class="{ show: sidebarOpen }" @click="toggleSidebar" aria-hidden="true"></div>

  <!-- Main Content Area -->
  <GameSelector v-if="selectedGame == null" :gamesList="gamesList" @gameSelected="selectGame"/>
  <GameCore v-else :definition="selectedGame"/>

  <footer>Mission pédago © 2025 par <a href="https://www.protection-civile.org">Fédération Nationale de Protection Civile</a> et adapté par <a href="https://isere.protection-civile.org">Association de Protection Civile de l'Isère</a> sous licence <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"></footer>
</template>

<style>
  html, body, #app, main {
    height: 100%;
    margin: 0;
    padding: 0;

    font-family: Verdana, sans-serif;
    --orange-protec: #F08700;
    --bleu-protec: #004080;
  }
</style>

<style scoped>
  footer {
    text-align: center;
    font-size: small;
    margin: 1vh;
  }

  /* Sidebar Toggle Button */
  .sidebar-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    background: var(--orange-protec);
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    transition: all 0.3s ease;
  }

  .sidebar-toggle:hover {
    background: #e07800;
  }

  .sidebar-toggle span {
    width: 20px;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    border-radius: 1px;
  }

  .sidebar-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .sidebar-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .sidebar-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  /* Sidebar */
  .sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    background: white;
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--bleu-protec);
    color: white;
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 1.2em;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 4px;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .sidebar-content {
    padding: 20px;
  }

  .sidebar-content h3 {
    margin: 0 0 15px 0;
    color: var(--bleu-protec);
  }

  .sidebar-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-content li {
    margin-bottom: 8px;
  }

  .sidebar-content button {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    background: white;
    color: var(--bleu-protec);
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .sidebar-content button:hover {
    background: #f5f5f5;
    border-color: var(--orange-protec);
  }

  .sidebar-content button.active {
    background: var(--orange-protec);
    color: white;
    border-color: var(--orange-protec);
  }

  /* Sidebar Overlay */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .sidebar {
      width: 280px;
      left: -280px;
    }
  }
</style>