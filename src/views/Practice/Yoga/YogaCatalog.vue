<template>
  <div class="yoga-container">
    <span class="total-count">{{ totalVideos }} videos</span>
    <h1 class="page-title">Yoga Practice</h1>
    
    <div class="filter-section">
      <button v-for="filter in filters" 
              :key="filter.value"
              :class="['filter-btn', currentFilter === filter.value ? 'active' : '']"
              @click="applyFilter(filter.value)">
        {{ filter.label }}
      </button>
    </div>

    <div class="video-grid">
      <div v-for="video in paginatedVideos" :key="video.id" class="video-card">
        <div class="video-thumbnail">
          <a href="#">
            <img :src="video.thumbnail" :alt="video.title">
          </a>
          <span class="duration">{{ video.duration }}</span>
          <span class="level-badge">{{ video.level }}</span>
        </div>
        <h3 class="video-title">{{ video.title }}</h3>
        <p class="instructor">{{ video.instructor }}</p>
        <div class="rating">
          <span v-for="n in 5" :key="n" class="star">★</span>
          <span class="rating-count">({{ video.ratingCount }})</span>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button v-for="page in totalPages" 
              :key="page" 
              :class="['page-btn', currentPage === page ? 'active' : '']"
              @click="changePage(page)">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import data from '../../../api/data.json';

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      currentFilter: 'newest',
      filters: [
        { label: 'Newest to Oldest', value: 'newest' },
        { label: 'Oldest to Newest', value: 'oldest' },
        { label: 'Rating', value: 'rating' },
        { label: 'Title', value: 'title' }
      ],
      yogaVideos: data.YogaCatalog.Lessons
    }
  },
  computed: {
    totalVideos() {
      return this.yogaVideos.length;
    },
    totalPages() {
      return Math.ceil(this.yogaVideos.length / this.itemsPerPage);
    },
    paginatedVideos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedVideos.slice(start, end);
    },
    sortedVideos() {
      const videos = [...this.yogaVideos];
      switch (this.currentFilter) {
        case 'newest':
          return videos.sort((a, b) => b.id - a.id);
        case 'oldest':
          return videos.sort((a, b) => a.id - b.id);
        case 'rating':
          return videos.sort((a, b) => b.ratingCount - a.ratingCount);
        case 'title':
          return videos.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return videos;
      }
    }
  },
  methods: {
    applyFilter(filterValue) {
      this.currentFilter = filterValue;
      this.currentPage = 1;
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
}
</script>

<style scoped>
.yoga-container {
  max-width: 1200px;
  margin: 60px auto 40px; /* Thêm margin-top để chừa chỗ cho total-count */
  padding: 0 20px;
  position: relative;
}

.total-count {
  position: absolute;
  left: 20px;
  top: -30px;
  font-size: 16px;
  color: #666;
}
.page-title {
  font-size: 32px;
  text-align: center;
  margin: 40px 0;
  color: #1b1b1b;
}

.filter-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}

.filter-btn.active {
  background: #5488c7;
  color: white;
  border-color: #5488c7;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%; /* Thêm width 100% */
}

.video-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%; /* Thêm width 100% */
}


.video-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  width: 100%; /* Thêm width 100% */
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.level-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #5488c7;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 15px;
}

.video-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.instructor {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 12px;
}

.rating-count {
  color: #666;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.page-btn {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.page-btn.active {
  background: #5488c7;
  color: white;
  border-color: #5488c7;
}
</style>