<template>
  <div id="app" class="container mt-5">
    <Calendar :events="habits" :initialDate="today" eventDotColor="#e74c3c" @save-event="handleSaveEvent"
      @delete-event="handleDeleteEvent" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Calendar from "../../../components/Common/Misc/Calendar.vue";
import { getPagedRoutines, createRoutine, deleteRoutine } from "../../../scripts/api/services/routinesService";

const frequencyEnum = {
  Daily: 0,
  EveryMonday: 1,
  EveryTuesday: 2,
  EveryWednesday: 3,
  EveryThursday: 4,
  EveryFriday: 5,
  EverySaturday: 6,
  EverySunday: 7,
};

export default {
  name: "HabitTracker",
  components: { Calendar },
  setup() {
    const habits = ref([]);
    const today = new Date();
    const remainingDaysInMonth = computed(() => {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return daysInMonth - today.getDate() + 1;
    });
    const loadRoutines = async () => {
      try {
        const response = await getPagedRoutines({ pageIndex: 0, pageSize: 100 });
        console.log("Routines:", response);
        habits.value = Array.isArray(response.items) ? response.items : [];
      } catch (error) {
        console.error("Error loading routines:", error);
        habits.value = [];
      }
    };
    onMounted(() => {
      loadRoutines();
    });
    const handleSaveEvent = async (newEvent) => {
      try {
        const formattedEvent = {
          title: newEvent.title,
          description: newEvent.description || "",
          objective: newEvent.objective || "",
          frequency: frequencyEnum[newEvent.frequency] ?? 0,
        };
        const response = await createRoutine(formattedEvent);
        if (response.item) {
          habits.value.push(response.item);
        } else {
          habits.value.push(response.data);
        }
      } catch (error) {
        console.error("Error creating routine:", error);
      }
    };
    const handleDeleteEvent = async (eventToDelete) => {
      try {
        await deleteRoutine(eventToDelete.id);
        habits.value = habits.value.filter((e) => e.id !== eventToDelete.id);
      } catch (error) {
        console.error("Error deleting routine:", error);
      }
    };
    return { habits, today, remainingDaysInMonth, handleSaveEvent, handleDeleteEvent };
  },
};
</script>

<style scoped>
#app {
  margin-top: 2rem;
}
</style>