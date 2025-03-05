<template>
  <div class="view-reports">
    <h1 class="title">Reports Dashboard</h1>

    <div class="report-tabs">
      <button 
        v-for="tab in reportTabs" 
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div v-if="currentTab === 'user-progress'" class="report-section">
      <h2>User Progress Statistics</h2>
      <div class="report-filters">
        <select v-model="timeRange" class="filter-select">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
        <button @click="generateReport" class="btn-generate">Generate Report</button>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Roadmap Progress</h3>
          <div class="stat-content">
            <div class="stat-item">
              <span>Average Completion Rate</span>
              <strong>{{ userStats.avgCompletionRate }}%</strong>
            </div>
            <div class="stat-item">
              <span>Active Users</span>
              <strong>{{ userStats.activeUsers }}</strong>
            </div>
            <div class="stat-item">
              <span>Completed Roadmaps</span>
              <strong>{{ userStats.completedRoadmaps }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'revenue'" class="report-section">
      <h2>Revenue Analytics</h2>
      <div class="report-filters">
        <select v-model="timeRange" class="filter-select">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
        <button @click="generateReport" class="btn-generate">Generate Report</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Revenue Overview</h3>
          <div class="stat-content">
            <div class="stat-item">
              <span>Total Revenue</span>
              <strong>${{ revenueStats.totalRevenue }}</strong>
            </div>
            <div class="stat-item">
              <span>Premium Subscriptions</span>
              <strong>{{ revenueStats.premiumUsers }}</strong>
            </div>
            <div class="stat-item">
              <span>Average Revenue per User</span>
              <strong>${{ revenueStats.avgRevenuePerUser }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'features'" class="report-section">
      <h2>Feature Usage Analytics</h2>
      <div class="report-filters">
        <select v-model="selectedFeature" class="filter-select">
          <option value="all">All Features</option>
          <option value="health-tracking">Health Tracking</option>
          <option value="nutrition">Nutrition Planning</option>
          <option value="workouts">Workout Programs</option>
          <option value="community">Community Engagement</option>
        </select>
        <select v-model="timeRange" class="filter-select">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
        <button @click="generateReport" class="btn-generate">Generate Report</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Feature Usage Statistics</h3>
          <div class="stat-content">
            <div class="stat-item">
              <span>Active Users</span>
              <strong>{{ featureStats.activeUsers }}</strong>
            </div>
            <div class="stat-item">
              <span>Usage Frequency</span>
              <strong>{{ featureStats.usageFrequency }} times/week</strong>
            </div>
            <div class="stat-item">
              <span>User Satisfaction</span>
              <strong>{{ featureStats.satisfaction }}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'community'" class="report-section">
      <h2>Community Health Report</h2>
      <div class="report-filters">
        <select v-model="timeRange" class="filter-select">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
        <button @click="generateReport" class="btn-generate">Generate Report</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Community Engagement</h3>
          <div class="stat-content">
            <div class="stat-item">
              <span>Active Groups</span>
              <strong>{{ communityStats.activeGroups }}</strong>
            </div>
            <div class="stat-item">
              <span>Posts Created</span>
              <strong>{{ communityStats.totalPosts }}</strong>
            </div>
            <div class="stat-item">
              <span>User Interactions</span>
              <strong>{{ communityStats.interactions }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'user-progress',
      timeRange: 'month',
      selectedFeature: 'all',
      reportTabs: [
        { id: 'user-progress', name: 'User Progress' },
        { id: 'revenue', name: 'Revenue' },
        { id: 'features', name: 'Feature Usage' },
        { id: 'community', name: 'Community Health' }
      ],
      userStats: {
        avgCompletionRate: 75,
        activeUsers: 1200,
        completedRoadmaps: 450
      },
      revenueStats: {
        totalRevenue: 25000,
        premiumUsers: 500,
        avgRevenuePerUser: 50
      },
      featureStats: {
        activeUsers: 800,
        usageFrequency: 4.5,
        satisfaction: 92
      },
      communityStats: {
        activeGroups: 25,
        totalPosts: 1500,
        interactions: 7800
      }
    };
  },
  methods: {
    async generateReport() {
      console.log('Generating report for:', {
        tab: this.currentTab,
        timeRange: this.timeRange,
        feature: this.selectedFeature
      });
    },
    async fetchReportData() {
      try {
       
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    }
  },
  mounted() {
    this.fetchReportData();
  }
};
</script>

<style scoped>
.view-reports {
  padding: 20px;
}

.title {
  margin-bottom: 30px;
  color: #333;
}

.report-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  background: #f5f5f5;
  color: #666;
}

.tab-button.active {
  background: #007bff;
  color: white;
}

.report-section {
  margin-bottom: 40px;
}

.report-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.report-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
}

.btn-generate {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-generate:hover {
  background: #218838;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.stat-content {
  display: grid;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item span {
  color: #666;
}

.stat-item strong {
  color: #333;
  font-size: 1.2em;
}
</style>
