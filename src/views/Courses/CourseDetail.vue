<template>
  <div class="container-fluid" style="margin-top: 80px">
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px">
      <LoadingSpinner />
    </div>

    <div v-else>
      <div class="bg-dark text-white py-4 mb-4">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-4 mb-4 mb-md-0">
              <div class="course-thumbnail position-relative rounded overflow-hidden">
                <img v-if="course.thumbUrl" :src="course.thumbUrl" :alt="course.title" class="img-fluid w-100" />
                <div v-else class="bg-secondary d-flex align-items-center justify-content-center" style="height: 220px">
                  <div class="icon-circle bg-dark-subtle">
                    <LucideImageIcon />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-8">
              <div class="d-flex align-items-center gap-3 mb-3">
                <button @click="goBack" class="btn btn-icon rounded-circle bg-dark-subtle border-0">
                  <LucideArrowLeftIcon />
                </button>
                <span class="badge bg-success rounded-pill px-3 py-3">
                  {{ course.category }}
                </span>
              </div>

              <h1 class="h2 fw-bold mb-3">{{ course.title }}</h1>
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
                    <LucideStarIcon v-for="i in 5" :key="i" :class="i <= Math.round(course.rating)
                      ? 'text-warning'
                      : 'text-secondary'
                      " />
                  </div>
                  <span class="ms-2 text-light">
                    {{ course.rating }} ({{ course.reviewCount }} đánh giá)
                  </span>
                </div>

                <div class="d-flex align-items-center">
                  <div class="me-2">
                    <LucideUsersIcon />
                  </div>
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
            <div v-if="course.enrolled" class="card shadow-hover mb-4">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h3 class="h6 fw-bold mb-0">Tiến trình của bạn</h3>
                  <span class="text-muted">{{ course.progress }}% hoàn thành</span>
                </div>
                <div class="progress" style="height: 10px">
                  <div class="progress-bar bg-primary" role="progressbar" :style="{ width: `${course.progress}%` }" />
                </div>
                <div class="mt-3 d-flex justify-content-between">
                  <span class="small text-muted">
                    {{ completedLectures }} / {{ course.lectures.length }} bài
                    giảng hoàn thành
                  </span>
                  <span v-if="course.hasCertificate" class="small text-muted">
                    <div class="d-inline-flex align-items-center">
                      <div class="icon-circle bg-light me-1">
                        <LucideAwardIcon />
                      </div>
                      Có chứng chỉ sau khi hoàn thành
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div class="card shadow-hover mb-4">
              <div class="card-header bg-white py-3">
                <h2 class="h5 fw-bold mb-1">Nội dung khóa học</h2>
                <p class="text-muted small mb-0">
                  {{ course.lectures.length }} bài giảng •
                  {{ course.duration }} giờ tổng
                </p>
              </div>

              <div class="list-group list-group-flush">
                <div v-for="lecture in course.lectures" :key="lecture.id"
                  class="list-group-item d-flex align-items-center p-3 hover-bg-light cursor-pointer"
                  @click="navigateToLecture(lecture.id)">
                  <div class="me-3">
                    <component :is="lecture.completed
                      ? LucideCheckCircleIcon
                      : LucideCircleIcon
                      " />
                  </div>
                  <div class="flex-1">
                    <div class="d-flex align-items-center">
                      <div class="icon-circle bg-light me-2">
                        <component :is="getLectureIcon(lecture.type)" />
                      </div>
                      <span class="text-dark fw-medium">
                        {{ lecture.title }}
                      </span>
                    </div>
                    <p v-if="lecture.description" class="small text-muted mt-1 mb-0">
                      {{ lecture.description }}
                    </p>
                  </div>
                  <div class="d-flex align-items-center">
                    <span v-if="lecture.preview" class="badge bg-primary rounded-pill me-3">Xem trước</span>
                    <span class="small text-muted">{{ lecture.duration }} phút</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card shadow-hover sticky-top" style="top: 20px">
              <div class="card-body p-4">
                <h3 class="h6 fw-bold mb-3">Chia sẻ khóa học:</h3>
                <div class="d-flex gap-2">
                  <button class="btn-icon social-icon">
                    <LucideFacebookIcon />
                  </button>
                  <button class="btn-icon social-icon">
                    <LucideTwitterIcon />
                  </button>
                  <button class="btn-icon social-icon">
                    <LucideLinkedinIcon />
                  </button>
                  <button class="btn-icon social-icon">
                    <LucideMailIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ArrowLeft as LucideArrowLeftIcon,
  Image as LucideImageIcon,
  Star as LucideStarIcon,
  Users as LucideUsersIcon,
  CheckCircle as LucideCheckCircleIcon,
  Circle as LucideCircleIcon,
  Award as LucideAwardIcon,
  Video as LucideVideoIcon,
  FileText as LucideFileTextIcon,
  Film as LucideFilmIcon,
  File as LucideFileIcon,
  Facebook as LucideFacebookIcon,
  Twitter as LucideTwitterIcon,
  Linkedin as LucideLinkedinIcon,
  Mail as LucideMailIcon,
} from "lucide-vue-next";
import { getCourseById } from "@/scripts/api/services/courseService";
import { purchaseCourse } from "@/scripts/api/services/paymentService";
import { getLectures } from "@/scripts/api/services/lectureService";
import { getEnrollments } from "@/scripts/api/services/enrollmentService";
import { getUserProfile } from "@/scripts/api/services/authService";
import { getUserById } from "@/scripts/api/services/userService";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import { toast } from "vue3-toastify";

export default {
  name: "CourseDetail",
  components: {
    LoadingSpinner,
    LucideArrowLeftIcon,
    LucideImageIcon,
    LucideStarIcon,
    LucideUsersIcon,
    LucideCheckCircleIcon,
    LucideCircleIcon,
    LucideAwardIcon,
    LucideVideoIcon,
    LucideFileTextIcon,
    LucideFilmIcon,
    LucideFileIcon,
    LucideFacebookIcon,
    LucideTwitterIcon,
    LucideLinkedinIcon,
    LucideMailIcon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const course = ref({ lectures: [] });
    const loading = ref(true);
    const completedLectures = computed(
      () => course.value.lectures.filter((l) => l.completed).length
    );

    const goBack = () => router.back();

    const navigateToLecture = (lectureId) => {
      router.push(`/courses/${courseId}/lectures/${lectureId}`);
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        const currentUser = getUserProfile();
        const data = await getCourseById(courseId);
        const instructorInfo = await getUserById(data.creatorId);
        const lectureRes = await getLectures(courseId);
        const enrollmentRes = await getEnrollments({ pageSize: 100 });

        const isEnrolled = enrollmentRes.items.some(
          (e) => e.courseId === courseId
        );
        const progress = isEnrolled ? Math.floor(Math.random() * 100) : 0;

        course.value = {
          id: data.id,
          title: data.title,
          thumbUrl: data.thumbnail || data.thumbUrl,
          description: data.description,
          price: data.price,
          discount: data.discount,
          reviewCount: data.ratingCount || 0,
          rating: data.totalRating / (data.ratingCount || 1) || 0,
          duration: data.duration || 0,
          category: data.category || "Chưa phân loại",
          level: data.level || "cơ bản",
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          students: data.learnerCount || 0,
          hasCertificate: data.hasCertificate,
          enrolled: isEnrolled,
          progress: progress,
          lectures: lectureRes.items.map((l) => ({
            ...l,
            duration: l.duration || 0,
            completed: isEnrolled && Math.random() > 0.5,
            preview: Boolean(l.isPreview),
            description: l.description || "",
          })),
          instructor:
            instructorInfo.fullName || instructorInfo.name || "Không rõ",
        };
      } catch (error) {
        toast.error("Không thể tải dữ liệu khóa học");
        console.error("Error fetching course data:", error);
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const getLectureIcon = (type) => {
      const map = {
        0: LucideFileTextIcon,
        1: LucideVideoIcon,
        2: LucideFilmIcon,
      };
      return map[type] || LucideFileIcon;
    };

    onBeforeMount(fetchData);

    return {
      course,
      loading,
      completedLectures,
      goBack,
      formatDate,
      getLectureIcon,
      navigateToLecture,
      LucideCheckCircleIcon,
      LucideCircleIcon,
    };
  },
};
</script>

<style scoped>
.flex-1 {
  flex: 1;
}

.text-light-50 {
  color: rgba(255, 255, 255, 0.5);
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f8f9fa;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.social-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.social-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.shadow-hover:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.cursor-pointer {
  cursor: pointer;
}

.rounded-pill {
  border-radius: 50rem;
}
</style>