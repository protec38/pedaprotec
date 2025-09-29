<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import markdownit from 'markdown-it'
  import YAML from 'yaml'


  const cardDefinitions = ref()
  const activeQuestion = ref()

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
      cardDefinitions.value.forEach((element: { id: string; questions: string }) => {
        if (element.id == cardTypeId) {
          console.log(element)
          const randomIndex = Math.floor(Math.random() * element.questions.length);
          activeQuestion.value = md.render(element.questions[randomIndex])
        }
      });
      cardModal.showModal();
  }

  function closeModal() {
    console.log("close modal");
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
</script>

<template>
  <main>
    <section v-for="cardType in cardDefinitions" :id="cardType.id" :key="cardType.id" :style="{ backgroundColor: cardType.color, backgroundImage: 'url('+cardType.picture+')' }" @click="openModal(cardType.id)">
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
