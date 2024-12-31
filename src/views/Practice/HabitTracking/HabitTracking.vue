<template>
  <div class="container mt-5">
    <div class="mood-section mb-4">
      <h2>Mood Check-in</h2>
      <div class="mood-selection">
        <h3>How are you feeling right now?</h3>
        <div class="mood-icons d-flex gap-3 mt-3">
          <span v-for="mood in moods" :key="mood.id" @click="confirmAssessment(mood)"
            :class="{ active: currentMood === mood.id }">
            {{ mood.icon }}
          </span>
        </div>
      </div>
    </div>

    <div class="wellness-features row">
      <div class="col-md-6 mb-4">
        <MoodPet :userMood="currentMood" />
      </div>
      <div class="col-md-6 mb-4">
        <DailyQuest ref="dailyQuest" @reward-earned="onRewardEarned" />
      </div>
    </div>
    <!-- TODO: Make this a separated component -->
    <!-- <div class="tracking-grid row">
      <div class="tracking-card sleep-card col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Sleep Wellness</h3>
            <div class="sleep-input">
              <div class="mb-3 row">
                <label class="col-sm-6 col-form-label">Hours of sleep last night:</label>
                <div class="col-sm-6">
                  <input type="number" class="form-control" v-model="sleepData.hours" @input="updateSleepData" min="0"
                    max="24">
                </div>
              </div>
              TODO: This currently doesn't align in horrizontal, make it look better
              <div class="mb-3 row">
                <label class="col-sm-6 col-form-label">How well did you sleep?</label>
                <div class="col-sm-6">
                  <div class="sleep-quality-rating d-flex gap-2">
                    <span v-for="i in 5" :key="i" @click="setSleepQuality(i)"
                      :class="{ active: (sleepData.quality / 2) >= i }">
                      ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tracking-card wellness-card col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Wellness Recommendations</h3>
            <div class="wellness-recommendations">
              <ul class="list-group">
                <li v-for="(rec, index) in currentRecommendations" :key="index" class="list-group-item">
                  {{ rec }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import MoodPet from './components/MoodPet.vue'
import DailyQuest from './components/DailyQuest.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HabitTracking',
  components: {
    MoodPet,
    DailyQuest,
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
      return this.wellnessRecommendations[this.currentMood] || []
    }
  },
  methods: {
    confirmAssessment(mood) {
      this.currentMood = mood.id;
      this.showAssessment = false;
    },
    generateRecommendation() {
      let recommendations = []

      if (this.currentMood && this.wellnessRecommendations[this.currentMood]) {
        recommendations.push(...this.wellnessRecommendations[this.currentMood])
      }

      if (this.sleepData.hours < 6) {
        recommendations.push(
          'Try to get more rest tonight',
          'Take a short power nap if needed',
          'Reduce screen time before bed'
        )
      }

      if (recommendations.length === 0) {
          recommendations = [
            'Take a moment to breathe deeply 🌬️',
            'Stay hydrated throughout the day 💧',
            'Take short breaks between tasks 🛌',
            'Go for a short walk 🚶‍♂️',
            'Listen to your favorite music 🎵',
            'Do some light stretching 🧘‍♂️',
            'Eat a healthy snack 🍎',
            'Spend time with loved ones ❤️',
            'Read a book 📚',
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

.sleep-quality-rating span {
  cursor: pointer;
  font-size: 1.5rem;
  opacity: 0.3;
  transition: all 0.2s ease;
}

.sleep-quality-rating span.active {
  opacity: 1;
}
</style>