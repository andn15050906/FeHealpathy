<template>
  <div :class="['admin-dashboard', {'dark-mode': isDarkMode}]">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="title">
          <i class="fas fa-tachometer-alt mr-2"></i> Dashboard quản trị viên
        </h1>
        <p class="subtitle">Chào mừng trở lại, Admin</p>
      </div>
      <div class="header-actions">
        <!--<button class="btn-icon" @click="toggleDarkMode">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>-->
        <button class="btn-action">
          <i class="fas fa-download mr-2"></i> Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="quick-actions">
      <h2 class="section-title">Hành động nhanh</h2>
      <div class="actions-grid">
        <button class="action-card" @click="navigateTo('/admin/create-admin')">
          <i class="fas fa-user-cog"></i>
          <span>Quản lý người dùng</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/moderate-content')">
          <i class="fas fa-tasks"></i>
          <span>Kiểm duyệt nội dung</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/moderate-users')">
          <i class="fas fa-shield-alt"></i>
          <span>Kiểm duyệt người dùng</span>
        </button>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container" :class="{ 'is-loading': loading.charts }">
        <div class="chart-header">
          <h3>Tăng trưởng người dùng</h3>
        </div>
        <div v-if="loading.charts" class="loading-overlay">
          <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
        </div>
        <line-chart v-else :data="userGrowthData" :options="chartOptions"></line-chart>
      </div>
      
      <div class="chart-container" :class="{ 'is-loading': loading.charts }">
        <div class="chart-header">
          <h3>Phân tích doanh thu</h3>
        </div>
        <div v-if="loading.charts" class="loading-overlay">
          <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
        </div>
        <bar-chart v-else :data="revenueData" :options="chartOptions"></bar-chart>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon purple">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-details">
          <h3>Tổng số người dùng</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ generalReport.totalUserCount }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>{{ Math.floor((generalReport.totalUserCount / userCountLastMonth - 1) * 100) }} % so với tháng trước</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon blue">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-details">
          <h3>Người dùng hoạt động</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ generalReport.recentlyActiveUserCount }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon green">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="stat-details">
          <h3>Doanh thu</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ generalReport.revenue }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>{{
              revenueLastMonth > 0
                ? Math.floor((generalReport.revenue / revenueLastMonth - 1) * 100) + '% so với tháng trước'
                : generalReport.revenue + ' VND so với tháng trước'
             }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon orange">
          <i class="fas fa-flag"></i>
        </div>
        <div class="stat-details">
          <h3>Báo cáo</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ generalReport.reports }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change negative" v-if="!loading.stats">
            <i class="fas fa-arrow-down"></i>
            <span>{{ Math.floor((5 / generalReport.reports - 1) * 100) }} % vs last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card" :class="{ 'is-loading': loading.stats }">
        <div class="stat-icon purple">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-details">
          <h3>Người dùng Premium</h3>
          <div class="stat-number">
            <template v-if="!loading.stats">{{ generalReport.totalPremiumUserCount }}</template>
            <div v-else class="skeleton-loader"></div>
          </div>
          <div class="stat-change positive" v-if="!loading.stats">
            <i class="fas fa-arrow-up"></i>
            <span>{{ Math.floor((generalReport.totalPremiumUserCount / premiumUserCountLastMonth - 1) * 100) }} % so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>

    <!--<ViewReports></ViewReports>-->

    <!--
    <div class="recent-activity">
      <div class="section-header">
        <h2 class="section-title">Hoạt động gần đây</h2>
        <div class="activity-filters">
          <input 
            type="text" 
            v-model="activitySearch" 
            placeholder="Tìm kiếm hoạt động..."
            class="search-input"
          >
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
    </div>-->
  </div>
</template>

<script>
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import { getUserStatistics } from '@/scripts/api/services/statisticsService'
import ViewReports from './ViewReports.vue'

export default {
  name: 'AdminDashboard',
  components: {
    LineChart,
    BarChart,
    ViewReports
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
          title: 'Cập nhật hệ thống',
          description: 'Bản cập nhật hệ thống được lên lịch tối nay',
          time: '2 giờ trước',
          read: false
        },
        
      ],
      activities: [
        {
          id: 1,
          type: 'user',
          title: 'Đăng ký người dùng mới',
          description: 'John Doe đã đăng ký là người dùng mới',
          time: '5 phút trước'
        },
      ],
      userGrowthData: {},
      chartOptions: {
        responsive: true,
        devicePixelRatio: 4
      },
      loading: {
        stats: true,
        charts: true,
        activities: true
      },
      generalReport: {}
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
    },
    userCountLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Months are zero-based

      let totalUsersLastMonth = 0;
      for (let entry of this.generalReport.totalUserCountOverMonths) {
        if (entry.year < year || entry.year == year && entry.month < month) {
          totalUsersLastMonth += entry.count;
        }
      }

      return totalUsersLastMonth;
    },
    premiumUserCountLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Months are zero-based

      let totalUsersLastMonth = 0;
      for (let entry of this.generalReport.totalPremiumUserCountOverMonths) {
        if (entry.year < year || entry.year == year && entry.month < month) {
          totalUsersLastMonth += entry.count;
        }
      }

      return totalUsersLastMonth;
    },
    revenueLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Months are zero-based

      for (let entry of this.generalReport.revenueOverWeeks) {
        if (entry.year < year || entry.year == year && entry.month < month) {
          return entry.sum;
        }
      }
      return 0;
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

        await Promise.all([
          this.fetchStats()
        ])
      }
      catch (error) { }
      finally {
        setTimeout(() => {
          this.loading.stats = false
          this.loading.charts = false
          this.loading.activities = false
        }, 1000)
      }
    },
    async fetchStats() {
      this.generalReport = await getUserStatistics();
      this.generalReport.reports = 4;

      this.userGrowthData = {
        labels: this.generalReport.totalUserCountOverMonths.map(item => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[item.month - 1]} ${item.year}`;
        }),
        datasets: [{
          label: 'New Users',
          data: this.generalReport.totalUserCountOverMonths.map(item => item.count),
          fill: false,
          borderColor: '#4299e1',
          tension: 0.1
        }]
      }
            
      this.revenueData = {
        labels: this.generalReport.revenueOverWeeks.map(item => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[item.month - 1]} ${item.year}`;
        }),
        datasets: [{
          label: 'Revenue',
          data: this.generalReport.revenueOverWeeks.map(item => item.sum),
          backgroundColor: '#48bb78'
        }]
      }
    },
    navigateTo(path) {
      this.$router.push(path).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      });
    }
  },
  beforeMount() {
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