<template>
  <div class="view-reports">
    <div class="report-tabs">
      <button 
        v-for="tab in reportTabs" 
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        <i :class="getTabIcon(tab.id)"></i>
        {{ tab.name }}
        <span class="tab-badge" v-if="getTabCount(tab.id)">
          {{ getTabCount(tab.id) }}
        </span>
      </button>
    </div>

    <div class="report-content">
      <!-- User Progress Section -->
      <div v-if="currentTab === 'user-progress'" class="report-section">
        <div class="section-header">
          <h2><i class="fas fa-chart-line"></i> User Progress Statistics</h2>
          <div class="section-filters">
            <select v-model="selectedFeature" class="filter-select">
              <option value="all">All Features</option>
              <option value="health-tracking">Health Tracking</option>
              <option value="nutrition">Nutrition Planning</option>
              <option value="workouts">Workout Programs</option>
            </select>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card gradient-1">
            <div class="card-header">
              <h3>Roadmap Progress</h3>
              <div class="card-actions">
                <button class="btn-icon">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <div class="progress-circle">
                <div class="progress-value">
                  {{ userStats.avgCompletionRate }}%
                </div>
                <div class="progress-label">Completion Rate</div>
              </div>
              <div class="stat-details">
                <div class="stat-row">
                  <span>Active Users</span>
                  <strong>{{ userStats.activeUsers }}</strong>
                </div>
                <div class="stat-row">
                  <span>Completed Roadmaps</span>
                  <strong>{{ userStats.completedRoadmaps }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card gradient-2">
            <div class="card-header">
              <h3>Feature Engagement</h3>
              <div class="card-actions">
                <button class="btn-icon">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <div class="engagement-stats">
                <div class="engagement-item">
                  <i class="fas fa-clock"></i>
                  <div class="engagement-value">{{ featureStats.usageFrequency }}</div>
                  <div class="engagement-label">Uses/Week</div>
                </div>
                <div class="engagement-item">
                  <i class="fas fa-smile"></i>
                  <div class="engagement-value">{{ featureStats.satisfaction }}%</div>
                  <div class="engagement-label">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other sections remain similar but with enhanced styling -->
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
    getTabIcon(tabId) {
      const icons = {
        'user-progress': 'fas fa-chart-line',
        'revenue': 'fas fa-dollar-sign',
        'features': 'fas fa-puzzle-piece',
        'community': 'fas fa-users'
      };
      return icons[tabId] || 'fas fa-chart-bar';
    },
    getTabCount(tabId) {
      const counts = {
        'user-progress': this.userStats.activeUsers,
        'revenue': this.revenueStats.premiumUsers,
        'features': this.featureStats.activeUsers,
        'community': this.communityStats.activeGroups
      };
      return counts[tabId] || 0;
    },
    async generateReport() {
      console.log('Generating report for:', {
        tab: this.currentTab,
        timeRange: this.timeRange,
        feature: this.selectedFeature
      });
    },
    async fetchReportData() {
      try {
        // API calls here
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    }
  },
  mounted() {
    this.fetchReportData();
    // Add Font Awesome
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};
</script>

<style scoped>
.view-reports {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #4299e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.revenue { background: #48bb78; }
.stat-icon.users { background: #ed8936; }
.stat-icon.engagement { background: #667eea; }

.stat-info {
  flex: 1;
}

.stat-info h4 {
  color: #718096;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive { color: #48bb78; }
.stat-change.negative { color: #e53e3e; }

.report-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  padding: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tab-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.tab-button i {
  font-size: 16px;
}

.tab-button.active {
  background: #3182ce;
  color: white;
}

.tab-badge {
  background: rgba(0,0,0,0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.report-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.stat-card {
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.gradient-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-2 {
  background: linear-gradient(135deg, #2bb1ff 0%, #3182ce 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 500;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.btn-icon:hover {
  background: rgba(255,255,255,0.2);
}

.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.progress-value {
  font-size: 32px;
  font-weight: bold;
}

.progress-label {
  font-size: 14px;
  opacity: 0.8;
}

.stat-details {
  display: grid;
  gap: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.engagement-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  text-align: center;
}

.engagement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.engagement-item i {
  font-size: 24px;
  opacity: 0.8;
}

.engagement-value {
  font-size: 24px;
  font-weight: bold;
}

.engagement-label {
  font-size: 14px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .report-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1 1 calc(50% - 8px);
  }
}
</style>
