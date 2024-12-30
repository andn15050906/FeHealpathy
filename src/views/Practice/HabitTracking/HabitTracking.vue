<template>
  <div class="habit-tracking">
    <div class="mood-section">
      <h2>Mood Check-in</h2>
      <div class="mood-selection">
        <h3>How are you feeling right now?</h3>
        <div class="mood-icons">
          <span v-for="mood in moods" 
                :key="mood.id" 
                @click="confirmAssessment(mood)"
                :class="{ active: currentMood === mood.id }">
            {{ mood.icon }}
          </span>
        </div>
      </div>
    </div>

    <div class="wellness-features">
      <MoodPet :userMood="currentMood" />
      <DailyQuest ref="dailyQuest" @reward-earned="onRewardEarned" />
      <MoodAssessment v-if="showAssessment" />
    </div>

    <div class="tracking-grid">
      <div class="tracking-card sleep-card">
        <h3>Sleep Wellness</h3>
        <div class="sleep-input">
          <div class="input-group">
            <label>Hours of sleep last night:</label>
            <input type="number" v-model="sleepData.hours" @input="updateSleepData" min="0" max="24">
          </div>
          <div class="input-group">
            <label>How well did you sleep?</label>
            <div class="sleep-quality-rating">
              <span v-for="i in 5" 
                    :key="i" 
                    @click="setSleepQuality(i)"
                    :class="{ active: (sleepData.quality / 2) >= i }">
                ⭐
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="tracking-card wellness-card">
        <h3>Wellness Recommendations</h3>
        <div class="wellness-recommendations">
          <ul>
            <li v-for="(rec, index) in currentRecommendations" 
                :key="index">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MoodPet from './components/MoodPet.vue'
import DailyQuest from './components/DailyQuest.vue'
import StressAssessment from './components/StressAssessment.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HabitTracking',
  components: {
    MoodPet,
    DailyQuest,
    MoodAssessment
  },
  data() {
    return {
      moods: [
        { id: 'relaxed', icon: '😌', label: 'Relaxed' },
        { id: 'calm', icon: '😊', label: 'Calm' },
        { id: 'anxious', icon: '😰', label: 'Anxious' },
        { id: 'stressed', icon: '😫', label: 'Stressed' }
      ],
      currentMood: null,
      showAssessment: false,
      sleepData: {
        hours: 0,
        quality: 0
      },
      wellnessRecommendations: {
        stressed: [
          'Take 5 deep breaths',
          'Listen to calming music',
          'Try a quick meditation',
          'Take a short walk'
        ],
        anxious: [
          'Practice grounding exercises',
          'Write in your journal',
          'Do gentle stretching',
          'Drink calming tea'
        ],
        relaxed: [
          'Maintain this peaceful state',
          'Do some light stretching',
          'Practice gratitude'
        ],
        calm: [
          'Continue your mindful activities',
          'Enjoy some quiet time',
          'Write in your journal'
        ]
      },
      totalSleepHours: 7,
      sleepQuality: 8
    }
  },
  computed: {
    currentRecommendations() {
      if (!this.currentMood) return []
      
      // Return recommendations based on current mood
      return this.wellnessRecommendations[this.currentMood] || []
    }
  },
  methods: {
    confirmAssessment(mood) {
      this.currentMood = mood.id;
      const confirm = window.confirm("Would you like to participate in the stress assessment?");
      if (confirm) {
        this.$router.push({ name: 'StressAssessment' }); // Navigate to the assessment page
      } else {
        this.showAssessment = false; // Reload the current page
      }
    },
    generateRecommendation() {
      let recommendations = []

      // Add mood-based recommendations
      if (this.currentMood && this.wellnessRecommendations[this.currentMood]) {
        recommendations.push(...this.wellnessRecommendations[this.currentMood])
      }

      // Add sleep-based recommendations
      if (this.sleepData.hours < 6) {
        recommendations.push(
          'Try to get more rest tonight',
          'Take a short power nap if needed',
          'Reduce screen time before bed'
        )
      }

      // If no recommendations, provide default ones
      if (recommendations.length === 0) {
        recommendations = [
          'Take a moment to breathe deeply',
          'Stay hydrated throughout the day',
          'Take short breaks between tasks'
        ]
      }

      return recommendations
    },
    setSleepQuality(stars) {
      this.sleepData.quality = stars * 2
      this.updateSleepData()
    },
    updateSleepData() {
      this.totalSleepHours = this.sleepData.hours
      this.sleepQuality = this.sleepData.quality
      this.$refs.dailyQuest.updateQuestProgress('sleep', this.sleepData)
    },
    onRewardEarned(reward) {
      // Handle earned rewards
      this.showRewardNotification(reward)
    }
  }
}
</script>

<style scoped>
.habit-tracking {
  padding: 20px;
}

.mood-section {
  margin-bottom: 30px;
}

.mood-icons {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.mood-icons span {
  font-size: 30px;
  cursor: pointer;
  transition: transform 0.2s ease;
  opacity: 0.5;
}

.mood-icons span.active {
  opacity: 1;
  transform: scale(1.2);
}

.wellness-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.tracking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tracking-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.sleep-quality-rating {
  display: flex;
  gap: 8px;
  font-size: 20px;
  cursor: pointer;
}

.sleep-quality-rating span {
  opacity: 0.3;
  transition: all 0.2s ease;
}

.sleep-quality-rating span.active {
  opacity: 1;
}

.stat-box {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-box .label {
  font-size: 14px;
  color: #666;
}

.stat-box .value {
  font-size: 24px;
  font-weight: bold;
  color: #75c9c8;
}

.wellness-recommendations {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.wellness-recommendations ul {
  list-style-type: none;
  padding: 0;
}

.wellness-recommendations li {
  padding: 8px 0;
  border-bottom: 1px dashed #ddd;
  color: #666;
}
</style>
