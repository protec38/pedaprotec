<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const cardDefinitions = ref()
  const activeQuestion = ref()

  let cardModal: HTMLDialogElement;

  onMounted(() => {
    cardModal = document.getElementById("card") as HTMLDialogElement;


    fetchCardsDefinitions().then((value) => {
      cardDefinitions.value = value.definitions
    })
  })

  function openModal(cardTypeId: string) {
      cardDefinitions.value.forEach((element: { id: string; questions: string }) => {
        if (element.id == cardTypeId) {
          const randomIndex = Math.floor(Math.random() * element.questions.length);
          activeQuestion.value = element.questions[randomIndex]
        }
      });
      cardModal.showModal();
  }

  function closeModal() {
    console.log("close modal");
    cardModal.close();
  }

  function fetchCardsDefinitions() {
    return fetch('cards-definitions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      });

  }
</script>

<template>
  <section v-for="cardType in cardDefinitions" :id="cardType.id" :key="cardType.id" :style="{ backgroundColor: cardType.color, backgroundImage: 'url('+cardType.picture+')' }" @click="openModal(cardType.id)">
    <h2>{{ cardType.title }}</h2>
  </section>
  <dialog id="card">
    <!-- Container for 3D perspective -->
    <div class="card-wrapper">
      <!-- Flipping element -->
      <div class="card">
        <!-- Front face with content -->
        <div class="card-face card-front">
          <p class="question">{{ activeQuestion }}</p>
          <button @click="closeModal">Fermer</button>
        </div>
        <!-- Back face (blue background) -->
        <div class="card-face card-back"></div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
/*
 * Modal Dialog
 * Full-screen container that centers the card
 */
#card {
  position: absolute;
  width: 100vw;
  height: 100vh;
  border: 13px solid green;
  padding: 0;
  margin: 0;
  background: transparent;
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
  width: 80vw;
  height: 80vh;
  margin-left: 0vw;
  perspective: 2000px;
  border:5px solid red;
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
  border-radius: 10px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Front face - content side */
.card-front {
  background: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* Back face - initial visible side */
.card-back {
  background: white;
  background-image: url('https://www.protection-civile.org/wp-content/uploads/2020/01/logo-protec-1.png');
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
  align-items: center;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
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
