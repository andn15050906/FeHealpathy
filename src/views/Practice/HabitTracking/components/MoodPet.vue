<template>
  <div class="mood-pet-container">
    <div class="pet-status-wrapper">
      <div class="pet-avatar" :class="petMoodClass">
        <img :src="getPetImage" :alt="petName" />
      </div>
      
      <div class="pet-info">
        <h3>{{ petName }}</h3>
        <div class="status-bars">
          <div class="status-bar">
            <span>Hạnh phúc</span>
            <div class="progress-bar">
              <div :style="{ width: `${happiness}%` }" class="progress"></div>
            </div>
          </div>
          <div class="status-bar">
            <span>Năng lượng</span>
            <div class="progress-bar">
              <div :style="{ width: `${energy}%` }" class="progress"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pet-actions">
      <button @click="feedPet" :disabled="!canFeed">
        <span>🍎</span> Cho ăn
      </button>
      <button @click="playWithPet" :disabled="!canPlay">
        <span>🎾</span> Chơi đùa
      </button>
      <button @click="restPet" :disabled="!canRest">
        <span>😴</span> Nghỉ ngơi
      </button>
    </div>

    <div class="pet-messages" v-if="showMessage">
      {{ currentMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  userMood: {
    type: String,
    default: 'neutral'
  }
})

const petName = ref('Mochi')
const happiness = ref(80)
const energy = ref(70)
const showMessage = ref(false)
const currentMessage = ref('')

const petMoodClass = computed(() => {
  if (happiness.value < 30) return 'sad'
  if (happiness.value > 80) return 'very-happy'
  return 'normal'
})

const getPetImage = computed(() => {
  // Thay đổi hình ảnh thú cưng dựa trên tâm trạng
  switch(petMoodClass.value) {
    case 'sad': return '/pets/sad-pet.png'
    case 'very-happy': return '/pets/happy-pet.png'
    default: return '/pets/normal-pet.png'
  }
})

// Các methods tương tác với thú cưng
const feedPet = () => {
  happiness.value = Math.min(100, happiness.value + 10) // Tăng hạnh phúc
  energy.value = Math.min(100, energy.value + 15)      // Tăng năng lượng
  showPetMessage('Ngon quá! 😋')
}

const playWithPet = () => {
  happiness.value = Math.min(100, happiness.value + 20) // Tăng nhiều hạnh phúc
  energy.value = Math.max(0, energy.value - 10)        // Giảm năng lượng
  showPetMessage('Vui quá! Chơi tiếp nữa đi! 🎾')
}

const restPet = () => {
  energy.value = Math.min(100, energy.value + 30)      // Tăng nhiều năng lượng
  showPetMessage('Nghỉ ngơi thật thoải mái... 😴')
}

// Kiểm tra xem có thể thực hiện hành động không
const canFeed = computed(() => energy.value < 100)
const canPlay = computed(() => energy.value > 20)
const canRest = computed(() => energy.value < 80)

const showPetMessage = (message) => {
  currentMessage.value = message
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

// Watch user mood changes
watch(() => props.userMood, (newMood) => {
  switch(newMood) {
    case 'happy':
      happiness.value = Math.min(100, happiness.value + 15)
      showPetMessage('Chủ nhân vui vẻ, tôi cũng vui! 🎉')
      break
    case 'sad':
      happiness.value = Math.max(0, happiness.value - 10)
      showPetMessage('Đừng buồn chủ nhân ơi... 🥺')
      break
  }
})
</script>

<style scoped>
.mood-pet-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pet-status-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.pet-avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border: 3px solid #e1e1e1;
  transition: all 0.3s ease;
}

.pet-avatar.sad { border-color: #ffd3d3; }
.pet-avatar.very-happy { border-color: #75c9c8; }

.pet-info {
  flex: 1;
}

.status-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-bar {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #75c9c8;
  transition: width 0.3s ease;
}

.pet-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.pet-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pet-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pet-messages {
  margin-top: 15px;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
