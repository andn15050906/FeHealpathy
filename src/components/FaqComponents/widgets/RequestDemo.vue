<template>
  <VaCard class="help-card">
    <VaCardContent class="help-content">
      <div class="help-text">
        <h2 class="help-title">Cần trợ giúp?</h2>
        <p class="help-description">Liên hệ chuyên gia khỏe mạnh của chúng tôi để nhận hướng dẫn cá nhân.</p>
        <VaButton @click="showModal = true">Liên hệ chuyên gia</VaButton>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'

const showModal = ref(false)
const { validate } = useForm('form')
const { init } = useToast()

const submit = async () => {
  if (!validate()) return

  init({
    title: 'Yêu cầu demo đã được gửi!',
    message: 'Một chuyên gia sẽ liên hệ sớm',
    color: 'success',
  })

  showModal.value = false
}
</script>

<style scoped>
.help-card {
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.help-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.help-text {
  max-width: 60%;
}

.help-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #154EC1;
  margin-bottom: 0.5rem;
}

.help-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.help-image {
  max-width: 120px;
  height: auto;
}
</style>
