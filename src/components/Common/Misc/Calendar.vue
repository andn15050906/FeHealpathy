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
      <!-- Events Sidebar -->
      <div class="events-sidebar">
        <div class="selected-date">
          <div class="day-name">{{ selectedDayName }}</div>
          <div class="full-date">{{ formattedSelectedDate }}</div>
        </div>
        <transition name="fade">
          <div class="events-list" key="eventList">
            <div v-if="currentEvents.length === 0" class="no-events">
              No events for this day
            </div>
            <div v-else v-for="(event, idx) in currentEvents" :key="event.id || idx"
              class="event-item holding-wrapper mt-1"
              :class="{ collapsed: event.completed || event.closed, holding: event.holding }"
              :style="[{ borderLeft: '4px solid ' + (event.completed || event.closed ? '#bbb' : event.tag) }, { '--event-color': event.tag }]"
              @mousedown="startHold(event)" @mouseup="cancelHold" @mouseleave="cancelHold">
              <div class="event-info">
                <div class="event-title" :class="{ collapsed: event.completed || event.closed }">
                  <span class="title-text" :class="{ collapsed: event.completed || event.closed }">
                    {{ event.title }}
                  </span>
                  <template v-if="event.closed">
                    <i class="fa-solid fa-ban closed-icon"></i>
                  </template>
                  <template v-else-if="event.completed">
                    <i class="fa-solid fa-check completed-icon"></i>
                  </template>
                </div>
                <template v-if="!event.completed && !event.closed">
                  <div class="event-description">
                    {{ event.description }}
                  </div>
                  <div class="event-extra" v-if="event.objective || (event.startTime && event.endTime)">
                    <div v-if="event.objective" class="objective-text">
                      <strong>Objective:</strong> {{ event.objective }}
                    </div>
                    <div v-if="event.startTime && event.endTime" class="timeline-label">
                      <strong>Timeline:</strong> {{ event.startTime }} - {{ event.endTime }}
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
        <button class="add-event-btn" @click="openNewEventForm">
          <i class="fa-solid fa-plus"></i> Add Event
        </button>
      </div>
    </div>
    <transition name="fade">
      <div class="timeline-container" v-if="sortedEventsForSelectedDay.length">
        <h3>Timeline for {{ selectedDayName }} ({{ formattedSelectedDate }})</h3>
        <ul class="timeline">
          <li v-for="(event, idx) in sortedEventsForSelectedDay" :key="event.id || idx">
            <div class="timeline-marker"></div>
            <div class="timeline-content" :class="{ completed: event.completed || event.closed }">
              <div class="timeline-time">{{ event.startTime }} - {{ event.endTime }}</div>
              <div class="timeline-title">{{ event.title }}</div>
              <div class="timeline-description">{{ event.description }}</div>
              <div v-if="event.objective" class="timeline-objective">
                <strong>Objective:</strong> {{ event.objective }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showEventForm" class="event-form-modal">
        <div class="modal-content add-event-form">
          <h3>{{ isEditing ? "Edit Event" : "New Event" }}</h3>
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" v-model="newEvent.title" class="form-input" placeholder="Enter event title" />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newEvent.description" class="form-input"
              placeholder="Enter event description"></textarea>
          </div>
          <div class="form-group">
            <label for="objective">Objective</label>
            <input id="objective" v-model="newEvent.objective" class="form-input"
              placeholder="Enter objective (optional)" />
          </div>
          <div class="form-group">
            <label>Tag</label>
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
          <div class="form-group">
            <label for="repeat">Repeat</label>
            <select id="repeat" v-model="newEvent.repeat" class="form-input">
              <option value="none">None</option>
              <option value="weekday">Weekday (Mon-Fri)</option>
              <option value="allMonth">All Month</option>
              <option value="weekends">Weekends (Sat, Sun)</option>
            </select>
          </div>
          <div class="form-group time-group">
            <div>
              <label for="startTime">Start Time</label>
              <input id="startTime" type="time" v-model="newEvent.startTime" class="form-input" />
            </div>
            <div>
              <label for="endTime">End Time</label>
              <input id="endTime" type="time" v-model="newEvent.endTime" class="form-input" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn cancel-btn" @click="cancelEvent">Cancel</button>
            <button class="btn save-btn" @click="saveEvent">Save</button>
          </div>
        </div>
      </div>
    </transition>
    <DeleteConfirmPopup :message="`Are you sure you want to delete the event '${eventToDelete?.title}'?`"
      :isVisible="showDeletePopup" @confirmDelete="handleDeleteConfirm" @update:isVisible="showDeletePopup = false" />
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
  format
} from "date-fns";
import DeleteConfirmPopup from "../Popup/DeleteConfirmPopup.vue";

const delayMapping = {
  "#e74c3c": 2,
  "#e67e22": 5,
  "#f1c40f": 10,
  "#3498db": 20,
  "#2ecc71": 30
};

function getDeadline(event) {
  if (!event.date || !event.endTime) return new Date();
  const additional = Number(event.additionalTime) || 0;
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.endTime.split(":").map(Number);
  let deadline = new Date(year, month - 1, day, hour, minute, 0, 0);
  deadline.setMinutes(deadline.getMinutes() + additional);
  return deadline;
}

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
        endTime
      },
      eventToDelete: null,
      showEventForm: false,
      showDeletePopup: false,
      isEditing: false,
      tagPresets: [
        { color: "#2ecc71", label: "Low" },
        { color: "#3498db", label: "Medium" },
        { color: "#f1c40f", label: "Moderate" },
        { color: "#e67e22", label: "High" },
        { color: "#e74c3c", label: "Critical" }
      ],
      holdTimer: null
    };
  },
  computed: {
    daysOfWeek() {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
        const eventDate = e.creationTime ? new Date(e.creationTime) : e.date ? new Date(e.date) : null;
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
    }
  },
  mounted() {
    setInterval(() => {
      const now = new Date();
      this.localEvents.forEach(event => {
        if (!event.completed && !event.closed && event.date && event.endTime && event.additionalTime != null) {
          const deadline = getDeadline(event);
          if (now > deadline) {
            event.closed = true;
            toast.error("Event closed due to deadline!", {
              duration: 150,
              position: "bottom-center"
            });
          }
        }
      });
    }, 30000);
  },
  methods: {
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
        const eventDate = e.creationTime ? new Date(e.creationTime) : e.date ? new Date(e.date) : null;
        if (!eventDate) return false;
        return dfIsSameDay(eventDate, day.date);
      });
    },
    getEventCount(day) {
      return this.localEvents.filter(e => {
        if (!e) return false;
        const eventDate = e.creationTime ? new Date(e.creationTime) : e.date ? new Date(e.date) : null;
        if (!eventDate) return false;
        return dfIsSameDay(eventDate, day.date);
      }).length;
    },
    formatDate(date) {
      return format(date, "dd");
    },
    prevMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    selectDay(day) {
      this.selectedDate = day.date;
    },
    openNewEventForm() {
      this.isEditing = false;
      this.showEventForm = true;
    },
    editEvent(event) {
      this.isEditing = true;
      this.newEvent = { ...event };
      this.showEventForm = true;
    },
    saveEvent() {
      if (!this.newEvent.title) return;
      if (this.newEvent.repeat === "none") {
        if (this.isEditing) {
          const index = this.localEvents.findIndex(e => e.id === this.newEvent.id);
          if (index !== -1) {
            this.localEvents.splice(index, 1, { ...this.newEvent, date: this.selectedDate });
          }
        } else {
          const newId = Date.now();
          const newEvent = { ...this.newEvent, id: newId, date: this.selectedDate };
          const exists = this.localEvents.some(e =>
            dfIsSameDay(new Date(e.date), this.selectedDate) &&
            e.title === newEvent.title &&
            e.startTime === newEvent.startTime
          );
          if (!exists) {
            this.localEvents.push(newEvent);
          }
        }
      } else {
        const monthStart = startOfMonth(this.currentDate);
        const monthEnd = endOfMonth(this.currentDate);
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const day = new Date(d);
          if (this.newEvent.repeat === "weekday") {
            if (day.getDay() === 0 || day.getDay() === 6) continue;
          } else if (this.newEvent.repeat === "weekends") {
            if (day.getDay() !== 0 && day.getDay() !== 6) continue;
          }
          const exists = this.localEvents.some(e =>
            dfIsSameDay(new Date(e.date), day) &&
            e.title === this.newEvent.title &&
            e.startTime === this.newEvent.startTime
          );
          if (!exists) {
            const newId = Date.now() + day.getDate();
            const newEvent = { ...this.newEvent, id: newId, date: new Date(day) };
            this.localEvents.push(newEvent);
          }
        }
      }
      this.cancelEvent();
    },
    cancelEvent() {
      this.showEventForm = false;
      this.isEditing = false;
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
        endTime
      };
    },
    confirmDeleteEvent(e) {
      this.eventToDelete = e;
      this.showDeletePopup = true;
    },
    handleDeleteConfirm(c) {
      if (c) {
        this.localEvents = this.localEvents.filter(e => e.id !== this.eventToDelete.id);
      }
      this.showDeletePopup = false;
      this.eventToDelete = null;
    },
    startHold(event) {
      if (event.closed) return;
      this.holdTimer = setTimeout(() => {
        const wasCompleted = event.completed;
        this.toggleComplete(event);
        toast.success(
          wasCompleted ? "Event marked as undone!" : "Event marked as done!",
          { duration: 1000, position: "bottom-center" }
        );
      }, 500);
      event.holding = true;
    },
    cancelHold() {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
      this.currentEvents.forEach(e => (e.holding = false));
    },
    toggleComplete(event) {
      event.completed = !event.completed;
      event.holding = false;
    }
  }
};
</script>

<style scoped>
/* Container & Layout */
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

/* Calendar */
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

/* Events Sidebar */
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

/* Event Item */
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

/* Timeline */
.timeline-container {
  margin: 20px auto;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-container h3 {
  margin-bottom: 15px;
  text-align: center;
}

.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline li {
  display: flex;
  position: relative;
  padding-left: 30px;
  margin-bottom: 15px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 5px;
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
}

.timeline-content {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
}

.timeline-time {
  font-weight: bold;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.timeline-description {
  font-size: 0.9rem;
  color: #555;
}

.timeline-objective {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 4px;
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
  max-width: 500px;
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
</style>