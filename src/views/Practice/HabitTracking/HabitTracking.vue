<template>
  <div class="habit-tracking">
    <!-- Phần Mood Chart -->
    <div class="mood-chart-section">
      <h2>Biểu Đồ Tâm Trạng</h2>
      <!--<line-chart :chart-data="moodChartData" :options="moodChartOptions" :width="400" :height="200" />-->
      <div class="mood-selection">
        <h3>Tâm trạng hôm nay của bạn?</h3>
        <div class="mood-icons">
          <span v-for="mood in moods" :key="mood.id" @click="selectMood(mood)"
            :class="{ active: currentMood === mood.id }">
            {{ mood.icon }}
          </span>
        </div>
      </div>
    </div>

    <!-- Grid layout cho các cards -->
    <div class="tracking-grid">
      <!-- Sleep Quality Card -->
      <div class="tracking-card sleep-card">
        <h3>Chất Lượng Giấc Ngủ</h3>
        <div class="sleep-input">
          <div class="input-group">
            <label>Hôm nay bạn ngủ mấy tiếng?</label>
            <input type="number" v-model="sleepData.hours" min="0" max="24" @change="updateSleepData"
              class="cute-input" />
          </div>
          <div class="input-group">
            <label>Chất lượng giấc ngủ?</label>
            <div class="sleep-quality-rating">
              <span v-for="n in 5" :key="n" @click="setSleepQuality(n)"
                :class="{ active: sleepData.quality >= n * 2 }">⭐</span>
            </div>
          </div>
        </div>
        <div class="sleep-stats">
          <div class="stat-box">
            <span class="label">Số giờ ngủ</span>
            <span class="value">{{ totalSleepHours }}h</span>
          </div>
          <div class="stat-box">
            <span class="label">Chất lượng</span>
            <span class="value">{{ sleepQuality }}/10</span>
          </div>
        </div>
        <!--<bar-chart :chart-data="sleepChartData" :options="sleepChartOptions" :width="400" :height="200" />-->
      </div>

      <!-- Nutrition Card -->
      <div class="tracking-card nutrition-card">
        <h3>Dinh Dưỡng Hôm Nay</h3>
        <!--<pie-chart :chart-data="nutritionChartData" :options="nutritionChartOptions" :width="400" :height="200" />-->
        <div class="nutrition-recommendations">
          <h4>Gợi ý cho bạn:</h4>
          <ul>
            <li v-for="(rec, index) in currentNutritionRecommendation.split('\n')" :key="index">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habit-tracking {
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.tracking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.tracking-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mood-icons {
  display: flex;
  gap: 15px;
  font-size: 24px;
  cursor: pointer;
}

.mood-icons span.active {
  transform: scale(1.2);
}

.mood-chart-section {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sleep-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.total-sleep,
.sleep-quality {
  font-size: 24px;
  font-weight: bold;
  color: #5488c7;
}

.sleep-input {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.cute-input {
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  padding: 8px 15px;
  font-size: 16px;
  width: 80px;
  text-align: center;
  transition: all 0.3s ease;
}

.cute-input:focus {
  border-color: #75c9c8;
  box-shadow: 0 0 0 3px rgba(117, 201, 200, 0.2);
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

.nutrition-recommendations {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.nutrition-recommendations ul {
  list-style-type: none;
  padding: 0;
}

.nutrition-recommendations li {
  padding: 8px 0;
  border-bottom: 1px dashed #ddd;
  color: #666;
}
</style>

<script>
import { Line as LineChart, Bar as BarChart, Pie as PieChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'HabitTracking',
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  data() {
    return {
      moods: [
        { id: 'happy', icon: '😊', label: 'Vui vẻ' },
        { id: 'neutral', icon: '😐', label: 'Bình thường' },
        { id: 'sad', icon: '😔', label: 'Buồn' },
        { id: 'stressed', icon: '😫', label: 'Căng thẳng' }
      ],
      currentMood: null,
      sleepData: {
        hours: 0,
        quality: 0
      },
      nutritionRecommendations: {
        lowSleep: [
          'Thực phẩm giàu tryptophan',
          'Thực phẩm giàu magie',
          'Hạn chế caffeine'
        ],
        highSleep: [
          'Thực phẩm giàu năng lượng',
          'Vitamin B'
        ]
        // Thêm các recommendations khác
      },
      moodChartData: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{
          label: 'Tâm trạng',
          data: [4, 3, 5, 2, 4, 5, 4],
          borderColor: '#75c9c8',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(117, 201, 200, 0.1)'
        }]
      },
      sleepChartData: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{
          label: 'Giờ ngủ',
          data: [7, 6.5, 8, 7.5, 6, 9, 7.5],
          backgroundColor: 'rgba(165, 214, 167, 0.8)'
        }]
      },
      nutritionChartData: {
        labels: ['Protein', 'Carbs', 'Chất béo'],
        datasets: [{
          label: 'Phân bố dinh dưỡng',
          data: [30, 50, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)'
          ]
        }]
      },
      moodChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      },
      sleepChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      nutritionChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      totalSleepHours: 7,
      sleepQuality: 8
    }
  },
  computed: {
    currentNutritionRecommendation() {
      // Logic để trả về recommendation dựa trên sleep và mood
      return this.generateRecommendation()
    }
  },
  methods: {
    selectMood(mood) {
      this.currentMood = mood.id
      this.updateMoodChart()
    },
    generateRecommendation() {
      let recommendations = [];

      // Kiểm tra giấc ngủ
      if (this.sleepData.hours < 6) {
        recommendations.push(...this.nutritionRecommendations.lowSleep);
      } else if (this.sleepData.hours > 9) {
        recommendations.push(...this.nutritionRecommendations.highSleep);
      }

      // Kiểm tra tâm trạng
      if (this.currentMood) {
        switch (this.currentMood) {
          case 'stressed':
            recommendations.push('Thực phẩm giàu omega-3', 'Vitamin C');
            break;
          case 'sad':
            recommendations.push('Thực phẩm giàu vitamin D', 'Thực phẩm giàu serotonin');
            break;
        }
      }

      return recommendations.join('\n');
    },
    updateMoodChart() {
      const moodValues = {
        'happy': 5,
        'neutral': 3,
        'sad': 2,
        'stressed': 1
      };

      const newData = [...this.moodChartData.datasets[0].data];
      newData.shift();
      newData.push(moodValues[this.currentMood]);
      this.moodChartData.datasets[0].data = newData;
    },
    setSleepQuality(stars) {
      this.sleepData.quality = stars * 2
      this.updateSleepData()
    },
    updateSleepData() {
      this.totalSleepHours = this.sleepData.hours;
      this.sleepQuality = this.sleepData.quality;

      // Cập nhật biểu đồ
      const newData = [...this.sleepChartData.datasets[0].data];
      newData.shift();
      newData.push(this.sleepData.hours);
      this.sleepChartData.datasets[0].data = newData;
    },
    initializeChartData() {
      // Mood chart
      this.moodChartData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{
          label: 'Tâm trạng',
          data: [4, 3, 5, 2, 4, 5, 4],
          borderColor: '#75c9c8',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(117, 201, 200, 0.1)'
        }]
      };

      // Sleep chart  
      this.sleepChartData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{
          label: 'Giờ ngủ',
          data: [7, 6.5, 8, 7.5, 6, 9, 7.5],
          backgroundColor: 'rgba(165, 214, 167, 0.8)'
        }]
      };

      // Nutrition chart
      this.nutritionChartData = {
        labels: ['Protein', 'Carbs', 'Chất béo'],
        datasets: [{
          label: 'Phân bố dinh dư���ng',
          data: [30, 50, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)'
          ]
        }]
      };
    }
  },
  mounted() {
    // Khởi tạo dữ liệu ban đầu cho charts
    this.initializeChartData();
  },
  watch: {
    'moodChartData.labels'(newLabels) {
      this.sleepChartData.labels = [...newLabels];
    }
  }
}
</script>
