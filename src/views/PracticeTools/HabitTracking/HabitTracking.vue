<template>
  <div id="app" class="container">
    <Calendar :events="habits" :initialDate="today" @save-event="handleSaveHabit"
      @delete-event="handleDeleteHabit" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getPagedRoutines, createRoutine, updateRoutine, deleteRoutine } from "../../../scripts/api/services/routinesService";
import Calendar from "@/components/Common/Misc/Calendar.vue";

const tagMapping = {
  "#2ecc71": 0,
  "#3498db": 1,
  "#f1c40f": 2,
  "#e67e22": 3,
  "#e74c3c": 4
};

export default {
  name: "HabitTracker",
  components: { Calendar },
  setup() {
    const habits = ref([]);
    const today = new Date();
    const loadRoutines = async () => {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const response = await getPagedRoutines({
        From: firstDay.toISOString(),
        To: lastDay.toISOString()
      });
      habits.value = response.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        objective: item.objective,
        repeaterSequenceId: item.repeaterSequenceId || null,
        date: new Date(item.startDate).toISOString().split("T")[0],
        startTime: new Date(item.startDate).toTimeString().slice(0, 5),
        endTime: new Date(item.endDate).toTimeString().slice(0, 5),
        completed: item.isCompleted,
        closed: item.isClosed,
        tag: Object.keys(tagMapping).find(key => tagMapping[key] === item.tag) || "#3498db"
      }));
    };
    onMounted(() => { loadRoutines(); });
    const createPayload = (habit, isUpdate = false) => {
      const dateStr = habit.date
        ? (habit.date instanceof Date ? habit.date.toISOString().split("T")[0] : habit.date)
        : today.toISOString().split("T")[0];
      const startDateTime = new Date(dateStr + "T" + habit.startTime + ":00");
      const endDateTime = new Date(dateStr + "T" + habit.endTime + ":00");
      const payload = {
        title: habit.title,
        description: habit.description,
        objective: habit.objective,
        repeater: 0,
        repeaterSequenceId: isUpdate ? habit.repeaterSequenceId : null,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        isCompleted: habit.completed,
        isClosed: habit.closed,
        tag: tagMapping[habit.tag] || 0
      };
      if (!isUpdate) { payload.id = habit.id; }
      return payload;
    };
    const handleSaveHabit = async (habit) => {
      let payload;
      if (habit.isUpdate) {
        payload = createPayload(habit, true); //TODO: Update on case UpdateRoutine since pass payload to BE = null
        await updateRoutine(payload);
      } else {
        payload = createPayload(habit, false);
        await createRoutine(payload);
      }
      await loadRoutines();
    };
    const handleDeleteHabit = async (habitToDelete) => {
      await deleteRoutine(habitToDelete.id);
      await loadRoutines();
    };
    return { habits, today, handleSaveHabit, handleDeleteHabit };
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
</style>