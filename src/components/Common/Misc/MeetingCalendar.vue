<template>
    <div class="main-container">
        <div class="calendar-container">
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
                        <div v-for="(day, index) in calendarDays" :key="index" :class="dayClasses(day)"
                            @click="selectDay(day)">
                            {{ formatDate(day.date) }}
                            <div v-if="hasEvents(day)" class="event-indicator">
                                <span class="event-count">{{ getEventCount(day) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <div class="day-header">
                <h2>{{ selectedDayName }}</h2>
                <div class="selected-date">{{ formattedSelectedDate }}</div>
            </div>

            <div class="events-list">
                <div v-for="(event, index) in selectedDayEvents" :key="index" class="event-item">
                    <div class="event-name">{{ event.name }}</div>
                    <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
                    <div class="event-description" v-if="event.description">{{ event.description }}</div>
                    <div class="event-actions">
                        <button class="action-btn edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>

            <div class="sidebar-actions">
                <button class="schedule-btn" @click="openScheduleForm">
                    <i class="fa-solid fa-plus"></i> Đặt lịch
                </button>
            </div>
        </div>

        <div class="modal" v-if="showScheduleModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Đặt lịch họp với cố vấn</h3>
                    <span class="close-btn" @click="closeScheduleModal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Ngày họp với cố vấn</label>
                        <div class="selected-date-display">{{ formattedSelectedDate }}</div>
                    </div>
                    <div class="form-group">
                        <label>Giờ bắt đầu</label>
                        <input type="time" v-model="scheduleForm.startTime" class="time-input">
                    </div>
                    <div class="form-group">
                        <label>Thời gian họp</label>
                        <div class="duration-options">
                            <button v-for="duration in durations" :key="duration.value"
                                @click="selectDuration(duration.value)"
                                :class="['duration-btn', scheduleForm.duration === duration.value ? 'active' : '']">
                                {{ duration.label }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="closeScheduleModal">Hủy bỏ</button>
                    <button class="save-btn" @click="showSaveConfirm"
                        :disabled="!scheduleForm.startTime || !scheduleForm.duration">Lưu lại</button>
                </div>
            </div>
        </div>

        <SaveConfirmPopUp :message="'Bạn có chắc chắn muốn đặt lịch họp với cố vấn không?'"
            :isVisible="showSaveConfirmation" @confirmSave="handleSaveConfirmation"
            @update:isVisible="val => showSaveConfirmation = val" />
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
    isSameDay as dfIsSameDay,
    isSameMonth,
    format
} from "date-fns";
import SaveConfirmPopUp from "../Popup/SaveConfirmPopUp.vue";

export default {
    name: "Calendar",
    components: {
        SaveConfirmPopUp
    },
    props: {
        initialDate: { type: Date, default: () => new Date() }
    },
    data() {
        return {
            currentDate: this.initialDate,
            selectedDate: this.initialDate,
            events: [],
            showScheduleModal: false,
            showSaveConfirmation: false,
            scheduleForm: {
                startTime: "09:00",
                duration: 30
            },
            durations: [
                { value: 15, label: "15 phút" },
                { value: 30, label: "30 phút" },
                { value: 45, label: "45 phút" },
                { value: 60, label: "1 giờ" }
            ]
        };
    },
    computed: {
        daysOfWeek() { return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]; },
        currentMonth() { return format(this.currentDate, "MMMM"); },
        currentYear() { return format(this.currentDate, "yyyy"); },
        formattedSelectedDate() { return format(this.selectedDate, "dd/MM/yyyy"); },
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
        selectedDayName() { return format(this.selectedDate, "EEEE"); },
        selectedDayEvents() { return this.events.filter(event => dfIsSameDay(event.date, this.selectedDate)); }
    },
    methods: {
        dayClasses(day) {
            return {
                "calendar-day": true,
                "current-month": day.isCurrentMonth,
                "other-month": !day.isCurrentMonth,
                "selected": dfIsSameDay(day.date, this.selectedDate),
                "has-events": this.hasEvents(day)
            };
        },
        formatDate(date) { return format(date, "dd"); },
        prevMonth() { this.currentDate = subMonths(this.currentDate, 1); this.$emit('month-changed', this.currentDate); },
        nextMonth() { this.currentDate = addMonths(this.currentDate, 1); this.$emit('month-changed', this.currentDate); },
        selectDay(day) { this.selectedDate = day.date; this.$emit('date-selected', this.selectedDate); },
        hasEvents(day) { return this.events.some(event => dfIsSameDay(event.date, day.date)); },
        getEventCount(day) { return this.events.filter(event => dfIsSameDay(event.date, day.date)).length; },
        openScheduleForm() { this.showScheduleModal = true; },
        closeScheduleModal() { this.showScheduleModal = false; },
        selectDuration(duration) { this.scheduleForm.duration = duration; },
        showSaveConfirm() { this.showSaveConfirmation = true; },
        handleSaveConfirmation(confirmed) {
            if (confirmed) {
                this.saveSchedule();
                this.showSaveConfirmation = false;
            }
        },
        saveSchedule() {
            const startTime = this.scheduleForm.startTime;
            const durationMinutes = this.scheduleForm.duration;

            const [hours, minutes] = startTime.split(':').map(Number);
            let endHours = hours + Math.floor((minutes + durationMinutes) / 60);
            let endMinutes = (minutes + durationMinutes) % 60;

            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

            const newEvent = {
                name: "Họp với cố vấn",
                date: this.selectedDate,
                startTime: startTime,
                endTime: endTime,
                description: `Thời gian họp: ${durationMinutes} phút`
            };

            this.events.push(newEvent);
            this.closeScheduleModal();
        }
    }
};
</script>

<style scoped>
.main-container {
    display: flex;
    min-height: 450px;
    margin: 10px auto;
}

.calendar-container {
    flex: 1;
    ;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
}

.calendar-wrapper {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.calendar {
    flex: 1;
    display: flex;
    flex-direction: column;
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

.month-year {
    font-size: 1.2rem;
    font-weight: 500;
}

.nav-btn {
    background: none;
    border: 1px solid #3b82f6;
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

.weekdays {
    margin-bottom: 5px;
}

.days-grid {
    flex: 1;
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

.other-month {
    color: #bdc3c7;
    background: #f1f1f1;
}

.selected {
    background: #3b82f6 !important;
    color: #fff !important;
}

.event-indicator {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background-color: #4caf50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.event-count {
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
}

.sidebar {
    width: 300px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: auto;
}

.day-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
}

.day-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #2c3e50;
}

.selected-date {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-top: 5px;
}

.events-list {
    flex: 1;
    overflow-y: auto;
}

.event-item {
    background: #f8f9fa;
    border-left: 4px solid #3b82f6;
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    position: relative;
}

.event-name {
    font-weight: 500;
    margin-bottom: 5px;
}

.event-time {
    font-size: 0.8rem;
    color: #7f8c8d;
}

.event-description {
    margin-top: 5px;
    font-size: 0.9rem;
}

.event-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #7f8c8d;
    padding: 2px;
    border-radius: 3px;
}

.action-btn:hover {
    color: #2c3e50;
    background: #eaeaea;
}

.sidebar-actions {
    margin-top: auto;
}

.schedule-btn {
    width: 100%;
    padding: 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.schedule-btn:hover {
    background: #2563eb;
}

.schedule-btn i {
    font-size: 0.9rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 450px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #2c3e50;
}

.close-btn {
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
}

.selected-date-display {
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 5px;
    border: 1px solid #eaeaea;
}

.time-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    font-size: 1rem;
}

.duration-options {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.duration-btn {
    padding: 8px 12px;
    border: 1px solid #3b82f6;
    background: white;
    border-radius: 5px;
    cursor: pointer;
    flex-grow: 1;
    text-align: center;
    transition: all 0.2s;
}

.duration-btn:hover {
    background-color: #f0f7ff;
}

.duration-btn.active {
    background-color: #3b82f6;
    color: white;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eaeaea;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-btn {
    padding: 10px 20px;
    border: 1px solid #eaeaea;
    background: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
}

.cancel-btn:hover {
    background-color: #f8f9fa;
}

.save-btn {
    padding: 10px 20px;
    border: none;
    background-color: #3b82f6;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
}

.save-btn:hover {
    background-color: #2563eb;
}
</style>