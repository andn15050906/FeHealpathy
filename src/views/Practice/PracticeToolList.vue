<template>
  <div class="container">
    <GlowingCard primaryColor="#4facfe" secondaryColor="#00f2fe">
      <h2>YOGA</h2>
      <p>Khám phá sự cân bằng và thư giãn qua các bài tập Yoga chuyên nghiệp, cải thiện cả thể chất và tinh thần.</p>
      <RouterLink :to="'practice/yoga'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#ff4b5c" secondaryColor="#DBD65C">
      <h2>SELF ASSESSMENT</h2>
      <p>Đánh giá bản thân bằng những bài test đã được kiểm nghiệm</p>
      <RouterLink :to="'self-assessment'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#12c2e9" secondaryColor="#c471ed">
      <h2>LIBRARY</h2>
      <p>Tiếp cận nguồn tài nguyên đa phương tiện của bạn</p>
      <RouterLink :to="'habit-tracking'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#5614B0" secondaryColor="#F29492">
      <h2>DIARY</h2>
      <p>Ghi lại suy nghĩ, cảm xúc và nhận diện các tác nhân ảnh hưởng tới cảm xúc</p>
      <RouterLink :to="'diary/diary-list'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#1CD8D2" secondaryColor="#93EDC7">
      <h2>MOOD PATTERN</h2>
      <p>Nhận diện xu hướng tâm lý dựa vào trạng thái cảm xúc hàng ngày</p>
      <RouterLink :to="'mood'" class="arrow-btn">→</RouterLink>
    </GlowingCard>
    <GlowingCard primaryColor="#4776E6" secondaryColor="#8E54E9">
      <h2>HABIT TRACKER</h2>
      <p>Hình thành lối sống lành mạnh thông qua sự rèn luyện và thích nghi.</p>
      <RouterLink :to="'habit-tracking'" class="arrow-btn">→</RouterLink>
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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