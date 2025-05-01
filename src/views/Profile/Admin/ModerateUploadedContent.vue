<template>
  <div class="moderate-content">
    <h1 class="title">Kiểm duyệt nội dung tải lên</h1>

    <div class="content-header">
      <div class="filters">
        <select v-model="selectedType" class="filter-select">
          <option value="all">Tất cả loại</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="document">Tài liệu</option>
        </select>
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Đã từ chối</option>
        </select>
      </div>
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm nội dung..."
          class="search-input"
        />
      </div>
    </div>

    <div class="content-grid">
      <div v-for="content in filteredContent" :key="content.id" class="content-card">
        <div class="content-preview">
          <img v-if="content.type === 'image'" :src="content.url" :alt="content.title">
          <video v-else-if="content.type === 'video'" :src="content.url" controls></video>
          <div v-else class="document-preview">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
        <div class="content-info">
          <h3 class="content-title">{{ content.title }}</h3>
          <div class="content-meta">
            <span class="uploader">
              <i class="fas fa-user"></i> {{ content.uploader }}
            </span>
            <span class="upload-date">
              <i class="fas fa-calendar-alt"></i> {{ content.uploadDate }}
            </span>
          </div>
          <span :class="['status-badge', content.status]">
            {{ content.status }}
          </span>
        </div>
        <div class="content-actions">
          <button class="btn btn-view" @click="viewContent(content)" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-approve" @click="approveContent(content)" title="Duyệt">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-reject" @click="rejectContent(content)" title="Từ chối">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      selectedType: 'all',
      selectedStatus: 'all',
      currentPage: 1,
      itemsPerPage: 12,
      uploadedContent: [
        {
          id: 1,
          type: 'image',
          title: 'Hình ảnh sức khỏe 1',
          url: 'https://example.com/image1.jpg',
          uploader: 'John Doe',
          uploadDate: '2024-03-15',
          status: 'pending'
        },
        {
          id: 2,
          type: 'video',
          title: 'Bài tập thể dục 1',
          url: 'https://example.com/video1.mp4',
          uploader: 'Jane Smith',
          uploadDate: '2024-03-14',
          status: 'pending'
        },
        {
          id: 3,
          type: 'document',
          title: 'Hướng dẫn sức khỏe 1',
          url: 'https://example.com/doc1.pdf',
          uploader: 'Mike Johnson',
          uploadDate: '2024-03-13',
          status: 'approved'
        }
      ]
    }
  },
  computed: {
    filteredContent() {
      let filtered = this.uploadedContent

      if (this.selectedType !== 'all') {
        filtered = filtered.filter(item => item.type === this.selectedType)
      }

      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(item => item.status === this.selectedStatus)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.uploader.toLowerCase().includes(query)
        )
      }

      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredContent.length / this.itemsPerPage)
    }
  },
  methods: {
    viewContent(content) {
      console.log('Xem chi tiết:', content)
    },
    approveContent(content) {
      console.log('Duyệt nội dung:', content)
      content.status = 'approved'
    },
    rejectContent(content) {
      console.log('Từ chối nội dung:', content)
      content.status = 'rejected'
    }
  },
  mounted() {
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}
</script>

<style scoped>
.moderate-content {
  padding: 20px;
}

.title {
  margin-bottom: 30px;
  color: #333;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 8px 8px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.content-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.content-card:hover {
  transform: translateY(-5px);
}

.content-preview {
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-preview img,
.content-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.document-preview {
  font-size: 48px;
  color: #666;
}

.content-info {
  padding: 15px;
}

.content-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.content-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.content-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-view {
  background: #6c757d;
  color: white;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-reject {
  background: #dc3545;
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
}
</style>
