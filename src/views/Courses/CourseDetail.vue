<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />

    <div v-show="!isLoading">
      <div class="course-detail-container" v-if="course">
        <div class="course-header">
          <div class="course-media-actions">
            <img :src="course.thumbUrl" alt="Course Thumbnail" class="course-thumb" />
            
            <div 
              class="course-actions" 
              v-if="!isEnrolled && !isLoadingEnrollment" 
            >
              <div class="course-pricing">
                <span class="price-label">Giá:</span>
                <span class="price" v-if="course.discount > 0">
                  <del>{{ course.price?.toLocaleString('vi-VN') }} VND</del>
                  <strong>{{ discountedPrice.toLocaleString('vi-VN') }} VND</strong>
                  <span class="discount-badge">{{ course.discount }}% OFF</span>
                </span>
                <span class="price" v-else>
                  <strong>{{ course.price?.toLocaleString('vi-VN') }} VND</strong>
                </span>
              </div>
              <div class="buy-button-container">
                <button class="btn-buy" @click="handlePurchase">💰 Mua ngay</button>
              </div>
            </div>
            <div class="enrollment-status" v-else-if="isEnrolled && !isLoadingEnrollment">
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
              <span>⭐ {{ averageRating }}/5</span>
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
          </div>
        </div>

        <h2 class="section-title">📚 Bài giảng</h2>
        
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
                @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='block'; }"
              />
              <div class="lecture-thumb-placeholder" style="display: none;">Không thể tải ảnh</div>
            </template>
            <template v-else>
              <div class="lecture-thumb-placeholder">Không có ảnh xem trước</div>
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
              :disabled="!lecture.isPreviewable" 
              :title="!lecture.isPreviewable ? 'Bạn cần mua khóa học để xem bài giảng này' : 'Xem bài giảng'"
            >
              ▶️ Xem bài giảng
            </button> 
          </div>
        </div>
        <div v-else-if="!isLoadingLectures && course">
            <p>Chưa có bài giảng nào cho khóa học này.</p>
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
import { getCourseById } from "@/scripts/api/services/CourseService"; 
import { purchaseCourse } from "@/scripts/api/services/paymentService";
import { getLectures } from "@/scripts/api/services/lectureService";
import { getEnrollments } from "@/scripts/api/services/enrollmentService";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue'; 
import { getUserById } from "@/scripts/api/services/userService";

export default {
  name: "CourseDetail",
  components: {
    LoadingSpinner
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
             requirements: courseData.requirements || "Thông tin đang được cập nhật.",
             creatorId: courseData.creatorId
           };
           if (courseData.creatorId) {
              try {
                const instructorData = await getUserById(courseData.creatorId);
                instructorName.value = instructorData?.fullName || instructorData?.name || "Không rõ";
              } catch (userError) {
                console.error(`Lỗi khi lấy thông tin giảng viên ${courseData.creatorId}:`, userError);
                instructorName.value = "Không rõ";
              }
            } else {
              instructorName.value = "Không rõ";
            }
           return true;
         } else {
           console.error("Không tìm thấy dữ liệu khóa học.");
           return false;
         }
       } catch (error) {
         console.error("Lỗi khi lấy thông tin khóa học:", error);
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
          lectures.value = lectureList.map(lecture => {
             const firstImageMaterial = lecture.materials?.find(material => material.type === 1); 
             return {
                ...lecture,
                firstImageUrl: firstImageMaterial ? firstImageMaterial.url : null 
             };
          });
       } catch (error) {
          console.error(`Lỗi khi lấy danh sách bài giảng cho khóa học ${courseId}:`, error);
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
          const enrolled = response.items.some(enrollment => enrollment.courseId === courseId);
          isEnrolled.value = enrolled;
        } else {
          isEnrolled.value = false;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng ký:", error);
        isEnrolled.value = false; 
      } finally {
        isLoadingEnrollment.value = false;
      }
    };

    const isLoading = computed(() => 
      isLoadingCourse.value || 
      isLoadingLectures.value || 
      isLoadingEnrollment.value
    );

    const discountedPrice = computed(() => {
       if (!course.value) return 0;
       const discount = Number(course.value.discount) || 0;
       const price = Number(course.value.price) || 0;
       return discount > 0 ? price * (1 - discount / 100) : price;
    });

    const averageRating = computed(() => {
       if (!course.value || !course.value.ratingCount) return "N/A";
       return (course.value.totalRating / course.value.ratingCount).toFixed(1);
    });

    const handlePurchase = async () => {
       if (!course.value?.id) {
         alert("Không xác định được khóa học.");
         return;
       }
      try {
        const data = await purchaseCourse(course.value.id);
        if (!data?.url) {
          alert("Không nhận được URL thanh toán.");
          return;
        }
        window.location.href = data.url;
      } catch (error) {
        console.error("Lỗi khi mua khóa học:", error);
        alert(error.response?.data?.message || "Có lỗi xảy ra khi tiến hành thanh toán.");
      }
    };

    const viewLecture = (lectureId) => {
      if (!lectureId) {
        console.error("Không có ID bài giảng trong CourseDetail");
        return;
      }

      console.log("Redirecting to lecture with ID:", lectureId);
      
      router.push({ 
        name: 'lectureDetail',
        params: { id: lectureId },
        query: { courseId: course.value.id }
      });
    };

    onMounted(async () => {
       await Promise.all([
         fetchCourseInfo(), 
         fetchLectures(),
         checkEnrollmentStatus()
       ]);
    });

    return {
      isLoading, 
      isLoadingCourse, 
      isLoadingLectures, 
      isLoadingEnrollment,
      isEnrolled,
      course,
      lectures,
      instructorName,
      discountedPrice,
      averageRating,
      viewLecture,
      handlePurchase,
    };
  },
};
</script>

<style scoped>
.course-detail-container {
  max-width: 1100px;
  margin: 40px auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.course-header {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 40px;
}

.course-media-actions {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-thumb {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.course-info {
  flex-grow: 1;
}

.course-title {
  font-size: 28px;
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #333;
}

.course-meta {
  font-size: 14px;
  color: #555;
  margin-bottom: 25px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.course-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.course-section {
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #0056b3;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.course-intro,
.course-description,
.course-outcomes,
.course-requirements {
  font-size: 15px;
  color: #444;
  line-height: 1.6;
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
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.price-label {
  font-weight: 500;
  color: #555;
  margin-right: 5px;
}

.price del {
  color: #aaa;
  font-size: 16px;
  margin-right: 8px;
}

.price strong {
   font-weight: bold;
   font-size: 22px;
   color: #d9534f;
}

.discount-badge {
  background-color: #f0ad4e;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
}

.buy-button-container {
  margin-top: 0;
}

.btn-buy {
  background: linear-gradient(to right, #28a745, #218838);
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.4);
  width: 100%;
  text-align: center;
}

.btn-buy:hover {
  background: linear-gradient(to right, #218838, #1e7e34);
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.5);
  transform: translateY(-2px);
}

.section-title {
  font-size: 22px;
  margin-top: 40px;
  border-bottom: 2px solid #0056b3;
  padding-bottom: 8px;
  color: #333;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 25px;
}

.lecture-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lecture-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.lecture-thumb {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #f0f0f0;
  margin-bottom: 15px;
}

.lecture-content h3 {
  font-size: 17px;
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
}

.lecture-summary {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.5;
}

.preview-badge {
  display: inline-block;
  background: #17a2b8;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: 500;
}

.btn-view {
  background: #007bff;
  color: white;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
  width: 100%;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.btn-view:hover {
  background: #0056b3;
}

.btn-view:disabled {
  background-color: #adb5bd;
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-view:disabled:hover {
  background-color: #adb5bd;
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
      padding: 20px;
  }
}

.loading-placeholder {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #666;
}

.lecture-thumb-placeholder {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #888;
  font-size: 14px;
  text-align: center;
  border-radius: 8px;
  border: 1px dashed #ddd;
  margin-bottom: 15px;
}

.enrollment-status {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9f7ef;
  border: 1px solid #b8e0c8;
  border-radius: 8px;
  text-align: center;
}

.enrolled-message {
  color: #155724;
  font-weight: 600;
  margin: 0;
}

.enrollment-loading {
    margin-top: 20px;
    text-align: center;
    color: #6c757d;
}
</style>
