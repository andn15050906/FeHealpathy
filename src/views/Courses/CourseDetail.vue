<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />

    <div v-show="!isLoading">
      <div class="course-detail-container" v-if="course">
        <div class="course-header">
          <div class="course-media-actions">
            <div class="course-thumb-container">
              <img
                :src="course.thumbUrl"
                alt="Course Thumbnail"
                class="course-thumb"
              />
              <div class="level-badge" :class="getLevelClass(course.level)">
                {{ getLevelText(course.level) }}
              </div>
            </div>

            <div class="owner-status" v-if="isOwner">
              <p class="owner-message">🔑 Đây là khóa học của bạn.</p>
            </div>

            <div
              class="course-actions"
              v-else-if="!isEnrolled && !isLoadingEnrollment"
            >
              <div class="course-pricing">
                <span class="price-label">Giá:</span>
                <div class="price-container">
                  <div class="old-price-row" v-if="course.discount > 0">
                    <del>{{ course.price?.toLocaleString("vi-VN") }} VND</del>
                    <span class="discount-badge"
                      >{{ Math.floor(course.discount * 100) }}% OFF</span
                    >
                  </div>
                  <div class="new-price">
                    <strong>{{
                      discountedPrice == 0
                        ? "Miễn phí"
                        : discountedPrice.toLocaleString("vi-VN") + " VND"
                    }}</strong>
                  </div>
                </div>
              </div>
              <div class="buy-button-container">
                <button class="btn-buy" @click="handlePurchase">
                  💰 Mua ngay
                </button>
              </div>
            </div>
            <div
              class="enrollment-status"
              v-else-if="isEnrolled && !isLoadingEnrollment"
            >
              <p class="enrolled-message">✅ Bạn đã tham gia khóa học này.</p>
            </div>
            <div v-else-if="isLoadingEnrollment" class="enrollment-loading">
              <p>Đang kiểm tra trạng thái...</p>
            </div>
          </div>

          <div class="course-info">
            <h1 class="course-title">{{ course.title }}</h1>
            <p class="course-meta">
              <span>🧑‍🏫 Giảng viên: {{ instructorName }}</span>
              <span>🎓 {{ course.learnerCount || 0 }} Học viên</span>
              <span class="rating-meta" @click="scrollToRating">⭐ {{ averageRating }}/5</span>
            </p>

            <div class="course-section">
              <h3 class="section-subtitle">🎯 Giới thiệu</h3>
              <p class="course-intro">{{ course.intro }}</p>
            </div>

            <div class="course-section">
              <h3 class="section-subtitle">💡 Mô tả chi tiết</h3>
              <p class="course-description">{{ course.description }}</p>
            </div>

            <div class="course-section">
              <h3 class="section-subtitle">🎯 Kết quả đạt được</h3>
              <p class="course-outcomes">{{ course.outcomes }}</p>
            </div>

            <div class="course-section">
              <h3 class="section-subtitle">💡 Yêu cầu khóa học</h3>
              <p class="course-requirements">{{ course.requirements }}</p>
            </div>

            <div class="course-section" v-if="isEnrolled">
              <h3 class="section-subtitle">📊 Tiến độ học tập</h3>
              <div class="progress-container">
                <div class="progress-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ completedLectures }}/{{ totalLectures }}</div>
                    <div class="stat-label">Bài giảng đã học</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ Math.round(completionRate) }}%</div>
                    <div class="stat-label">Hoàn thành</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ lastStudyDate || 'Chưa học' }}</div>
                    <div class="stat-label">Lần học cuối</div>
                  </div>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${completionRate}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <div class="section-header">
              <h4 class="fw-bold text-dark card-title mb-4">📚 Bài giảng</h4>
              <div class="section-stats" v-if="isEnrolled">
                <span class="stat-badge">
                  <i class="fas fa-book-open"></i>
                  {{ completedLectures }}/{{ totalLectures }} bài đã học
                </span>
                <span class="stat-badge">
                  <i class="fas fa-chart-line"></i>
                  {{ Math.round(completionRate) }}% hoàn thành
                </span>
              </div>
            </div>

            <div v-if="lectures.length > 0" class="lecture-grid">
              <div
                v-for="lecture in lectures"
                :key="lecture.id"
                class="lecture-card"
              >
                <template v-if="lecture.firstImageUrl">
                  <img
                    :src="lecture.firstImageUrl"
                    alt="Lecture Image"
                    class="lecture-thumb"
                    @error="
                      (e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }
                    "
                  />
                  <div class="lecture-thumb-placeholder" style="display: none">
                    Không thể tải ảnh
                  </div>
                </template>
                <template v-else>
                  <div class="lecture-thumb-placeholder">
                    Không có ảnh xem trước
                  </div>
                </template>

                <div class="lecture-content">
                  <h3>{{ lecture.title }}</h3>
                  <p class="lecture-summary">{{ lecture.contentSummary }}</p>
                  <span v-if="lecture.isPreviewable" class="preview-badge"
                    >🔓 Xem trước miễn phí</span
                  >
                </div>
                <button
                  class="btn-view"
                  @click="viewLecture(lecture.id)"
                  :disabled="!lecture.isPreviewable && !isOwner && !isEnrolled"
                  :title="
                    lecture.isPreviewable
                      ? 'Xem bài giảng'
                      : isOwner || isEnrolled
                      ? 'Xem bài giảng'
                      : 'Bạn cần mua khóa học để xem bài giảng này'
                  "
                >
                  ▶️ Xem bài giảng
                </button>
              </div>
            </div>
            <div v-else-if="!isLoadingLectures && course">
              <p class="no-lectures">Chưa có bài giảng nào cho khóa học này.</p>
            </div>
          </div>
        </div>

        <div
          class="card border-0 shadow-sm mb-2 mt-4"
          v-if="recommendedCourses.length > 0"
        >
          <div class="card-body">
            <h4 class="fw-bold text-dark card-title mb-4">
              Khóa học bạn có thể thích
            </h4>

            <div class="position-relative">
              <swiper
                :modules="swiperModules"
                :slides-per-view="1"
                :space-between="10"
                :navigation="true"
                :pagination="{ clickable: true }"
                :breakpoints="{
                  576: { slidesPerView: 1 },
                  768: { slidesPerView: 2, spaceBetween: 10 },
                  992: { slidesPerView: 3, spaceBetween: 10 },
                }"
                class="related-courses-swiper"
              >
                <swiper-slide
                  v-for="recCourse in recommendedCourses"
                  :key="recCourse.objectID"
                >
                  <a
                    :href="`/courses/${recCourse.objectID}`"
                    class="card h-100 shadow-sm article-card text-decoration-none"
                  >
                    <div class="image-container">
                      <img
                        :src="recCourse.ThumbUrl"
                        class="card-img-top"
                        alt="course image"
                      />
                    </div>
                    <div class="card-content">
                      <h5 class="fw-bold title-truncate">
                        {{ recCourse.Title }}
                      </h5>
                      <p class="text-muted mb-0 date-text">
                        {{ formatDate(recCourse.CreationTime) }}
                      </p>
                    </div>
                  </a>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>

        <div class="rating-section" v-if="course">
          <!-- <h2 class="section-title">⭐ Đánh giá khóa học</h2>
          
          <div class="rating-summary">
            <div class="average-rating">
              <div class="rating-number">{{ averageRating }}</div>
              <div class="rating-stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= Math.round(averageRating) }">★</span>
              </div>
              <div class="rating-count">{{ course.ratingCount || 0 }} đánh giá</div>
            </div>
          </div> -->

          <div class="rating-form" v-if="isEnrolled && !hasRated">
            <h3>Viết đánh giá của bạn</h3>
            <div class="rating-input">
              <span v-for="n in 5" :key="n" 
                    class="star-input" 
                    :class="{ 'filled': n <= userRating }"
                    @click="setUserRating(n)"
                    @mouseover="hoverRating = n"
                    @mouseleave="hoverRating = 0">★</span>
            </div>
            <textarea 
              v-model="userReview" 
              placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
              class="review-input"
            ></textarea>
            <button class="btn-submit-review" @click="submitReview" :disabled="!userRating">
              Gửi đánh giá
            </button>
          </div>

          <div class="reviews-list" v-if="course.ratingCount > 0">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <img :src="review.userAvatar || '/default-avatar.png'" alt="User Avatar" class="reviewer-avatar">
                  <span class="reviewer-name">{{ review.userName }}</span>
                </div>
                <div class="review-rating">
                  <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
                </div>
              </div>
              <p class="review-content">{{ review.content }}</p>
              <div class="review-date">{{ formatDate(review.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!isLoadingCourse && !course && !isLoadingEnrollment">
        <p class="loading-placeholder">⚠️ Không thể tải thông tin khóa học.</p>
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
    const userRating = ref(0);
    const hoverRating = ref(0);
    const userReview = ref('');
    const hasRated = ref(false);
    const reviews = ref([]);
    const completedLectures = ref(0);
    const totalLectures = ref(0);
    const completionRate = ref(0);
    const lastStudyDate = ref('');

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
        lectures.value = lectureList
          .map((lecture) => {
            const firstImageMaterial = lecture.materials?.find(
              (material) => material.type === 1
            );
            return {
              ...lecture,
              firstImageUrl: firstImageMaterial ? firstImageMaterial.url : null,
            };
          })
          .sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime));
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

    const setUserRating = (rating) => {
      userRating.value = rating;
    };

    const submitReview = async () => {
      if (!userRating.value) return;
      
      try {
        // TODO: Implement API call to submit review
        // await submitCourseReview(courseId, {
        //   rating: userRating.value,
        //   content: userReview.value
        // });
        
        toast.success('Cảm ơn bạn đã đánh giá khóa học!');
        hasRated.value = true;
        userRating.value = 0;
        userReview.value = '';
        
        // Refresh reviews
        // await fetchReviews();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi gửi đánh giá');
      }
    };

    const fetchReviews = async () => {
      try {
        // TODO: Implement API call to fetch reviews
        // const response = await getCourseReviews(courseId);
        // reviews.value = response.items || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const scrollToRating = () => {
      const ratingSection = document.querySelector('.rating-section');
      if (ratingSection) {
        ratingSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

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

    const calculateProgress = () => {
      // Mock data for now
      totalLectures.value = lectures.value.length;
      completedLectures.value = Math.floor(Math.random() * totalLectures.value);
      completionRate.value = (completedLectures.value / totalLectures.value) * 100;
      
      // Mock last study date
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      lastStudyDate.value = date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    onMounted(async () => {
      getCurrentUserInfo();

      await Promise.all([
        fetchCourseInfo(),
        fetchLectures(),
        checkEnrollmentStatus(),
      ]);

      await fetchRecommendedCourses();
      await fetchReviews();

      if (isEnrolled.value) {
        calculateProgress();
      }
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
      userRating,
      hoverRating,
      userReview,
      hasRated,
      reviews,
      setUserRating,
      submitReview,
      scrollToRating,
      getLevelClass,
      getLevelText,
      completedLectures,
      totalLectures,
      completionRate,
      lastStudyDate,
    };
  },
};
</script>

<style scoped>
.course-detail-container {
  margin: 0px auto;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.06);
  width: 72vw;
}

.course-header {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  margin-bottom: 50px;
}

.course-media-actions {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.course-thumb-container {
  position: relative;
  width: 100%;
  height: 210px;
}

.course-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-thumb:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.level-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.level-beginner {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.level-intermediate {
  background: linear-gradient(135deg, #ffc107, #d39e00);
}

.level-advanced {
  background: linear-gradient(135deg, #dc3545, #bd2130);
}

.course-info {
  flex-grow: 1;
}

.course-title {
  font-size: 32px;
  margin: 0 0 15px 0;
  font-weight: 700;
  color: #222;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.course-meta {
  font-size: 15px;
  color: #555;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.course-section {
  margin-bottom: 25px;
}

.section-subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #0056b3;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eef2f7;
}

.course-intro,
.course-description,
.course-outcomes,
.course-requirements {
  font-size: 16px;
  color: #444;
  line-height: 1.7;
  margin-top: 0;
}

.course-actions {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.course-pricing {
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #f8f9fa;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.price-label {
  font-weight: 500;
  color: #444;
  margin-bottom: 5px;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.old-price-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.old-price-row del {
  color: #999;
  font-size: 14px;
}

.discount-badge {
  background: linear-gradient(135deg, #f0ad4e, #ec971f);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(240, 173, 78, 0.4);
}

.new-price strong {
  font-weight: 700;
  font-size: 24px;
  color: #d9534f;
}

.buy-button-container {
  margin-top: 5px;
}

.btn-buy {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  padding: 16px 30px;
  font-size: 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(40, 167, 69, 0.3);
  width: 100%;
  text-align: center;
  letter-spacing: 0.5px;
}

.btn-buy:hover {
  background: linear-gradient(135deg, #218838, #1a6b2d);
  box-shadow: 0 8px 18px rgba(40, 167, 69, 0.4);
  transform: translateY(-3px);
}

.section-title {
  font-size: 24px;
  margin-bottom: 30px;
  border-bottom: 3px solid #0056b3;
  padding-bottom: 10px;
  color: #222;
  position: relative;
  display: inline-block;
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #28a745;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 25px;
}

.lecture-card {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.lecture-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.lecture-thumb-container {
  position: relative;
  width: 100%;
  height: 160px;
  margin-bottom: 18px;
}

.lecture-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.lecture-content h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
}

.lecture-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.preview-badge {
  display: inline-block;
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(23, 162, 184, 0.3);
}

.btn-view {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 12px;
  font-size: 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-align: center;
  margin-top: 15px;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.25);
}

.btn-view:hover {
  background: linear-gradient(135deg, #0056b3, #004494);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.35);
  transform: translateY(-2px);
}

.btn-view:disabled {
  background: linear-gradient(135deg, #adb5bd, #868e96);
  color: #fff;
  cursor: not-allowed;
  opacity: 0.8;
  box-shadow: none;
}

.btn-view:disabled:hover {
  background: linear-gradient(135deg, #adb5bd, #868e96);
  transform: none;
}

@media (max-width: 768px) {
  .course-header {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .course-media-actions {
    width: 100%;
    max-width: 450px;
    align-items: center;
  }

  .course-thumb {
    max-width: 400px;
    height: auto;
  }

  .course-info {
    width: 100%;
  }

  .course-pricing {
    justify-content: center;
  }

  .btn-buy {
    width: 100%;
  }

  .lecture-grid {
    grid-template-columns: 1fr;
  }

  .course-detail-container {
    padding: 25px;
  }
}

.loading-placeholder {
  text-align: center;
  padding: 60px;
  font-size: 1.3em;
  color: #555;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin: 40px auto;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.lecture-thumb-placeholder {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #888;
  font-size: 14px;
  text-align: center;
  border-radius: 10px;
  border: 1px dashed #ddd;
  margin-bottom: 18px;
}

.enrollment-status {
  margin-top: 20px;
  padding: 18px;
  background-color: #e9f7ef;
  border: 1px solid #c8e6d2;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.1);
}

.enrolled-message {
  color: #155724;
  font-weight: 600;
  margin: 0;
  font-size: 16px;
}

.enrollment-loading {
  margin-top: 20px;
  text-align: center;
  color: #6c757d;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.owner-status {
  margin-top: 20px;
  padding: 18px;
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(255, 193, 7, 0.1);
}

.owner-message {
  color: #856404;
  font-weight: 600;
  margin: 0;
  font-size: 16px;
}

.related-courses-swiper {
  padding: 0 15px;
  padding-bottom: 2.5rem;
  max-width: 100%;
}

.image-container {
  height: 200px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.article-card:hover .card-img-top {
  transform: scale(1.05);
}

.card-content {
  min-height: 75px;
  max-height: 85px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  justify-content: space-between;
}

.title-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  max-height: 2.6em;
  margin-bottom: 0.25rem;
  font-size: 1rem;
  word-break: break-word;
  hyphens: auto;
}

.swiper-button-next,
.swiper-button-prev {
  color: #6c757d;
  font-weight: bold;
  top: 45%;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-weight: bold;
  font-size: 20px;
}

.swiper-pagination-bullet-active {
  background: #6c757d;
}

:deep(.swiper-pagination) {
  bottom: 0 !important;
  margin-bottom: 0.5rem;
}

:deep(.swiper-button-prev) {
  left: 0;
}

:deep(.swiper-button-next) {
  right: 0;
}

.article-card {
  height: 320px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

:deep(.swiper-wrapper) {
  width: 100%;
}

:deep(.swiper-slide) {
  width: auto;
  display: flex;
  justify-content: center;
}

.card-body {
  padding: 1.25rem 0.75rem;
}

.rating-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.rating-summary {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.average-rating {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  min-width: 200px;
}

.rating-number {
  font-size: 48px;
  font-weight: bold;
  color: #0056b3;
  line-height: 1;
  margin-bottom: 10px;
}

.rating-stars {
  margin-bottom: 10px;
}

.star {
  color: #ddd;
  font-size: 24px;
  margin: 0 2px;
}

.star.filled {
  color: #ffc107;
}

.rating-count {
  color: #666;
  font-size: 14px;
}

.rating-form {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.rating-form h3 {
  margin-bottom: 15px;
  color: #333;
}

.rating-input {
  margin-bottom: 20px;
}

.star-input {
  font-size: 32px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
  margin-right: 5px;
}

.star-input.filled {
  color: #ffc107;
}

.review-input {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  resize: vertical;
  font-size: 14px;
}

.btn-submit-review {
  background: linear-gradient(135deg, #0056b3, #003d82);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-submit-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 86, 179, 0.2);
}

.btn-submit-review:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.reviews-list {
  margin-top: 30px;
}

.review-item {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-content {
  color: #444;
  line-height: 1.6;
  margin-bottom: 10px;
}

.review-date {
  color: #888;
  font-size: 12px;
}

@media (max-width: 768px) {
  .rating-summary {
    flex-direction: column;
    text-align: center;
  }

  .average-rating {
    margin-bottom: 20px;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.rating-meta {
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-meta:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}

.progress-container {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.progress-bar-container {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0056b3, #007bff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .progress-stats {
    flex-direction: column;
    gap: 20px;
  }

  .stat-item {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
  }
}

.course-content-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-stats {
  display: flex;
  gap: 15px;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 14px;
  color: #0056b3;
  font-weight: 500;
}

.stat-badge i {
  font-size: 16px;
}

.no-lectures {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
  font-size: 16px;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .section-stats {
    width: 100%;
    flex-direction: column;
  }

  .stat-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>