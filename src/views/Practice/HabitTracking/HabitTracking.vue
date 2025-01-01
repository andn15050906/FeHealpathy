<template>
  <div class="habit-tracking">
    <div class="mood-section">
      <h2>What is Your Mood Today?</h2>
      <div class="mood-layout">
        <div class="mood-chart">
          <PieChart :moodData="moodData" />
        </div>
        <div class="mood-selection">
          <span @click="selectMood('happy')" class="mood-icon" :class="{ active: currentMood === 'happy' }">😊</span>
          <span @click="selectMood('relaxed')" class="mood-icon" :class="{ active: currentMood === 'relaxed' }">😌</span>
          <span @click="selectMood('anxious')" class="mood-icon" :class="{ active: currentMood === 'anxious' }">😟</span>
          <span @click="selectMood('stressed')" class="mood-icon" :class="{ active: currentMood === 'stressed' }">😣</span>
          <span @click="selectMood('sad')" class="mood-icon" :class="{ active: currentMood === 'sad' }">😢</span>
        </div>
      </div>
    </div>

    <div class="sleep-input">
      <h3>Sleep Quality</h3>
      <input type="number" v-model="sleepHours" placeholder="Hours of Sleep" />
      <div>
        <label>Sleep Quality:</label>
        <div class="star-rating">
          <span v-for="star in 5" :key="star" @click="setSleepQuality(star)" class="star" :class="{ filled: sleepQuality >= star }">⭐</span>
        </div>
      </div>
      <button @click="submitSleepData">Submit Sleep Data</button>
    </div>

    <div class="wellness-features">
      <SleepChart :sleepData="sleepData" />
      <Checklist :stressLevel="stressLevel" :checklistItems="checklistItems" />
    </div>
  </div>
</template>

<script>
import SleepChart from './components/SleepChart.vue';
import Checklist from './components/Checklist.vue';
import PieChart from './components/PieChart.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'HabitTracking',
  components: {
    SleepChart,
    Checklist,
    PieChart
  },
  data() {
    return {
      moodData: {
        happy: 10,
        relaxed: 5,
        anxious: 3,
        stressed: 2,
        sad: 1
      },
      currentMood: null,
      sleepData: {
        hours: [7, 6, 8, 5, 9],
        quality: [4, 3, 5, 2, 4]
      },
      sleepHours: null,
      sleepQuality: 5,
      stressLevel: null,
      checklistItems: []
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const stressLevel = ref(null);

    onMounted(() => {
      if (route.query.stressLevel) {
        stressLevel.value = Number(route.query.stressLevel);
      }
    });

    return { stressLevel, router };
  },
  methods: {
    selectMood(mood) {
      this.currentMood = mood;
      this.moodData[mood] += 1;

      this.updateChecklist();

      if (mood === 'stressed') {
        if (confirm("Do you want to take the stress assessment?")) {
          this.router.push('/stress-assessment');
        }
      }
    },
    setSleepQuality(rating) {
      this.sleepQuality = rating;
    },
    submitSleepData() {
      if (this.sleepHours && this.sleepQuality) {
        this.sleepData.hours.push(this.sleepHours);
        this.sleepData.quality.push(this.sleepQuality);
        this.sleepHours = null;
        this.sleepQuality = 5;
        this.updateChecklist();
      }
    },
    updateChecklist() {
      this.checklistItems = [];
      if (this.currentMood) {
        this.checklistItems.push(`Take a moment to relax when feeling ${this.currentMood}.`);
      }
      if (this.sleepHours) {
        this.checklistItems.push(`Ensure you get at least 7 hours of sleep.`);
      }
      if (this.stressLevel) {
        this.checklistItems.push(`Consider stress-relief activities.`);
      }
    }
  }
}
</script>

<style scoped>
.habit-tracking {
  padding: 20px;
  position: relative;
}

.mood-section {
  margin-bottom: 30px;
  text-align: right;
}

.mood-layout {
  display: flex;
  justify-content: space-between;
}

.mood-chart {
  height: 505px;
  width: 500px;
  margin-right: 20px;
}

.mood-selection {
  display: flex;
  flex-direction: row;
  font-size: 16px;
}

.mood-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.mood-icon.active {
  transform: scale(1.2);
}

.sleep-input {
  margin-top: 20px;
}

.star-rating {
  display: flex;
  cursor: pointer;
}

.star {
  font-size: 24px;
  color: gray;
}

.star.filled {
  color: gold;
}

.wellness-features {
  margin-top: 20px;
}
</style>