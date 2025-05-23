<template>
  <form class="memory-entry-container" @submit.prevent="handleSubmit">
    <SweetAlert ref="sweetAlert" />
    <header class="header-section">
      <button class="back-button" @click="handleBack">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d9b58e3b5db27ef7508f6ec31fd50ca2a91cd5f71d18910c95741bcb028f9bba"
          alt="Quay lại" class="back-icon" />
        <span>Quay lại</span>
      </button>
    </header>

    <input type="text" class="memory-title-input" v-model="memoryTitle" aria-label="Tiêu đề nhật ký"
      placeholder="Nhật ký của tôi #1" />

    <input type="date" class="memory-date-input" v-model="memoryDate" aria-label="Ngày viết" />

    <div class="content-section">
      <div class="content-header">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e44458ef9434dde6ea240cbe1e7b2a82dca59ee4b66564ddcbe76fbf7ddf52c"
          alt="Tải ảnh lên" class="upload-icon" tabindex="0" @click="triggerFileInput" />
        <input type="file" ref="fileInput" class="visually-hidden" @change="handleFileChange" multiple
          accept="image/*" />
      </div>
      <textarea class="memory-content" placeholder="Viết bất cứ điều gì..." v-model="memoryContent"
        aria-label="Nội dung nhật ký"></textarea>

      <div class="preview-section">
        <div v-for="(file, index) in mediaFiles" :key="index" class="preview-item">
          <img :src="file.preview" alt="Xem trước" class="preview-image" />
          <button type="button" @click="removeFile(file.id)" class="remove-button">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <button type="submit" class="save-button">Lưu lại</button>
  </form>
</template>

<script>
import { inject, ref, onMounted } from "vue";
import {
  createDiaryNote,
  getPagedDiaryNotes,
  updateDiaryNote,
} from "@/scripts/api/services/diaryNoteService";
import { ConvertTo_yyyy_mm_dd } from "../../../scripts/logic/common";
import { useRoute, useRouter } from "vue-router";
import { getUserProfile } from '@/scripts/api/services/authService';

export default {
  name: "DiaryWriting",
  setup() {
    const sweetAlert = inject("sweetAlert");
    const route = useRoute();
    const router = useRouter();

    const memoryTitle = ref("");
    const memoryDate = ref("");
    const memoryContent = ref("");
    const mediaFiles = ref([]);
    const removedFileIds = ref([]);
    const diaryNoteId = ref(null);
    const isEdit = ref(false);

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
          sweetAlert.showError("Không tìm thấy nhật ký.");
        }
      } catch (error) {
        sweetAlert.showError("Không thể tải nhật ký. Vui lòng thử lại.");
      }
    }

    async function fetchTodayDiary() {
      const today = ConvertTo_yyyy_mm_dd(new Date());
      const now = new Date();
      now.setHours(now.getHours() - 8); // Trừ 8 tiếng để khớp UTC
      const startAfter = now.toISOString(); // Định dạng đúng cả ngày + giờ

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

    async function handleSubmit() {
      if (!memoryTitle.value || !memoryDate.value || !memoryContent.value) {
        sweetAlert.showError("Vui lòng điền đầy đủ thông tin trước khi lưu.");
        return;
      }

      const formData = new FormData();
      isEdit.value && formData.append("Id", diaryNoteId.value || "");
      formData.append("Title", memoryTitle.value);
      formData.append("Content", memoryContent.value);

      try {
        if (isEdit.value && diaryNoteId.value) {
          await updateDiaryNote(formData);
          sweetAlert.showSuccess("Cập nhật nhật ký thành công!");
        } else {
          const response = await createDiaryNote(formData);
          diaryNoteId.value = response.id;
          sweetAlert.showSuccess("Tạo nhật ký thành công!");
        }
        router.push({ name: "diaryList" });
      } catch (error) {
        console.error("Lỗi khi lưu nhật ký:", error);
        sweetAlert.showError("Không thể lưu nhật ký. Vui lòng thử lại.");
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
      handleSubmit,
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
  overflow: hidden;
  align-items: end;
  padding: 23px 23px 39px 23px;
}

.header-section {
  align-self: start;
}

.back-button {
  display: flex;
  gap: 5px;
  color: #000;
  font: 400 18px Manrope, sans-serif;
  background: none;
  border: none;
  cursor: pointer;
  align-items: center;
}

.back-icon {
  aspect-ratio: 1;
  width: 26px;
}

.memory-title-input {
  border-radius: 11px;
  background-color: rgba(220, 210, 247, 0.4);
  margin-top: 24px;
  width: 1286px;
  max-width: 100%;
  color: #251d1d;
  padding: 13px;
  font: 400 18px Manrope, sans-serif;
  border: none;
}

.memory-date-input {
  border-radius: 11px;
  background-color: rgba(220, 210, 247, 0.4);
  margin-top: 16px;
  width: 1286px;
  max-width: 100%;
  color: #161616;
  padding: 14px;
  font: 400 18px Manrope, sans-serif;
  border: none;
}

.content-section {
  border-radius: 11px;
  background-color: rgba(220, 210, 247, 0.4);
  margin-top: 13px;
  width: 100%;
  max-width: 1286px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

.upload-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.upload-icon:hover {
  transform: scale(1.1);
}

.memory-content {
  color: #2d2828;
  font: 400 18px Manrope, sans-serif;
  margin: 0 44px 20px;
  background: transparent;
  border: none;
  min-height: 700px;
  resize: vertical;
  margin-top: -35px;
}

.memory-content:focus {
  outline: none;
}

.formatting-toolbar {
  background-color: #fff9f9;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  padding: 23px 76px;
}

.format-icon {
  aspect-ratio: 1;
  width: 40px;
  cursor: pointer;
}

.save-button {
  align-self: center;
  border-radius: 7.72px;
  background: var(--Black, #282828);
  margin-top: 32px;
  width: 383px;
  max-width: 100%;
  color: #fff;
  padding: 15px;
  font: 700 17px Manrope, sans-serif;
  border: none;
  cursor: pointer;
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

.preview-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  /* Increased gap between items */
  justify-content: flex-start;
}

.preview-item {
  position: relative;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #ff0000;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.remove-button:hover {
  transform: scale(1.2);
}

.remove-button i {
  margin: 0;
}

.preview-item:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 991px) {
  .memory-entry-container {
    padding: 0 20px;
  }

  .memory-title-input,
  .memory-date-input {
    padding-right: 20px;
  }

  .memory-content {
    margin-left: 10px;
  }

  .formatting-toolbar {
    max-width: 100%;
    margin: 40px 0 10px;
    padding: 0 20px;
  }

  .save-button {
    padding: 15px 20px;
  }

  .content-header {
    padding: 12px;
  }

  .memory-content {
    margin: 0 20px 20px;
  }
}
</style>
