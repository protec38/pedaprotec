<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import markdownit from 'markdown-it'
  import YAML from 'yaml'

  import GameCountdown from './GameCountdown.vue';


  const cardDefinitions = ref()
  const activeQuestion = ref()
  const hasTimer = ref(false)
  const timerMinutes = ref(0)

  const md = new markdownit({
    html: true,
    linkify: true,
    typographer: true,
  });

  let cardModal: HTMLDialogElement;

  onMounted(() => {
    cardModal = document.getElementById("card") as HTMLDialogElement;


    fetchCardsDefinitions().then((value) => {
      cardDefinitions.value = value
    })
  })

  function openModal(cardTypeId: string) {
      cardDefinitions.value.forEach((element: { id: string; questions: string; timer: number }) => {
        if (element.id == cardTypeId) {
          const randomIndex = Math.floor(Math.random() * element.questions.length);
          activeQuestion.value = md.render(element.questions[randomIndex])
          if (element.timer) {
            console.log("element.timer", element.timer)
            hasTimer.value = true;
            timerMinutes.value = element.timer;
          } else {
            hasTimer.value = false;
          }
        }
      });
      cardModal.showModal();
  }

  function closeModal() {
    cardModal.close();
  }

  function fetchCardsDefinitions() {
    return fetch('cards-definitions.yaml')
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return YAML.parse(await response.text());
      });

  }

  function getStyle(cardType: { color: any; picture: string }) {
    return {
      backgroundColor: cardType.color,
      backgroundImage: 'url(img/'+cardType.picture+')'
    }
  }
</script>

<template>
  <main>
    <section v-for="cardType in cardDefinitions" :id="cardType.id" :key="cardType.id" :style="getStyle(cardType)" @click="openModal(cardType.id)">
      <h2>{{ cardType.title }}</h2>
    </section>
  </main>
  <dialog id="card">
    <!-- Container for 3D perspective -->
    <div class="card-wrapper">
      <!-- Flipping element -->
      <div class="card">
        <!-- Front face with content -->
        <div class="card-face card-front">
          <div class="question" v-html="activeQuestion"></div>
          <game-countdown v-if="hasTimer" :minutes="timerMinutes"></game-countdown>
          <button @click="closeModal">Fermer</button>
        </div>
        <!-- Back face (blue background) -->
        <div class="card-face card-back"></div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
</style>
