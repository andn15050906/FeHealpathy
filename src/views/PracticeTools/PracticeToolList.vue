<template>
  <div class="tools-container">
    <div class="tool-card-container">
      <GlowingCard class="tool-card" primaryColor="#6366F1" secondaryColor="#8B5CF6">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-spa"></i>
          </div>
          <h2>YOGA</h2>
          <p>Khám phá sự cân bằng và thư giãn thông qua các bài tập yoga</p>
          <RouterLink :to="'options/yoga'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#EC4899" secondaryColor="#F472B6">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <h2>TỰ ĐÁNH GIÁ</h2>
          <p>Đánh giá bản thân với các bài kiểm tra đã được kiểm chứng</p>
          <RouterLink :to="'self-assessment'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#3B82F6" secondaryColor="#60A5FA">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-photo-video"></i>
          </div>
          <h2>Phương tiện truyền thông</h2>
          <p>Truy cập nguồn tài nguyên đa phương tiện của bạn</p>
          <RouterLink :to="'media-resources'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#10B981" secondaryColor="#34D399">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-book"></i>
          </div>
          <h2>NHẬT KÝ</h2>
          <p>Ghi lại suy nghĩ, cảm xúc và xác định các yếu tố ảnh hưởng đến tâm trạng</p>
          <RouterLink :to="'diary/diary-list'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#F59E0B" secondaryColor="#FBBF24">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-smile"></i>
          </div>
          <h2>CẬP NHẬT TRẠNG THÁI CẢM XÚC</h2>
          <p>Xác định xu hướng tâm lý dựa trên tâm trạng hàng ngày của bạn</p>
          <RouterLink :to="'mood-cart'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#8B5CF6" secondaryColor="#A78BFA">
        <div class="card-content">
          <div class="icon-wrapper">
            <i class="fas fa-tasks"></i>
          </div>
          <h2>THEO DÕI THÓI QUEN</h2>
          <p>Xây dựng lối sống lành mạnh thông qua thực hành và điều chỉnh liên tục</p>
          <RouterLink :to="'habit-tracking'" class="arrow-btn">
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </GlowingCard>
    </div>
  </div>
</template>

<script>
import GlowingCard from '@/components/Common/GlowingCard.vue';

export default {
  name: "PracticeToolList",
  components: {
    GlowingCard
  }
};
</script>

<style scoped>
.tools-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 30px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  justify-items: center;
  align-items: stretch;
}

@media (max-width: 1200px) {
  .tools-container {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .tools-container {
    grid-template-columns: repeat(1, 1fr);
    max-width: 400px;
  }
}

.tool-card-container {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.tool-card-container:hover {
  transform: translateY(-5px);
}

.tool-card {
  width: 100%;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.icon-wrapper i {
  font-size: 24px;
  color: white;
}

h2 {
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

p {
  font-size: 15px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-weight: 300;
}

.arrow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-top: auto;
  backdrop-filter: blur(5px);
}

.arrow-btn:hover {
  background: white;
  color: #333;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.arrow-btn:hover .arrow {
  transform: translateX(3px);
}
</style>
