<template>
  <div class="tools-container">
    <div class="tool-card-container">
      <GlowingCard class="tool-card" primaryColor="#4facfe" secondaryColor="#00f2fe">
        <h2>YOGA</h2>
        <p>Discover balance and relaxation through yoga exercises</p>
        <RouterLink :to="'options/yoga'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#ff4b5c" secondaryColor="#DBD65C">
        <h2>SELF ASSESSMENT</h2>
        <p>Evaluate yourself with proven assessments</p>
        <RouterLink :to="'self-assessment'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#12c2e9" secondaryColor="#c471ed">
        <h2>MEDIA LIBRARY</h2>
        <p>Access your multimedia resources</p>
        <RouterLink :to="'media-resources'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#5614B0" secondaryColor="#F29492">
        <h2>DIARY</h2>
        <p>Record your thoughts, emotions, and identify mood influencers</p>
        <RouterLink :to="'diary/diary-list'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#1CD8D2" secondaryColor="#93EDC7">
        <h2>MOOD PATTERN</h2>
        <p>Identify psychological trends based on your daily mood</p>
        <RouterLink :to="'mood-cart'" class="arrow-btn">→</RouterLink>
      </GlowingCard>
    </div>
    <div class="tool-card-container">
      <GlowingCard primaryColor="#4776E6" secondaryColor="#8E54E9">
        <h2>HABIT TRACKER</h2>
        <p>Build a healthy lifestyle through consistent practice and adaptation.</p>
        <RouterLink :to="'habit-tracking'" class="arrow-btn">→</RouterLink>
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
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
  justify-items: center;
  align-items: center;
}

.tool-card-container {
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-card {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

h2 {
  font-size: 20px;
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
