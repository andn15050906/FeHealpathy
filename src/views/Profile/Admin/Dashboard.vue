<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1 d-flex align-items-center">
          <Gauge class="me-2" :size="28" />
          Dashboard quản trị viên
        </h1>
        <p class="text-muted mb-0">Chào mừng trở lại, Admin</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary d-flex align-items-center" @click="downloadReport">
          <Download class="me-2" :size="16" />
          Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="h5 mb-3">Hành động nhanh</h3>
      <div class="row g-3">
        <div class="col-md-4">
          <button class="btn btn-light w-100 p-3 d-flex flex-column align-items-center"
            @click="navigateTo('/admin/create-admin')">
            <UserCog class="mb-2" :size="24" />
            <span>Quản lý người dùng</span>
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-light w-100 p-3 d-flex flex-column align-items-center"
            @click="navigateTo('/admin/moderate-content')">
            <CheckSquare class="mb-2" :size="24" />
            <span>Kiểm duyệt nội dung</span>
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-light w-100 p-3 d-flex flex-column align-items-center"
            @click="navigateTo('/admin/moderate-users')">
            <Shield class="mb-2" :size="24" />
            <span>Kiểm duyệt người dùng</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">Tăng trưởng người dùng</h5>
          </div>
          <div class="card-body">
            <div v-if="loading.charts" class="d-flex justify-content-center align-items-center" style="height: 200px;">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <line-chart v-else :data="userGrowthData" :options="chartOptions" style="height: 200px;"></line-chart>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">Phân tích doanh thu</h5>
          </div>
          <div class="card-body">
            <div v-if="loading.charts" class="d-flex justify-content-center align-items-center" style="height: 200px;">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <bar-chart v-else :data="revenueData" :options="chartOptions" style="height: 200px;"></bar-chart>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="bg-primary bg-opacity-10 rounded p-3 me-3">
              <Users class="text-primary" :size="24" />
            </div>
            <div class="flex-grow-1">
              <h6 class="text-muted mb-1">Tổng số người dùng</h6>
              <div v-if="loading.stats" class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
              <h4 v-else class="mb-1">{{ generalReport.totalUserCount }}</h4>
              <small v-if="!loading.stats" class="text-success d-flex align-items-center">
                <TrendingUp class="me-1" :size="14" />
                {{ Math.floor((generalReport.totalUserCount / userCountLastMonth - 1) * 100) }}% so với tháng trước
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="bg-info bg-opacity-10 rounded p-3 me-3">
              <Activity class="text-info" :size="24" />
            </div>
            <div class="flex-grow-1">
              <h6 class="text-muted mb-1">Người dùng hoạt động</h6>
              <div v-if="loading.stats" class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
              <h4 v-else class="mb-1">{{ generalReport.recentlyActiveUserCount }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="bg-success bg-opacity-10 rounded p-3 me-3">
              <DollarSign class="text-success" :size="24" />
            </div>
            <div class="flex-grow-1">
              <h6 class="text-muted mb-1">Doanh thu</h6>
              <div v-if="loading.stats" class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
              <h4 v-else class="mb-1">{{ generalReport.revenue }}</h4>
              <small v-if="!loading.stats" class="text-success d-flex align-items-center">
                <TrendingUp class="me-1" :size="14" />
                {{
                  revenueLastMonth > 0
                    ? Math.floor((generalReport.revenue / revenueLastMonth - 1) * 100) + '% so với tháng trước'
                    : generalReport.revenue + ' VND so với tháng trước'
                }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="bg-warning bg-opacity-10 rounded p-3 me-3">
              <Flag class="text-warning" :size="24" />
            </div>
            <div class="flex-grow-1">
              <h6 class="text-muted mb-1">Báo cáo</h6>
              <div v-if="loading.stats" class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
              <h4 v-else class="mb-1">{{ generalReport.reports }}</h4>
              <small v-if="!loading.stats" class="text-danger d-flex align-items-center">
                <TrendingDown class="me-1" :size="14" />
                {{ Math.floor((5 / generalReport.reports - 1) * 100) }}% vs last month
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="card">
          <div class="card-body d-flex align-items-center">
            <div class="bg-purple bg-opacity-10 rounded p-3 me-3">
              <Crown class="text-purple" :size="24" />
            </div>
            <div class="flex-grow-1">
              <h6 class="text-muted mb-1">Người dùng Premium</h6>
              <div v-if="loading.stats" class="placeholder-glow">
                <span class="placeholder col-6"></span>
              </div>
              <h4 v-else class="mb-1">{{ generalReport.totalPremiumUserCount }}</h4>
              <small v-if="!loading.stats" class="text-success d-flex align-items-center">
                <TrendingUp class="me-1" :size="14" />
                {{ Math.floor((generalReport.totalPremiumUserCount / premiumUserCountLastMonth - 1) * 100) }}% so với
                tháng trước
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import {
  Gauge, Download, UserCog, CheckSquare, Shield, Users, Activity,
  DollarSign, Flag, Crown, TrendingUp, TrendingDown
} from 'lucide-vue-next'
import { getUserStatistics } from '@/scripts/api/services/statisticsService'
import { exportReport } from '@/scripts/api/services/billService'

export default {
  name: 'AdminDashboard',
  components: {
    LineChart,
    BarChart,
    Gauge,
    Download,
    UserCog,
    CheckSquare,
    Shield,
    Users,
    Activity,
    DollarSign,
    Flag,
    Crown,
    TrendingUp,
    TrendingDown
  },
  data() {
    return {
      userGrowthData: {},
      revenueData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4
      },
      loading: {
        stats: true,
        charts: true
      },
      generalReport: {}
    }
  },
  computed: {
    userCountLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      let totalUsersLastMonth = 0;
      for (let entry of this.generalReport.totalUserCountOverMonths || []) {
        if (entry.year < year || (entry.year == year && entry.month < month)) {
          totalUsersLastMonth += entry.count;
        }
      }
      return totalUsersLastMonth;
    },
    premiumUserCountLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      let totalUsersLastMonth = 0;
      for (let entry of this.generalReport.totalPremiumUserCountOverMonths || []) {
        if (entry.year < year || (entry.year == year && entry.month < month)) {
          totalUsersLastMonth += entry.count;
        }
      }
      return totalUsersLastMonth;
    },
    revenueLastMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      for (let entry of this.generalReport.revenueOverWeeks || []) {
        if (entry.year < year || (entry.year == year && entry.month < month)) {
          return entry.sum;
        }
      }
      return 0;
    }
  },
  methods: {
    async fetchDashboardData() {
      try {
        this.loading.stats = true;
        this.loading.charts = true;
        await this.fetchStats();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setTimeout(() => {
          this.loading.stats = false;
          this.loading.charts = false;
        }, 1000);
      }
    },
    async fetchStats() {
      this.generalReport = await getUserStatistics();
      this.generalReport.reports = 4;

      this.userGrowthData = {
        labels: (this.generalReport.totalUserCountOverMonths || []).map(item => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[item.month - 1]} ${item.year}`;
        }),
        datasets: [{
          label: 'New Users',
          data: (this.generalReport.totalUserCountOverMonths || []).map(item => item.count),
          fill: false,
          borderColor: '#0d6efd',
          tension: 0.1
        }]
      };

      this.revenueData = {
        labels: (this.generalReport.revenueOverWeeks || []).map(item => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[item.month - 1]} ${item.year}`;
        }),
        datasets: [{
          label: 'Revenue',
          data: (this.generalReport.revenueOverWeeks || []).map(item => item.sum),
          backgroundColor: '#198754'
        }]
      };
    },
    navigateTo(path) {
      this.$router.push(path).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      });
    },
    downloadReport() {
      exportReport();
    }
  },
  beforeMount() {
    this.fetchDashboardData();
  }
}
</script>

<style scoped>
.bg-purple {
  background-color: #6f42c1 !important;
}

.text-purple {
  color: #6f42c1 !important;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: transform 0.15s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>