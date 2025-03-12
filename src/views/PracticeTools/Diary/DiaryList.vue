<template>
  <div class="diary-container">
    <header class="header-section">
      <h1 class="diary-title">📖 My Diary Entries</h1>
      <router-link to="/diary/diary-writing" class="new-entry-button">
        <span>New Entry</span> ➕
      </router-link>
    </header>

    <div class="calendar-and-book">
      <div class="calendar-container">
        <v-calendar
          v-model="selectedDate"
          @dayclick="goToNearestEntry"
          :attributes="calendarAttributes"
          class="custom-calendar"
        />
      </div>

      <div class="book">
        <div class="page cover" v-if="currentPageIndex === 0" @click="nextPage">
          <h2 class="cover-title">📕 My Diary</h2>
        </div>

        <div
          class="page diary-page left"
          :class="{ flippingleft: isFlippingLeft }"
          v-if="prevEntry"
          @click="prevPage"
        >
          <div v-if="prevEntry">
            <h2 class="entry-title">{{ prevEntry.title }}</h2>
            <p class="entry-date">{{ formatDate(prevEntry.creationTime) }}</p>
            <p class="entry-content">{{ prevEntry.content }}</p>
          </div>
        </div>

        <div
          class="page diary-page right"
          :class="{ flippingright: isFlippingRight }"
          @click="nextPage"
        >
          <div v-if="currentEntry">
            <h2 class="entry-title">{{ currentEntry.title }}</h2>
            <p class="entry-date">{{
              formatDate(currentEntry.creationTime)
            }}</p>
            <p class="entry-content">{{ currentEntry.content }}</p>
            <button
              class="edit-button"
              @click.stop="viewEntry(currentEntry.id, currentEntry.title)"
              >✏️</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPagedDiaryNotes } from "@/scripts/api/services/diaryNoteService";
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
      isFlippingLeft: false,
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
    prevEntry() {
      return this.currentPageIndex > 0
        ? this.orderedEntries[this.currentPageIndex - 1]
        : null;
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
        }, 800);
      }
    },
    prevPage() {
      if (this.currentPageIndex > 0) {
        this.isFlippingLeft = true;
        setTimeout(() => {
          this.currentPageIndex--;
          this.isFlippingLeft = false;
        }, 800);
      }
    },
    goToNearestEntry(day) {
      const selectedDate = new Date(day.id).toISOString().split("T")[0]; // Chuyển về format YYYY-MM-DD
      const index = this.orderedEntries.findIndex(
        (entry) => entry.creationTime.startsWith(selectedDate) // Kiểm tra ngày trùng khớp
      );

      if (index !== -1) {
        this.currentPageIndex = index;
      } else {
        Swal.fire("Not Found", "No diary entry found for this date.", "info");
      }
    },
    viewEntry(diaryId, diaryTitle) {
      this.$router.push({
        name: "DiaryWriting",
        params: { id: diaryId, title: diaryTitle },
      });
    },
  },
  mounted() {
    this.fetchDiaryNotes();
  },
};
</script>

<style scoped>
.custom-calendar {
  max-width: 300px;
  flex-shrink: 0;
}

.calendar-and-book {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  margin-top: 150px;
  margin-left: 60px;
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

.new-entry-button {
  background: #282828;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font: 600 16px Manrope, sans-serif;
  cursor: pointer;
}

.calendar-container {
  margin-bottom: 20px;
}

.date-picker {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.book {
  display: flex;
  width: 700px;
  height: 600px;
  margin: auto;
  position: relative;
  perspective: 1500px;
}

.page.cover {
  flex: 1;
  background: #282828;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transform-origin: right;
  transition: transform 0.6s;
}

.page {
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
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
