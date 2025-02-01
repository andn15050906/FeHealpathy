<template>
  <div class="container">
    <div class="calendar-wrapper">
      <div class="calendar">
        <div class="header">
          <button class="nav-btn" @click="prevMonth"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="month-year">{{ currentMonth }} {{ currentYear }}</div>
          <button class="nav-btn" @click="nextMonth"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="days-grid">
          <div v-for="(day, index) in calendarDays" :key="index" :class="dayClasses(day)" @click="selectDay(day)">
            {{ formatDate(day.date) }}
          </div>
        </div>
      </div>
      <div class="events-sidebar">
        <div class="selected-date">
          <div class="day-name">{{ selectedDayName }}</div>
          <div class="full-date">{{ formattedSelectedDate }}</div>
        </div>
        <div class="events-list">
          <div v-if="currentEvents.length === 0" class="no-events">No events for this day</div>
          <div v-else v-for="(event, idx) in currentEvents" :key="idx" class="event-item">
            <div class="event-info">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-description">{{ event.description }}</div>
            </div>
            <div class="event-actions">
              <button class="delete-event-btn" @click="deleteEvent(event)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <button class="add-event-btn" @click="showEventForm = true">
          <i class="fa-solid fa-plus"></i> Add Event
        </button>
      </div>
    </div>
    <div v-if="showEventForm" class="event-form-modal">
      <div class="modal-content">
        <h3>New Event</h3>
        <input v-model="newEvent.title" placeholder="Event title" class="form-input" />
        <textarea v-model="newEvent.description" placeholder="Description" class="form-input"></textarea>
        <input v-model="newEvent.objective" placeholder="Objective" class="form-input" />
        <select v-model="newEvent.frequency" class="form-input">
          <option value="Daily">Daily</option>
          <option value="EveryMonday">Every Monday</option>
          <option value="EveryTuesday">Every Tuesday</option>
          <option value="EveryWednesday">Every Wednesday</option>
          <option value="EveryThursday">Every Thursday</option>
          <option value="EveryFriday">Every Friday</option>
          <option value="EverySaturday">Every Saturday</option>
          <option value="EverySunday">Every Sunday</option>
        </select>
        <div class="modal-actions">
          <button @click="cancelEvent">Cancel</button>
          <button class="btn btn-success" @click="saveEvent">Save</button>
        </div>
      </div>
    </div>
    <div v-if="showDeleteForm" class="delete-modal">
      <div class="modal-content">
        <h3>Delete Event</h3>
        <p>Are you sure you want to delete the event "{{ eventToDelete.title }}"?</p>
        <div class="modal-actions">
          <button @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";

export default {
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    initialDate: {
      type: Date,
      default: () => new Date(),
    },
    eventDotColor: {
      type: String,
      default: "#e74c3c",
    },
  },
  data() {
    return {
      currentDate: this.initialDate,
      selectedDate: this.initialDate,
      newEvent: { title: "", description: "", objective: "", frequency: "Daily" },
      eventToDelete: null,
      showEventForm: false,
      showDeleteForm: false,
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
        days.push({ date: day, isCurrentMonth: isSameMonth(day, this.currentDate) });
        day = addDays(day, 1);
      }
      return days;
    },
    selectedDayName() {
      return format(this.selectedDate, "EEEE");
    },
    currentEvents() {
      return this.events.filter((event) => {
        if (!event) return false;
        const eventDate = event.creationTime
          ? new Date(event.creationTime)
          : event.date
            ? new Date(event.date)
            : null;
        if (!eventDate) return false;
        return isSameDay(eventDate, this.selectedDate);
      });
    },
  },
  methods: {
    dayClasses(day) {
      return {
        "calendar-day": true,
        "current-month": day.isCurrentMonth,
        "selected": isSameDay(day.date, this.selectedDate),
        "has-event": this.hasEvents(day),
      };
    },
    hasEvents(day) {
      return this.events.some((event) => {
        if (!event) return false;
        const eventDate = event.creationTime
          ? new Date(event.creationTime)
          : event.date
            ? new Date(event.date)
            : null;
        if (!eventDate) return false;
        return isSameDay(eventDate, day.date);
      });
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
    saveEvent() {
      if (!this.newEvent.title) return;
      const eventPayload = {
        title: this.newEvent.title,
        description: this.newEvent.description,
        objective: this.newEvent.objective,
        frequency: this.newEvent.frequency,
        date: this.selectedDate,
      };
      this.$emit("save-event", eventPayload);
      this.cancelEvent();
    },
    cancelEvent() {
      this.showEventForm = false;
      this.newEvent = { title: "", description: "", objective: "", frequency: "Daily" };
    },
    deleteEvent(event) {
      this.eventToDelete = event;
      this.showDeleteForm = true;
    },
    confirmDelete() {
      this.$emit("delete-event", this.eventToDelete);
      this.showDeleteForm = false;
      this.eventToDelete = null;
    },
    cancelDelete() {
      this.eventToDelete = null;
      this.showDeleteForm = false;
    },
  },
};
</script>

<style scoped>
.container {
  margin: 20px auto;
}

.calendar-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  background: white;
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
  border: 1px solid #ddd;
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
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
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
  color: white !important;
}

.has-event::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #e74c3c;
  border-radius: 50%;
}

.events-sidebar {
  border-left: 1px solid #eee;
  padding-left: 20px;
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
  padding: 10px;
  margin: 8px 0;
  background: #f8f9fa;
  border-radius: 6px;
  transition: 0.2s;
}

.event-item:hover {
  background: #f0f0f0;
}

.event-info {
  flex: 4;
  display: flex;
  flex-direction: column;
}

.event-actions {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-event-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: red;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  transition: 0.2s;
}

.add-event-btn:hover {
  background: #2980b9;
}

.event-form-modal,
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: whitesmoke;
  padding: 25px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.modal-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>