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
    <a v-for="{title, id} in props.gamesList" :key="id" @click="$emit('gameSelected', id)">{{ title }}</a>
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

  a {
    display: block;
    border: 1px solid black;
    border-radius: 1vh;
    margin: 1vh;
    text-align: center;
    box-shadow: 0px 1px 1px whitesmoke;
    background-color: whitesmoke;
  }

  a:hover {
    background-color: var(--orange-protec);
  }
</style>