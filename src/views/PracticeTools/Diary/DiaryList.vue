<template>
  <div class="diary-app">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-md-4 col-lg-3 sidebar">
          <div class="sidebar-header">
            <h2 class="d-flex align-items-center justify-content-center gap-2 mb-0">
              <BookOpen :size="28" class="text-primary" />
              Nhật Ký
            </h2>
          </div>

          <div class="calendar-section">
            <h5 class="section-title d-flex align-items-center justify-content-center gap-2">
              <Calendar :size="20" />
              Lịch
            </h5>
            <div class="calendar-wrapper">
              <v-calendar v-model="selectedDate" @dayclick="goToNearestEntry" :attributes="calendarAttributes"
                class="custom-calendar" is-expanded />
            </div>
          </div>

          <div class="quick-actions">
            <router-link to="/diary/diary-writing" class="text-decoration-none">
              <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                <PenTool :size="18" />
                Viết nhật ký mới
              </button>
            </router-link>
          </div>

          <div class="entries-list">
            <h5 class="section-title d-flex align-items-center justify-content-center gap-2">
              <FileText :size="20" />
              Danh sách nhật ký ({{ orderedEntries.length }})
            </h5>
            <div class="entries-container">
              <div v-for="(entry, index) in orderedEntries" :key="entry.id" class="entry-item"
                :class="{ active: currentPageIndex === index }" @click="currentPageIndex = index">
                <div class="entry-preview">
                  <h6 class="entry-preview-title">
                    {{ entry.title || "Không có tiêu đề" }}
                  </h6>
                  <p class="entry-preview-date">
                    {{ formatDateShort(entry.creationTime) }}
                  </p>
                  <p class="entry-preview-content">
                    {{ getPreviewContent(entry.content) }}
                  </p>
                </div>
              </div>
              <div v-if="orderedEntries.length === 0" class="no-entries">
                <FileX :size="48" class="text-muted mb-2" />
                <p class="text-muted">Chưa có nhật ký nào</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8 col-lg-9 main-content">
          <div v-if="currentEntry" class="entry-editor">
            <div class="entry-header">
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <input type="text" v-model="currentEntry.title" @input="updateDiary"
                    class="form-control form-control-lg border-0 entry-title-input" placeholder="Tiêu đề nhật ký..." />
                </div>
                <button class="btn btn-outline-danger btn-sm"
                  @click="showDeleteConfirmation(currentEntry.id, currentEntry.title)">
                  <Trash2 :size="16" />
                </button>
              </div>

              <div class="entry-meta">
                <span class="badge bg-light text-dark d-flex align-items-center gap-1">
                  <Calendar :size="14" />
                  {{ formatDate(currentEntry.creationTime) }}
                </span>
                <span class="badge bg-light text-dark d-flex align-items-center gap-1">
                  <Clock :size="14" />
                  {{ getWordCount(currentEntry.content) }} từ
                </span>
              </div>
            </div>

            <div class="entry-content-section">
              <textarea v-model="currentEntry.content" @input="updateDiary" class="form-control entry-content-textarea"
                placeholder="Viết về ngày hôm nay của bạn..." rows="20"></textarea>
            </div>

            <div class="entry-footer">
              <div class="d-flex justify-content-between align-items-center">
                <div class="navigation-buttons">
                  <button class="btn btn-outline-secondary btn-sm me-2" @click="previousEntry"
                    :disabled="currentPageIndex === 0">
                    <ChevronLeft :size="16" />
                    Trước
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" @click="nextEntry"
                    :disabled="currentPageIndex === orderedEntries.length - 1">
                    Sau
                    <ChevronRight :size="16" />
                  </button>
                </div>

                <div class="entry-info">
                  <span class="text-muted small">
                    {{ currentPageIndex + 1 }} / {{ orderedEntries.length }}
                  </span>
                </div>

                <div class="save-status">
                  <span class="badge bg-success d-flex align-items-center gap-1">
                    <Check :size="12" />
                    Đã lưu tự động
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="text-center">
              <BookOpen :size="80" class="text-muted mb-4" />
              <h3 class="text-muted mb-3">Chào mừng đến với Nhật Ký</h3>
              <p class="text-muted mb-4">
                Bắt đầu viết nhật ký đầu tiên của bạn hoặc chọn một nhật ký từ
                danh sách bên trái.
              </p>
              <router-link to="/diary/diary-writing" class="text-decoration-none">
                <button class="btn btn-primary btn-lg d-flex align-items-center gap-2 mx-auto">
                  <PenTool :size="20" />
                  Viết nhật ký đầu tiên
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DeleteConfirmPopup :message="deleteMessage" :isVisible="showDeleteDialog" @confirmDelete="handleConfirmDelete"
      @update:isVisible="showDeleteDialog = $event" />
  </div>
</template>

<script>
import {
  getPagedDiaryNotes,
  deleteDiaryNote,
  updateDiaryNote,
} from "@/scripts/api/services/diaryNoteService";
import { getUserProfile } from "@/scripts/api/services/authService";
import { toast } from "vue3-toastify";
import { Calendar } from "v-calendar";
import {
  BookOpen,
  PenTool,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileX,
  Clock,
  Check,
} from "lucide-vue-next";
import DeleteConfirmPopup from "../../../components/Common/Popup/DeleteConfirmPopup.vue";
import "v-calendar/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "DiaryList",
  components: {
    VCalendar: Calendar,
    BookOpen,
    PenTool,
    Trash2,
    Calendar: CalendarIcon,
    ChevronLeft,
    ChevronRight,
    FileText,
    FileX,
    Clock,
    Check,
    DeleteConfirmPopup,
  },
  data() {
    return {
      entries: [],
      currentPageIndex: 0,
      selectedDate: new Date(),
      showDeleteDialog: false,
      deleteMessage: "",
      entryToDelete: null,
    };
  },
  computed: {
    orderedEntries() {
      return this.entries.sort(
        (a, b) => new Date(b.creationTime) - new Date(a.creationTime)
      );
    },
    currentEntry() {
      return this.orderedEntries[this.currentPageIndex] || null;
    },
    calendarAttributes() {
      return this.entries.map((entry) => ({
        key: entry.id,
        highlight: {
          color: "blue",
          fillMode: "solid",
        },
        dates: new Date(entry.creationTime),
      }));
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    },
    formatDateShort(date) {
      return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    getPreviewContent(content) {
      if (!content) return "Không có nội dung...";
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    },
    getWordCount(content) {
      if (!content) return 0;
      return content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    },
    async fetchDiaryNotes() {
      try {
        var user = await getUserProfile();
        const data = await getPagedDiaryNotes({ CreatorId: user.id });
        this.entries = (data.items || []).filter((entry) => !!entry.title);
      } catch (error) {
        if (error.response?.status === 404) {
          this.entries = [];
        } else {
          toast.error("Không thể tải danh sách nhật ký.");
        }
      }
    },
    nextEntry() {
      if (this.currentPageIndex < this.orderedEntries.length - 1) {
        this.currentPageIndex++;
      }
    },
    previousEntry() {
      if (this.currentPageIndex > 0) {
        this.currentPageIndex--;
      }
    },
    goToNearestEntry(day) {
      const selectedDate = new Date(day.id).toISOString().split("T")[0];
      const index = this.orderedEntries.findIndex((entry) =>
        entry.creationTime.startsWith(selectedDate)
      );
      if (index !== -1) {
        this.currentPageIndex = index;
      } else {
      }
    },
    async updateDiary() {
      if (!this.currentEntry) return;
      const formData = new FormData();
      formData.append("Id", this.currentEntry.id);
      formData.append("Title", this.currentEntry.title);
      formData.append("Content", this.currentEntry.content);

      try {
        await updateDiaryNote(formData);
      } catch (error) {
        toast.error("Lỗi khi cập nhật nhật ký.");
      }
    },
    showDeleteConfirmation(entryId, entryTitle) {
      this.entryToDelete = entryId;
      this.deleteMessage = `Bạn có chắc chắn muốn xóa nhật ký "${entryTitle || 'Không có tiêu đề'}"? Hành động này không thể hoàn tác.`;
      this.showDeleteDialog = true;
    },
    async handleConfirmDelete(confirmed) {
      if (!confirmed || !this.entryToDelete) {
        this.entryToDelete = null;
        return;
      }

      try {
        await deleteDiaryNote(this.entryToDelete);
        this.entries = this.entries.filter((entry) => entry.id !== this.entryToDelete);
        if (
          this.currentPageIndex >= this.orderedEntries.length &&
          this.currentPageIndex > 0
        ) {
          this.currentPageIndex--;
        }
        toast.success("Nhật ký đã được xóa thành công.");
      } catch (error) {
        toast.error("Không thể xóa nhật ký.");
      } finally {
        this.entryToDelete = null;
      }
    },
  },
  mounted() {
    this.fetchDiaryNotes();
  },
};
</script>

<style scoped>
.diary-app {
  width: 1380px;
  background-color: #f8f9fa;
}

.sidebar {
  background-color: white;
  border-right: 1px solid #e9ecef;
  padding: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  text-align: center;
}

.sidebar-header h2 {
  color: #495057;
  font-weight: 600;
}

.calendar-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.calendar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-title {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.custom-calendar {
  width: 100%;
  max-width: 280px;
}

.quick-actions {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.entries-list {
  padding: 1.5rem;
  flex: 1;
}

.entries-list .section-title {
  text-align: center;
}

.entries-container {
  max-height: 400px;
  overflow-y: auto;
}

.entry-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.entry-item:hover {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.entry-item.active {
  background-color: #e3f2fd;
  border-color: #007bff;
}

.entry-preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #495057;
}

.entry-preview-date {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.entry-preview-content {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0;
  line-height: 1.4;
}

.no-entries {
  text-align: center;
  padding: 2rem;
}

.main-content {
  padding: 0;
  overflow-y: auto;
}

.entry-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.entry-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
}

.entry-title-input {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
}

.entry-title-input:focus {
  box-shadow: none;
  border-color: transparent;
}

.entry-meta {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.entry-content-section {
  flex: 1;
  padding: 1.5rem;
  background-color: white;
}

.entry-content-textarea {
  border: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
}

.entry-content-textarea:focus {
  box-shadow: none;
  border-color: transparent;
}

.entry-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.empty-state {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 300px;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .sidebar.show {
    left: 0;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>