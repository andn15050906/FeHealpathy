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
                    <div v-for="(day, index) in calendarDays" :key="index" :class="dayClasses(day)"
                        @click="selectDay(day)">
                        {{ formatDate(day.date) }}
                    </div>
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
    isSameDay as dfIsSameDay,
    isSameMonth,
    format
} from "date-fns";

export default {
    name: "Calendar",
    props: {
        initialDate: { type: Date, default: () => new Date() }
    },
    data() {
        return {
            currentDate: this.initialDate,
            selectedDate: this.initialDate
        };
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
        }
    },
    methods: {
        dayClasses(day) {
            return {
                "calendar-day": true,
                "current-month": day.isCurrentMonth,
                selected: dfIsSameDay(day.date, this.selectedDate)
            };
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
            this.$emit('date-selected', this.selectedDate);
        }
    }
};
</script>

<style scoped>
.container {
    height: 100%;
    margin: 20px auto;
    padding: 0 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.calendar-wrapper {
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
</style>