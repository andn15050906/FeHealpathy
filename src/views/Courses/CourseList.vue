<template>
  <h4 class="page-title">Course Catalog</h4>

  <div class="search-section">
    <input type="text" placeholder="Search courses..." v-model="searchQuery" class="search-input"/>
  </div>

    <select  v-model="sortOption" @change="" class="form-select" style="width: 200px;">
          <option selected value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
    </select>


  <div class="courses-container">
    <div class="course-grid">
      <courseCard v-for="course in paginatedCourses" :key="course.id" :course="course" />
    </div>
  </div>

  <div class="pagination">
    <button v-for="page in totalPages" :key="page"
      :class="['page-btn', currentPage === page ? 'active' : '']"
      @click="changePage(page)">
      {{ page }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getCourses } from "@/scripts/api/services/courseService.js";
import courseCard from '@/components/courseComponents/courseCard.vue';
import { getPagedTags } from "@/scripts/api/services/tagService.js"; 
import { onMounted } from 'vue';

// Khai báo các reactive states cho component
const selectedTags = ref([]); // Danh sách các tag được chọn để lọc
const searchQuery = ref(''); // Từ khóa tìm kiếm
const sortOption = ref('name-asc'); // Tùy chọn sắp xếp (A-Z hoặc Z-A)
const itemsPerPage = 20; // Số lượng khóa học hiển thị trên mỗi trang
const courses = ref([]); // Danh sách tất cả các khóa học
const currentPage = ref(1); // Trang hiện tại
const filters = ref([]); // Danh sách các bộ lọc có sẵn
const currentFilter = ref('all'); // Bộ lọc hiện tại đang được áp dụng
const totalPages = ref(0);
const isLoading = ref(false); // Thêm state để track loading

defineEmits(['authenticated', 'addNotification', 'removeNotification']);

// Hàm fetch dữ liệu khóa học
async function fetchCourses(page = 1) {
  try {
    isLoading.value = true;
    const courseResponse = await getCourses({
      PageIndex: page - 1,
      PageSize: itemsPerPage
    });
    courses.value = courseResponse?.items?.map(course => ({ ...course })) || [];
    totalPages.value = Math.ceil(courseResponse.totalCount / itemsPerPage);
  } catch (error) {
    console.error("Failed to fetch courses", error);
  } finally {
    isLoading.value = false;
  }
}

// Hàm xử lý việc thêm/xóa tag khỏi danh sách lọc
function toggleTag(tagId) {
  const index = selectedTags.value.indexOf(tagId);
  if (index === -1) {
    selectedTags.value.push(tagId); // Thêm tag nếu chưa có
  } else {
    selectedTags.value.splice(index, 1); // Xóa tag nếu đã có
  }
  currentPage.value = 1; // Reset về trang 1 khi thay đổi filter
  fetchCourses(1); // Fetch lại dữ liệu
}

// Computed property để lọc khóa học theo tags và từ khóa tìm kiếm
const filteredcourses = computed(() => {
  let result = courses.value;
  
  // Lọc theo tags nếu có tags được chọn
  if (selectedTags.value.length > 0) {
    result = result.filter(course => selectedTags.value.every(tagId =>
      course.tags.some(tag => tag.id === tagId)
    ));
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value) {
    result = result.filter(course => 
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return result;
});

// Lấy danh sách khóa học cho trang hiện tại
const paginatedCourses = computed(() => {
  return filteredcourses.value;
});

// Hàm sắp xếp danh sách khóa học
function sortcourses() {
  if (sortOption.value === 'name-asc') {
    courses.value.sort((a, b) => a.title.localeCompare(b.title)); // Sắp xếp A-Z
  } else if (sortOption.value === 'name-desc') {
    courses.value.sort((a, b) => b.title.localeCompare(a.title)); // Sắp xếp Z-A
  }
}

// Watch thay đổi của tùy chọn sắp xếp
watch(sortOption, () => {
  currentPage.value = 1; // Reset về trang 1
  fetchCourses(1); // Fetch lại dữ liệu
});

// Watch thay đổi của search query
watch(searchQuery, () => {
  currentPage.value = 1; // Reset về trang 1
  fetchCourses(1); // Fetch lại dữ liệu
});

// Khởi tạo dữ liệu khi component được mount
onMounted(async () => {
  try {
    // Lấy danh sách tags từ API
    const tagResponse = await getPagedTags();
    // Định dạng lại danh sách tags
    filters.value = tagResponse?.map(tag => ({
      value: tag.id,
      label: tag.title
    })) || [];
    
    // Fetch dữ liệu khóa học ban đầu
    await fetchCourses(1);
  } catch (error) {
    console.error("Failed to fetch initial data", error);
  }
});

// Hàm chuyển trang
async function changePage(page) {
  currentPage.value = page;
  await fetchCourses(page);
}

// Hàm áp dụng bộ lọc
async function applyFilter(filterValue) {
  currentFilter.value = filterValue;
  currentPage.value = 1; // Reset về trang 1
  await fetchCourses(1);
}

</script>


<style scoped>
.courses-container {
  max-width: 1200px;
  margin: 60px auto 40px;
  padding: 0 20px;
  position: relative;
  min-height: 300px;
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
  flex-wrap: wrap;
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

.course-grid {
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

.page-title {
font-size: 32px;
text-align: center;
margin: 40px 0;
color: #1b1b1b;
}

.search-section {
margin: 20px 0;
display: flex;
justify-content: center;
}

.search-input {
width: 100%;
max-width: 800px;
padding: 10px 20px;
font-size: 16px;
border: 1px solid #ccc;
border-radius: 20px;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
transition: border-color 0.3s;
}

.search-input:focus {
border-color: #007BFF;
outline: none;
}
</style>