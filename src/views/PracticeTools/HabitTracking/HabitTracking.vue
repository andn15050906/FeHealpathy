<template>
  <div id="app" class="container">
    <Calendar :events="habits" :initialDate="today" @save-event="handleSaveHabit" @delete-event="handleDeleteHabit" />
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
      const dateStr = typeof habit.date === 'string' ? habit.date :
        new Date(habit.date).toISOString().split('T')[0];

      console.log(dateStr);
      console.log('habit.startTime', habit.startTime);
      console.log('habit.endTime', habit.endTime);

      const startDateTime = new Date(`${dateStr}T${habit.startTime}`);
      const endDateTime = new Date(`${dateStr}T${habit.endTime}`);

      const payload = {
        title: habit.title,
        description: habit.description || "",
        objective: habit.objective || "",
        repeater: 0,
        repeaterSequenceId: habit.repeaterSequenceId || null,
        startDate: startDateTime,
        endDate: endDateTime,
        isCompleted: habit.completed || false,
        isClosed: habit.closed || false,
        tag: tagMapping[habit.tag] || 0
      };

      if (isUpdate) {
        payload.id = habit.id;
      }

      return payload;
    };

    const handleSaveHabit = async (habit) => {
      try {
        if (habit.isUpdate) {
          const payload = createPayload(habit, true);
          console.log(payload);
          await updateRoutine(payload);
        } else {
          const payload = createPayload(habit, false);
          console.log(payload);
          await createRoutine(payload);
        }
        await loadRoutines();
      } catch (error) {
        console.error("Error saving habit:", error);
      }
    };

    const handleDeleteHabit = async (habitToDelete) => {
      try {
        await deleteRoutine(habitToDelete.id);
        await loadRoutines();
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    };

    return {
      habits,
      today,
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
</style>