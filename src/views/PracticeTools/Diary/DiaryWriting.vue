<template>
  <form class="memory-entry-container" @submit.prevent="showSaveConfirmation">
    <header class="header-section">
      <button type="button" class="back-button" @click="handleBack">
        <ArrowLeft :size="24" />
        <span>Quay lại</span>
      </button>
    </header>

    <div class="input-group">
      <input type="text" class="memory-title-input" :class="{ 'is-invalid': titleError }" v-model="memoryTitle"
        aria-label="Tiêu đề nhật ký" placeholder="Nhật ký của tôi #1" maxlength="100" />
      <div v-if="titleError" class="error-message">{{ titleError }}</div>
      <div class="char-count">{{ memoryTitle.length }}/100</div>
    </div>

    <div class="input-group">
      <input type="date" class="memory-date-input" v-model="memoryDate" aria-label="Ngày viết" />
    </div>

    <div class="content-section">
      <div class="content-header">
        <button type="button" class="upload-button" @click="triggerFileInput">
          <Upload :size="24" />
        </button>
        <input type="file" ref="fileInput" class="visually-hidden" @change="handleFileChange" multiple
          accept="image/*" />
      </div>

      <div class="textarea-wrapper">
        <textarea class="memory-content" :class="{ 'is-invalid': contentError }" placeholder="Viết bất cứ điều gì..."
          v-model="memoryContent" aria-label="Nội dung nhật ký" maxlength="1000"></textarea>
        <div v-if="contentError" class="error-message">{{ contentError }}</div>
        <div class="char-count">{{ memoryContent.length }}/1000</div>
      </div>

      <div v-if="mediaFiles.length > 0" class="preview-section">
        <div v-for="(file, index) in mediaFiles" :key="index" class="preview-item">
          <img :src="file.preview" alt="Xem trước" class="preview-image" />
          <button type="button" @click="removeFile(file.id)" class="remove-button">
            <X :size="16" />
          </button>
        </div>
      </div>
    </div>

    <button type="submit" class="save-button" :disabled="!isFormValid">
      <Save :size="20" />
      {{ isEdit ? 'Cập nhật' : 'Lưu lại' }}
    </button>

    <SaveConfirmPopUp :message="confirmMessage" :isVisible="showConfirmDialog" @confirmSave="handleConfirmSave"
      @update:isVisible="showConfirmDialog = $event" />
  </form>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  createDiaryNote,
  getPagedDiaryNotes,
  updateDiaryNote,
} from "@/scripts/api/services/diaryNoteService";
import { ConvertTo_yyyy_mm_dd } from "../../../scripts/logic/common";
import { useRoute, useRouter } from "vue-router";
import { getUserProfile } from '@/scripts/api/services/authService';
import { toast } from "vue3-toastify";
import { ArrowLeft, Upload, X, Save } from "lucide-vue-next";
import SaveConfirmPopUp from "../../../components/Common/Popup/SaveConfirmPopUp.vue";

export default {
  name: "DiaryWriting",
  components: {
    ArrowLeft,
    Upload,
    X,
    Save,
    SaveConfirmPopUp
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const memoryTitle = ref("");
    const memoryDate = ref("");
    const memoryContent = ref("");
    const mediaFiles = ref([]);
    const removedFileIds = ref([]);
    const diaryNoteId = ref(null);
    const isEdit = ref(false);
    const showConfirmDialog = ref(false);

    const titleError = computed(() => {
      if (!memoryTitle.value.trim()) {
        return "Tiêu đề không được để trống";
      }
      if (memoryTitle.value.length > 100) {
        return "Tiêu đề không được vượt quá 100 ký tự";
      }
      return "";
    });

    const contentError = computed(() => {
      if (!memoryContent.value.trim()) {
        return "Nội dung không được để trống";
      }
      if (memoryContent.value.length > 1000) {
        return "Nội dung không được vượt quá 1000 ký tự";
      }
      return "";
    });

    const isFormValid = computed(() => {
      return !titleError.value && !contentError.value && memoryTitle.value.trim() && memoryContent.value.trim();
    });

    const confirmMessage = computed(() => {
      return isEdit.value
        ? `Bạn có chắc chắn muốn cập nhật nhật ký này?`
        : `Bạn có chắc chắn muốn lưu nhật ký này?`;
    });

    onMounted(async () => {
      const title = route.params.title;
      if (title) {
        isEdit.value = true;
        await fetchDiaryNote(title);
      } else {
        isEdit.value = false;
        await fetchTodayDiary();
      }
    });

    async function fetchDiaryNote(title) {
      try {
        const filter = { Title: title };
        const response = await getPagedDiaryNotes(filter);

        if (response.items && response.items.length > 0) {
          const diary = response.items[0];
          diaryNoteId.value = diary.id;
          memoryTitle.value = diary.title;
          memoryDate.value = diary.creationTime
            ? diary.creationTime.split("T")[0]
            : ConvertTo_yyyy_mm_dd(new Date());
          memoryContent.value = diary.content || "";
          mediaFiles.value = (diary.medias || []).map((media) => ({
            id: media.id,
            isOld: true,
            file: null,
            preview: media.url,
            url: media.url,
          }));
        } else {
          toast.error("Không tìm thấy nhật ký.");
          router.push({ name: "diaryList" });
        }
      } catch (error) {
        toast.error("Không thể tải nhật ký. Vui lòng thử lại.");
        router.push({ name: "diaryList" });
      }
    }

    async function fetchTodayDiary() {
      const today = ConvertTo_yyyy_mm_dd(new Date());
      const now = new Date();
      now.setHours(now.getHours() - 8);
      const startAfter = now.toISOString();

      var user = await getUserProfile();
      const queryParams = { StartAfter: startAfter, CreatorId: user.id };

      try {
        const response = await getPagedDiaryNotes(queryParams);
        if (response.items && response.items.length > 0) {
          const diary = response.items[0];
          diaryNoteId.value = diary.id;
          memoryTitle.value = diary.title || "";
          memoryDate.value = diary.creationTime
            ? diary.creationTime.split("T")[0]
            : today;
          memoryContent.value = diary.content || "";
          mediaFiles.value = (diary.medias || []).map((media) => ({
            id: media.id,
            isOld: true,
            file: null,
            preview: media.url,
            url: media.url,
          }));
          isEdit.value = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          memoryDate.value = today;
          isEdit.value = false;
        }
      }
    }

    function showSaveConfirmation() {
      if (!isFormValid.value) {
        toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
        return;
      }
      showConfirmDialog.value = true;
    }

    async function handleConfirmSave(confirmed) {
      if (!confirmed) {
        return;
      }

      const formData = new FormData();
      isEdit.value && formData.append("Id", diaryNoteId.value || "");
      formData.append("Title", memoryTitle.value.trim());
      formData.append("Content", memoryContent.value.trim());

      try {
        if (isEdit.value && diaryNoteId.value) {
          await updateDiaryNote(formData);
          toast.success("Cập nhật nhật ký thành công!");
        } else {
          const response = await createDiaryNote(formData);
          diaryNoteId.value = response.id;
          toast.success("Tạo nhật ký thành công!");
        }
        router.push({ name: "diaryList" });
      } catch (error) {
        console.error("Lỗi khi lưu nhật ký:", error);
        toast.error("Không thể lưu nhật ký. Vui lòng thử lại.");
      }
    }

    function handleBack() {
      router.push({ name: "diaryList" });
    }

    function triggerFileInput() {
      document.querySelector(".visually-hidden").click();
    }

    function handleFileChange(event) {
      const files = event.target.files;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          mediaFiles.value.push({
            id: crypto.randomUUID(),
            file,
            preview: e.target.result,
            url: null,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    function removeFile(fileId) {
      removedFileIds.value.push(fileId);
      mediaFiles.value = mediaFiles.value.filter((file) => file.id !== fileId);
    }

    return {
      memoryTitle,
      memoryDate,
      memoryContent,
      mediaFiles,
      removedFileIds,
      diaryNoteId,
      isEdit,
      titleError,
      contentError,
      isFormValid,
      showConfirmDialog,
      confirmMessage,
      showSaveConfirmation,
      handleConfirmSave,
      fetchDiaryNote,
      fetchTodayDiary,
      handleBack,
      triggerFileInput,
      handleFileChange,
      removeFile,
    };
  },
};
</script>

<style scoped>
.memory-entry-container {
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 1300px;
  margin: 0 auto;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 1rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f8f9fa;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.memory-title-input,
.memory-date-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.memory-title-input:focus,
.memory-date-input:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.memory-title-input.is-invalid,
.memory-content.is-invalid {
  border-color: #dc3545;
}

.content-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  margin-bottom: 2rem;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.upload-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: #6c757d;
  transition: all 0.2s ease;
}

.upload-button:hover {
  background-color: #e9ecef;
  color: #495057;
}

.textarea-wrapper {
  position: relative;
  padding: 1rem;
}

.memory-content {
  width: 100%;
  min-height: 400px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #495057;
  resize: vertical;
  font-family: inherit;
}

.memory-content:focus {
  outline: none;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.char-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.preview-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  display: block;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.remove-button:hover {
  background: #dc3545;
}

.save-button {
  align-self: center;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 200px;
  justify-content: center;
}

.save-button:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 768px) {
  .memory-entry-container {
    padding: 1rem;
  }

  .preview-section {
    gap: 0.5rem;
  }

  .preview-image {
    width: 120px;
    height: 120px;
  }

  .save-button {
    min-width: 100%;
  }
}
</style>