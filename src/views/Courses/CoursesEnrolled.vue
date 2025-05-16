<template>
  <div class="container-fluid py-4">
    <div class="content-wrapper">
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
              <div class="stat-icon-container bg-primary">
                <BookOpenIcon class="icon" />
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
              <div class="stat-icon-container bg-success">
                <CheckCircleIcon class="icon" />
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
              <div class="stat-icon-container bg-purple">
                <ClockIcon class="icon" />
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
                <img 
                  :src="course.thumbnail || DEFAULT_IMAGE_URL" 
                  :alt="course.title"
                  class="card-img-top"
                  style="height: 160px; object-fit: cover"
                  @error="handleImageError"
                />
                <div v-if="!course.thumbnail" class="card-img-top bg-light d-flex align-items-center justify-content-center"
                  style="height: 160px">
                  <ImageIcon class="icon text-muted" style="width: 48px; height: 48px" />
                </div>
                <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white p-2">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <ClockIcon class="icon me-1" style="width: 16px; height: 16px" />
                      <span class="small">{{ course.duration || 0 }} giờ</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <StarIcon class="icon text-warning me-1" style="width: 16px; height: 16px" />
                      <span class="small">{{ course.rating || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge" :class="getLevelClass(course.level)">
                    {{ getLevelText(course.level) }}
                  </span>
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
                    <th scope="col">Cấp độ</th>
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
                      <span class="badge" :class="getLevelClass(course.level)">
                        {{ getLevelText(course.level) }}
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
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

const router = useRouter();

const enrollments = ref([]);
const courseDetails = ref({});
const authorDetails = ref({});
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 10;
const searchQuery = ref('');
const filterStatus = ref('all');

const fetchCourseDetails = async (courseId) => {
  if (!courseId) {
    console.error("Không hợp lệ courseId");
    return;
  }

  try {
    const courseData = await getCourseById(courseId);
    if (!courseData) {
      console.error(`Không tìm thấy khóa học với id ${courseId}`);
      return;
    }

    // Ensure course has all required properties with default values
    courseDetails.value[courseId] = {
      id: courseData.id,
      title: courseData.title || 'Khóa học không có tiêu đề',
      thumbnail: courseData.thumbUrl || DEFAULT_IMAGE_URL,
      intro: courseData.intro || 'Chưa có mô tả',
      description: courseData.description || 'Chưa có mô tả chi tiết',
      price: courseData.price || 0,
      discount: courseData.discount || 0,
      learnerCount: courseData.learnerCount || 0,
      ratingCount: courseData.ratingCount || 0,
      totalRating: courseData.totalRating || 0,
      category: courseData.category || 'Chưa phân loại',
      duration: courseData.duration || 0,
      creatorId: courseData.creatorId,
      level: courseData.level || 1,
      outcomes: courseData.outcomes || 'Thông tin đang được cập nhật.',
      requirements: courseData.requirements || 'Thông tin đang được cập nhật.',
    };

    if (courseData.creatorId) {
      await fetchAuthorDetails(courseData.creatorId);
    }
  } catch (error) {
    console.error(`Không thể tải chi tiết khóa học cho ${courseId}:`, error);
    // Set default values if fetch fails
    courseDetails.value[courseId] = {
      id: courseId,
      title: 'Không thể tải thông tin khóa học',
      thumbnail: DEFAULT_IMAGE_URL,
      category: 'Chưa phân loại',
      duration: 0,
      rating: 0,
      instructor: 'Chưa có giảng viên',
      progress: 0
    };
  }
};

const fetchAuthorDetails = async (creatorId) => {
  try {
    const user = await getUserById(creatorId);
    authorDetails.value[creatorId] = {
      fullName: user?.fullName || user?.name || 'Không rõ',
      avatar: user?.avatar || null
    };
  } catch (error) {
    console.error(`Không thể tải chi tiết tác giả cho ${creatorId}:`, error);
    authorDetails.value[creatorId] = {
      fullName: 'Không rõ',
      avatar: null
    };
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

    // Fetch course details for all enrollments
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

const enrolledCourses = computed(() => {
  return enrollments.value.map(enrollment => {
    const course = courseDetails.value[enrollment.courseId] || {};
    const author = authorDetails.value[course.creatorId] || {};
    
    return {
      ...course,
      progress: enrollment.progress || 0,
      enrolled: true,
      lastAccessed: enrollment.lastAccessed,
      rating: course.ratingCount ? (course.totalRating / course.ratingCount).toFixed(1) : '0.0',
      thumbnail: course.thumbnail || DEFAULT_IMAGE_URL,
      category: course.category || 'Chưa phân loại',
      duration: course.duration || 0,
      instructor: author.fullName || 'Không rõ',
      instructorAvatar: author.avatar
    };
  }).filter(course => course && course.id);
});

const completedCourses = computed(() => {
  return enrolledCourses.value.filter(course => course.progress === 100);
});

const inProgressCourses = computed(() => {
  return enrolledCourses.value.filter(course => course.progress > 0 && course.progress < 100);
});

const totalHoursLearned = computed(() => {
  return enrolledCourses.value.reduce((total, course) => total + (course.duration || 0), 0);
});

const filteredCourses = computed(() => {
  let courses = enrolledCourses.value;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    courses = courses.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query)
    );
  }
  
  // Filter by status
  if (filterStatus.value !== 'all') {
    switch (filterStatus.value) {
      case 'in-progress':
        courses = courses.filter(course => course.progress > 0 && course.progress < 100);
        break;
      case 'completed':
        courses = courses.filter(course => course.progress === 100);
        break;
      case 'not-started':
        courses = courses.filter(course => course.progress === 0);
        break;
    }
  }
  
  return courses;
});

const getLevelClass = (level) => {
  switch (level) {
    case 1:
      return 'level-beginner';
    case 2:
      return 'level-intermediate';
    case 3:
      return 'level-advanced';
    default:
      return 'level-beginner';
  }
};

const getLevelText = (level) => {
  switch (level) {
    case 1:
      return 'Sơ cấp';
    case 2:
      return 'Trung cấp';
    case 3:
      return 'Cao cấp';
    default:
      return 'Sơ cấp';
  }
};

const getCategoryClass = (category) => {
  const classes = {
    'primary': 'bg-primary bg-opacity-10 text-primary',
    'success': 'bg-success bg-opacity-10 text-success',
    'warning': 'bg-warning bg-opacity-10 text-warning',
    'danger': 'bg-danger bg-opacity-10 text-danger',
    'info': 'bg-info bg-opacity-10 text-info',
    'purple': 'bg-purple bg-opacity-10 text-purple',
    'orange': 'bg-orange bg-opacity-10 text-orange',
    'teal': 'bg-teal bg-opacity-10 text-teal',
    'pink': 'bg-pink bg-opacity-10 text-pink'
  };
  
  return classes[category?.toLowerCase()] || 'bg-secondary bg-opacity-10 text-secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa có dữ liệu';
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const handleImageError = (event) => {
  event.target.src = DEFAULT_IMAGE_URL;
};

const navigateToCourse = (courseId) => {
  router.push({
    name: "courseDetail",
    params: { id: courseId },
  });
};

const enrollInCourse = (courseId) => {
  // Implement enrollment logic
  console.log('Enroll in course:', courseId);
};

onMounted(() => {
  fetchEnrollments(0);
});
</script>

<style scoped>
.content-wrapper {
  max-width: 72vw;
  margin: 0 auto;
  padding: 0 1rem;
}

.icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.icon:hover {
  transform: scale(1.1);
}

.course-image {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.course-image:hover {
  transform: scale(1.05);
}

.table th,
.table td {
  padding: 1.25rem;
  vertical-align: middle;
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
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
  border-radius: 8px 8px 0 0;
}

.course-thumbnail img {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-thumbnail:hover img {
  transform: scale(1.05);
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.card:hover {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.btn {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-dark {
  background: linear-gradient(145deg, #212529, #343a40);
  border: none;
}

.btn-dark:hover {
  background: linear-gradient(145deg, #343a40, #212529);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 2px solid #0d6efd;
}

.btn-outline-primary:hover {
  background: linear-gradient(145deg, #0d6efd, #0a58ca);
  color: white;
  border: none;
}

.btn-outline-success {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 2px solid #198754;
}

.btn-outline-success:hover {
  background: linear-gradient(145deg, #198754, #157347);
  color: white;
  border: none;
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
  background-color: #fff;
}

.progress {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(145deg, #e9ecef, #f8f9fa);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  background: linear-gradient(90deg, #0d6efd, #0a58ca);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.input-group {
  border-radius: 8px;
  overflow: hidden;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-right: none;
}

.form-control {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  background: #ffffff;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
  border-color: #86b7fe;
}

.form-select {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.5rem 2.25rem 0.5rem 1rem;
  transition: all 0.2s ease;
}

.form-select:focus {
  background: #ffffff;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
  border-color: #86b7fe;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Empty state styling */
.text-center .icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  opacity: 0.7;
}

/* Card stats styling */
.bg-opacity-10 {
  opacity: 0.15 !important;
}

.bg-primary.bg-opacity-10 {
  background: linear-gradient(145deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.15)) !important;
}

.bg-success.bg-opacity-10 {
  background: linear-gradient(145deg, rgba(25, 135, 84, 0.1), rgba(25, 135, 84, 0.15)) !important;
}

.bg-purple.bg-opacity-10 {
  background: linear-gradient(145deg, rgba(111, 66, 193, 0.1), rgba(111, 66, 193, 0.15)) !important;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 90vw;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    max-width: 100vw;
    padding: 0 0.5rem;
  }
  
  .card {
    margin-bottom: 1rem;
  }
  
  .table-responsive {
    border-radius: 12px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.level-beginner {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}

.level-intermediate {
  background: linear-gradient(135deg, #ffc107, #d39e00);
  color: white;
}

.level-advanced {
  background: linear-gradient(135deg, #dc3545, #bd2130);
  color: white;
}

.stat-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.stat-icon-container .icon {
  width: 24px;
  height: 24px;
  color: white;
  transition: transform 0.3s ease;
}

.stat-icon-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon-container:hover .icon {
  transform: scale(1.1);
}

.bg-primary {
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
}

.bg-success {
  background: linear-gradient(135deg, #198754, #157347);
}

.bg-purple {
  background: linear-gradient(135deg, #6f42c1, #5a32a3);
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

.card-body {
  padding: 1.5rem;
}

.card-body h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body p {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
