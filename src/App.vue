<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import markdownit from 'markdown-it'
  import YAML from 'yaml'

  import Game from './Game.vue';

  const selectedGame = ref();
  const gamesList = [
    {id: 'mission-pedago', title: "Mission pédago", definitionFile: "mission-pedago.yaml"}, 
    {id: 'sos-citoyen', title: "SOS Citoyen", definitionFile: "sos-citoyen.yaml"},
    {id: 'malaise-dating', title: "Malaise Dating", definitionFile: "malaise-dating.yaml"}
  ]

  onMounted(() => {
    let selectedGameId = localStorage.getItem("selected_game");
    if (selectedGameId != null) {
      try {
        loadGame(selectedGameId)
      } catch (e) {
        console.error(e)
      }
    }
  })

  function loadGame(gameId) {
    const game = gamesList.find(game => game.id === gameId)
    if (game) {
      fetchCardsDefinitions(game.definitionFile).then((value) => {
        selectedGame.value = value
      })
    } else {
      throw new Error("Game not found")
    }
  }

  function selectGame(gameId) {
    localStorage.setItem("selected_game", gameId)
    loadGame(gameId)
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
  <main v-if="selectedGame == null">
    Sélectionner un jeu ! 
    <ul>
      <li v-for="{title, id} in gamesList"><a @click="selectGame(id)">{{ title }}</a></li>
    </ul>
  </main>
  <Game v-else :definition="selectedGame"/>
</template>

<style scoped>
</style>
