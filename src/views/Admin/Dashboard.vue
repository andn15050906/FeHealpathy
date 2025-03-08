<template>
  <div :class="['admin-dashboard', {'dark-mode': isDarkMode}]">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="title">
          <i class="fas fa-tachometer-alt mr-2"></i>
          Admin Dashboard
        </h1>
        <p class="subtitle">Welcome back, Admin</p>
      </div>
      <div class="header-actions">
        <!-- Dark Mode Toggle -->
        <button class="btn-icon" @click="toggleDarkMode">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        
        <!-- Notifications Dropdown -->
        <div class="notifications-dropdown" v-click-outside="closeNotifications">
          <button class="btn-icon" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span class="notification-badge" v-if="unreadNotifications">{{ unreadNotifications }}</span>
          </button>
          <div class="dropdown-content" v-show="showNotifications">
            <div class="dropdown-header">
              <h3>Notifications</h3>
              <button class="btn-text">Mark all as read</button>
            </div>
            <div class="notifications-list">
              <div v-for="notification in notifications" :key="notification.id" 
                   :class="['notification-item', { 'unread': !notification.read }]">
                <div class="notification-icon" :class="notification.type">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-desc">{{ notification.description }}</div>
                  <div class="notification-time">{{ notification.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-action">
          <i class="fas fa-download mr-2"></i>
          Export Report
        </button>
        <button class="btn-action primary">
          <i class="fas fa-plus mr-2"></i>
          New Announcement
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="stats-grid">
      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon purple">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-details">
          <h3>Total Users</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ userStats.totalUsers }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>15% vs last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon blue">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-details">
          <h3>Active Users</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ userStats.activeUsers }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>12% vs last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon green">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="stat-details">
          <h3>Revenue</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ userStats.revenue }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>18% vs last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon orange">
          <i class="fas fa-flag"></i>
        </div>
        <div class="stat-details">
          <h3>Reports</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ userStats.reports }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change negative" v-if="!loading.stats">
            <i class="fas fa-arrow-down"></i>
            <span>5% vs last month</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container" :class="{ 'is-loading': loading.charts }">
        <div class="chart-header">
          <h3>User Growth</h3>
          <div class="chart-actions">
            <select v-model="userChartPeriod" class="select-period" :disabled="loading.charts">
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        <div v-if="loading.charts" class="loading-overlay">
          <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
        </div>
        <line-chart v-else :chart-data="userGrowthData" :options="chartOptions"></line-chart>
      </div>
      
      <div class="chart-container" :class="{ 'is-loading': loading.charts }">
        <div class="chart-header">
          <h3>Revenue Analytics</h3>
          <div class="chart-actions">
            <select v-model="revenueChartPeriod" class="select-period" :disabled="loading.charts">
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        <div v-if="loading.charts" class="loading-overlay">
          <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
        </div>
        <bar-chart v-else :chart-data="revenueData" :options="chartOptions"></bar-chart>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="calendar-section">
      <div class="section-header">
        <h2 class="section-title">Upcoming Events</h2>
        <button class="btn-action">
          <i class="fas fa-plus mr-2"></i>
          Add Event
        </button>
      </div>
      <vue-calendar 
        :events="calendarEvents"
        @dayClick="handleDayClick"
        @eventClick="handleEventClick">
      </vue-calendar>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <button class="action-card" @click="navigateTo('/admin/create-admin')">
          <i class="fas fa-user-cog"></i>
          <span>Manage Users</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/moderate-content')">
          <i class="fas fa-tasks"></i>
          <span>Moderate Content</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/view-reports')">
          <i class="fas fa-chart-bar"></i>
          <span>View Reports</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/moderate-users')">
          <i class="fas fa-shield-alt"></i>
          <span>Moderate Users</span>
        </button>
      </div>
    </div>

    <div class="recent-activity">
      <div class="section-header">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-filters">
          <input 
            type="text" 
            v-model="activitySearch" 
            placeholder="Search activities..."
            class="search-input"
          >
          <select v-model="activityFilter" class="filter-select">
            <option value="all">All Activities</option>
            <option value="user">User Related</option>
            <option value="content">Content Related</option>
            <option value="system">System Related</option>
          </select>
          <button class="btn-text">View All</button>
        </div>
      </div>
      <div class="activity-list">
        <div v-for="activity in filteredActivities" 
             :key="activity.id" 
             class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import VueCalendar from '@/components/Common/Misc/Calendar.vue'
import { ref, computed } from 'vue'

export default {
  name: 'AdminDashboard',
  components: {
    LineChart,
    BarChart,
    VueCalendar
  },
  data() {
    return {
      isDarkMode: false,
      showNotifications: false,
      userChartPeriod: 'month',
      revenueChartPeriod: 'month',
      activitySearch: '',
      activityFilter: 'all',
      unreadNotifications: 3,
      notifications: [
        {
          id: 1,
          type: 'warning',
          title: 'System Update',
          description: 'System maintenance scheduled for tonight',
          time: '2 hours ago',
          read: false
        },
        
      ],
      calendarEvents: [
        {
          id: 1,
          title: 'Team Meeting',
          start: new Date(),
          end: new Date(),
          color: '#4299e1'
        },
      ],
      activities: [
        {
          id: 1,
          type: 'user',
          title: 'New User Registration',
          description: 'John Doe has registered as a new user',
          time: '5 minutes ago'
        },
      ],
      userGrowthData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'New Users',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4299e1',
          tension: 0.1
        }]
      },
      revenueData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
          backgroundColor: '#48bb78'
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      loading: {
        stats: true,
        charts: true,
        activities: true
      },
      userStats: {
        totalUsers: 12345,
        activeUsers: 8892,
        revenue: '$45,678',
        reports: 23
      }
    }
  },
  computed: {
    filteredActivities() {
      return this.activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(this.activitySearch.toLowerCase()) ||
                            activity.description.toLowerCase().includes(this.activitySearch.toLowerCase())
        const matchesFilter = this.activityFilter === 'all' || activity.type === this.activityFilter
        return matchesSearch && matchesFilter
      })
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    closeNotifications() {
      this.showNotifications = false
    },
    getNotificationIcon(type) {
      const icons = {
        warning: 'fas fa-exclamation-triangle',
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || 'fas fa-bell'
    },
    getActivityIcon(type) {
      const icons = {
        user: 'fas fa-user',
        content: 'fas fa-file-alt',
        system: 'fas fa-cog'
      }
      return icons[type] || 'fas fa-circle'
    },
    handleDayClick(date) {
      console.log('Day clicked:', date)
    },
    handleEventClick(event) {
      console.log('Event clicked:', event)
    },
    async fetchDashboardData() {
      try {
        this.loading.stats = true
        this.loading.charts = true
        this.loading.activities = true

        // Simulate API calls
        await Promise.all([
          this.fetchStats(),
          this.fetchChartData(),
          this.fetchActivities()
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        // Add slight delay to show loading animation
        setTimeout(() => {
          this.loading.stats = false
          this.loading.charts = false
          this.loading.activities = false
        }, 1000)
      }
    },
    async fetchStats() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Update stats...
    },
    async fetchChartData() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Update chart data...
    },
    async fetchActivities() {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Update activities...
    },
    navigateTo(path) {
      this.$router.push(path)
    }
  },
  mounted() {
    this.fetchDashboardData()
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link')
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
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

.welcome-section .title {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-section .subtitle {
  color: #718096;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-action {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #f7fafc;
}

.btn-action.primary {
  background: #4299e1;
  color: white;
  border: none;
}

.btn-action.primary:hover {
  background: #3182ce;
}

.btn-icon {
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: none;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #f7fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.purple { background: #9f7aea; }
.stat-icon.blue { background: #4299e1; }
.stat-icon.green { background: #48bb78; }
.stat-icon.orange { background: #ed8936; }

.stat-details {
  flex: 1;
}

.stat-details h3 {
  color: #718096;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-number {
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

.quick-actions {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #4a5568;
  border: none;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  color: #4299e1;
}

.action-card i {
  font-size: 24px;
}

.recent-activity {
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

.btn-text {
  color: #4299e1;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.activity-list {
  display: grid;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f8fafc;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #4299e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon.warning {
  background: #ed8936;
}

.activity-icon.success {
  background: #48bb78;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 4px;
}

.activity-desc {
  color: #718096;
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-time {
  color: #a0aec0;
  font-size: 12px;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  color: #2d3748;
}

.calendar-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.notifications-dropdown {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.3s ease;
}

.notification-item:hover {
  background-color: #f7fafc;
}

.notification-item.unread {
  background-color: #ebf8ff;
}

.activity-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 200px;
}

.filter-select {
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .btn-action {
    flex: 1;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .activity-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .dropdown-content {
    width: 100%;
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    border-radius: 12px 12px 0 0;
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode Styles */
.dark-mode {
  background: #1a202c;
  color: #e2e8f0;
}

.dark-mode .stat-card,
.dark-mode .action-card,
.dark-mode .recent-activity,
.dark-mode .chart-container {
  background: #2d3748;
  color: #e2e8f0;
}

.dark-mode .title,
.dark-mode .stat-number,
.dark-mode .section-title {
  color: #e2e8f0;
}

.dark-mode .subtitle,
.dark-mode .stat-details h3,
.dark-mode .activity-desc {
  color: #a0aec0;
}

/* Loading States */
.is-loading {
  position: relative;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #4299e1;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}

.skeleton-loader {
  height: 24px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Dark mode adjustments */
.dark-mode .loading-overlay {
  background: rgba(45, 55, 72, 0.8);
}

.dark-mode .skeleton-loader {
  background: linear-gradient(
    90deg,
    #2d3748 25%,
    #4a5568 50%,
    #2d3748 75%
  );
  background-size: 200% 100%;
}

/* Loading Pulse Effect */
.is-loading::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.dark-mode .is-loading::after {
  background-image: linear-gradient(
    90deg,
    rgba(45, 55, 72, 0) 0,
    rgba(45, 55, 72, 0.2) 20%,
    rgba(45, 55, 72, 0.5) 60%,
    rgba(45, 55, 72, 0)
  );
}
</style> 