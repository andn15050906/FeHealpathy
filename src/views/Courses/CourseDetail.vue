<template>
  <div class="course-detail-container" v-if="course">
    <div class="course-header">
      <img :src="course.thumbUrl" alt="Course Thumbnail" class="course-thumb" />
      <div class="course-info">
        <h1>{{ course.title }}</h1>
        <p class="course-meta">
          🧑‍🏫 Instructor: {{ instructorName }} • 🎓
          {{ course.learnerCount }} Learners • ⭐ {{ averageRating }}/5
        </p>
        <p class="course-intro">{{ course.intro }}</p>
        <p class="course-description">{{ course.description }}</p>
        <div class="course-pricing">
          <span class="price" v-if="course.discount > 0">
            <del>${{ course.price.toFixed(2) }}</del>
            <strong>${{ discountedPrice.toFixed(2) }}</strong>
          </span>
          <span class="price" v-else>${{ course.price.toFixed(2) }}</span>
          <button class="btn-buy" @click="handlePurchase">💰 Mua khóa học</button>
        </div>
      </div>
    </div>

    <h2 class="section-title">📚 Lectures</h2>
    <div class="lecture-grid">
      <div
        v-for="(lecture, index) in lectures"
        :key="index"
        class="lecture-card"
      >
        <img
          :src="lecture.thumbUrl"
          alt="Lecture Image"
          class="lecture-thumb"
        />
        <div class="lecture-content">
          <h3>{{ lecture.title }}</h3>
          <p class="lecture-summary">{{ lecture.contentSummary }}</p>
          <span v-if="lecture.isPreviewable" class="preview-badge"
            >🔓 Free Preview</span
          >
        </div>
        <button class="btn-view" @click="viewLecture(lecture.id)"
          >▶️ View Lecture</button
        >
      </div>
    </div>
  </div>
  <div v-else>
    <p>⏳ Đang tải thông tin khóa học...</p>
  </div>
</template>


<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCourseById } from "@/scripts/api/services/CourseService";
import { purchaseCourse as purchaseCourseAPI } from "@/scripts/api/services/paymentService";

export default {
  name: "CourseDetail",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;

    const course = ref(null);
    const instructorName = ref("Đang tải...");

    const lectures = ref([
      {
        id: "lec1",
        title: "Introduction to Vue",
        contentSummary: "Overview of Vue.js basics.",
        isPreviewable: true,
        thumbUrl:
          "https://i.pinimg.com/550x/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg",
      },
      {
        id: "lec2",
        title: "Vue Directives",
        contentSummary: "Learn v-bind, v-model, v-for.",
        isPreviewable: false,
        thumbUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw50TxlxMp7fLYQfMbioTa6Vg7kJGKtFzibg&s",
      },
      {
        id: "lec3",
        title: "Vue Router",
        contentSummary: "How to set up routing in Vue.js.",
        isPreviewable: false,
        thumbUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3zAUnS60PEt8CuYQkOzpNjZ-XeMW3liGkmg&s",
      },
      {
        id: "lec4",
        title: "Vue State Management",
        contentSummary: "Understanding Vuex and Pinia.",
        isPreviewable: false,
        thumbUrl:
          "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/02/y-nghia-cua-cac-icon-4.jpg",
      },
      {
        id: "lec5",
        title: "Vue Composition API",
        contentSummary: "Using setup() and refs in Vue.",
        isPreviewable: true,
        thumbUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL7_seRTRheWJpPnFCoOkAjxYrZz94HBgHx6av0_3e-YyBehej7q43akXypOG2wVakOPI&usqp=CAU",
      },
      {
        id: "lec6",
        title: "Vue Composition API",
        contentSummary: "Using setup() and refs in Vue.",
        isPreviewable: true,
        thumbUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRgMDpEX0wRun92n0LC79Cfyh8coqsamDUO_1f_wtD4miwDBDX4VwmcWJa1pzK99rxX5Y&usqp=CAU",
      },
      {
        id: "lec7",
        title: "Vue Composition API",
        contentSummary: "Using setup() and refs in Vue.",
        isPreviewable: true,
        thumbUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92FLxyclItwi4Ydx0BPndu9WAJNNaWM_9ikVo-JQXy61loR8Y86AGRGTCcuNi7pTNGe4&usqp=CAU",
      },
      // Giữ nguyên danh sách lecture như bạn có
    ]);

    const getCourseDetail = async () => {
      try {
        const data = await getCourseById(courseId);
        if (data) {
          course.value = {
            id: data.id,
            title: data.title,
            thumbUrl: data.thumbUrl,
            intro: data.intro,
            description: data.description,
            price: data.price,
            discount: data.discount,
            learnerCount: data.learnerCount,
            ratingCount: data.ratingCount,
            totalRating: data.totalRating,
            instructorId: data.instructorId,
          };

          instructorName.value = "Instructor Name";
        } else {
          alert("Không tìm thấy thông tin khóa học.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
      }
    };

    const discountedPrice = computed(() => {
      if (!course.value) return 0;
      return course.value.discount > 0
        ? course.value.price * (1 - course.value.discount / 100)
        : course.value.price;
    });

    const averageRating = computed(() => {
      if (!course.value) return "N/A";
      return course.value.ratingCount > 0
        ? (course.value.totalRating / course.value.ratingCount).toFixed(1)
        : "N/A";
    });

    const handlePurchase = async () => {
      try {
        const id = course.value?.id || courseId;

        if (!id) {
          alert("Không xác định được khóa học.");
          return;
        }

        const data = await purchaseCourseAPI(id);
        if (!data?.url) {
          alert("Không nhận được URL thanh toán.");
          return;
        }

        window.location.href = data.url;
      } catch (error) {
        console.error("Purchase error", error);
      }
    };

    const viewLecture = () => {
      router.push("/lectures-detail");
    };

    onMounted(() => {
      getCourseDetail();
    });

    return {
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
  max-width: 1000px;
  margin: auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.course-thumb {
  width: 300px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.course-info h1 {
  font-size: 24px;
  margin: 0;
}

.course-meta {
  font-size: 14px;
  color: #666;
}

.course-intro {
  font-size: 16px;
  margin: 10px 0;
}

.course-description {
  font-size: 14px;
  color: #444;
}

.course-pricing {
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
}

.price del {
  color: #ff4d4d;
  margin-right: 10px;
}

.section-title {
  font-size: 20px;
  margin-top: 40px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.lecture-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.lecture-thumb {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.lecture-content h3 {
  font-size: 16px;
  margin: 10px 0 5px;
}

.lecture-summary {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.preview-badge {
  display: inline-block;
  background: #28a745;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 5px;
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
}

.btn-view:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .course-header {
    flex-direction: column;
    align-items: center;
  }

  .course-thumb {
    width: 100%;
    max-width: 350px;
  }

  .lecture-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
