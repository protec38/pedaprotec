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
    <div id="card-front">
      <section>{{ activeQuestion }}</section>
      <nav><button id="close" @click="closeModal">Fermer</button></nav>
    </div>
    <div id="card-back"></div>
  </dialog>
</template>

<style scoped></style>
