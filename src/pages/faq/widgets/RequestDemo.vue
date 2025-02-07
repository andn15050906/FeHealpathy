<template>
  <VaCard class="mb-5 pr-4 flex justify-between">
    <div>
      <VaCardContent>
        <h2 class="va-h5">Need help?</h2>
        <p class="text-base leading-5">Contact our health experts for personalized guidance.</p>
      </VaCardContent>
      <div class="p-4">
        <VaButton @click="showModal = !showModal">Contact Expert</VaButton>
      </div>
    </div>
    <!--add request-demo image -->
  </VaCard>
</template>

<script setup>
import { ref } from 'vue'

import { useForm, useToast } from 'vuestic-ui'

const showModal = ref(false)
const email = ref('')
const { validate } = useForm('form')
const { init } = useToast()

const submit = async () => {
  if (!validate()) {
    return
  }
  init({
    title: 'Demo Request Submitted!',
    message: 'An expert will get in touch soon',
    color: 'success',
  })
  showModal.value = false
}
</script>

<style scoped>
.va-h5 {
  font-size: 1.5rem;
  color: #154EC1; 
}

.text-base {
  margin-bottom: 0.5rem;
}

img {
  max-width: 100px; 
  height: auto; 
}
</style>
