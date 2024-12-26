<template>
  <div class="container">
    <GlowingCard primaryColor="#4facfe" secondaryColor="#00f2fe">
      <h2>YOGA</h2>
      <p>Khám phá sự cân bằng và thư giãn qua các bài tập Yoga chuyên nghiệp, cải thiện cả thể chất và tinh thần.</p>
      <RouterLink :to="'practice/yoga'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#ff4b5c" secondaryColor="#F29492">
      <h2>GYM</h2>
      <p>
        Nâng cao thể lực, sức khỏe và hình thể qua các bài tập Gym hiệu quả cùng chương trình tập luyện thông minh.
      </p>
      <RouterLink :to="'GymExerciseDetail'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#5614B0" secondaryColor="#DBD65C">
      <h2>HABIT TRACKER</h2>
      <p>Hình thành lối sống lành mạnh thông qua sự rèn luyện và thích nghi.</p>
      <RouterLink :to="'practice/habit-tracking'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
  </div>
</template>

<script>
import GlowingCard from '@/components/Common/GlowingCard.vue';

export default {
  name: "PracticeToolList",
  components: {
    GlowingCard
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  height: 100%;
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

.arrow-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  border-radius: 50%;
  padding: 10px 15px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;
}

.arrow-btn:hover {
  background: white;
  color: #333;
}
</style>