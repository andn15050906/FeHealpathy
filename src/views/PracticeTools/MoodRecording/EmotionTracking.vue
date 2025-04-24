<template>
  <div class="dashboard-container">
    <div class="emotion-dashboard">
      <header class="header-section">
        <div class="user-profile">
          <div class="avatar" role="img" aria-label="User avatar"></div>
          <div class="user-info">
            <p class="greeting">Have a good day!</p>
            <p class="username">Olivia</p>
          </div>
        </div>
        <button class="notification-btn" aria-label="View notifications">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f0ea7bfa9a973034f78ea9f3d117061f0ebc3f49fc3c8d28e5bfe58508ef7f24?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
            alt="" class="notification-icon" />
        </button>
      </header>

      <section class="overview-section">
        <h1 class="overview-title">Emotion Overview</h1>
        <p class="overview-subtitle">Your daily emotion statistics</p>
      </section>

      <div class="stats-container">
        <div class="stats-grid">
          <div class="emotion-chart">
            <div class="chart-wrapper">
              <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d69c6209672612da63c043a38b1a9c3b0c93d8c6676caf71ac0759711cef3fd?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                class="chart-background" alt="" role="presentation" />
            </div>
            <p class="emotion-status">Good</p>
          </div>

          <div class="daily-tracker">
            <div class="tracker-header">
              <span class="tracker-date">Today</span>
            </div>
            <div class="tracker-content">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c7749e10a4cb727e5ce0c7fd48d44fb683bf93b2fa7c59643148748496b286b0?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                alt="" class="tracker-icon" />
              <div class="tracker-avatars">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/66d1cbb29a71ed410869fc322ebff79ab649de2ab156a0c4ca152f4536989181?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                  alt="User avatar 1" class="tracker-avatar" />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9451db0027a7284ddb1fdb10bd8b902a860a7fffc6bf267e47f60e9bcc8298b8?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                  alt="User avatar 2" class="tracker-avatar" />
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a06c0be82d854cbeefba3da058b61f5da375b0904d20ae3e36a98ef8fe612a83?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                alt="Tracking graph" class="tracker-graph" />
            </div>
          </div>
        </div>
      </div>

      <div class="metrics-container">
        <div class="metric-card primary-emotion">
          <h2 class="metric-title">Primary Emotion</h2>
          <p class="metric-value">Happy</p>
        </div>

        <div class="metric-card intensity">
          <div class="intensity-content">
            <h2 class="metric-title">Mood Intensity</h2>
            <p class="metric-value">High</p>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9229bc8da0bad68cc00c6d89c6becb76542b07244e81188f6d487b0c4b1f696b?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
            alt="" class="intensity-icon" />
        </div>
      </div>
      <section class="emotion-tracking-section">
        <div class="chart-header">
          <h2 class="chart-title">Emotion Tracking</h2>
          <div class="chart-controls">
            <button v-for="period in periods" :key="period"
              :class="['period-btn', { active: selectedPeriod === period }]" @click="selectedPeriod = period">
              {{ period }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="emotionChart"></canvas>
        </div>
      </section>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Chart from 'chart.js/auto'

interface MoodLevels {
  [key: string]: number;
  Happy: number;
  Eager: number;
  Angry: number;
  Anxiety: number;
  Sad: number;
}

interface ChartData {
  week: number[];
  month: number[];
  year: number[];
}

export default defineComponent({
  name: 'EmotionDashboard',
  data() {
    return {
      selectedPeriod: 'Week',
      periods: ['Week', 'Month', 'Year'] as const,
      chart: null as any,
      moodLevels: {
        'Happy': 5,
        'Eager': 4,
        'Angry': 3,
        'Anxiety': 2,
        'Sad': 1
      } as MoodLevels,
      chartData: {
        week: [4, 3, 5, 4, 5, 3, 4],
        month: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5) + 1),
        year: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5) + 1)
      } as ChartData
    }
  },
  methods: {
    initChart() {
      const canvas = this.$refs.emotionChart as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.getLabels('Week') as string[],
          datasets: [{
            label: 'Mood Level',
            data: this.chartData.week,
            borderColor: 'rgba(187, 161, 255, 1)',
            backgroundColor: 'rgba(187, 161, 255, 0.2)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(187, 161, 255, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: (value) => {
                  const numValue = value as number
                  return Object.keys(this.moodLevels).find(key => this.moodLevels[key] === numValue) || ''
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number
                  const moodName = Object.keys(this.moodLevels).find(key => this.moodLevels[key] === value)
                  return `Mood: ${moodName}`
                }
              }
            }
          }
        }
      })
    },
    getLabels(period: 'Week' | 'Month' | 'Year'): string[] | number[] {
      switch (period) {
        case 'Week':
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        case 'Month':
          return Array.from({ length: 30 }, (_, i) => i + 1)
        case 'Year':
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        default:
          return []
      }
    },
    updateChart(period: 'Week' | 'Month' | 'Year') {
      if (!this.chart) return

      const labels = this.getLabels(period)
      const data = this.chartData[period.toLowerCase() as keyof ChartData]
      
      this.chart.data.labels = labels
      this.chart.data.datasets[0].data = data
      this.chart.update()
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    selectedPeriod(newPeriod: 'Week' | 'Month' | 'Year') {
      this.updateChart(newPeriod)
    }
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f5f5f5;
}

.emotion-dashboard {
  border-radius: 20px;
  background-color: rgba(245, 245, 245, 0.5);
  box-shadow: 0 20px 60px rgba(149, 138, 173, 0.34);
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-width: 900px;
  flex-direction: column;
  margin: 0 auto;
  padding: 32px 40px;
}

.stats-grid {
  display: flex;
  gap: 30px;
}

.metrics-container {
  display: flex;
  margin-top: 30px;
  gap: 30px;
}

.emotion-tracking-section {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title {
  color: #222;
  font: 500 20px Poppins, sans-serif;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.header-section {
  display: flex;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.41px;
}

.avatar {
  border-radius: 100px;
  background-color: rgba(0, 0, 0, 0.2);
  width: 48px;
  height: 48px;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.greeting {
  color: rgba(92, 92, 92, 1);
  font: 400 14px Poppins, sans-serif;
  margin: 0;
}

.username {
  color: rgba(34, 34, 34, 1);
  font: 500 16px Poppins, sans-serif;
  margin: 0;
}

.notification-btn {
  border-radius: 100px;
  background-color: rgba(217, 210, 237, 0.79);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  cursor: pointer;
}

.notification-icon {
  width: 20px;
  height: 20px;
}

.overview-section {
  margin-top: 30px;
}

.overview-title {
  color: rgba(34, 34, 34, 1);
  font: 500 20px Poppins, sans-serif;
  letter-spacing: -0.41px;
  margin: 0;
}

.overview-subtitle {
  color: rgba(96, 96, 96, 1);
  font: 400 13px/2 Poppins, sans-serif;
  letter-spacing: -0.41px;
  margin: 4px 0 0;
}

.stats-container {
  margin-top: 22px;
  width: 100%;
}

.stats-grid {
  display: flex;
  gap: 20px;
}

.emotion-chart {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 39px 20px;
  flex: 1;
  box-shadow: 0 8px 24px rgba(149, 138, 173, 0.15);
}

.chart-wrapper {
  position: relative;
  aspect-ratio: 5.125;
  margin-right: 18px;
}

.chart-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chart-overlay {
  position: relative;
  width: 26px;
  aspect-ratio: 1.08;
}

.emotion-status {
  color: rgba(0, 0, 0, 1);
  text-align: center;
  font: 500 16px Poppins, sans-serif;
  margin: 5px 0 0;
}

.daily-tracker {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 16px 20px 27px;
  flex: 1;
}

.tracker-header {
  color: rgba(34, 34, 34, 1);
  font: 400 14px Poppins, sans-serif;
  letter-spacing: -0.41px;
  margin-bottom: 16px;
}

.tracker-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  gap: 13px;
}

.tracker-avatars {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
  margin: 10px 0;
}

.tracker-avatar {
  width: 48px;
  height: 48px;
  border-radius: 100px;
}

.tracker-graph {
  width: 112px;
  max-width: 100%;
  margin: 0 auto;
}

.tracker-icon {
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
  margin-top: -32px;
}

.metrics-container {
  display: flex;
  margin-top: 16px;
  gap: 40px;
  /* font-family: Poppins, sans-serif; */
  font-weight: 500;
  letter-spacing: -0.41px;
}

.metric-card {
  border-radius: 20px;
  padding: 20px;
  flex: 1;
}

.period-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(187, 161, 255, 0.3);
  background: transparent;
  color: #666;
  font: 500 14px Poppins, sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn.active {
  background: rgba(187, 161, 255, 0.2);
  color: rgba(187, 161, 255, 1);
  border-color: rgba(187, 161, 255, 0.5);
}

.chart-container {
  height: 300px;
  position: relative;
}

.metric-title {
  color: rgba(82, 82, 82, 1);
  font-size: 16px;
  margin: 0;
}

.metric-value {
  color: rgba(187, 161, 255, 1);
  font-size: 13px;
  line-height: 30px;
  margin: 4px 0 0;
}

.intensity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.intensity-icon {
  width: 18px;
  aspect-ratio: 0.75;
}

@media (max-width: 991px) {
  .dashboard-container {
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }

  .emotion-dashboard {
    padding-bottom: 100px;
  }

  .header-section {
    max-width: 100%;
  }

  .stats-grid {
    flex-direction: column;
  }

  .emotion-chart {
    margin-top: 14px;
  }

  .daily-tracker {
    margin-top: 14px;
  }

  .metrics-container {
    flex-wrap: wrap;
    max-width: 100%;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>