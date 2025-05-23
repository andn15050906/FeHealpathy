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
                <div v-if="selectedDayEvents.length === 0" class="no-events">
                    Không có lịch tư vấn nào trong ngày này
                </div>
                <div v-for="(event, index) in selectedDayEvents" :key="index" class="event-item">
                    <div class="event-name">{{ event.name }}</div>
                    <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
                    <div class="event-description" v-if="event.description">{{ event.description }}</div>
                    <div class="event-actions" v-if="isUserEvent(event)">
                        <button class="action-btn cancel" @click="confirmDeleteEvent(index)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="sidebar-actions">
                <button class="schedule-btn" @click="openScheduleForm"
                    :disabled="userHasBookingOnSelectedDay || isPastDate"
                    :style="(userHasBookingOnSelectedDay || isPastDate) ? 'background-color: #cccccc; cursor: not-allowed;' : ''">
                    <i class="fa-solid fa-plus"></i> Đặt lịch tư vấn
                </button>
            </div>
        </div>

        <div class="modal" v-if="showScheduleModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Đặt lịch tư vấn với cố vấn</h3>
                    <span class="close-btn" @click="closeScheduleModal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Ngày tư vấn với cố vấn</label>
                        <div class="selected-date-display">{{ formattedSelectedDate }}</div>
                    </div>
                    <div class="form-group">
                        <label>Chọn khung giờ tư vấn</label>
                        <div class="time-slots">
                            <div v-for="(slot, index) in availableTimeSlots" :key="index" class="time-slot-item" :class="{
                                'selected': scheduleForm.selectedSlot === index,
                                'disabled': isTimeSlotBooked(slot)
                            }" @click="isTimeSlotBooked(slot) ? null : selectTimeSlot(index)">
                                <div class="slot-checkbox">
                                    <i class="fa-solid"
                                        :class="scheduleForm.selectedSlot === index ? 'fa-check-circle' : 'fa-circle'"></i>
                                </div>
                                <div class="slot-time">
                                    Slot {{ index + 1 }}: {{ slot.startTime }} - {{ slot.endTime }}
                                    <span v-if="isTimeSlotBooked(slot)" class="booked-indicator">(đã đặt)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Ghi chú</label>
                        <textarea v-model="scheduleForm.notes" rows="3" class="form-control"
                            placeholder="Nhập ghi chú..." />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" @click="closeScheduleModal">Hủy bỏ</button>
                    <button class="save-btn" @click="confirmSave" :disabled="scheduleForm.selectedSlot === null">
                        Lưu lại
                    </button>
                </div>
            </div>
        </div>

        <SaveConfirmPopUp :message="'Bạn có chắc chắn muốn đặt lịch tư vấn với cố vấn không?'"
            :isVisible="showSaveConfirmation" @confirmSave="handleSaveConfirmation"
            @update:isVisible="val => showSaveConfirmation = val" />

        <DeleteConfirmPopup :message="'Bạn có chắc chắn muốn huỷ cuộc hẹn tư vấn này không?'"
            :isVisible="showDeleteConfirmation" @confirmDelete="handleDeleteConfirmation"
            @update:isVisible="val => showDeleteConfirmation = val" />
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
    format,
    isBefore,
    startOfDay,
    parseISO
} from "date-fns";
import SaveConfirmPopUp from "../Popup/SaveConfirmPopUp.vue";
import DeleteConfirmPopup from "../Popup/DeleteConfirmPopup.vue";
import { createMeeting, deleteMeeting, getMeetings } from "../../../scripts/api/services/meetingService.js";
import { getUserProfile } from '../../../scripts/api/services/authService.js';
import { toast } from 'vue3-toastify';

export default {
    name: "MeetingCalendar",
    components: { SaveConfirmPopUp, DeleteConfirmPopup },
    props: {
        initialDate: { type: Date, default: () => new Date() },
        advisorId: { type: String, required: true }
    },
    data() {
        return {
            currentDate: this.initialDate,
            selectedDate: this.initialDate,
            events: [],
            showScheduleModal: false,
            showSaveConfirmation: false,
            showDeleteConfirmation: false,
            eventToDeleteIndex: null,
            scheduleForm: {
                selectedSlot: null,
                notes: ''
            },
            availableTimeSlots: [
                { startTime: "07:00", endTime: "08:00" },
                { startTime: "08:00", endTime: "09:00" },
                { startTime: "09:00", endTime: "10:00" },
                { startTime: "10:00", endTime: "11:00" },
                { startTime: "11:00", endTime: "12:00" },
                { startTime: "13:00", endTime: "14:00" },
                { startTime: "14:00", endTime: "15:00" },
                { startTime: "15:00", endTime: "16:00" },
                { startTime: "16:00", endTime: "17:00" },
                { startTime: "17:00", endTime: "18:00" },
                { startTime: "20:00", endTime: "21:00" },
                { startTime: "21:00", endTime: "22:00" },
            ],
            currentUserId: null,
            today: startOfDay(new Date())
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
        selectedDayEvents() {
            return this.events.filter(event => dfIsSameDay(new Date(event.date), this.selectedDate));
        },
        userHasBookingOnSelectedDay() {
            if (!this.currentUserId) return false;

            const dateStr = format(this.selectedDate, "yyyy-MM-dd");

            return this.events.some(event => {
                if (event.date !== dateStr) return false;

                return event.participants &&
                    event.participants.some(p =>
                        p.userId === this.currentUserId && !p.isHost
                    );
            });
        },
        isPastDate() {
            return isBefore(this.selectedDate, this.today);
        }
    },
    watch: {
        advisorId: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.fetchMeetings();
                }
            }
        }
    },
    async mounted() {
        await this.getCurrentUser();
        await this.fetchMeetings();
    },
    methods: {
        async getCurrentUser() {
            try {
                const userProfile = await getUserProfile();
                this.currentUserId = userProfile.id;
            } catch (error) {
                console.error("Failed to get user profile:", error);
                this.currentUserId = null;
            }
        },
        dayClasses(day) {
            return {
                "calendar-day": true,
                "current-month": day.isCurrentMonth,
                "other-month": !day.isCurrentMonth,
                "selected": dfIsSameDay(day.date, this.selectedDate),
                "has-events": this.hasEvents(day),
                "past-date": isBefore(day.date, this.today)
            };
        },
        formatDate(date) { return format(date, "dd"); },
        prevMonth() {
            this.currentDate = subMonths(this.currentDate, 1);
            this.$emit('month-changed', this.currentDate);
            this.fetchMeetings();
        },
        nextMonth() {
            this.currentDate = addMonths(this.currentDate, 1);
            this.$emit('month-changed', this.currentDate);
            this.fetchMeetings();
        },
        selectDay(day) {
            this.selectedDate = day.date;
            this.$emit('date-selected', this.selectedDate);
        },
        hasEvents(day) {
            return this.events.some(event => dfIsSameDay(new Date(event.date), day.date));
        },
        getEventCount(day) {
            return this.events.filter(event => dfIsSameDay(new Date(event.date), day.date)).length;
        },
        isTimeSlotBooked(slot) {
            const dateStr = format(this.selectedDate, "yyyy-MM-dd");
            const slotStartTime = `${dateStr}T${slot.startTime}:00`;
            const slotEndTime = `${dateStr}T${slot.endTime}:00`;
            const slotStart = new Date(slotStartTime);
            const slotEnd = new Date(slotEndTime);

            return this.selectedDayEvents.some(event => {
                const eventStart = event.rawStartAt;
                const eventEnd = event.rawEndAt;

                return (
                    (eventStart <= slotStart && eventEnd > slotStart) ||
                    (eventStart >= slotStart && eventStart < slotEnd)
                );
            });
        },
        isUserEvent(event) {
            if (!this.currentUserId) return false;

            return event.participants &&
                event.participants.some(p =>
                    p.userId === this.currentUserId && !p.isHost
                );
        },
        openScheduleForm() {
            if (this.isPastDate) return;
            if (this.userHasBookingOnSelectedDay) {
                toast.error("Bạn đã đặt lịch tư vấn trong ngày này rồi", {
                    timeout: 1500,
                    closeButton: true
                });
                return;
            }

            this.scheduleForm.selectedSlot = null;
            this.showScheduleModal = true;
        },
        closeScheduleModal() {
            this.showScheduleModal = false;
            this.scheduleForm.notes = '';
            this.scheduleForm.selectedSlot = null;
        },
        selectTimeSlot(index) {
            const slot = this.availableTimeSlots[index];
            if (!this.isTimeSlotBooked(slot)) {
                this.scheduleForm.selectedSlot = index;
            }
        },
        confirmSave() { this.showSaveConfirmation = true; },
        async handleSaveConfirmation(confirmed) {
            if (confirmed) {
                await this.saveSchedule();
            }
            this.showSaveConfirmation = false;
        },
        async saveSchedule() {
            if (this.scheduleForm.selectedSlot !== null) {
                const selectedSlot = this.availableTimeSlots[this.scheduleForm.selectedSlot];

                if (this.isTimeSlotBooked(selectedSlot)) {
                    toast.error("Khung giờ này đã được đặt, vui lòng chọn khung giờ khác", {
                        timeout: 1500,
                        closeButton: true
                    });
                    return;
                }

                if (this.userHasBookingOnSelectedDay) {
                    toast.error("Bạn đã đặt lịch tư vấn trong ngày này rồi", {
                        timeout: 1500,
                        closeButton: true
                    });
                    this.closeScheduleModal();
                    return;
                }

                const dateStr = format(this.selectedDate, "yyyy-MM-dd");
                const startTimeStr = `${dateStr}T${selectedSlot.startTime}:00`;
                const startAt = new Date(startTimeStr);
                const endTimeStr = `${dateStr}T${selectedSlot.endTime}:00`;
                const endAt = new Date(endTimeStr);

                try {
                    const participants = [
                        {
                            userId: this.currentUserId,
                            isHost: false
                        },
                        {
                            userId: this.advisorId,
                            isHost: true
                        }
                    ];

                    const meetingData = {
                        title: `Tư vấn với cố vấn - Slot ${this.scheduleForm.selectedSlot + 1}`,
                        startAt: startTimeStr,
                        endAt: endTimeStr,
                        maxParticipants: 2,
                        participants: participants,
                        description: this.scheduleForm.notes || `Thời gian tư vấn 1 giờ`
                    };

                    const response = await createMeeting(meetingData);

                    const newEvent = {
                        id: response.id,
                        name: meetingData.title,
                        date: dateStr,
                        startTime: selectedSlot.startTime,
                        endTime: selectedSlot.endTime,
                        description: meetingData.description,
                        rawStartAt: startAt,
                        rawEndAt: endAt,
                        participants: participants
                    };

                    this.events.push(newEvent);

                    toast.success("Đặt lịch tư vấn thành công", {
                        timeout: 500,
                        closeButton: false,
                        hideProgressBar: true
                    });

                    this.closeScheduleModal();
                } catch (error) {
                }
            }
        },
        confirmDeleteEvent(index) {
            this.eventToDeleteIndex = index;
            this.showDeleteConfirmation = true;
        },
        async handleDeleteConfirmation(confirmed) {
            if (confirmed && this.eventToDeleteIndex !== null) {
                await this.deleteEvent(this.eventToDeleteIndex);
            }
            this.showDeleteConfirmation = false;
            this.eventToDeleteIndex = null;
        },
        async deleteEvent(index) {
            const eventToDelete = this.selectedDayEvents[index];

            if (!this.isUserEvent(eventToDelete)) {
                toast.error("Bạn không có quyền xóa lịch hẹn này", {
                    timeout: 1500,
                    closeButton: true
                });
                return;
            }

            const mainIndex = this.events.findIndex(event =>
                event.id === eventToDelete.id
            );

            if (mainIndex !== -1) {
                try {
                    await deleteMeeting(eventToDelete.id);
                    this.events.splice(mainIndex, 1);

                    toast.success("Huỷ lịch tư vấn thành công", {
                        timeout: 500,
                        closeButton: false,
                        hideProgressBar: true
                    });
                } catch (error) {
                    console.error("Failed to delete meeting:", error);
                }
            }
        },
        async fetchMeetings() {
            try {
                const firstDay = startOfMonth(this.currentDate);
                const lastDay = endOfMonth(this.currentDate);
                const fromDate = format(firstDay, 'yyyy-MM-dd') + 'T00:00:00';
                const toDate = format(lastDay, 'yyyy-MM-dd') + 'T23:59:59';
                const queryParams = {
                    Participants: [this.advisorId],
                    Start: fromDate,
                    End: toDate
                };

                const response = await getMeetings(queryParams);

                let meetingsData = [];
                if (response && Array.isArray(response)) {
                    meetingsData = response;
                } else if (response && response.items && Array.isArray(response.items)) {
                    meetingsData = response.items;
                }

                this.events = meetingsData.map(meeting => {
                    const startAt = new Date(meeting.startAt);
                    const endAt = new Date(meeting.endAt);

                    const participants = meeting.participants.map(p => ({
                        userId: p.creatorId,
                        isHost: p.isHost,
                        status: p.status
                    }));

                    return {
                        id: meeting.id,
                        name: meeting.title,
                        date: format(startAt, 'yyyy-MM-dd'),
                        startTime: format(startAt, 'HH:mm'),
                        endTime: format(endAt, 'HH:mm'),
                        description: meeting.description,
                        rawStartAt: startAt,
                        rawEndAt: endAt,
                        participants: participants
                    };
                });
            } catch (error) {
                console.error("Failed to fetch meetings:", error);
                this.events = [];
            }
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
    padding: 2px;
    border-radius: 3px;
}

.action-btn.cancel {
    color: #dc2626;
}

.action-btn:hover {
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

.time-slots {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.time-slot-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background-color 0.2s;
}

.time-slot-item:last-child {
    border-bottom: none;
}

.time-slot-item:hover {
    background-color: #f5f5f5;
}

.time-slot-item.selected {
    background-color: #e3f2fd;
}

.slot-checkbox {
    margin-right: 12px;
    color: #757575;
}

.time-slot-item.selected .slot-checkbox {
    color: #2196f3;
}

.slot-time {
    font-size: 14px;
}

.time-slot-item.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f0f0f0;
}

.booked-indicator {
    color: #e74c3c;
    font-style: italic;
    margin-left: 5px;
    font-size: 0.9em;
}
</style>