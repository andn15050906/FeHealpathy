<template>
  <div>
    <div v-if="!isEditingCourse">
      <div class="course-management">
        <h1 class="title">🧘 Course Management</h1>
        <div class="header-actions">
          <router-link to="/course/create">
            <button class="create-course-btn btn">✅  Create A Course</button>
          </router-link>
        </div>

        <p v-if="isLoading">Loading ...</p>

        <div class="course-list" v-if="!isLoading">
          <div class="course-item" v-for="course in courses" :key="course.id">
            <img :src="course.thumbUrl || 'https://placehold.co/16x9'" :alt="course.title" class="thumbnail" />
            <div class="course-details">
              <h2 class="course-title">{{ course.title }}</h2>
              <p class="course-date">Date: {{ formattedDate(course.creationTime) }}</p>
              <div class="actions">
                <button class="btn edit" @click="editcourse(course)">✏️ Update</button>
                <button class="btn delete" @click="openDeletePopup(course)">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <p v-if="courses.length === 0 && !isLoading" class="no-courses">Chưa có bài course nào được đăng!</p>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button v-for="page in totalPages" :key="page"
        :class="['page-btn', currentPage === page ? 'active' : '']"
        @click="changePage(page)">
        {{ page }}
      </button>
    </div>

    <UpdateCourse v-if="isEditingcourse" :courseData="selectedcourse" @courseUpdated="handlecourseUpdated" />
    <DeleteConfirmPopup 
      :message="'Xóa lớp course này?'" 
      :isVisible="isDeletePopupVisible" 
      @confirmDelete="handleDeleteConfirm"
      @update:isVisible="isDeletePopupVisible = $event"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { getCourses, deleteCourse } from '@/scripts/api/services/courseService';
import UpdateCourse from './UpdateCourse.vue';
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';

export default {
  components: { UpdateCourse, DeleteConfirmPopup },
  name: "ManageCourse",
  data() {
    return {
      courses: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: 1,
      totalCount: 0,
      isLoading: false,  // Thêm trạng thái loading
      isEditingCourse: false,
      selectedcourse: null,
      isDeletePopupVisible: false,
      courseToDelete: null,
    };
  },
  methods: {
    async handleDeleteConfirm(confirm) {
      if (confirm && this.courseToDelete) {
        try {
          await deleteCourse(this.courseToDelete.id);
          this.fetchCourses();
        } catch (error) {
          alert("Lỗi khi xóa lớp course. Vui lòng thử lại.");
        } finally {
          this.isDeletePopupVisible = false;
          this.courseToDelete = null;
        }
      } else {
        this.isDeletePopupVisible = false;
      }
    },
    formattedDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm');
    },
    async fetchCourses() {
      try {
        this.isLoading = true;
        this.courses = [];
        const params = { pageIndex: this.currentPage - 1, pageSize: this.itemsPerPage };
        const data = await getCourses(params);

        if (data.items) {
          this.courses = data.items;
          this.totalCount = data.totalCount;
          this.totalPages = data.pageCount;
        } else {
          this.courses = [];
          this.totalCount = 0;
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu course:", error);
        this.courses = [];
        this.totalCount = 0;
        this.totalPages = 1;
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.courses = [];
        this.fetchCourses();
      }
    },
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>



  
  <style scoped>
  /* Cập nhật background giống Blog */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }

  .course-management {
    max-width: 900px;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px 30px;
  }

  .title {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }

  /* Căn giữa nút tạo lớp course giống Blog */
  .header-actions {
    text-align: center;
    margin-bottom: 20px;
  }

  .create-course-btn {
    background-color: #28a745;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  /* Thêm hiệu ứng hover giống Blog */
  .create-course-btn:hover {
    background-color: #218838;
  }

  .course-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .course-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    gap: 20px; /* Đồng bộ khoảng cách giống Blog */
  }

  .thumbnail {
    width: 20%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
  }

  /* Căn chỉnh phần chi tiết giống Blog */
  .course-details {
    flex: 1;
  }

  .course-title {
    font-size: 1.2rem;
    margin: 0;
    color: #333;
  }

  /* Cập nhật margin giống Blog */
  .course-date {
    font-size: 0.9rem;
    color: #888;
    margin: 5px 0;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  /* Cập nhật font-weight của nút giống Blog */
  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
  }

  .btn.edit {
    background: #ffc107;
    color: white;
  }

  .btn.delete {
    background: #dc3545;
    color: white;
  }

  .no-courses {
    text-align: center;
    color: #888;
    font-size: 1rem;
  }

  .pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
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

