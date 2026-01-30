<script setup lang="ts">
  const props = defineProps({
    gamesList: {
      type: Array as () => Array<{ id: string | number; title: string }>,
      required: true,
    }
  })

</script>

<template>
  <main>
    <h1>Sélectionner un jeu !</h1>
    <span class="game-list">
      <a v-for="{title, id} in props.gamesList" :key="id" @click="$emit('gameSelected', id)">{{ title }}</a>
    </span>
  </main>
</template>

<style scoped>
  main {
    background-color: var(--bleu-protec);
  }

  h1 {
    color: var(--orange-protec);
    margin: 1vh;
    margin-top: 0;
    text-align: center;
    font-size: xx-large;
  }

  .game-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  a {
    display: block;

    border: 1px solid black;
    border-radius: 1vh;

    margin: 1vh;
    padding: 1vh;

    overflow: clip;
    text-overflow: clip;

    box-shadow: 0px 1px 1px whitesmoke;
    background-color: whitesmoke;

    width: 50%;
    max-width: 95vw;
    min-width: fit-content;

    height: auto;
    
    text-align: center;
    font-size: large;
    text-decoration: none;

  }

  a:hover {
    background-color: var(--orange-protec);
  }
</style>