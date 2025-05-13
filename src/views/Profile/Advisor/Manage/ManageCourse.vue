<template>
  <div class="container-fluid">
    <div class="row mb-4 p-2">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">Quản lý khoá học</h1>
          <button
            class="btn btn-primary d-flex align-items-center"
            @click="navigateTo('add-course')"
          >
            <PlusIcon class="icon me-2" />
            Thêm khoá học
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white py-3">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Khoá học của tôi</h5>
          </div>
          <div class="col-auto">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Search courses..."
                v-model="searchQuery"
                @input="filterCourses"
              />
              <span class="input-group-text d-flex align-items-center">
                <SearchIcon class="icon" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tiêu đề</th>
                <th scope="col">Loại</th>
                <th scope="col">Tổng bài giảng</th>
                <th scope="col">Tống tham gia</th>
                <th scope="col">Giá</th>
                <th scope="col">Tình trạng</th>
                <th scope="col" class="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in courses" :key="course.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="course-image me-3">
                      <img
                        :src="course.thumbUrl"
                        alt="Course"
                        class="rounded"
                        width="48"
                        height="48"
                      />
                    </div>
                    <div>
                      <h6 class="mb-0">{{ course.title }}</h6>
                      <small class="text-muted">{{
                        formatDate(course.creationTime)
                      }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ getCategoryName(course.leafCategoryId) }}</td>
                <td>{{ course.lectureCount }}</td>
                <td>{{ course.learnerCount }}</td>
                <td>{{ formatPrice(course.price) }}</td>
                <td>
                  <span class="badge" :class="getStatusClass(course.status)">
                    {{ getStatusText(course.status) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-end">
                    <button
                      class="btn btn-sm btn-outline-primary me-1 d-flex align-items-center"
                      @click="navigateTo('course-details', course.id)"
                      title="View Details"
                    >
                      <EyeIcon class="icon me-1" /> Xem
                    </button>
                    <button
                      class="btn btn-sm btn-outline-secondary me-1 d-flex align-items-center"
                      @click="editCourse(course)"
                      title="Edit Course"
                    >
                      <EditIcon class="icon me-1" /> Chỉnh sửa
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger me-1 d-flex align-items-center"
                      @click="openDeletePopup(course)"
                      title="Delete Course"
                    >
                      <TrashIcon class="icon me-1" /> Xoá
                    </button>
                    <button
                      class="btn btn-sm btn-outline-success d-flex align-items-center"
                      @click="navigateTo('course-profit', course.id)"
                      title="View Profit"
                    >
                      <DollarSignIcon class="icon me-1" /> Doanh thu
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="courses.length === 0">
                <td colspan="8" class="text-center py-4">
                  <FileSearchIcon size="48" class="text-muted mb-2" />
                  <p class="mb-0">Bạn không có khoá học nào cả.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer bg-white py-3">
        <div class="row align-items-center">
          <div class="col">
            <small class="text-muted"
              >Hiện {{ courses.length }} trên tổng {{ totalCount }} khoá
              học</small
            >
          </div>
          <div class="col-auto">
            <nav aria-label="Course pagination">
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button
                    class="page-link"
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                  >
                    <ChevronLeftIcon class="icon" />
                  </button>
                </li>
                <li
                  v-for="page in getPageNumbers()"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="changePage(page)">
                    {{ page }}
                  </button>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button
                    class="page-link"
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                  >
                    <ChevronRightIcon class="icon" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import moment from "moment";
import { getCourses, deleteCourse } from "@/scripts/api/services/courseService";
import UpdateCourse from "./UpdateCourse.vue";
import DeleteConfirmPopup from "@/components/Common/Popup/DeleteConfirmPopup.vue";
import Pagination from "@/components/Common/Pagination.vue";
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  DollarSignIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileSearchIcon,
} from "lucide-vue-next";

export default {
  name: "ManageCourse",
  components: { UpdateCourse, DeleteConfirmPopup, Pagination },
  data() {
    return {
      sweetAlert: inject("sweetAlert"),
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
          await sweetAlert.showError("Không thể xóa khóa học này!");
        } finally {
          this.isDeletePopupVisible = false;
          this.courseToDelete = null;
        }
      } else {
        this.isDeletePopupVisible = false;
      }
    },
    formattedDate(value) {
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
    },
    async fetchCourses() {
      try {
        this.isLoading = true;
        this.courses = [];
        const params = {
          pageIndex: this.currentPage - 1,
          pageSize: this.itemsPerPage,
        };
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
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
}

.course-image {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.table th,
.table td {
  padding: 1rem;
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
}

.badge {
  padding: 0.5em 0.75em;
}
</style>
