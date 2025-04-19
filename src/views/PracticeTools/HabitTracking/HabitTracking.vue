<template>
  <div id="app" class="container">
    <Calendar :events="habits" :initialDate="today" @save-event="handleSaveHabit" @delete-event="handleDeleteHabit"
      @month-changed="handleMonthChanged" />
    <LoadingSpinner ref="spinner" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { getPagedRoutines, createRoutine, updateRoutine, deleteRoutine } from "../../../scripts/api/services/routinesService";
import Calendar from "@/components/Common/Misc/Calendar.vue";
import LoadingSpinner from "../../../components/Common/Popup/LoadingSpinner.vue";

const tagMapping = {
  "#2ecc71": 0,
  "#3498db": 1,
  "#f1c40f": 2,
  "#e67e22": 3,
  "#e74c3c": 4
};

export default {
  name: "HabitTracker",
  components: { Calendar, LoadingSpinner },
  setup() {
    const habits = ref([]);
    const today = new Date();
    const spinnerRef = ref(null);
    const currentViewDate = ref(new Date());

    const loadRoutines = async (date = null) => {
      try {
        spinnerRef.value?.showSpinner();
        const viewDate = date || currentViewDate.value;
        const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        const formattedFirstDay = firstDay.getFullYear() + "-" + String(firstDay.getMonth() + 1).padStart(2, "0") + "-" + String(firstDay.getDate()).padStart(2, "0") + "T" + String(firstDay.getHours()).padStart(2, "0") + ":" + String(firstDay.getMinutes()).padStart(2, "0") + ":" + String(firstDay.getSeconds()).padStart(2, "0");
        const formattedLastDay = lastDay.getFullYear() + "-" + String(lastDay.getMonth() + 1).padStart(2, "0") + "-" + String(lastDay.getDate()).padStart(2, "0") + "T" + String(lastDay.getHours()).padStart(2, "0") + ":" + String(lastDay.getMinutes()).padStart(2, "0") + ":" + String(lastDay.getSeconds()).padStart(2, "0");
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        const queryParams = new URLSearchParams({ CreatorId: userProfile.id, From: formattedFirstDay, To: formattedLastDay });
        const response = await getPagedRoutines(queryParams);
        habits.value = response.items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || "Chưa có mô tả",
          objective: item.objective || "Chưa có mục tiêu",
          repeaterSequenceId: item.repeaterSequenceId || null,
          date: new Date(item.startDate).toISOString().split("T")[0],
          startTime: new Date(item.startDate).toTimeString().slice(0, 5),
          endTime: new Date(item.endDate).toTimeString().slice(0, 5),
          completed: item.isCompleted,
          closed: item.isClosed,
          tag: Object.keys(tagMapping).find(key => tagMapping[key] === item.tag) || "#3498db"
        }));
      } catch (error) {
        console.error(error);
        toast.error("Không tải được danh sách thói quen!", { position: "bottom-center" });
      } finally {
        spinnerRef.value?.hideSpinner();
      }
    };

    const handleMonthChanged = (newDate) => {
      currentViewDate.value = newDate;
      loadRoutines(newDate);
    };

    onMounted(() => loadRoutines(today));

    const generateGuid = () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

    const createPayload = (habit, isUpdate = false) => {
      const dateStr = typeof habit.date === "string" ? habit.date : new Date(habit.date).toISOString().split("T")[0];
      const startDateTime = new Date(`${dateStr}T${habit.startTime}`);
      const endDateTime = new Date(`${dateStr}T${habit.endTime}`);
      const payload = {
        title: habit.title,
        description: habit.description || "Chưa có mô tả",
        objective: habit.objective || "Chưa có mục tiêu",
        repeater: 0,
        repeaterSequenceId: habit.repeaterSequenceId || null,
        startDate: startDateTime,
        endDate: endDateTime,
        isCompleted: habit.completed || false,
        isClosed: habit.closed || false,
        tag: tagMapping[habit.tag] || 0
      };
      if (isUpdate) payload.id = habit.id;
      return payload;
    };

    const generateDatesFromRepeatOption = (selectedDate, repeatOption) => {
      const dates = [];
      const todayDate = new Date();
      todayDate.setHours(23, 59, 0, 0);
      const initial = new Date(selectedDate);
      initial.setHours(23, 59, 0, 0);
      const start = initial < todayDate ? new Date(todayDate) : new Date(initial);
      switch (repeatOption) {
        case "weekday": {
          let firstWorkday = new Date(start);
          const startDow = firstWorkday.getDay();
          if (startDow === 0 || startDow === 6) {
            const daysUntilMonday = startDow === 0 ? 1 : 2;
            firstWorkday.setDate(firstWorkday.getDate() + daysUntilMonday);
          }
          let cur = new Date(firstWorkday);
          while (cur.getDay() >= 1 && cur.getDay() <= 5) {
            dates.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
          }
          break;
        }
        case "weekends": {
          let firstWeekendDay = new Date(start);
          const startDow = firstWeekendDay.getDay();
          if (startDow >= 1 && startDow <= 5) {
            const daysUntilSaturday = 6 - startDow;
            firstWeekendDay.setDate(firstWeekendDay.getDate() + daysUntilSaturday);
          }
          dates.push(new Date(firstWeekendDay));
          if (firstWeekendDay.getDay() === 6) {
            const nextSunday = new Date(firstWeekendDay);
            nextSunday.setDate(nextSunday.getDate() + 1);
            dates.push(new Date(nextSunday));
          }
          break;
        }
        case "allWeek": {
          let firstDay = new Date(start);
          const startDow = firstDay.getDay();
          const daysUntilSunday = startDow === 0 ? 1 : 7 - startDow;
          for (let i = 0; i < daysUntilSunday; i++) {
            const d = new Date(firstDay);
            d.setDate(firstDay.getDate() + i);
            dates.push(new Date(d));
          }
          break;
        }
        case "allMonth": {
          const startMonth = start.getMonth();
          const startYear = start.getFullYear();
          const daysInMonth = new Date(startYear, startMonth + 1, 0).getDate();
          for (let d = start.getDate(); d <= daysInMonth; d++) dates.push(new Date(startYear, startMonth, d, 23, 59, 0, 0));
          break;
        }
        default:
          dates.push(new Date(start));
      }
      return dates;
    };

    const handleSaveHabit = async (habit) => {
      try {
        spinnerRef.value?.showSpinner();
        if (habit.isUpdate) {
          const p = createPayload(habit, true);
          await updateRoutine(p);
          if (habit.updateAllInSequence && habit.repeaterSequenceId) {
            const seq = habit.repeaterSequenceId;
            for (const h of habits.value.filter(x => x.repeaterSequenceId === seq && x.id !== habit.id)) {
              const rp = { ...createPayload(habit, true), id: h.id, startDate: new Date(`${h.date}T${habit.startTime}`), endDate: new Date(`${h.date}T${habit.endTime}`) };
              await updateRoutine(rp);
            }
          }
        } else if (habit.repeat && habit.repeat !== "none") {
          const seq = generateGuid(), dates = generateDatesFromRepeatOption(habit.date || new Date(), habit.repeat);
          for (const d of dates) await createRoutine(createPayload({ ...habit, date: d.toISOString().split("T")[0], repeaterSequenceId: seq }));
        } else {
          const sd = new Date(habit.date); sd.setHours(0, 0, 0, 0);
          const td = new Date(); td.setHours(0, 0, 0, 0);
          if (sd >= td) await createRoutine(createPayload(habit));
        }
        await loadRoutines(currentViewDate.value);
        toast.success(habit.isUpdate ? "Cập nhật thói quen thành công!" : "Thêm thói quen thành công!", { position: "bottom-center" });
      } catch {
        toast.error(habit.isUpdate ? "Cập nhật thói quen thất bại!" : "Thêm thói quen thất bại!", { position: "bottom-center" });
      } finally {
        spinnerRef.value?.hideSpinner();
      }
    };

    const handleDeleteHabit = async ({ id, deleteAllInSequence, repeaterSequenceId }) => {
      try {
        spinnerRef.value?.showSpinner();
        if (deleteAllInSequence && repeaterSequenceId) for (const h of habits.value.filter(x => x.repeaterSequenceId === repeaterSequenceId)) await deleteRoutine(h.id);
        else await deleteRoutine(id);
        await loadRoutines(currentViewDate.value);
        toast.success("Xóa thói quen thành công!", { position: "bottom-center" });
      } catch {
        toast.error("Xóa thói quen thất bại!", { position: "bottom-center" });
      } finally {
        spinnerRef.value?.hideSpinner();
      }
    };

    return {
      habits,
      today,
      handleSaveHabit,
      handleDeleteHabit,
      handleMonthChanged,
      spinner: spinnerRef
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