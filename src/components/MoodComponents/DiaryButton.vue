<template>
  <div class="diary-button-container">
    <button @click="navigateToDiary" class="diary-button" :title="'Writing diary'">
      <i class="fa-solid fa-pen-clip"></i>
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
      this.$router.push({
        path: '/diary/diary-writing'
      })
    }
  }
}
</script>

<style scoped>
.diary-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.diary-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diary-button i {
  font-size: 1.5rem;
  color: #282828;
}

.diary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 1);
}

.diary-button:active {
  transform: translateY(0);
}
</style> 