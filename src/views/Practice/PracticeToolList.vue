<template>
  <div class="container">
    <div class="box yoga">
      <h2>YOGA</h2>
      <p>
        Khám phá sự cân bằng và thư giãn qua các bài tập Yoga chuyên nghiệp, cải thiện cả thể chất và tinh thần.
      </p>
      <button @click="navigateToYoga">→</button>
    </div>

    <div class="box gym">
      <h2>GYM</h2>
      <p>
        Nâng cao thể lực, sức khỏe và hình thể qua các bài tập Gym hiệu quả cùng chương trình tập luyện thông minh.
      </p>
      <button @click="navigateToGym">→</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FitnessBoxes",
  methods: {
    navigateToYoga() {
      this.$router.push({ name: 'YogaExerciseDetail' });
    },
    navigateToGym() {
      this.$router.push({ name: 'GymExerciseDetail' });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100%;
  width: 100vw;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  height: 50vh;
}

.box:hover {
  transform: scale(1.05);
}

.yoga {
  background: linear-gradient(to bottom, #4facfe, #00f2fe);
}

.gym {
  background: linear-gradient(to bottom, #ff4b5c, #ff0844);
}

h2 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: bold;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

button {
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 50%;
  padding: 10px 15px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: white;
  color: #333;
}
</style>
