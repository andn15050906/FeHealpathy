<template>
    <div class="container">
      <GlowingCard primaryColor="#4facfe" secondaryColor="#00f2fe" class="left-card">
        <h2>ÂM NHẠC</h2>
        <p>Đắm mình trong thế giới của những giai điệu nhẹ nhàng và những bản nhạc tích cực để nâng cao sức khỏe tinh thần của bạn.</p>
        <RouterLink :to="'music-library'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
      <GlowingCard primaryColor="#ff4b5c" secondaryColor="#DBD65C" class="right-card">
        <h2>VIDEO</h2>
        <p>Khám phá bộ sưu tập video phong phú được thiết kế để truyền cảm hứng, giáo dục và hướng dẫn bạn trong hành trình khám phá bản thân.</p>
        <RouterLink :to="'video-library'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
  </template>
  
  <script>
  import GlowingCard from '@/components/Common/GlowingCard.vue';
  
  export default {
    name: "MediaResources",
    components: {
      GlowingCard
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 20px;
    height: 100vh;
  }
  
  .left-card,
  .right-card {
    flex: 1;
    max-width: 45%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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
  