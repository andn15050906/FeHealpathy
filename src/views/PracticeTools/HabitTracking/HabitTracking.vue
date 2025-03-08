<template>
  <div id="app" class="container">
    <Calendar :events="habits" :initialDate="today" eventDotColor="#e74c3c" @save-event="handleSaveHabit"
      @delete-event="handleDeleteHabit" />
    <div class="habit-stats">
      <h3>Habit Statistics for {{ formattedToday }}</h3>
      <ul>
        <li>Total habits: {{ habits.length }}</li>
        <li>Completed: {{ stats.completed }}</li>
        <li>Pending: {{ stats.pending }}</li>
        <li>Closed (missed deadline): {{ stats.closed }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Calendar from "../../../components/Common/Misc/Calendar.vue";

const sampleHabits = [];
const tags = ["#2ecc71", "#3498db", "#f1c40f", "#e67e22", "#e74c3c"];
const tagLabels = ["Low", "Medium", "Moderate", "High", "Critical"];
const additionalTimes = [2, 5, 10, 20, 30];
const repeaterCodes = Array.from({ length: 20 }, () =>
  Math.random().toString(36).substring(2, 15)
);
const now = new Date();
for (let i = 1; i <= 20; i++) {
  const startTime = new Date(now.getTime() + i * 3600000);
  const endTime = new Date(startTime.getTime() + 3600000);
  sampleHabits.push({
    id: i,
    title: `Habit ${i}`,
    description: `This is description for Habit ${i}`,
    objective: `Objective for Habit ${i}`,
    tag: tags[i % tags.length],
    additionalTime: additionalTimes[i % additionalTimes.length],
    repeatercode: repeaterCodes[i - 1],
    date: startTime.toISOString().split("T")[0],
    startTime: startTime.toTimeString().slice(0, 5),
    endTime: endTime.toTimeString().slice(0, 5),
    createdate: now.toISOString().split("T")[0],
    completed: false,
    closed: false,
    holding: false,
    creationTime: startTime.toISOString()
  });
}

export default {
  name: "HabitTracker",
  components: { Calendar },
  setup() {
    const habits = ref([...sampleHabits]);
    const today = new Date();

    const stats = computed(() => {
      const completed = habits.value.filter(h => h.completed).length;
      const closed = habits.value.filter(h => h.closed).length;
      const pending = habits.value.filter(h => !h.completed && !h.closed).length;
      return { completed, closed, pending };
    });

    const formattedToday = computed(() =>
      today.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
    );

    const handleSaveHabit = async (newHabit) => {
      if (!newHabit.title) return;
      const index = habits.value.findIndex(h => h.id === newHabit.id);
      if (index !== -1) {
        habits.value.splice(index, 1, { ...newHabit, date: newHabit.date || today.toISOString().split("T")[0] });
      } else {
        newHabit.id = Date.now();
        newHabit.date = today.toISOString().split("T")[0];
        habits.value.push(newHabit);
      }
    };

    const handleDeleteHabit = async (habitToDelete) => {
      habits.value = habits.value.filter(h => h.id !== habitToDelete.id);
    };

    return {
      habits,
      today,
      formattedToday,
      stats,
      handleSaveHabit,
      handleDeleteHabit
    };
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

.habit-stats {
  margin-top: 30px;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.habit-stats h3 {
  text-align: center;
  margin-bottom: 15px;
}

.habit-stats ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
}

.habit-stats li {
  margin-bottom: 8px;
  text-align: center;
}
</style>
