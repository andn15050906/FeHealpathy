<template>
  <div id="app" class="container mt-5">
    <h1 class="text-center mb-4">Habit Tracker</h1>
    <div class="month-controls mb-4 text-center">
      <span @click="previousMonth" class="icon-clickable">
        <i class="fas fa-chevron-left"></i>
      </span>
      <span class="mx-3">{{ currentMonthYear }}</span>
      <span @click="nextMonth" class="icon-clickable">
        <i class="fas fa-chevron-right"></i>
      </span>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered habit-table">
        <thead class="thead-light">
          <tr>
            <th class="habit-column" rowspan="2">Habits</th>
            <th v-for="day in firstHalfDays" :key="day" class="day-column">{{ day }}</th>
            <th class="goal-column" rowspan="2">Goal</th>
            <th class="achieved-column" rowspan="2">Achieved</th>
          </tr>
          <tr v-if="daysOfMonth.length > 16">
            <th v-for="day in secondHalfDays" :key="day" class="day-column">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(habit, habitIndex) in habits" :key="habitIndex">
            <tr>
              <td class="habit-column" rowspan="2">{{ habit.name }}</td>
              <td v-for="(date, dateIndex) in firstHalfDays" :key="dateIndex"
                :class="{ completed: habit.completedDates.includes(date), 'past-date': isPastDate(date), 'future-date': isFutureDate(date) }"
                @click="toggleCompletion(habit, date)" class="day-column">
              </td>
              <td class="goal-column" rowspan="2">{{ habit.goal }}</td>
              <td class="achieved-column" rowspan="2">{{ habit.completedDates.length }}</td>
            </tr>
            <tr>
              <td v-for="(date, dateIndex) in secondHalfDays" :key="dateIndex"
                :class="{ completed: habit.completedDates.includes(date), 'past-date': isPastDate(date), 'future-date': isFutureDate(date) }"
                @click="toggleCompletion(habit, date)" class="day-column">
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="controls mt-4 text-left">
      <span @click="showAddHabitForm = true" class="icon-clickable border p-2">
        <i class="fas fa-plus"></i> Add new habit
      </span>
    </div>

    <transition name="fade">
      <div v-if="showAddHabitForm" class="add-habit-form mt-4 p-4 border rounded bg-light">
        <h3 class="mb-3">Add New Habit</h3>
        <div class="mb-3">
          <label for="habitName" class="form-label">Habit Name</label>
          <input type="text" class="form-control" id="habitName" v-model="newHabitName">
        </div>
        <div class="mb-3">
          <label for="habitGoal" class="form-label">Goal</label>
          <input type="number" class="form-control" id="habitGoal" v-model="newHabitGoal" :max="remainingDaysInMonth">
          <small class="form-text text-muted">Max goal of this month: {{ remainingDaysInMonth }}</small>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="showAddHabitForm = false">Cancel</button>
          <button class="btn btn-primary" @click="addNewHabit">Add Habit</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';

export default {
  name: 'HabitTracker',
  setup() {
    const habits = reactive([{ name: 'Example Habit', completedDates: [], goal: 1 }]);
    const today = new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear = ref(today.getFullYear());

    const daysOfMonth = computed(() => {
      const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    });

    const firstHalfDays = computed(() => daysOfMonth.value.slice(0, 16));
    const secondHalfDays = computed(() => daysOfMonth.value.slice(16));

    const currentMonthYear = computed(() => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[currentMonth.value]} ${currentYear.value}`;
    });

    const remainingDaysInMonth = computed(() => {
      const todayDate = today.getDate();
      return daysOfMonth.value.length - todayDate + 1;
    });

    const showAddHabitForm = ref(false);
    const newHabitName = ref('');
    const newHabitGoal = ref(1);

    const addNewHabit = () => {
      if (newHabitName.value && !isNaN(newHabitGoal.value) && newHabitGoal.value <= remainingDaysInMonth.value) {
        habits.push({ name: newHabitName.value, completedDates: [], goal: newHabitGoal.value });
        newHabitName.value = '';
        newHabitGoal.value = 1;
        showAddHabitForm.value = false;
      }
    };

    const toggleCompletion = (habit, date) => {
      if (!isPastDate(date) && !isFutureDate(date)) {
        const index = habit.completedDates.indexOf(date);
        if (index > -1) {
          habit.completedDates.splice(index, 1);
        } else {
          habit.completedDates.push(date);
        }
      }
    };

    const previousMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
      } else {
        currentMonth.value -= 1;
      }
      renewHabitsForNewMonth();
    };

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
      } else {
        currentMonth.value += 1;
      }
      renewHabitsForNewMonth();
    };

    const renewHabitsForNewMonth = () => {
      habits.forEach(habit => {
        habit.completedDates = habit.completedDates.filter(date => date <= daysOfMonth.value.length);
      });
    };

    const isPastDate = date => {
      const currentDate = new Date(currentYear.value, currentMonth.value, date);
      return currentDate < today.setHours(0, 0, 0, 0);
    };

    const isFutureDate = date => {
      const currentDate = new Date(currentYear.value, currentMonth.value, date);
      return currentDate > today.setHours(0, 0, 0, 0);
    };

    return {
      habits,
      daysOfMonth,
      firstHalfDays,
      secondHalfDays,
      currentMonthYear,
      remainingDaysInMonth,
      showAddHabitForm,
      newHabitName,
      newHabitGoal,
      addNewHabit,
      toggleCompletion,
      previousMonth,
      nextMonth,
      isPastDate,
      isFutureDate,
    };
  },
};
</script>

<style scoped>
.controls {
  margin-top: 20px;
  text-align: left;
}

.icon-clickable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.month-controls {
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  width: 100%;
}

.habit-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
}

.habit-table th,
.habit-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  vertical-align: middle;
}

.habit-table th {
  background-color: #f4f4f4;
}

.habit-table .day-column {
  width: 45px;
}

.habit-table .habit-column {
  width: 150px;
  height: 60px;
}

.habit-table .goal-column,
.habit-table .achieved-column {
  width: 90px;
}

.habit-table td.completed {
  background-color: #d1ffd6;
  cursor: pointer;
}

.habit-table td.past-date {
  background-color: #ffcccc;
  cursor: not-allowed;
}

.habit-table td.future-date {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.add-habit-form {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
