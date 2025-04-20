<template>
  <div class="diary-container">
    <header class="header-section">
      <h1 class="diary-title">📖 Nhật Ký Của Tôi</h1>
    </header>

    <div class="book">
      <div class="page cover">
        <h2 class="cover-title">📕 Nhật Ký Của Tôi</h2>
        <v-calendar v-model="selectedDate" @dayclick="goToNearestEntry" :attributes="calendarAttributes"
          class="custom-calendar" />
        <div class="write-note-container">
          <div class="arrow-animation">➡️</div>
          <router-link to="/diary/diary-writing">
            <button class="new-entry-button">Viết nhật ký hôm nay</button>
          </router-link>
        </div>
      </div>

      <div class="page diary-page right" :class="{ flippingright: isFlippingRight }" @click.self="nextPage">
        <div v-if="currentEntry">
          <button class="delete-button fixed" @click.stop="confirmDelete(currentEntry.id)">🗑️</button>
          <input type="text" v-model="currentEntry.title" @input="updateDiary" class="entry-title" />
          <p class="entry-date">{{ formatDate(currentEntry.creationTime) }}</p>
          <textarea v-model="currentEntry.content" @input="updateDiary" class="entry-content"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPagedDiaryNotes, deleteDiaryNote, updateDiaryNote } from "@/scripts/api/services/diaryNoteService";
import { getUserProfile } from '@/scripts/api/services/authService';
import Swal from "sweetalert2";
import { Calendar } from "v-calendar";
import "v-calendar/style.css";

export default {
  name: "DiaryList",
  components: { VCalendar: Calendar },
  data() {
    return {
      entries: [],
      currentPageIndex: 0,
      selectedDate: new Date(),
      isFlippingRight: false,
    };
  },
  computed: {
    orderedEntries() {
      return this.entries.sort(
        (a, b) => new Date(a.creationTime) - new Date(b.creationTime)
      );
    },
    currentEntry() {
      return this.orderedEntries[this.currentPageIndex] || null;
    },
    calendarAttributes() {
      return this.entries.map((entry) => ({
        key: entry.id,
        highlight: { color: "blue", fillMode: "solid" },
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
      });
    },
    async fetchDiaryNotes() {
      try {
        var user = await getUserProfile();
        const data = await getPagedDiaryNotes({ CreatorId: user.id });
        this.entries = (data.items || []).filter(entry => !!entry.title);
      } catch (error) {
        if (error.response?.status === 404) {
          this.entries = [];
        } else {
          Swal.fire("Lỗi", "Không thể tải danh sách nhật ký.", "error");
        }
      }
    },
      nextPage() {
        if (this.currentPageIndex < this.orderedEntries.length - 1) {
          this.isFlippingRight = true;
          setTimeout(() => {
            this.currentPageIndex++;
            this.isFlippingRight = false;
          }, 700);
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
          Swal.fire("Không tìm thấy", "Không có nhật ký nào vào ngày này.", "info");
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
          console.error("Error updating diary:", error);
        }
      },
    async confirmDelete(entryId) {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn?",
          text: "Bạn sẽ không thể khôi phục lại nhật ký này!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có, xóa nó!",
          cancelButtonText: "Hủy bỏ",
        });

        if (result.isConfirmed) {
          await this.deleteDiary(entryId);
        }
      },
    async deleteDiary(entryId) {
        try {
          await deleteDiaryNote(entryId);
          this.entries = this.entries.filter((entry) => entry.id !== entryId);
          Swal.fire("Đã xóa!", "Nhật ký của bạn đã được xóa.", "success");
        } catch (error) {
          Swal.fire("Lỗi", "Không thể xóa nhật ký.", "error");
        }
      },
    },
    mounted() {
      this.fetchDiaryNotes();
    },
  };
</script>

<style scoped>
.new-entry-button {
  background: #673ab7;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.new-entry-button:hover {
  background: #512da8;
}

.custom-calendar {
  max-width: 280px;
  margin-top: 10px;
}

.entry-title {
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  border: none;
  background: none;
  text-align: center;
}

.entry-content {
  width: 100%;
  height: 400px;
  border: none;
  background: none;
  font-size: 16px;
  padding: 10px;
}

.calendar-and-book {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  margin-top: 50px;
}

.delete-button {
  position: absolute;
  top: 35px;
  right: 35px;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.delete-button.fixed {
  position: absolute;
  top: 35px;
  right: 35px;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.diary-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
}

.edit-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.header-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 1000px;
}

.diary-title {
  font: 700 32px Poppins, sans-serif;
  color: #282828;
}

.calendar-container {
  margin-bottom: 20px;
}

.write-note-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-left: -50px;
}

.arrow-animation {
  font-size: 24px;
  color: #ff9800;
  animation: moveArrow 1.2s infinite alternate ease-in-out;
}

@keyframes moveArrow {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }

  50% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(10px);
    opacity: 0;
  }
}

.date-picker {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.book {
  position: relative;
  width: 800px;
  height: 600px;
  display: flex;
  box-shadow: -15px 0 25px rgba(0, 0, 0, 0.2), 10px 0 15px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to right, #d4c5a1 20%, #f5f5f5 80%);
  perspective: 2000px;
  border-radius: 15px;
}

.page.cover {
  flex: 1;
  background: #a974cf;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  transition: transform 0.6s;
  padding: 20px;
}

.cover-title {
  font-size: 30px;
  margin-bottom: 20px;
}

.page {
  flex: 1;
  width: 50%;
  height: 100%;
  background: #fdfaf6;
  padding: 40px 50px;
  text-align: center;
  font-family: "Georgia", serif;
  line-height: 1.8;
  border-radius: 5px;
  cursor: pointer;
  transform-origin: left;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2), 6px 6px 15px rgba(0, 0, 0, 0.15),
    8px 8px 20px rgba(0, 0, 0, 0.1);
}

.page::after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 100%;
  height: 100%;
  background: #f3f1eb;
  border-radius: 5px;
  z-index: -1;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15), 6px 6px 12px rgba(0, 0, 0, 0.1);
}

.page::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 100%;
  height: 100%;
  background: #eae5dc;
  border-radius: 5px;
  z-index: -2;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.12);
}

.flippingright {
  transform: rotateY(-90deg);
}

.flippingleft {
  transform: rotateY(90deg);
  transform-origin: right;
}
</style>
