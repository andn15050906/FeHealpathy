<template>
  <div class="diary-button-container" @click="navigateToDiary">
    <button class="diary-button" :title="'Writing diary'">
      <i class="fa-solid fa-pen-clip"></i>
      <span class="diary-text">Writing diary</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'DiaryButton',
  props: {
    moodType: {
      type: String,
      required: true
    }
  },
  methods: {
    navigateToDiary() {
      this.$router.push({ name: 'DiaryWriting' })
    }
  }
}
</script>

<style scoped>
.diary-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.diary-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diary-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.diary-button i {
  font-size: 1.5rem;
  color: #282828;
}

.diary-text {
  font-size: 1rem;
  font-weight: bold;
  color: #282828;
}
</style>
