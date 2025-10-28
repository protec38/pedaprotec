<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import markdownit from 'markdown-it'
  import YAML from 'yaml'

  import GameCountdown from './GameCountdown.vue';

  const props = defineProps({
    definition: {
    type: Object,
    required: true,
    }
  })

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
  })

  function openModal(cardType: { questions: string[]; timer?: number }) {
    const randomIndex = Math.floor(Math.random() * cardType.questions.length);
    activeQuestion.value = md.render(cardType.questions[randomIndex])

    if (cardType.timer) {
      console.log("cardType.timer", cardType.timer)
      hasTimer.value = true;
      timerMinutes.value = cardType.timer;
    } else {
      hasTimer.value = false;
    }
    
    cardModal.showModal();
  }

  function closeModal() {
    cardModal.close();
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
    <section v-for="cardType in props.definition" :id="cardType.id" :key="cardType.id" :style="getStyle(cardType)" @click="openModal(cardType)">
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
