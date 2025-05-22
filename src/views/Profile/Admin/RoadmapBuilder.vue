<template>
  <div class="roadmap-builder">
    <div class="page-header">
      <h1 class="title">
        <i class="fas fa-road mr-2"></i> Quản lý lộ trình
      </h1>
      <button class="btn-create" @click="navigateTo('/roadmaps/create')">
        <i class="fas fa-plus mr-2"></i> Tạo lộ trình mới
      </button>
    </div>

    <div class="roadmap-list">
      <div class="list-header">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm lộ trình..."
            class="search-input"
          >
        </div>
        <div class="filter-box">
          <select v-model="filterFeatured" class="filter-select">
            <option value="all">Tất cả</option>
            <option value="featured">Đề xuất</option>
            <option value="normal">Thông thường</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Số giai đoạn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="roadmap in filteredRoadmaps" :key="roadmap.id">
              <td>{{ roadmap.title }}</td>
              <td>{{ roadmap.phases?.length || 0 }}</td>
              <td>
                <span :class="['status-badge', roadmap.featured ? 'featured' : 'normal']">
                  {{ roadmap.featured ? 'Đề xuất' : 'Thông thường' }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-action edit" @click="navigateTo(`/roadmaps/edit/${roadmap.id}`)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete" @click="confirmDelete(roadmap)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa lộ trình "{{ selectedRoadmap?.title }}" không?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Hủy</button>
          <button class="btn-confirm" @click="handleDelete">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoadmaps, deleteRoadmap } from '@/scripts/api/services/roadmapService';

export default {
  name: 'RoadmapBuilder',
  data() {
    return {
      roadmaps: [],
      searchQuery: '',
      filterFeatured: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      showDeleteModal: false,
      selectedRoadmap: null,
      loading: false
    }
  },
  computed: {
    filteredRoadmaps() {
      let filtered = this.roadmaps;

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(roadmap => 
          roadmap.title.toLowerCase().includes(query)
        );
      }

      // Apply featured filter
      if (this.filterFeatured !== 'all') {
        filtered = filtered.filter(roadmap => 
          this.filterFeatured === 'featured' ? roadmap.featured : !roadmap.featured
        );
      }

      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.roadmaps.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchRoadmaps() {
      try {
        this.loading = true;
        const response = await getRoadmaps();
        if (Array.isArray(response)) {
          this.roadmaps = response;
        }
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        this.loading = false;
      }
    },
    navigateTo(path) {
      this.$router.push(path);
    },
    confirmDelete(roadmap) {
      this.selectedRoadmap = roadmap;
      this.showDeleteModal = true;
    },
    async handleDelete() {
      if (!this.selectedRoadmap) return;
      
      try {
        await deleteRoadmap(this.selectedRoadmap.id);
        await this.fetchRoadmaps();
        this.showDeleteModal = false;
        this.selectedRoadmap = null;
      } catch (error) {
        console.error('Error deleting roadmap:', error);
      }
    }
  },
  mounted() {
    this.fetchRoadmaps();
  }
}
</script>

<style scoped>
.roadmap-builder {
  margin-top: -15px;
  min-width: 1200px;
  min-height: 100vh;
  padding: 24px;
  background: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-create {
  padding: 12px 24px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
}

.btn-create:hover {
  background: #3182ce;
}

.list-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.filter-select {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 150px;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.featured {
  background: #ebf8ff;
  color: #3182ce;
}

.status-badge.normal {
  background: #f7fafc;
  color: #718096;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.edit {
  background: #ebf8ff;
  color: #3182ce;
}

.btn-action.edit:hover {
  background: #bee3f8;
}

.btn-action.delete {
  background: #fff5f5;
  color: #e53e3e;
}

.btn-action.delete:hover {
  background: #fed7d7;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: #f7fafc;
}

.page-info {
  color: #4a5568;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.modal-content h3 {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 16px;
}

.modal-content p {
  color: #4a5568;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #e53e3e;
  color: white;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #c53030;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .list-header {
    flex-direction: column;
    gap: 16px;
  }

  .search-box {
    max-width: none;
  }

  .data-table {
    display: block;
    overflow-x: auto;
  }
}
</style>