<template>
  <div class="diary-container">
    <header class="header-section">
      <h1 class="diary-title">📖 My Diary Entries</h1>
    </header>

    <div class="book">
      <div class="page cover">
        <h2 class="cover-title">📕 My Diary</h2>
        <v-calendar
          v-model="selectedDate"
          @dayclick="goToNearestEntry"
          :attributes="calendarAttributes"
          class="custom-calendar"
        />
        <div class="write-note-container">
          <div class="arrow-animation">➡️</div>
          <router-link to="/diary/diary-writing">
            <button class="new-entry-button"
              >Write a diary note for today</button
            >
          </router-link>
        </div>
      </div>

      <div
        class="page diary-page right"
        :class="{ flippingright: isFlippingRight }"
        @click.self="nextPage"
      >
        <div v-if="currentEntry">
          <button
            class="delete-button fixed"
            @click.stop="confirmDelete(currentEntry.id)"
            >🗑️</button
          >
          <input
            type="text"
            v-model="currentEntry.title"
            @input="updateDiary"
            class="entry-title"
          />
          <p class="entry-date">{{ formatDate(currentEntry.creationTime) }}</p>
          <textarea
            v-model="currentEntry.content"
            @input="updateDiary"
            class="entry-content"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPagedDiaryNotes,
  deleteDiaryNote,
  updateDiaryNote,
} from "@/scripts/api/services/diaryNoteService";
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
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    async fetchDiaryNotes() {
      try {
        const data = await getPagedDiaryNotes();
        this.entries = data.items || [];
      } catch (error) {
        Swal.fire("Error", "Failed to fetch diary entries.", "error");
      }
    },
    nextPage() {
      if (this.currentPageIndex < this.orderedEntries.length - 1) {
        this.isFlippingRight = true;
        setTimeout(() => {
          this.currentPageIndex++;
          this.isFlippingRight = false;
        }, 400);
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
        Swal.fire("Not Found", "No diary entry found for this date.", "info");
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
        title: "Are you sure?",
        text: "You won't be able to recover this diary entry!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await this.deleteDiary(entryId);
      }
    },
    async deleteDiary(entryId) {
      try {
        await deleteDiaryNote(entryId);
        this.entries = this.entries.filter((entry) => entry.id !== entryId);
        Swal.fire("Deleted!", "Your diary entry has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete diary entry.", "error");
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
  background: #673ab7; /* Màu tím sáng */
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
  padding-top: 20px;
  display: flex;
  width: 900px; 
  height: 700px;
  margin: auto;
  position: relative;
  perspective: 2000px;
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
  background: #f5f5f5;
  padding: 30px; 
  text-align: center;
  cursor: pointer;
  transform-origin: left;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.flippingright {
  transform: rotateY(-90deg);
}

.flippingleft {
  transform: rotateY(90deg);
  transform-origin: right;
}
</style>
