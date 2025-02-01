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
import { getUserAuthData } from "../../../scripts/api/services/authService";

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

    const refreshEvents = async () => {
      try {
        const response = await getPagedRoutines({ pageIndex: 0, pageSize: 100, creatorId: getUserAuthData().id }); // Pagination is not fully implemented yet
        habits.value = Array.isArray(response.items) ? response.items : [];
      } catch (error) {
        habits.value = [];
      }
    };

    onMounted(() => {
      refreshEvents();
    });

    const handleSaveEvent = async (newEvent) => {
      try {
        const formattedEvent = {
          title: newEvent.title,
          description: newEvent.description || "",
          objective: newEvent.objective || "",
          frequency: frequencyEnum[newEvent.frequency] ?? 0,
        };
        await createRoutine(formattedEvent);
        await refreshEvents();
      } catch (error) {
        console.error("Error creating routine:", error);
      }
    };

    const handleDeleteEvent = async (eventToDelete) => {
      try {
        await deleteRoutine(eventToDelete.id);
        await refreshEvents();
      } catch (error) {
        console.error(" Error deleting routine:", error);
      }
    };

    return { habits, today, handleSaveEvent, handleDeleteEvent, refreshEvents };
  },
};
</script>

<style scoped>
#app {
  margin-top: 2rem;
}
</style>