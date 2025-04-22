<template>
  <div class="container">
    <div class="calendar-wrapper">
      <div class="calendar">
        <div class="header">
          <button class="nav-btn" @click="prevMonth">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="month-year">{{ currentMonth }} {{ currentYear }}</div>
          <button class="nav-btn" @click="nextMonth">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="days-grid">
          <div v-for="(day, index) in calendarDays" :key="index" :class="dayClasses(day)" @click="selectDay(day)">
            {{ formatDate(day.date) }}
            <span v-if="getEventCount(day) > 0" class="event-count">
              {{ getEventCount(day) }}
            </span>
          </div>
        </div>
      </div>      
      <div class="events-sidebar">
        <div class="selected-date">
          <div class="day-name">{{ selectedDayName }}</div>
          <div class="full-date">{{ formattedSelectedDate }}</div>
        </div>
        <transition name="fade">
          <div class="events-list" key="eventList">
            <div v-if="currentEvents.length === 0" class="no-events">
              Không có thói quen nào trong ngày này
            </div>
            <div v-else v-for="(event, idx) in currentEvents" :key="event.id || idx"
              class="event-item holding-wrapper mt-1"
              :class="{ collapsed: event.completed || event.closed, holding: event.holding, 'repeating-event': event.repeaterSequenceId || event.repeat !== 'none' }"
              :style="[{ borderLeft: '4px solid ' + (event.completed || event.closed ? '#bbb' : event.tag) }, { '--event-color': event.tag }]"
              @mousedown="startHold(event)" @mouseup="cancelHold" @mouseleave="cancelHold">
              <div class="event-info">
                <div class="event-title" :class="{ collapsed: event.completed || event.closed }">
                  <span class="title-text" :class="{ collapsed: event.completed || event.closed }">
                    {{ event.title }}
                    <i v-if="event.repeaterSequenceId" class="fa-solid fa-repeat repeat-icon"
                      :style="{ color: event.tag }"></i>
                  </span>
                  <div class="event-status-icons">
                    <template v-if="event.closed">
                      <i class="fa-solid fa-ban closed-icon"></i>
                    </template>
                    <template v-else-if="event.completed">
                      <i class="fa-solid fa-check completed-icon"></i>
                    </template>
                  </div>
                </div>
                <template v-if="!event.completed && !event.closed">
                  <div class="event-description">
                    {{ event.description }}
                  </div>
                  <div class="event-extra" v-if="event.objective || (event.startTime && event.endTime)">
                    <div v-if="event.objective" class="objective-text">
                      <strong>Mục tiêu:</strong> {{ event.objective }}
                    </div>
                    <div v-if="event.startTime && event.endTime" class="timeline-label">
                      <strong>Thời gian:</strong> {{ event.startTime }} - {{ event.endTime }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="timeline-label collapsed">
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                </template>
              </div>
              <template v-if="!event.completed && !event.closed">
                <div class="event-actions">
                  <button class="edit-event-btn" @click.stop="editEvent(event)" :style="{ color: event.tag }">
                    <i class="fa-solid fa-edit"></i>
                  </button>
                  <button class="delete-event-btn" @click.stop="confirmDeleteEvent(event)"
                    :style="{ color: event.tag }">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </transition>
        <button v-if="!isDateBeforeToday" class="add-event-btn" @click="openNewEventForm">
          <i class="fa-solid fa-plus"></i> Thêm thói quen mới
        </button>
      </div>
    </div>
    <transition name="fade">
      <div class="task-chart-section" v-if="currentEvents.length > 0">
        <canvas ref="taskChart"></canvas>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showEventForm" class="event-form-modal">
        <div class="modal-content add-event-form">
          <h3>{{ isEditing ? "Chỉnh Sửa Thói Quen" : "Thêm Thói Quen mới" }}</h3>
          <div class="form-group">
            <label for="title">Tiêu đề</label>
            <input id="title" v-model="newEvent.title" class="form-input" placeholder="Nhập tiêu đề thói quen"
              @input="validateTitleConstraints" />
            <div v-if="titleError" class="error-message" style="color: #e74c3c;">{{ titleError }}</div>
          </div>
          <div class="form-group">
            <label for="description">Mô tả</label>
            <label for="description">Mô tả</label>
            <textarea id="description" v-model="newEvent.description" class="form-input"
              placeholder="Nhập mô tả Thói quen" @input="validateDescriptionConstraints"></textarea>
            <div v-if="descriptionError" class="error-message" style="color: #e74c3c;">{{ descriptionError }}</div>
          </div>
          <div class="form-group">
            <label for="objective">Mục tiêu</label>
            <label for="objective">Mục tiêu</label>
            <input id="objective" v-model="newEvent.objective" class="form-input"
              placeholder="Nhập mục tiêu (không bắt buộc)" />
          </div>
          <div class="form-group">
            <label>Nhãn</label>
            <div class="tag-options">
              <div v-for="(preset, idx) in tagPresets" :key="idx" class="tag-option"
                @click="newEvent.tag = preset.color">
                <div class="tag-color-circle" :style="{ backgroundColor: preset.color }"></div>
                <div class="tag-label">{{ preset.label }}</div>
                <div v-if="newEvent.tag === preset.color" class="tag-selected-mark">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group" v-if="!isEditing">
            <label for="repeat">Lặp lại</label>
            <select id="repeat" v-model="newEvent.repeat" class="form-input">
              <option value="none">Không lặp lại</option>
              <option value="weekday">Ngày trong tuần (T2-T6)</option>
              <option value="weekends">Cuối tuần (T7, CN)</option>
              <option value="allWeek">Cả tuần</option>
              <option value="allMonth">Cả tháng</option>
            </select>
          </div>
          <div v-if="isEditing && newEvent.repeaterSequenceId" class="form-group">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="updateAllInSequence" v-model="newEvent.updateAllInSequence"
                class="styled-checkbox" />
              <label for="updateAllInSequence" class="checkbox-label">Áp dụng thay đổi cho những thói quen lặp
                lại?</label>
            </div>
          </div>
          <div class="form-group time-group">
            <div>
              <label for="startTime">Thời gian bắt đầu</label>
              <label for="startTime">Thời gian bắt đầu</label>
              <input id="startTime" type="time" v-model="newEvent.startTime" class="form-input" />
            </div>
            <div>
              <label for="endTime">Thời gian kết thúc</label>
              <label for="endTime">Thời gian kết thúc</label>
              <input id="endTime" type="time" v-model="newEvent.endTime" class="form-input" />
            </div>
          </div>
          <div v-if="timeError" class="error-message" style="color: #e74c3c;">{{ timeError }}</div>
          <div class="modal-actions">
            <button class="btn cancel-btn" @click="cancelEvent">Hủy bỏ</button>
            <button class="btn save-btn" @click="saveEvent"
              :disabled="!!timeError || !!titleError || !!descriptionError">Lưu lại</button>
          </div>
        </div>
      </div>
    </transition>
    <DeleteConfirmPopup :message="deleteMessage" :isVisible="showDeletePopup" @confirmDelete="handleDeleteConfirm"
      @update:isVisible="showDeletePopup = false" />
    <div v-if="showDeleteOptions" class="event-form-modal">
      <div class="modal-content delete-options-modal">
        <h3>Xóa thói quen lặp lại</h3>
        <p>Thói quen này là một phần của chuỗi thói quen lặp lại. Bạn muốn xóa:</p>
        <div class="delete-options">
          <button class="btn delete-option-btn" @click="deleteCurrentEvent">
            <i class="fa-solid fa-calendar-day"></i>
            Chỉ thói quen này
          </button>
          <button class="btn delete-option-btn delete-all" @click="deleteAllEvents">
            <i class="fa-solid fa-calendar-week"></i>
            Tất cả thói quen
          </button>
        </div>
        <div class="modal-actions mt-4">
          <button class="btn cancel-btn" @click="showDeleteOptions = false">Hủy bỏ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
  isSameDay as dfIsSameDay,
  isSameMonth,
  format,
  isAfter,
  isBefore,
  startOfDay
} from "date-fns";
import DeleteConfirmPopup from "../Popup/DeleteConfirmPopup.vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function getRoundedTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const remainder = minutes % 15;
  if (remainder !== 0) {
    minutes += 15 - remainder;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }
  hours = hours % 24;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getDeadline(event) {
  if (!event.date || !event.endTime) return new Date();
  const additional = Number(event.additionalTime) || 0;
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.endTime.split(":").map(Number);
  let deadline = new Date(year, month - 1, day, hour, minute, 0, 0);
  deadline.setMinutes(deadline.getMinutes() + additional);
  return deadline;
}

export default {
  name: "Calendar",
  components: { DeleteConfirmPopup },
  props: {
    events: { type: Array, default: () => [] },
    initialDate: { type: Date, default: () => new Date() },
    eventDotColor: { type: String, default: "#e74c3c" }
  },
  data() {
    const now = new Date();
    const startTime = getRoundedTime(now);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const endDate = new Date(now);
    endDate.setHours(startHour + 1, startMinute, 0, 0);
    const endTime = formatTime(endDate);
    return {
      currentDate: this.initialDate,
      selectedDate: this.initialDate,
      localEvents: [...this.events],
      newEvent: {
        title: "",
        description: "",
        objective: "",
        tag: "#3498db",
        repeat: "none",
        startTime,
        endTime,
        updateAllInSequence: true
      },
      timeError: "",
      titleError: "",
      descriptionError: "",
      eventToDelete: null,
      showEventForm: false,
      showDeletePopup: false,
      showDeleteOptions: false,
      isEditing: false,
      deleteMessage: "Bạn có chắc chắn muốn xóa thói quen này?",
      tagPresets: [
        { color: "#2ecc71", label: "Thấp" },
        { color: "#3498db", label: "Trung bình" },
        { color: "#f1c40f", label: "Vừa phải" },
        { color: "#e67e22", label: "Cao" },
        { color: "#e74c3c", label: "Quan trọng" }
      ],
      holdTimer: null,
      chartInstance: null
    };
  },
  watch: {
    events: {
      handler(newEvents) {
        this.localEvents = [...newEvents];
      },
      immediate: true,
      deep: true
    },
    localEvents: {
      handler(newVal) {
        if (this.currentEvents.length > 0) {
          this.$nextTick(() => {
            this.renderChart();
          });
        } else if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
      },
      immediate: true,
      deep: true
    },
    'newEvent.startTime': function () {
      this.validateTimeConstraints();
    },
    'newEvent.endTime': function () {
      this.validateTimeConstraints();
    },
    'newEvent.title': function () {
      this.validateTitleConstraints();
    },
    'newEvent.description': function () {
      this.validateDescriptionConstraints();
    }
  },
  computed: {
    daysOfWeek() {
      return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    },
    currentMonth() {
      return format(this.currentDate, "MMMM");
    },
    currentYear() {
      return format(this.currentDate, "yyyy");
    },
    formattedSelectedDate() {
      return format(this.selectedDate, "dd/MM/yyyy");
    },
    calendarDays() {
      const startDate = startOfWeek(startOfMonth(this.currentDate));
      const endDate = endOfWeek(endOfMonth(this.currentDate));
      const days = [];
      let day = startDate;
      while (day <= endDate) {
        days.push({
          date: day,
          isCurrentMonth: isSameMonth(day, this.currentDate)
        });
        day = addDays(day, 1);
      }
      return days;
    },
    selectedDayName() {
      return format(this.selectedDate, "EEEE");
    },
    currentEvents() {
      return this.localEvents.filter(e => {
        if (!e) return false;
        const eventDate = e.date ? new Date(e.date) : null;
        if (!eventDate) return false;
        return dfIsSameDay(eventDate, this.selectedDate);
      });
    },
    sortedEventsForSelectedDay() {
      return this.currentEvents.slice().sort((a, b) => {
        if (!a.startTime) return -1;
        if (!b.startTime) return 1;
        return a.startTime.localeCompare(b.startTime);
      });
    },
    completedCount() {
      return this.currentEvents.filter(task => task.completed).length;
    },
    closedCount() {
      return this.currentEvents.filter(task => task.closed).length;
    },
    remainingCount() {
      return this.currentEvents.filter(task => !task.completed && !task.closed).length;
    },
    isDateBeforeToday() {
      const today = startOfDay(new Date());
      const selectedDay = startOfDay(this.selectedDate);
      return isBefore(selectedDay, today);
    }
  },
  mounted() {
    this.renderChart();
    setInterval(() => {
      const now = new Date();
      this.localEvents.forEach(event => {
        if (!event.completed && !event.closed && event.date && event.endTime && event.additionalTime != null) {
          const deadline = getDeadline(event);
          if (now > deadline) {
            event.closed = true;
            toast.error("Sự kiện đã được đóng do thời hạn!", { duration: 150, position: "bottom-center" });
            this.renderChart();
          }
        }
      });
    }, 30000);
  },
  methods: {
    validateTimeConstraints() {
      if (!this.newEvent.startTime || !this.newEvent.endTime) {
        this.timeError = "";
        return;
      }

      const startTime = this.newEvent.startTime;
      const endTime = this.newEvent.endTime;

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        this.timeError = "Thời gian bắt đầu phải sớm hơn thời gian kết thúc";
        return;
      }

      if (endHour === 0 && endMinute === 0) {
        this.timeError = "Thời gian kết thúc không thể là nửa đêm (00:00)";
        return;
      }

      this.timeError = "";
    },
    validateTitleConstraints() {
      if (!this.newEvent.title || this.newEvent.title.trim() === "") {
        this.titleError = "Tiêu đề không được để trống";
        return;
      }

      const title = this.newEvent.title.trim();

      if (title.length > 30) {
        this.titleError = "Tiêu đề không được vượt quá 30 ký tự";
        return;
      }

      if (title.length < 3) {
        this.titleError = "Tiêu đề phải có ít nhất 3 ký tự";
        return;
      }

      this.titleError = "";
    },
    validateDescriptionConstraints() {
      if (!this.newEvent.description || this.newEvent.description.trim() === "") {
        this.descriptionError = "Mô tả không được để trống";
        return;
      }

      const description = this.newEvent.description.trim();

      if (description.length > 200) {
        this.descriptionError = "Mô tả không được vượt quá 200 ký tự";
        return;
      }

      if (description.length < 10) {
        this.descriptionError = "Mô tả phải có ít nhất 10 ký tự";
        return;
      }

      this.descriptionError = "";
    },
    dayClasses(day) {
      return {
        "calendar-day": true,
        "current-month": day.isCurrentMonth,
        selected: dfIsSameDay(day.date, this.selectedDate),
        "has-event": this.hasEvents(day)
      };
    },
    hasEvents(day) {
      return this.localEvents.some(e => {
        if (!e) return false;
        const eventDate = e.date ? new Date(e.date) : null;
        if (!eventDate) return false;
        return dfIsSameDay(eventDate, day.date);
      });
    },
    getEventCount(day) {
      return this.localEvents.filter(e => {
        if (!e) return false;
        const eventDate = e.date ? new Date(e.date) : null;
        if (!eventDate) return false;
        return dfIsSameDay(eventDate, day.date);
      }).length;
    },
    formatDate(date) {
      return format(date, "dd");
    },
    prevMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
      this.$emit('month-changed', this.currentDate);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
      this.$emit('month-changed', this.currentDate);
    },
    selectDay(day) {
      this.selectedDate = day.date;
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    openNewEventForm() {
      if (this.isDateBeforeToday) return;

      this.isEditing = false;
      this.timeError = "";
      this.titleError = "";
      this.descriptionError = "";
      const now = new Date();
      const startTime = getRoundedTime(now);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const endDate = new Date(now);
      endDate.setHours(startHour + 1, startMinute, 0, 0);
      const endTime = formatTime(endDate);

      this.newEvent = {
        title: "",
        description: "",
        objective: "",
        tag: "#3498db",
        repeat: "none",
        startTime,
        endTime,
        updateAllInSequence: true
      };

      this.showEventForm = true;
    },
    editEvent(event) {
      this.isEditing = true;
      this.newEvent = {
        ...event,
        isUpdate: true,
        updateAllInSequence: true,
        repeat: event.repeaterSequenceId ? "custom" : "none"
      };
      this.timeError = "";
      this.titleError = "";
      this.descriptionError = "";
      this.showEventForm = true;
      this.validateTimeConstraints();
      this.validateTitleConstraints();
      this.validateDescriptionConstraints();
    },
    saveEvent() {
      this.validateTitleConstraints();
      this.validateDescriptionConstraints();
      this.validateTimeConstraints();

      if (this.titleError || this.descriptionError || this.timeError) {
        return;
      }

      // For new events
      if (!this.isEditing) {
        const savedEvent = {
          ...this.newEvent,
          id: Date.now().toString(),
          date: format(this.selectedDate, "yyyy-MM-dd"),
          completed: false,
          closed: false
        };

        this.$emit("save-event", savedEvent);
      }
      else {
        const updatedEvent = {
          ...this.newEvent,
          date: format(this.selectedDate, "yyyy-MM-dd")
        };

        this.$emit("save-event", updatedEvent);
      }

      this.showEventForm = false;
      this.isEditing = false;

      setTimeout(() => {
        this.renderChart();
      }, 1000);
    },
    cancelEvent() {
      this.showEventForm = false;
      this.isEditing = false;
      this.timeError = "";
      this.titleError = "";
      this.descriptionError = "";

      const now = new Date();
      const startTime = getRoundedTime(now);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const endDate = new Date(now);
      endDate.setHours(startHour + 1, startMinute, 0, 0);
      const endTime = formatTime(endDate);

      this.newEvent = {
        title: "",
        description: "",
        objective: "",
        tag: "#3498db",
        repeat: "none",
        startTime,
        endTime,
        updateAllInSequence: true
      };
    },
    confirmDeleteEvent(event) {
      this.eventToDelete = event;

      if (event.repeaterSequenceId) {
        this.showDeleteOptions = true;
      } else {
        this.deleteMessage = "Bạn có chắc chắn muốn xóa thói quen này?";
        this.showDeletePopup = true;
      }
    },
    deleteCurrentEvent() {
      this.showDeleteOptions = false;
      this.eventToDelete.deleteAllInSequence = false;
      this.deleteMessage = "Bạn có chắc chắn muốn xóa chỉ thói quen này?";
      this.showDeletePopup = true;
    },
    deleteAllEvents() {
      this.showDeleteOptions = false;
      this.eventToDelete.deleteAllInSequence = true;
      this.deleteMessage = "Bạn có chắc chắn muốn xóa tất cả các thói quen lặp lại này?";
      this.showDeletePopup = true;
    },
    handleDeleteConfirm(confirmed) {
      if (confirmed && this.eventToDelete) {
        this.$emit("delete-event", this.eventToDelete);
      }
      this.showDeletePopup = false;
      this.eventToDelete = null;
      setTimeout(() => {
        this.renderChart();
      }, 1000);
    },
    startHold(event) {
      if (event.closed) return;
      this.holdTimer = setTimeout(() => {
        event.completed = !event.completed;
        event.isUpdate = true;
        event.holding = false;
        toast.success(
          event.completed ? "Đã đánh dấu hoàn thành!" : "Đã bỏ đánh dấu hoàn thành!",
          { position: "bottom-center" }
        );
        this.$emit("save-event", event);
        setTimeout(() => {
          this.renderChart();
        }, 1000);
      }, 500);
      event.holding = true;
    },
    cancelHold() {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
      this.currentEvents.forEach(e => (e.holding = false));
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      if (!this.$refs.taskChart || this.currentEvents.length === 0) return;
      const ctx = this.$refs.taskChart.getContext("2d");
      const progressData = [
        this.completedCount,
        this.remainingCount,
        this.closedCount
      ];
      this.chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Đã hoàn thành", "Còn lại", "Chưa hoàn thành"],
          datasets: [
            {
              data: progressData,
              backgroundColor: ["#28a745", "#3498db", "#ff4040"],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Tiến độ đạt được hôm nay" }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.calendar-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.nav-btn {
  background: none;
  border: 1px solid hwb(214 0% 75%);
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.nav-btn:hover {
  background: #f0f0f0;
}

.weekdays,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekday {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
  padding: 5px;
}

.calendar-day {
  position: relative;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.calendar-day:hover {
  transform: scale(1.02);
}

.current-month {
  background: #f8f9fa;
  color: #2c3e50;
}

.calendar-day:not(.current-month) {
  color: #bdc3c7;
}

.selected {
  background: #3498db !important;
  color: #fff !important;
}

.event-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #a2d5a2;
  color: #fff;
  font-size: 0.6rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.events-sidebar {
  border-left: 1px solid #eee;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.selected-date {
  margin-bottom: 20px;
}

.day-name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
}

.full-date {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.events-list {
  height: 300px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: #fafafa;
  transition: background 0.2s, transform 0.2s;
}

.event-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.event-item.collapsed {
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.event-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 4px;
  padding-right: 8px;
  overflow: hidden;
}

.title-text {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-text.collapsed {
  text-decoration: line-through;
  color: #777;
}

.event-description {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.event-extra {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.timeline-label {
  margin-top: 2px;
}

.event-actions {
  display: flex;
  gap: 10px;
}

.edit-event-btn,
.delete-event-btn,
.complete-event-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.edit-event-btn:hover {
  color: #011d41;
}

.delete-event-btn:hover {
  color: #ff4040;
}

.add-event-btn {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-event-btn:hover {
  background: #2980b9;
}

.task-chart-section {
  margin: 20px auto;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  height: 350px;
}

.task-chart-section canvas {
  max-width: 300px;
  max-height: 300px;
  margin: 0 auto;
  display: block;
}

.event-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content.add-event-form {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 650px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 0.95rem;
}

.tag-options {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f4f4f4;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s, background 0.2s;
}

.tag-option:hover {
  background: #e9e9e9;
}

.tag-color-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.tag-label {
  font-size: 0.85rem;
  color: #555;
}

.tag-selected-mark {
  margin-left: auto;
  color: #2c3e50;
  font-size: 0.85rem;
}

.time-group {
  display: flex;
  gap: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn {
  font-weight: 600;
}

.cancel-btn {
  background: #ddd;
  color: #333;
}

.save-btn {
  background: #3498db;
  color: #fff;
}

.save-btn:hover {
  background: #2980b9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.holding-wrapper.holding::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 0%;
  height: 100%;
  background-color: var(--event-color);
  opacity: 0.85;
  animation: slideIn 0.5s forwards;
  z-index: 1;
  border-radius: 5px;
}

@keyframes slideIn {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

.completed-icon,
.closed-icon {
  margin-left: 8px;
  font-size: 16px;
  flex-shrink: 0;
}

.completed-icon {
  color: #28a745;
}

.closed-icon {
  color: #ff4040;
}

.title-text,
.event-description,
.objective-text {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-status-icons {
  display: flex;
  align-items: center;
}

.delete-confirm-popup,
.event-form-modal.delete-confirm-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-confirm-popup .modal-content,
.modal-content.delete-options-modal {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.delete-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.delete-option-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  width: 100%;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background: #f8f9fa;
  transition: background 0.2s, transform 0.1s;
}

.delete-option-btn i {
  flex-shrink: 0;
}

.delete-option-btn:hover {
  background: #e2e6ea;
}

.delete-option-btn.delete-all {
  background: #e74c3c;
  color: #fff;
}

.delete-option-btn.delete-all:hover {
  background: #c0392b;
}

.modal-actions {
  justify-content: flex-end;
  display: flex;
  gap: 10px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 0;
  margin-top: 5px;
}

.styled-checkbox {
  position: relative;
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #3498db;
  border-radius: 4px;
  background: #fff;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.styled-checkbox:checked {
  background: #3498db;
}

.styled-checkbox:checked::after {
  content: "\2713";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-label {
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.styled-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
</style>