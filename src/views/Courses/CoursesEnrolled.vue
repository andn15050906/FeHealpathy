<template>
  <div class="container py-4">
    <h1 class="mb-4">Khóa học của tôi</h1>
    
    <div v-if="loading" class="text-center py-5">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <div v-if="!enrollments?.length" class="text-center py-5 bg-white rounded shadow-sm">
        <div class="p-4">
          <v-icon size="64" color="grey">mdi-book-outline</v-icon>
          <h3 class="mt-4 mb-3">Bạn chưa tham gia khóa học nào</h3>
          <p class="text-muted mb-4">Hãy truy cập trang khóa học để chọn khóa học bạn muốn tham gia</p>
          <router-link to="/courses" class="btn btn-success">
            Truy cập trang khóa học
          </router-link>
        </div>
      </div>

      <div v-else class="bg-white rounded shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="text-center" style="width: 80px">STT</th>
                <th style="width: 120px">Ảnh</th>
                <th>Tên khóa học</th>
                <th style="width: 150px">Tác giả</th>
                <th style="width: 150px">Ngày tham gia</th>
                <th class="text-center" style="width: 150px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(enrollment, index) in enrollments" :key="enrollment.id">
                <td class="text-center">{{ index + 1 + currentPage * pageSize }}</td>
                <td>
                  <img 
                    :src="courseDetails[enrollment.courseId]?.thumbUrl || DEFAULT_IMAGE_URL" 
                    :alt="courseDetails[enrollment.courseId]?.title || 'Default image'"
                    class="img-fluid rounded"
                    style="width: 100px; height: 60px; object-fit: cover;"
                    @error="handleImageError"
                  />
                </td>
                <td>{{ courseDetails[enrollment.courseId]?.title || 'Đang tải...' }}</td>
                <td>{{ getAuthorName(courseDetails[enrollment.courseId]?.creatorId) }}</td>
                <td>{{ formatDate(enrollment.creationTime) }}</td>
                <td class="text-center">
                  <router-link 
                    :to="{ name: 'courseDetail', params: { id: enrollment.courseId }}" 
                    class="btn btn-success btn-sm"
                  >
                    Xem khóa học
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-3 p-3 border-top">
          <button 
            class="btn btn-success"
            :class="{ disabled: currentPage === 0 }"
            @click="changePage(currentPage - 1)"
          >
            Trang trước
          </button>
          <span>Trang {{ currentPage + 1 }} / {{ totalPages }}</span>
          <button 
            class="btn btn-success"
            :class="{ disabled: currentPage >= totalPages - 1 }"
            @click="changePage(currentPage + 1)"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEnrollments } from '@/scripts/api/services/enrollmentService';
import { getCourseById } from '@/scripts/api/services/courseService';
import { getUserById } from '@/scripts/api/services/userService';
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue'

const DEFAULT_IMAGE_URL = 'https://placehold.co/160x90';

const enrollments = ref([]);
const courseDetails = ref({});
const authorDetails = ref({});
const loading = ref(true);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 10;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const handleImageError = (event) => {
  if (event.target.src !== DEFAULT_IMAGE_URL) {
    event.target.src = DEFAULT_IMAGE_URL;
  }
};

const getAuthorName = (creatorId) => {
  if (!creatorId) return 'N/A';
  return authorDetails.value[creatorId]?.fullName || 'Đang tải...';
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
    console.error('Không hợp lệ courseId');
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
      pageSize: pageSize
    });

    if (!response || !response.items) {
      console.error('Định dạng phản hồi không hợp lệ');
      enrollments.value = [];
      totalPages.value = 0;
      return;
    }

    enrollments.value = response.items;
    totalPages.value = response.pageCount || 1;
    currentPage.value = page;

    await Promise.all(
      response.items.map(enrollment => fetchCourseDetails(enrollment.courseId))
    );
  } catch (error) {
    console.error('Không thể tải đăng ký khóa học:', error);
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
.table > :not(caption) > * > * {
  padding: 1rem;
}
</style>
