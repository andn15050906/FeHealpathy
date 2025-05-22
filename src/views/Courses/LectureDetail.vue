<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />
    <!-- <button class="btn-back" @click="goBack">⬅️ Quay lại khóa học</button> -->
    <div v-show="!isLoading" class="lecture-detail-container">
      <div v-if="lecture" class="lecture-main-content">
        <!-- Tab Navigation -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item" v-for="tab in tabs" :key="tab.id">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === tab.id }" 
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Tab 1: Thông tin bài giảng -->
          <div v-show="activeTab === 'info'" class="tab-pane fade show active lecture-info">
            <div class="">
              <h1 class="lecture-title text-center">{{ lecture.title }}</h1>
              <div class="lecture-meta">
                <div class="meta-item">
                  <span class="meta-label">Cố vấn:</span>
                  <span class="meta-value">{{ authorName || 'Không rõ tác giả' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Ngày tạo:</span>
                  <span class="meta-value">{{ formatDate(lecture.creationTime) }}</span>
                </div>
                <div class="meta-item" v-if="lecture.lastModificationTime">
                  <span class="meta-label">Cập nhật lần cuối:</span>
                  <span class="meta-value">{{ formatDate(lecture.lastModificationTime) }}</span>
                </div>
              </div>
              <div class="lecture-content mt-4">
                <h3 class="content-title">Giới thiệu</h3>
                <div class="content-body">
                  {{ lecture.content || lecture.contentSummary }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Nội dung bài giảng -->
          <div v-show="activeTab === 'materials'" class="tab-pane fade show active">
            <div v-if="hasMaterials" class="lecture-materials">
              <div class="material-grid">
                <div
                  v-for="(material, index) in lecture.materials"
                  :key="index"
                  class="material-card"
                >
                  <template v-if="isImage(material.url)">
                    <img
                      :src="material.url"
                      :alt="material.title || 'Hình ảnh'"
                      class="material-image"
                      @error="handleImageError"
                    />
                  </template>
                  <template v-else-if="isVideo(material.url)">
                    <video controls :src="material.url" class="material-video"></video>
                  </template>
                  <template v-else-if="isAudio(material.url)">
                    <audio controls :src="material.url" class="material-audio"></audio>
                  </template>
                  <template v-else>
                    <div class="document-container">
                      <a :href="material.url" target="_blank" class="material-link">
                        📄 {{ material.title || 'Tài liệu' }}
                      </a>
                      <button
                        class="btn-download"
                        @click="downloadFile(material.url, material.title || 'download')"
                      >
                        ⬇️ Tải xuống
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="no-materials">
              <span class="icon">📁</span>
              <p>Chưa có tài liệu đính kèm nào.</p>
            </div>
          </div>

          <!-- Tab 3: Bình luận -->
          <div v-show="activeTab === 'comments'" class="tab-pane fade show active">
            <div class="comments-section">
              <div class="comment-form-container">
                <div class="form-content">
                  <textarea 
                    v-model="newComment" 
                    class="comment-input" 
                    placeholder="Viết bình luận..."
                    rows="3"
                  ></textarea>
                  <div class="comment-actions">
                    <button 
                      class="btn-post-comment" 
                      @click="postComment" 
                      :disabled="!newComment.trim()"
                    >
                      <span class="icon">✉️</span> Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="comments-container">
                <div v-if="comments && comments.length > 0" class="comments-list">
                  <div v-for="(comment, index) in comments" :key="comment.id" class="comment-item">
                    <div class="comment-header">
                      <div class="comment-user">
                        <img 
                          class="user-avatar comment-avatar" 
                          :src="comment.creatorAvatarUrl || '/default-avatar.png'" 
                          alt="Avatar"
                        >
                        <div class="user-info">
                          <strong>{{ comment.creatorName || 'Người dùng ẩn danh' }}</strong>
                          <span class="comment-date">{{ formatCommentDate(comment.creationTime) }}</span> 
                        </div>
                      </div>
                      <div v-if="isCurrentUserComment(comment)" class="comment-controls">
                        <button class="btn-icon btn-edit-comment" @click="startEditComment(comment, index)" title="Sửa bình luận">
                          ✏️
                        </button>
                        <button class="btn-icon btn-delete-comment" @click="confirmDeleteComment(comment.id)" title="Xóa bình luận">
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div v-if="editingCommentIndex !== index" class="comment-body">
                      <p class="comment-content">{{ comment.content }}</p>
                    </div>
                    <div v-else class="edit-comment-form">
                      <textarea 
                        v-model="editCommentContent" 
                        class="edit-comment-input"
                        rows="3"
                        ref="editInput"
                      ></textarea>
                      <div class="edit-comment-actions">
                        <button class="btn-save-edit" @click="saveCommentEdit(comment.id)">
                          Lưu
                        </button>
                        <button class="btn-cancel-edit" @click="cancelCommentEdit">
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="no-comments">
                  <span class="icon">📝</span>
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên thảo luận về bài giảng này!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lecture-progress-sidebar" v-if="isEnrolled || isOwner">
        <div class="progress-sidebar-header">
            <h3>Tiến độ học tập</h3>
            <div class="progress-overview">
              <div class="progress-stats">
                <div class="progress-stat-item">
                  <span class="progress-stat-label">Tổng số bài giảng:</span>
                  <span class="progress-stat-value">{{ totalLectures }}</span>
                </div>
                <div class="progress-stat-item">
                  <span class="progress-stat-label">Đã hoàn thành:</span>
                  <span class="progress-stat-value">{{ completedLectures }}</span>
                </div>
                <div class="progress-stat-item">
                  <span class="progress-stat-label">Tiến độ:</span>
                  <span class="progress-stat-value">{{ Math.round(completionRate) }}%</span>
                </div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: `${completionRate}%` }"></div>
              </div>
            </div>
          </div>
          <div class="lecture-progress-list">
            <div
              v-for="(lecture, index) in lectures"
              :key="lecture.id"
              class="lecture-progress-item"
              :class="{ 
                completed: lecture.isCompleted, 
                current: lecture.isCurrent 
              }"
              @click="viewLecture(lecture.id)"
            >
              <h4>
                <span class="lecture-number">Bài {{ index + 1 }}</span>
                {{ lecture.title }}
              </h4>
              <p>{{ lecture.contentSummary }}</p>
              <div class="progress-status" :class="{ 
                completed: lecture.isCompleted, 
                current: lecture.isCurrent 
              }">
                <i :class="lecture.isCompleted ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                {{ lecture.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành' }}
              </div>
            </div>
          </div>
      </div>
      <div class="lecture-progress-sidebar" v-else>
          <div class="enrollment-sidebar">
            <div class="enrollment-sidebar-content">
              <i class="fas fa-lock sidebar-icon"></i>
              <h3>Đăng ký khóa học</h3>
              <p>Đăng ký ngay để:</p>
              <ul>
                <li>Theo dõi tiến độ học tập</li>
                <li>Xem các bài giảng đã hoàn thành</li>
                <li>Tiếp tục học từ bài cuối cùng</li>
              </ul>
              <button class="btn-enroll-sidebar" @click="handlePurchase">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
    </div>
    
    <DeleteConfirmPopup
      v-model:isVisible="showDeleteConfirm"
      title="Xác nhận xóa bình luận"
      message="Bạn có chắc chắn muốn xóa bình luận này không?"
      @confirmDelete="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />

    <UpdateConfirmPopup
      v-model:isVisible="showUpdateConfirm"
      :url="`/api/Comments/${commentToUpdate?.id}`"
      title="Xác nhận cập nhật"
      message="Bạn có chắc chắn muốn cập nhật bình luận này không?"
      @confirmUpdate="handleUpdateConfirm"
      @cancel="handleUpdateCancel"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getLectureById } from "@/scripts/api/services/lectureService";
import { getUserById } from "@/scripts/api/services/userService";
import { 
  getPagedLectureComments, 
  createLectureComment, 
  updateLectureComment, 
  deleteLectureComment 
} from "@/scripts/api/services/commentService";
import { getUserProfile } from "@/scripts/api/services/authService";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';
import UpdateConfirmPopup from '@/components/Common/Popup/UpdateConfirmPopup.vue';
import { getLectures } from "@/scripts/api/services/lectureService";
import { getEnrollments } from "@/scripts/api/services/enrollmentService";
import { getCourseById } from "@/scripts/api/services/courseService";

export default {
  name: "LectureDetail",
  components: {
    LoadingSpinner,
    DeleteConfirmPopup,
    UpdateConfirmPopup
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const lectureId = route.params.id;
    const courseId = route.query.courseId;
    
    const lecture = ref(null);
    const authorName = ref('');
    const isLoading = ref(true);
    const comments = ref([]);
    const commentsLoading = ref(false);
    const currentPage = ref(1);
    const totalComments = ref(0);
    const pageSize = ref(10);
    
    const newComment = ref('');
    const editingCommentIndex = ref(-1);
    const editCommentContent = ref('');
    const currentUser = ref(null);
    const editInput = ref(null);

    const lectures = ref([]);
    const totalLectures = ref(0);
    const completedLectures = ref(0);
    const completionRate = ref(0);
    const currentLectureId = ref(lectureId);
    const isEnrolled = ref(false);
    const isOwner = ref(false);

    const hasMaterials = computed(() => 
      lecture.value?.materials && Array.isArray(lecture.value.materials) && lecture.value.materials.length > 0
    );

    const isCurrentUserComment = (comment) => {
      if (!currentUser.value) return false;
      return comment.creatorId === currentUser.value.id;
    };

    const fetchComments = async () => {
      if (!lectureId) return;
      
      try {
        commentsLoading.value = true;
        const response = await getPagedLectureComments(lectureId, currentPage.value, pageSize.value);
        
        if (response.items && Array.isArray(response.items)) {
          const rawComments = response.items;
          totalComments.value = response.totalCount;

          const userPromises = rawComments.map(async (comment) => {
            if (comment.creatorId) {
              try {
                const userData = await getUserById(comment.creatorId);
                comment.creatorName = userData?.fullName || userData?.name || 'Người dùng ẩn danh';
                comment.creatorAvatarUrl = userData?.avatarUrl || '/default-avatar.png'; 
              } catch (userError) {
                console.error(`Lỗi khi lấy thông tin user ${comment.creatorId}:`, userError);
                comment.creatorName = 'Người dùng ẩn danh';
                comment.creatorAvatarUrl = '/default-avatar.png';
              }
            } else {
              comment.creatorName = 'Người dùng ẩn danh';
              comment.creatorAvatarUrl = '/default-avatar.png';
            }
            return comment; 
          });

          let fetchedComments = await Promise.all(userPromises);
          
          // Sắp xếp comments theo ngày mới nhất
          fetchedComments.sort((a, b) => {
            // Chuyển đổi sang đối tượng Date để so sánh chính xác
            const dateA = new Date(a.creationTime);
            const dateB = new Date(b.creationTime);
            return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
          });

          comments.value = fetchedComments;
          
        } else {
          comments.value = [];
          totalComments.value = 0;
        }
      } catch (error) {
        console.error("Lỗi khi tải bình luận:", error);
        comments.value = [];
        totalComments.value = 0;
      } finally {
        commentsLoading.value = false;
      }
    };

    const postComment = async () => {
      if (!newComment.value.trim() || !lectureId) return;
      
      try {
        const response = await createLectureComment(lectureId, newComment.value);

        await fetchComments();

        newComment.value = '';
        
      } catch (error) {
        console.error('Lỗi khi đăng bình luận:', error);
        alert('Không thể đăng bình luận. Vui lòng thử lại sau.');
      }
    };

    const startEditComment = async (comment, index) => {
      editingCommentIndex.value = index;
      editCommentContent.value = comment.content;
      // Chờ DOM cập nhật rồi focus vào input
      await nextTick(); 
      if (editInput.value && editInput.value[0]) { 
          editInput.value[0].focus();
      }
    };

    const showUpdateConfirm = ref(false);
    const commentToUpdate = ref(null);

    const saveCommentEdit = async (commentId) => {
      if (!editCommentContent.value.trim()) return;
      
      commentToUpdate.value = {
        id: commentId,
        content: editCommentContent.value
      };
      showUpdateConfirm.value = true;
    };

    const handleUpdateConfirm = async (confirm) => {
      if (!confirm) {
        showUpdateConfirm.value = false;
        return;
      }
      
      if (!commentToUpdate.value) return;
      
      try {
        await updateLectureComment(commentToUpdate.value.id, commentToUpdate.value.content);
        await fetchComments();
        cancelCommentEdit();
        
      } catch (error) {
        console.error('Lỗi khi cập nhật bình luận:', error);
        alert('Không thể cập nhật bình luận. Vui lòng thử lại sau.');
      } finally {
        showUpdateConfirm.value = false;
        commentToUpdate.value = null;
      }
    };

    const handleUpdateCancel = () => {
      showUpdateConfirm.value = false;
      commentToUpdate.value = null;
    };

    const cancelCommentEdit = () => {
      editingCommentIndex.value = -1;
      editCommentContent.value = '';
    };

    const showDeleteConfirm = ref(false);
    const commentToDelete = ref(null);

    const confirmDeleteComment = (commentId) => {
      commentToDelete.value = commentId;
      showDeleteConfirm.value = true;
    };

    const handleDeleteConfirm = async (confirm) => {
      if (!confirm) {
        showDeleteConfirm.value = false;
        return;
      }
      
      if (!commentToDelete.value) return;
      
      try {
        await deleteLectureComment(commentToDelete.value);
        await fetchComments();
      } catch (error) {
        console.error('Lỗi khi xóa bình luận:', error);
        if (error.response) {
          console.error('Dữ liệu phản hồi từ server:', error.response.data);
          console.error('Mã trạng thái phản hồi từ server:', error.response.status);
          console.error('Tiêu đề phản hồi từ server:', error.response.headers);
        } else if (error.request) {
          console.error('Không nhận được phản hồi:', error.request);
        } else {
          console.error('Lỗi khi thiết lập yêu cầu:', error.message);
        }
      } finally {
        showDeleteConfirm.value = false;
        commentToDelete.value = null;
      }
    };

    const handleDeleteCancel = () => {
      showDeleteConfirm.value = false;
      commentToDelete.value = null;
    };

    const fetchLecture = async () => {
      if (!lectureId) {
        console.error("Không có ID bài giảng trong LectureDetail");
        isLoading.value = false;
        return;
      }

      try {
        isLoading.value = true;
        const response = await getLectureById(lectureId);

        
        if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          lecture.value = response.items[0];
        } else if (Array.isArray(response) && response.length > 0) {
          lecture.value = response[0];
        } else if (response && typeof response === 'object') {
          lecture.value = response;
        } else {
          console.error("Không tìm thấy bài giảng với ID:", lectureId);
          lecture.value = null;
        }
        
        
        if (lecture.value?.creatorId) {
          try {
            const userData = await getUserById(lecture.value.creatorId);
            authorName.value = userData?.fullName || userData?.name || "Không rõ";
          } catch (error) {
            console.error("Lỗi khi lấy thông tin tác giả:", error);
            authorName.value = "Không rõ";
          }
        }
      } catch (error) {
        console.error(`Lỗi khi lấy thông tin bài giảng ${lectureId}:`, error);
        lecture.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };

    const isImage = (url) => {
      if (!url) return false;
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    };

    const isVideo = (url) => {
      if (!url) return false;
      return /\.(mp4|webm|ogg|avi|mov|wmv)$/i.test(url);
    };

    const isAudio = (url) => {
      if (!url) return false;
      return /\.(mp3|wav|ogg|m4a)$/i.test(url);
    };

    const handleImageError = (e) => {
      e.target.src = '/placeholder-image.jpg';
      e.target.alt = 'Không thể tải ảnh';
    };

    const downloadFile = (url, filename) => {
      if (!url) return;
      
      try {
      const link = document.createElement("a");
      link.href = url;
        link.download = filename || 'download';
        document.body.appendChild(link);
      link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Lỗi khi tải file:', error);
        window.open(url, '_blank');
      }
    };

    const goBack = () => {
      if (courseId) {
        router.push({ name: 'courseDetail', params: { id: courseId } });
      } else {
        router.go(-1);
      }
    };

    const getCurrentUserInfo = () => {
      try {
        currentUser.value = getUserProfile();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng từ localStorage:", error);
        currentUser.value = null;
      }
    };

    const formatCommentDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      // Định dạng ngày/tháng/năm
      return date.toLocaleDateString("vi-VN", { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    };

    const fetchLectures = async () => {
      if (!courseId) return;
      try {
        const response = await getLectures(courseId);
        const lectureList = response?.items || [];
        lectures.value = lectureList
          .map((lecture, index) => {
            return {
              ...lecture,
              isCompleted: false, // TODO: Implement completion status
              isCurrent: lecture.id === lectureId,
              order: index + 1
            };
          })
          .sort((a, b) => (a.index || 0) - (b.index || 0));
          
        totalLectures.value = lectures.value.length;
        completedLectures.value = lectures.value.filter(l => l.isCompleted).length;
        completionRate.value = (completedLectures.value / totalLectures.value) * 100;
      } catch (error) {
        console.error('Error fetching lectures:', error);
        lectures.value = [];
      }
    };

    const viewLecture = (id) => {
      if (!id) return;
      router.push({
        name: 'lectureDetail',
        params: { id },
        query: { courseId }
      });
    };

    const checkEnrollmentStatus = async () => {
      if (!courseId) return;
      try {
        const response = await getEnrollments({ pageSize: 100 });
        if (response && response.items) {
          isEnrolled.value = response.items.some(
            (enrollment) => enrollment.courseId === courseId
          );
        } else {
          isEnrolled.value = false;
        }
      } catch (error) {
        console.error('Error checking enrollment status:', error);
        isEnrolled.value = false;
      }
    };

    const checkOwnerStatus = async () => {
      if (!courseId || !currentUser.value) return;
      try {
        const courseData = await getCourseById(courseId);
        if (courseData) {
          isOwner.value = courseData.creatorId === currentUser.value.id;
        } else {
          isOwner.value = false;
        }
      } catch (error) {
        console.error('Error checking owner status:', error);
        isOwner.value = false;
      }
    };

    const tabs = [
      { id: 'info', name: ' Thông tin bài giảng' },
      { id: 'materials', name: ' Nội dung bài giảng' },
      { id: 'comments', name: ' Bình luận' }
    ];

    const activeTab = ref('info');

    onMounted(async () => {
      getCurrentUserInfo();
      await Promise.all([
        fetchLecture(),
        fetchLectures(),
        fetchComments(),
        checkEnrollmentStatus(),
        checkOwnerStatus()
      ]);
    });

    return {
      lecture,
      authorName,
      isLoading,
      hasMaterials,
      formatDate,
      isImage,
      isVideo,
      isAudio,
      handleImageError,
      downloadFile,
      goBack,
      comments,
      commentsLoading,
      currentPage,
      totalComments,
      newComment,
      editingCommentIndex,
      editCommentContent,
      isCurrentUserComment,
      postComment,
      startEditComment,
      saveCommentEdit,
      cancelCommentEdit,
      confirmDeleteComment,
      pageSize,
      formatCommentDate,
      editInput,
      showDeleteConfirm,
      handleDeleteConfirm,
      handleDeleteCancel,
      showUpdateConfirm,
      handleUpdateConfirm,
      handleUpdateCancel,
      commentToUpdate,
      lectures,
      totalLectures,
      completedLectures,
      completionRate,
      currentLectureId,
      viewLecture,
      isEnrolled,
      isOwner,
      activeTab,
      tabs
    };
  }
};
</script>

<style scoped>
.lecture-detail-container {
  margin: 0;
  background: #f8f9fa;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  width: 94vw;
  display: flex;
  min-height: 100vh;
  margin: 0;
  overflow-x: hidden;
}

.lecture-main-content {
  width: 80%;
  padding: 40px;
  overflow-y: auto;
  height: 100vh;
  background: #f8f9fa;
}

.lecture-header {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.lecture-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.lecture-meta {
  font-size: 14px;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.lecture-content {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.lecture-content p {
  margin: 0;
  white-space: pre-wrap;
}

.lecture-materials {
  margin-top: 0;
  width: 100%;
}

.lecture-materials h2 {
  font-size: 22px;
  color: #0056b3;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.material-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  width: 100%;
  margin-top: 20px;
}

.material-card {
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
  transition: all 0.3s ease;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(0,0,0,0.05);
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.material-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.material-video {
  width: 100%;
  max-height: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.material-audio {
  width: 100%;
  margin: 20px 0;
  height: 80px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.document-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px;
  height: 100%;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.material-link {
  display: inline-block;
  padding: 20px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,123,255,0.2);
}

.material-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,123,255,0.3);
  background: linear-gradient(135deg, #0056b3, #004494);
}

.btn-download {
  padding: 20px;
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 12px rgba(40,167,69,0.2);
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(40,167,69,0.3);
  background: linear-gradient(135deg, #1e7e34, #155d27);
}

.btn-back {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 12px 25px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-back:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.error-message {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #666;
}

.lecture-comments {
  margin-top: 40px;
  width: 100%;
}

.lecture-comments h2 {
  font-size: 22px;
  color: #0056b3;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.comment-date {
  color: #888;
}

.comment-content {
  color: #333;
  line-height: 1.5;
}

.no-comments {
  margin-top: 30px;
  color: #888;
  font-style: italic;
  text-align: center;
}

.comments-section {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
}

.comments-section h2 {
  font-size: 24px;
  color: #343a40;
  margin-bottom: 25px;
  font-weight: 600;
}

.comment-form-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-avatar {
  flex-shrink: 0;
}

.form-content {
  flex-grow: 1;
}

.comment-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  margin-bottom: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.comment-input:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-post-comment {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-post-comment .icon {
  font-size: 16px;
}

.enrollment-sidebar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
}

.enrollment-sidebar-content {
  text-align: center;
  max-width: 100%;
}

.enrollment-sidebar h3 {
  color: #343a40;
  font-size: 20px;
  margin-bottom: 12px;
}

.enrollment-sidebar p {
  color: #495057;
  margin-bottom: 12px;
}

.enrollment-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  text-align: left;
}

.enrollment-sidebar li {
  color: #495057;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  font-size: 14px;
}

.enrollment-sidebar li:before {
  content: "✓";
  color: #28a745;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.btn-enroll-sidebar {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2);
  width: 100%;
  max-width: 200px;
}

.btn-enroll-sidebar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3);
} 

.btn-post-comment:hover {
  background: #0056b3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.btn-post-comment:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.comments-container {
  margin-top: 30px;
}

.comments-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 30px;
  font-size: 1.1em;
  color: #6c757d;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  background: #fff;
  padding: 18px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.07);
  border: 1px solid #e9ecef;
  position: relative;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  font-weight: 600;
  color: #343a40;
  font-size: 15px;
}

.comment-date {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}

.comment-controls {
  display: flex;
  gap: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment-item:hover .comment-controls {
  opacity: 1;
}

.btn-icon {
  background: #f1f3f5;
  border: none;
  color: #495057;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 14px;
}

.btn-edit-comment:hover {
  background-color: #dbe4ff;
  color: #0056b3;
}

.btn-delete-comment:hover {
  background-color: #ffe3e3;
  color: #dc3545;
}

.comment-body {
  margin-left: 52px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  word-wrap: break-word;
}

.edit-comment-form {
  margin-left: 52px;
  margin-top: 10px;
}

.edit-comment-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.edit-comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn-save-edit,
.btn-cancel-edit {
  background: none;
  border: 1px solid #ced4da;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.btn-save-edit {
  color: #007bff;
  border-color: #007bff;
}
.btn-save-edit:hover {
  background-color: #007bff;
  color: white;
}

.btn-cancel-edit {
  color: #6c757d;
}
.btn-cancel-edit:hover {
  background-color: #f1f3f5;
}

.no-comments {
  text-align: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.no-comments .icon {
  font-size: 30px;
  color: #adb5bd;
}
.no-comments p {
  margin: 0;
  font-size: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* Tab Navigation Styles */
.nav-tabs {
  border-bottom: none;
  margin-bottom: 30px;
  background: white;
  padding: 0 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
  gap: 10px;
}

.nav-tabs .nav-item {
  margin-bottom: 0;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 600;
  padding: 15px 30px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 10px 0;
  position: relative;
  font-size: 16px;
}

.nav-tabs .nav-link:hover {
  color: #0056b3;
  background: rgba(0, 123, 255, 0.05);
  transform: translateY(-2px);
}

.nav-tabs .nav-link.active {
  color: #0056b3;
  background: rgba(0, 123, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.nav-tabs .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #0056b3;
  border-radius: 3px;
}

/* Tab Content Styles */
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  min-height: 600px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}


/* Lecture Info Styles */
.lecture-info {
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.lecture-title {
  font-size: 36px;
  color: #1a1a1a;
  margin-bottom: 30px;
  font-weight: 700;
  line-height: 1.3;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  text-align: center;
}

.lecture-meta {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.meta-label {
  font-weight: 600;
  color: #495057;
  min-width: 140px;
  font-size: 15px;
}

.meta-value {
  color: #1a1a1a;
  font-size: 15px;
}

.content-title {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 25px;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
}

.content-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #0056b3;
  border-radius: 3px;
}

.content-body {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

/* Sidebar styles */
.lecture-progress-sidebar {
  width: 20%;
  background: white;
  padding: 40px;
  border-left: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.progress-sidebar-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.progress-sidebar-header h3 {
  font-size: 20px;
  color: #0056b3;
  margin: 0 0 15px 0;
}

.progress-overview {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.progress-stats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.progress-stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #0056b3;
  margin-bottom: 5px;
}

.progress-bar-container {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0056b3, #007bff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.lecture-progress-list {
  margin-top: 20px;
}

.lecture-progress-item {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.lecture-progress-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.lecture-progress-item.completed {
  border-left: 4px solid #28a745;
}

.lecture-progress-item.current {
  border-left: 4px solid #0056b3;
}

.lecture-progress-item h4 {
  font-size: 14px;
  margin: 0 0 5px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lecture-progress-item p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.progress-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  margin-top: 5px;
}

.progress-status.completed {
  color: #28a745;
}

.progress-status.current {
  color: #0056b3;
}

.lecture-number {
  font-size: 12px;
  color: #666;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Responsive styles */
@media (max-width: 992px) {
  .lecture-detail-container {
    flex-direction: column;
  }
  
  .lecture-main-content {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  
  .lecture-progress-sidebar {
    width: 100%;
    position: relative;
    height: auto;
    border-left: none;
    border-top: 1px solid #e9ecef;
    padding: 20px;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}

</style>
