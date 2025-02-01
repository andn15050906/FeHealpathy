<template>
  <div class="yoga-container">
    <span class="total-count">{{ totalLessons }} lessons</span>
    <h1 class="page-title">Yoga Practice</h1>

    <div class="filter-section">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', currentFilter === filter.value ? 'active' : '']" @click="applyFilter(filter.value)">
        {{ filter.label }}
      </button>
    </div>

    <div class="excercise-grid">
      <YogaExerciseCard v-for="excercise in paginatedLessons" :key="excercise.id" :excercise="excercise" />
    </div>

    <div class="pagination">
      <button v-for="page in totalPages" :key="page" :class="['page-btn', currentPage === page ? 'active' : '']"
        @click="changePage(page)">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import GlowingCard from '@/components/Common/GlowingCard.vue';
import data from '../../../scripts/data/data.json';
import YogaExerciseCard from '@/components/PracticeComponents/YogaExerciseCard.vue';

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      currentFilter: 'newest',
      filters: [
        { label: 'Newest to Oldest', value: 'newest' },
        { label: 'Oldest to Newest', value: 'oldest' },
        { label: 'Rating', value: 'rating' },
        { label: 'Title', value: 'title' }
      ],
      yogaLessons: data.YogaCatalog.Lessons
    }
  },
  computed: {
    totalLessons() {
      return this.yogaLessons.length;
    },
    totalPages() {
      return Math.ceil(this.yogaLessons.length / this.itemsPerPage);
    },
    paginatedLessons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedLessons.slice(start, end);
    },
    sortedLessons() {
      const lessons = [...this.yogaLessons];
      switch (this.currentFilter) {
        case 'newest':
          return lessons.sort((a, b) => b.id - a.id);
        case 'oldest':
          return lessons.sort((a, b) => a.id - b.id);
        case 'rating':
          return lessons.sort((a, b) => b.ratingCount - a.ratingCount);
        case 'title':
          return lessons.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return lessons;
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
  },
  components: {
    GlowingCard,
    YogaExerciseCard
  }
}
</script>

<style scoped>
.yoga-container {
  max-width: 1200px;
  margin: 60px auto 40px;
  /* Thêm margin-top để chừa chỗ cho total-count */
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

.excercise-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
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