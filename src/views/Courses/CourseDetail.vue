<template>
  <div class="container-fluid py-4">
    <div class="bg-dark text-white py-4 mb-4">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <div class="course-thumbnail position-relative">
              <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="img-fluid rounded" />
              <div v-else class="bg-secondary d-flex align-items-center justify-content-center rounded"
                style="height: 220px">
                <ImageIcon class="icon text-light" style="width: 64px; height: 64px" />
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="d-flex align-items-center gap-2 mb-2">
              <button @click="goBack" class="btn btn-link text-light p-0">
                <ArrowLeftIcon class="icon" style="width: 20px; height: 20px" />
              </button>
              <span class="badge bg-primary">
                {{ course.category }}
              </span>
            </div>

            <h1 class="h2 fw-bold mb-3">
              {{ course.title }}
            </h1>

            <p class="text-light mb-4">{{ course.description }}</p>

            <div class="row mb-4">
              <div class="col-6 col-sm-3 mb-3 mb-sm-0">
                <p class="text-light-50 small mb-1">Giảng viên</p>
                <p class="mb-0 fw-medium">{{ course.instructor }}</p>
              </div>
              <div class="col-6 col-sm-3 mb-3 mb-sm-0">
                <p class="text-light-50 small mb-1">Thời lượng</p>
                <p class="mb-0 fw-medium">{{ course.duration }} giờ</p>
              </div>
              <div class="col-6 col-sm-3">
                <p class="text-light-50 small mb-1">Trình độ</p>
                <p class="mb-0 fw-medium text-capitalize">{{ course.level }}</p>
              </div>
              <div class="col-6 col-sm-3">
                <p class="text-light-50 small mb-1">Cập nhật lần cuối</p>
                <p class="mb-0 fw-medium">
                  {{ formatDate(course.lastUpdated) }}
                </p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-4">
              <div class="d-flex align-items-center">
                <div class="d-flex">
                  <StarIcon v-for="i in 5" :key="i" style="width: 20px; height: 20px"
                    :class="[i <= Math.round(course.rating) ? 'icon text-warning' : 'icon text-secondary']" />
                </div>
                <span class="ms-2 text-light">
                  {{ course.rating }} ({{ course.reviewCount }} đánh giá)
                </span>
              </div>

              <div class="d-flex align-items-center">
                <UsersIcon class="icon text-light-50 me-2" style="width: 20px; height: 20px" />
                <span>{{ course.students }} học viên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-lg-8 mb-4 mb-lg-0">
          <div v-if="course.enrolled" class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h3 class="h6 fw-bold mb-0">Tiến trình của bạn</h3>
                <span class="text-muted">{{ course.progress }}% hoàn thành</span>
              </div>
              <div class="progress" style="height: 10px">
                <div class="progress-bar bg-primary" role="progressbar" :style="{ width: `${course.progress}%` }"
                  :aria-valuenow="course.progress" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div class="mt-3 d-flex justify-content-between">
                <span class="small text-muted">
                  {{ completedLectures }} / {{ course.lectures.length }} bài giảng hoàn thành
                </span>
                <span v-if="course.hasCertificate" class="small text-muted">
                  <AwardIcon class="icon me-1" style="width: 16px; height: 16px" />
                  Có chứng chỉ sau khi hoàn thành
                </span>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
              <h2 class="h5 fw-bold mb-0">Nội dung khóa học</h2>
              <p class="text-muted small mb-0">
                {{ course.lectures.length }} bài giảng • {{ course.duration }} giờ tổng
              </p>
            </div>

            <div class="list-group list-group-flush">
              <div v-for="(lecture, lectureIndex) in course.lectures" :key="lecture.id"
                class="list-group-item d-flex align-items-center hover-bg-light">
                <div class="me-3">
                  <CheckCircleIcon v-if="lecture.completed" class="icon text-success"
                    style="width: 20px; height: 20px" />
                  <CircleIcon v-else class="icon text-muted" style="width: 20px; height: 20px" />
                </div>

                <div class="flex-1">
                  <div class="d-flex align-items-center">
                    <component :is="getLectureIcon(lecture.type)" class="icon text-muted me-2"
                      style="width: 16px; height: 16px" />
                    <span class="text-dark lecture-link" @click="navigateToLecture(lecture.id)">
                      {{ lecture.title }}
                    </span>
                  </div>
                  <p v-if="lecture.description" class="small text-muted mt-1 mb-0">
                    {{ lecture.description }}
                  </p>
                </div>

                <div class="d-flex align-items-center">
                  <span v-if="lecture.preview" class="badge bg-primary me-3">
                    Xem trước
                  </span>
                  <span class="small text-muted">{{ lecture.duration }} phút</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex flex-column flex-sm-row justify-content-between gap-3">
              <h2 class="h5 fw-bold mb-0">Đánh giá của học viên</h2>
              <div class="d-flex align-items-center">
                <span class="me-2 small text-muted">Sắp xếp theo:</span>
                <select v-model="reviewSortOption" class="form-select form-select-sm">
                  <option value="recent">Mới nhất</option>
                  <option value="highest">Đánh giá cao</option>
                  <option value="lowest">Đánh giá thấp</option>
                </select>
              </div>
            </div>

            <div class="card-body border-bottom">
              <div class="row">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                  <div class="display-4 fw-bold text-dark mb-2">{{ course.rating }}</div>
                  <div class="d-flex justify-content-center mb-1">
                    <StarIcon v-for="i in 5" :key="i" style="width: 20px; height: 20px"
                      :class="[i <= Math.round(course.rating) ? 'icon text-warning' : 'icon text-muted']" />
                  </div>
                  <div class="small text-muted">{{ course.reviewCount }} đánh giá</div>
                </div>

                <div class="col-md-8">
                  <div v-for="i in 5" :key="i" class="d-flex align-items-center mb-2">
                    <div class="small text-muted w-8">{{ 6 - i }}</div>
                    <div class="flex-1 mx-2">
                      <div class="progress" style="height: 8px">
                        <div class="progress-bar bg-warning" role="progressbar"
                          :style="{ width: `${getRatingPercentage(6 - i)}%` }"
                          :aria-valuenow="getRatingPercentage(6 - i)" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                    <div class="small text-muted w-8">{{ getRatingCount(6 - i) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sortedReviews.length === 0" class="card-body text-center py-5">
              <MessageSquareIcon class="icon text-muted mb-3" style="width: 48px; height: 48px" />
              <p class="text-muted mb-4">Chưa có đánh giá</p>
              <button v-if="course.enrolled" @click="showReviewForm = true" class="btn btn-dark">
                Viết đánh giá
              </button>
            </div>

            <div v-else>
              <div v-if="showReviewForm" class="p-4 border-bottom bg-light">
                <h3 class="h6 fw-bold mb-3">Viết đánh giá</h3>
                <div class="mb-3">
                  <label class="form-label small fw-medium">Điểm</label>
                  <div class="d-flex">
                    <StarIcon v-for="i in 5" :key="i" @click="newReview.rating = i" style="width: 24px; height: 24px"
                      :class="['icon cursor-pointer', i <= newReview.rating ? 'text-warning' : 'text-muted']" />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-medium">Nội dung</label>
                  <textarea v-model="newReview.content" rows="4" class="form-control"
                    placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button @click="showReviewForm = false" class="btn btn-light">Hủy</button>
                  <button @click="submitReview" class="btn btn-dark">Gửi đánh giá</button>
                </div>
              </div>

              <div class="list-group list-group-flush">
                <div v-for="(review, index) in sortedReviews" :key="index" class="list-group-item p-4">
                  <div class="d-flex justify-content-between mb-2">
                    <div class="d-flex">
                      <div class="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                        style="width: 40px; height: 40px">
                        <UserIcon class="icon text-muted" style="width: 20px; height: 20px" />
                      </div>
                      <div>
                        <div class="fw-medium text-dark">{{ review.userName }}</div>
                        <div class="small text-muted">{{ formatDate(review.date) }}</div>
                      </div>
                    </div>
                    <div class="d-flex">
                      <StarIcon v-for="i in 5" :key="i" style="width: 16px; height: 16px"
                        :class="['icon', i <= review.rating ? 'text-warning' : 'text-muted']" />
                    </div>
                  </div>
                  <p class="text-dark mb-0">{{ review.content }}</p>
                </div>
              </div>

              <!-- Phân trang -->
              <div v-if="sortedReviews.length > 5" class="card-footer d-flex justify-content-center">
                <nav aria-label="Phân trang đánh giá">
                  <ul class="pagination mb-0">
                    <li class="page-item"><a class="page-link" href="#" aria-label="Trước">&laquo;</a></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#" aria-label="Tiếp">&raquo;</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm sticky-top" style="top: 20px">
            <div class="card-body">
              <h3 class="h6 fw-bold mb-3">Chia sẻ khóa học:</h3>
              <div class="d-flex gap-2">
                <button class="btn btn-light rounded-circle" style="width: 40px; height: 40px">
                  <FacebookIcon class="icon text-primary" style="width: 20px; height: 20px" />
                </button>
                <button class="btn btn-light rounded-circle" style="width: 40px; height: 40px">
                  <TwitterIcon class="icon text-info" style="width: 20px; height: 20px" />
                </button>
                <button class="btn btn-light rounded-circle" style="width: 40px; height: 40px">
                  <LinkedinIcon class="icon text-primary" style="width: 20px; height: 20px" />
                </button>
                <button class="btn btn-light rounded-circle" style="width: 40px; height: 40px">
                  <MailIcon class="icon text-dark" style="width: 20px; height: 20px" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCourseById } from "@/scripts/api/services/courseService";
import { purchaseCourse } from "@/scripts/api/services/paymentService";
import { getLectures } from "@/scripts/api/services/lectureService";
import { getEnrollments } from "@/scripts/api/services/enrollmentService";
import { getUserProfile } from "@/scripts/api/services/authService";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import { getUserById } from "@/scripts/api/services/userService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { getRecommendationCourses } from "@/scripts/api/services/courseService";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowLeftIcon,
  ImageIcon,
  StarIcon,
  UsersIcon,
  CheckCircleIcon,
  CircleIcon,
  MessageSquareIcon,
  UserIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
  AwardIcon,
} from "lucide-vue-next";

export default {
  name: "CourseDetail",
  components: {
    LoadingSpinner,
    Swiper,
    SwiperSlide,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref(null);
    const instructorName = ref("Đang tải...");
    const lectures = ref([]);
    const isLoadingCourse = ref(true);
    const isLoadingLectures = ref(true);
    const isEnrolled = ref(false);
    const isLoadingEnrollment = ref(true);
    const isOwner = ref(false);
    const currentUser = ref(null);
    const recommendedCourses = ref([]);
    const isLoadingRecommendations = ref(false);
    const swiperModules = [Navigation, Pagination];

    const getCurrentUserInfo = () => {
      try {
        currentUser.value = getUserProfile();
      } catch (error) {
        currentUser.value = null;
      }
    };

    const fetchCourseInfo = async () => {
      isLoadingCourse.value = true;
      try {
        const courseData = await getCourseById(courseId);
        if (courseData) {
          course.value = {
            id: courseData.id,
            title: courseData.title,
            thumbUrl: courseData.thumbUrl,
            intro: courseData.intro,
            description: courseData.description,
            price: courseData.price,
            discount: courseData.discount,
            learnerCount: courseData.learnerCount,
            ratingCount: courseData.ratingCount,
            totalRating: courseData.totalRating,
            outcomes: courseData.outcomes || "Thông tin đang được cập nhật.",
            requirements:
              courseData.requirements || "Thông tin đang được cập nhật.",
            creatorId: courseData.creatorId,
          };
          if (courseData.creatorId) {
            try {
              const instructorData = await getUserById(courseData.creatorId);
              instructorName.value =
                instructorData?.fullName || instructorData?.name || "Không rõ";
            } catch (userError) {
              instructorName.value = "Không rõ";
            }
          } else {
            instructorName.value = "Không rõ";
          }
          if (currentUser.value && course.value) {
            isOwner.value = course.value.creatorId === currentUser.value.id;
          }
          return true;
        } else {
          isOwner.value = false;
          return false;
        }
      } catch (error) {
        isOwner.value = false;
        return false;
      } finally {
        isLoadingCourse.value = false;
      }
    };

    const fetchLectures = async () => {
      if (!courseId) return;
      isLoadingLectures.value = true;
      try {
        const response = await getLectures(courseId);
        const lectureList = response?.items || [];
        lectures.value = lectureList.map((lecture) => {
          const firstImageMaterial = lecture.materials?.find(
            (material) => material.type === 1
          );
          return {
            ...lecture,
            firstImageUrl: firstImageMaterial ? firstImageMaterial.url : null,
          };
        });
      } catch (error) {
        lectures.value = [];
      } finally {
        isLoadingLectures.value = false;
      }
    };

    const checkEnrollmentStatus = async () => {
      if (!courseId) return;
      isLoadingEnrollment.value = true;
      try {
        const response = await getEnrollments({ pageSize: 100 });

        if (response && response.items) {
          const enrolled = response.items.some(
            (enrollment) => enrollment.courseId === courseId
          );
          isEnrolled.value = enrolled;
        } else {
          isEnrolled.value = false;
        }
      } catch (error) {
        isEnrolled.value = false;
      } finally {
        isLoadingEnrollment.value = false;
      }
    };

    const fetchRecommendedCourses = async () => {
      if (!courseId) return;
      isLoadingRecommendations.value = true;
      try {
        const response = await getRecommendationCourses();
        recommendedCourses.value = response || [];
        recommendedCourses.value = recommendedCourses.value.filter(
          (c) => c.id !== courseId
        );
      } catch (error) {
        recommendedCourses.value = [];
      } finally {
        isLoadingRecommendations.value = false;
      }
    };

    const isLoading = computed(
      () =>
        isLoadingCourse.value ||
        isLoadingLectures.value ||
        isLoadingEnrollment.value
    );

    const discountedPrice = computed(() => {
      if (!course.value) return 0;
      const discount = Number(course.value.discount) || 0;
      const price = Number(course.value.price) || 0;
      return Math.floor(discount > 0 ? price * (1 - discount) : price);
    });

    const averageRating = computed(() => {
      if (!course.value || !course.value.ratingCount) return "N/A";
      return (course.value.totalRating / course.value.ratingCount).toFixed(1);
    });

    const handlePurchase = async () => {
      if (!course.value?.id) {
        toast.error("Không xác định được khóa học");
        return;
      }
      try {
        const data = await purchaseCourse(course.value.id);
        if (!data?.url) {
          toast.error("Không nhận được URL thanh toán");
          return;
        }
        window.location.href = data.url;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Có lỗi xảy ra khi tiến hành thanh toán"
        );
      }
    };

    const viewLecture = (lectureId) => {
      if (!lectureId) {
        return;
      }

      router.push({
        name: "lectureDetail",
        params: { id: lectureId },
        query: { courseId: course.value.id },
      });
    };

    const navigateToCourse = (id) => {
      if (id === courseId) return;

      router.push({
        name: "courseDetail",
        params: { id: id },
      });
    };

    const formatDiscountPrice = (course) => {
      if (!course) return "";
      const discount = Number(course.discount) || 0;
      const price = Number(course.price) || 0;
      const finalPrice = Math.floor(
        discount > 0 ? price * (1 - discount) : price
      );

      return finalPrice === 0
        ? "Miễn phí"
        : `${finalPrice.toLocaleString("vi-VN")} VND`;
    };

    onMounted(async () => {
      getCurrentUserInfo();

      await Promise.all([
        fetchCourseInfo(),
        fetchLectures(),
        checkEnrollmentStatus(),
      ]);

      await fetchRecommendedCourses();
    });

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    };

    return {
      isLoading,
      isLoadingCourse,
      isLoadingLectures,
      isLoadingEnrollment,
      isEnrolled,
      isOwner,
      course,
      lectures,
      instructorName,
      discountedPrice,
      averageRating,
      viewLecture,
      handlePurchase,
      recommendedCourses,
      navigateToCourse,
      formatDiscountPrice,
      swiperModules,
      formatDate,
    };
  },
};
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
}

.cursor-pointer {
  cursor: pointer;
}

.flex-1 {
  flex: 1;
}

.text-light-50 {
  color: rgba(255, 255, 255, 0.5);
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.lecture-link {
  cursor: pointer;
  text-decoration: none;
}

.lecture-link:hover {
  color: #0d6efd !important;
  text-decoration: underline;
}

.w-8 {
  width: 32px;
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

.card-header {
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1rem;
}

.sticky-top {
  z-index: 1020;
}
</style>
