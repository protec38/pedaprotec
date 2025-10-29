<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import markdownit from 'markdown-it'

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

  function getStyle(cardType: { color: string; picture: string }) {
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
  main {
    display: flex;
    flex-direction: column;
  }
  main > section {
    background-color: lightsalmon;
    border-radius: 1vh;
    margin: 1vh;
    padding: 1vh;
    flex-grow: 1;

    min-height: 0;

    display: flex;
    align-items: center;

    overflow: hidden;

    background-origin: content-box;
    background-size: contain;
    background-repeat: no-repeat;

    box-shadow: black 1px 1px 1px;
  }

  main > section h2 {
    font-variant: small-caps;
    text-shadow: white 1px 1px 1px;
    flex-grow: 1;
    text-align: center;
  }

  /*
  * Modal Dialog
  * Full-screen container that centers the card
  */
  #card {
    width: 100vw;
    height: 100vh;
    background: transparent;
    border: none;
  }

  #card[open] {
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  #card::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  /*
  * Card Container & 3D Space
  * Handles perspective and dimensions
  */
  .card-wrapper {
    width: min(90vw, 90dvw);
    height: min(95vh, 95dvh);
    margin: auto;
    perspective: 2000px;
    overflow: visible;
  }

  /*
  * Card Element
  * Manages 3D transforms and animations
  */
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  /* Initial position (off-screen) */
  #card:not([open]) .card {
    transform: translateY(-100vh) rotateX(180deg);
  }

  /* Animation when dialog opens */
  #card[open] .card {
    animation: slideAndFlip 1s ease-in forwards;
  }

  /*
  * Card Faces
  * Common styles for front and back
  */
  .card-face {
    position: absolute;
    inset: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background-color: white;  /* Ensure white background extends to edges */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  /* Lighter, more subtle shadow */
    border: none;  /* Remove any potential borders */
    overflow: hidden;  /* Prevent content overflow */
  }

  /* Front face - content side */
  .card-front {
    background: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow: scroll;
  }

  /* Back face - initial visible side */
  .card-back {
    background: white;
    background-image: url('img/logo_fnpc.png');
    background-size: auto 40%;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotateX(180deg);
  }

  /*
  * Content Styling
  */
  .question {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 1rem;
    font-size: 3vh;
  }

  .question :deep(strong) {
    color: var(--orange-protec)
  }

  .question :deep(em) {
    color: var(--bleu-protec);
  }

  /* Close button */
  button {
    padding: 0.5rem 2rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background: #f0f0f0;
  }

  /*
  * Animation
  * 1. Slide down (0-40%)
  * 3. Flip (40-100%)
  */
  @keyframes slideAndFlip {
    0% {
      transform: translateY(-100vh) rotateX(-180deg);
    }
    40% {
      transform: translateY(0) rotateX(-180deg);
    }
    100% {
      transform: translateY(0) rotateX(0deg);
    }
  }
</style>
