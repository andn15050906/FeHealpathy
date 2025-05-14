<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
          <div>
            <h1 class="h3 mb-1">Khóa học của tôi</h1>
          </div>
          <div class="mt-3 mt-md-0 d-flex flex-column flex-sm-row gap-2">
            <div class="input-group">
              <span class="input-group-text d-flex align-items-center">
                <SearchIcon class="icon" />
              </span>
              <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm khóa học..." />
            </div>
            <select v-model="filterStatus" class="form-select">
              <option value="all">Tất cả khóa học</option>
              <option value="in-progress">Đang học</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="not-started">Chưa bắt đầu</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 mb-3 mb-md-0">
        <div class="card shadow-sm">
          <div class="card-body d-flex align-items-center">
            <div class="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <BookOpenIcon class="icon text-primary" style="width: 24px; height: 24px" />
            </div>
            <div>
              <p class="text-muted mb-0 small">Khóa học đã đăng ký</p>
              <h4 class="mb-0">{{ enrolledCourses.length }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3 mb-md-0">
        <div class="card shadow-sm">
          <div class="card-body d-flex align-items-center">
            <div class="bg-success bg-opacity-10 rounded-circle p-3 me-3">
              <CheckCircleIcon class="icon text-success" style="width: 24px; height: 24px" />
            </div>
            <div>
              <p class="text-muted mb-0 small">Khóa học hoàn thành</p>
              <h4 class="mb-0">{{ completedCourses.length }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body d-flex align-items-center">
            <div class="bg-purple bg-opacity-10 rounded-circle p-3 me-3">
              <ClockIcon class="icon text-purple" style="width: 24px; height: 24px" />
            </div>
            <div>
              <p class="text-muted mb-0 small">Tổng giờ học</p>
              <h4 class="mb-0">{{ totalHoursLearned }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Tiếp tục học</h2>
      </div>

      <div v-if="inProgressCourses.length === 0" class="card shadow-sm p-4 text-center">
        <div class="py-4">
          <BookOpenIcon class="icon text-muted mb-3" style="width: 48px; height: 48px" />
          <p class="text-muted mb-4">Bạn chưa có khóa học nào đang tiến hành</p>
          <button class="btn btn-dark">Khám phá khóa học</button>
        </div>
      </div>

      <div v-else class="row">
        <div v-for="course in inProgressCourses" :key="course.id" class="col-lg-4 col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="course-thumbnail position-relative">
              <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="card-img-top"
                style="height: 160px; object-fit: cover" />
              <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center"
                style="height: 160px">
                <ImageIcon class="icon text-muted" style="width: 48px; height: 48px" />
              </div>
              <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white p-2">
                <div class="d-flex align-items-center">
                  <ClockIcon class="icon me-1" style="width: 16px; height: 16px" />
                  <span class="small">{{ course.duration }} giờ</span>
                </div>
              </div>
            </div>

            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge bg-primary bg-opacity-10 text-primary">{{
                  course.category
                }}</span>
                <div class="d-flex align-items-center">
                  <StarIcon class="icon text-warning me-1" style="width: 16px; height: 16px" />
                  <span class="small text-muted">{{ course.rating }}</span>
                </div>
              </div>

              <h3 class="h6 fw-bold mb-2">{{ course.title }}</h3>

              <div class="mb-3">
                <div class="d-flex justify-content-between text-muted small mb-1">
                  <span>Tiến độ</span>
                  <span>{{ course.progress }}%</span>
                </div>
                <div class="progress" style="height: 8px">
                  <div class="progress-bar bg-primary" role="progressbar" :style="{ width: `${course.progress}%` }"
                    :aria-valuenow="course.progress" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>

              <p class="small text-muted mt-auto mb-3">
                Truy cập lần cuối: {{ formatDate(course.lastAccessed) }}
              </p>
            </div>

            <div class="card-footer bg-white border-top py-3">
              <button @click="navigateToCourse(course.id)" class="btn btn-dark w-100">
                Tiếp tục học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Tất cả khóa học</h2>
      </div>

      <div v-if="filteredCourses.length === 0" class="card shadow-sm p-4 text-center">
        <div class="py-4">
          <SearchIcon class="icon text-muted mb-3" style="width: 48px; height: 48px" />
          <p class="text-muted">Không tìm thấy khóa học phù hợp</p>
        </div>
      </div>

      <div v-else class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">Khóa học</th>
                  <th scope="col">Danh mục</th>
                  <th scope="col">Tiến độ</th>
                  <th scope="col">Thời lượng</th>
                  <th scope="col">Đánh giá</th>
                  <th scope="col" class="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in filteredCourses" :key="course.id" class="align-middle">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="course-image me-3">
                        <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="img-fluid" />
                        <div v-else class="d-flex align-items-center justify-content-center h-100 w-100">
                          <ImageIcon class="icon text-muted" style="width: 20px; height: 20px" />
                        </div>
                      </div>
                      <div>
                        <h6 class="mb-0 fw-medium">{{ course.title }}</h6>
                        <small v-if="course.instructor" class="text-muted">Giảng viên: {{ course.instructor }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="getCategoryClass(course.category)">
                      {{ course.category }}
                    </span>
                  </td>
                  <td>
                    <div v-if="course.enrolled">
                      <div class="d-flex align-items-center">
                        <div class="progress me-2" style="width: 80px; height: 8px">
                          <div class="progress-bar bg-primary" role="progressbar"
                            :style="{ width: `${course.progress}%` }" :aria-valuenow="course.progress" aria-valuemin="0"
                            aria-valuemax="100"></div>
                        </div>
                        <span class="small text-muted">{{ course.progress }}%</span>
                      </div>
                    </div>
                    <div v-else class="small text-muted">Chưa đăng ký</div>
                  </td>
                  <td class="small text-muted">{{ course.duration }} giờ</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <StarIcon class="icon text-warning me-1" style="width: 16px; height: 16px" />
                      <span class="small text-muted">{{ course.rating }}</span>
                    </div>
                  </td>
                  <td class="text-end">
                    <button v-if="course.enrolled" @click="navigateToCourse(course.id)"
                      class="btn btn-sm btn-outline-primary me-2">
                      Tiếp tục
                    </button>
                    <button v-else @click="enrollInCourse(course.id)" class="btn btn-sm btn-outline-success">
                      Đăng ký
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getEnrollments } from "@/scripts/api/services/enrollmentService";
import { getCourseById } from "@/scripts/api/services/courseService";
import { getUserById } from "@/scripts/api/services/userService";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import {
  SearchIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ImageIcon,
} from "lucide-vue-next";

const DEFAULT_IMAGE_URL = "https://placehold.co/160x90";

const enrollments = ref([]);
const courseDetails = ref({});
const authorDetails = ref({});
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 10;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const handleImageError = (event) => {
  if (event.target.src !== DEFAULT_IMAGE_URL) {
    event.target.src = DEFAULT_IMAGE_URL;
  }
};

const getAuthorName = (creatorId) => {
  if (!creatorId) return "N/A";
  return authorDetails.value[creatorId]?.fullName || "Đang tải...";
};

const fetchAuthorDetails = async (creatorId) => {
  try {
    const user = await getUserById(creatorId);
    authorDetails.value[creatorId] = user;
  } catch (error) {
    console.error(`Không thể tải chi tiết tác giả cho ${creatorId}:`, error);
  }
};

const fetchCourseDetails = async (courseId) => {
  if (!courseId) {
    console.error("Không hợp lệ courseId");
    return;
  }

  try {
    const course = await getCourseById(courseId);
    if (!course) {
      console.error(`Không tìm thấy khóa học với id ${courseId}`);
      return;
    }

    courseDetails.value[courseId] = course;
    if (course.creatorId) {
      await fetchAuthorDetails(course.creatorId);
    }
  } catch (error) {
    console.error(`Không thể tải chi tiết khóa học cho ${courseId}:`, error);
  }
};

const fetchEnrollments = async (page) => {
  try {
    loading.value = true;

    const response = await getEnrollments({
      pageIndex: page,
      pageSize: pageSize,
    });

    if (!response || !response.items) {
      console.error("Định dạng phản hồi không hợp lệ");
      enrollments.value = [];
      totalPages.value = 0;
      return;
    }

    enrollments.value = response.items;
    totalPages.value = response.pageCount || 1;
    currentPage.value = page;

    await Promise.all(
      response.items.map((enrollment) =>
        fetchCourseDetails(enrollment.courseId)
      )
    );
  } catch (error) {
    console.error("Không thể tải đăng ký khóa học:", error);
    enrollments.value = [];
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchEnrollments(page);
  }
};

onMounted(() => {
  fetchEnrollments(0);
});
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

.bg-purple {
  background-color: #6f42c1;
}

.text-purple {
  color: #6f42c1;
}

.bg-orange {
  background-color: #fd7e14;
}

.text-orange {
  color: #fd7e14;
}

.bg-teal {
  background-color: #20c997;
}

.text-teal {
  color: #20c997;
}

.bg-pink {
  background-color: #d63384;
}

.text-pink {
  color: #d63384;
}

.course-thumbnail {
  height: 160px;
  overflow: hidden;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}

.card {
  border: none;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.btn-dark {
  background-color: #212529;
  border-color: #212529;
}

.btn-dark:hover {
  background-color: #1a1e21;
  border-color: #191c1f;
}

.btn-outline-primary {
  color: #0d6efd;
  border-color: #0d6efd;
}

.btn-outline-success {
  color: #198754;
  border-color: #198754;
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1rem;
}
</style>
