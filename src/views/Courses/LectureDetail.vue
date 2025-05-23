<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />
    <button class="btn-back" @click="goBack">⬅️ Quay lại khóa học</button>
    <div v-show="!isLoading" class="lecture-detail-container">
      <div v-if="lecture">
    <div class="lecture-header">
      <h1>{{ lecture.title }}</h1>
      <p class="lecture-meta">
            🧑‍🏫 {{ authorName || 'Không rõ tác giả' }} • 
            🕒 Ngày tạo: {{ formatDate(lecture.creationTime) }} • 
            <span v-if="lecture.lastModificationTime">
              🖋️ Cập nhật: {{ formatDate(lecture.lastModificationTime) }}
            </span>
      </p>
    </div>

    <div class="lecture-content">
          <p>Nội dung bài giảng: {{ lecture.content || lecture.contentSummary }}</p>
    </div>

        <div v-if="hasMaterials" class="lecture-materials">
          <h2>📎 Tài liệu đính kèm</h2>
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

        <div class="comments-section">
          <h2>💬 Bình luận</h2>
          
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
              
              <!-- Phân trang nếu cần -->
              <div v-if="totalComments > pageSize" class="pagination">
                <!-- Thêm các nút phân trang -->
              </div>
            </div>
            
            <div v-else class="no-comments">
              <span class="icon">📝</span>
              <p>Chưa có bình luận nào. Hãy là người đầu tiên thảo luận về bài giảng này!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="!isLoading" class="error-message">
        <p>⚠️ Không thể tải thông tin bài giảng.</p>
        <button class="btn-back" @click="goBack">⬅️ Quay lại khóa học</button>
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

    onMounted(async () => {
      getCurrentUserInfo();
      await fetchLecture();
      await fetchComments();
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
      commentToUpdate
    };
  }
};
</script>

<style scoped>
.lecture-detail-container {
  width: 72vw;
  margin: 40px auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: 70vh;
}

.lecture-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
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
  margin-bottom: 40px;
  color: #444;
  max-width: 900px;
}

.lecture-materials {
  margin-top: 40px;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  width: 100%;
}

.material-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.material-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.material-image {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.material-video,
.material-audio {
  width: 100%;
  border-radius: 8px;
}

.material-audio {
  margin: 20px 0;
}

.document-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.material-link {
  display: inline-block;
  padding: 12px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  width: 100%;
  transition: background 0.3s ease;
}

.material-link:hover {
  background: #0056b3;
}

.btn-download {
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s ease;
  width: 100%;
}

.btn-download:hover {
  background: #218838;
}

.btn-back {
  display: block;
  margin-top: 40px;
  padding: 12px 25px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #5a6268;
  transform: translateY(-2px);
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
  margin-top: 50px;
  border-top: 2px solid #e9ecef;
  padding-top: 30px;
}

.comments-section h2 {
  font-size: 24px;
  color: #343a40;
  margin-bottom: 25px;
  font-weight: 600;
}

.comment-form-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 35px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
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

.btn-post-comment:hover {
  background: #0056b3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.btn-post-comment:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.comments-container {
  margin-top: 20px;
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

@media (max-width: 768px) {
  .lecture-detail-container {
    padding: 20px;
  }
  
  .material-grid {
    grid-template-columns: 1fr;
  }

  .lecture-header h1 {
    font-size: 24px;
  }

  .comment-controls {
    position: static;
    margin-top: 8px;
    justify-content: flex-end;
    width: 100%;
  }
  
  .comment-header {
    align-items: center;
  }
  
  .comment-body, 
  .edit-comment-form {
    margin-left: 0;
    margin-top: 15px;
  }
}
</style>
