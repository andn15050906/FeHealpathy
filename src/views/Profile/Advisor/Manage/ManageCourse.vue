<template>
  <div class="container">
    <h2 class="mb-3">
      <i class="fas fa-chalkboard-teacher me-2"></i>Quản lý khóa học
    </h2>
    <div v-if="!isEditingCourse" class="card shadow">
      <div class="card-body">
        <div class="text-center mb-4">
          <router-link to="/courses/create">
            <button class="btn btn-success">
              <i class="fas fa-plus me-1"></i>Tạo khóa học
            </button>
          </router-link>
        </div>
        <p v-if="isLoading" class="text-center">Đang tải...</p>
        <div v-if="!isLoading">
          <div v-if="courses.length > 0" class="list-group">
            <div class="list-group-item list-group-item-action mb-2" v-for="course in courses" :key="course.id">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <img :src="course.thumbUrl || 'https://placehold.co/16x9'" :alt="course.title"
                    class="img-fluid rounded" />
                </div>
                <div class="col-md-6">
                  <h5 class="mb-1">{{ course.title }}</h5>
                  <small class="text-muted">Ngày tạo: {{ formattedDate(course.creationTime) }}</small>
                </div>
                <div class="col-md-3 text-end">
                  <button class="btn btn-warning btn-sm me-2" @click="editcourse(course)">
                    <i class="fas fa-edit me-1"></i>Cập nhật
                  </button>
                  <button class="btn btn-danger btn-sm" @click="openDeletePopup(course)">
                    <i class="fas fa-trash-alt me-1"></i>Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p v-if="courses.length === 0" class="text-center text-muted">Không có khóa học nào được tạo!</p>
        </div>
      </div>
    </div>
    <Pagination v-if="totalPages > 1" :currentPage="currentPage" :totalPages="totalPages" @GoToPage="changePage" />
    <UpdateCourse v-if="isEditingcourse" :courseData="selectedcourse" @courseUpdated="handlecourseUpdated" />
    <DeleteConfirmPopup message="Xóa khóa học này?" :isVisible="isDeletePopupVisible"
      @confirmDelete="handleDeleteConfirm" @update:isVisible="isDeletePopupVisible = $event" />
  </div>
</template>

<script>
import { inject } from 'vue';
import moment from 'moment';
import { getCourses, deleteCourse } from '@/scripts/api/services/courseService';
import UpdateCourse from './UpdateCourse.vue';
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';
import Pagination from '@/components/Common/Pagination.vue';

export default {
  name: "ManageCourse",
  components: { UpdateCourse, DeleteConfirmPopup, Pagination },
  data() {
    return {
	  sweetAlert: inject('sweetAlert'),
      courses: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: 1,
      totalCount: 0,
      isLoading: false,
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
          await sweetAlert.showError('Không thể xóa khóa học này!');
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
        console.error("Lỗi tải khóa học:", error);
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
    openDeletePopup(course) {
      this.courseToDelete = course;
      this.isDeletePopupVisible = true;
    },
    editcourse(course) {
      this.selectedcourse = course;
      this.isEditingCourse = true;
    },
    handlecourseUpdated() {
      this.isEditingCourse = false;
      this.fetchCourses();
    }
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>

<style scoped>
body {
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.list-group-item {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
</style>
