<template>
  <div class="checklist mt-4">
    <h3 class="mb-3">Daily Checklist</h3>
    <div class="checklist-section" v-if="stressLevel !== null">
      <h4 v-if="stressLevel > 8" class="mb-3">Các thói quen khác</h4>
      <h4 v-else-if="stressLevel > 4" class="mb-3">Các thói quen tinh thần</h4>
      <h4 v-else class="mb-3">Các thói quen thể chất</h4>
      <ul class="list-group">
        <li v-for="habit in recommendedHabits" :key="habit.title" class="list-group-item d-flex align-items-center">
          <input type="checkbox" v-model="habit.completed" class="form-check-input me-2" />
          <span>{{ habit.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  stressLevel: {
    type: Number,
    required: true
  }
});

const mentalHabits = ref([
  { title: '🧘 Tập trung 10 phút', completed: false },
  { title: '🙏 Cảm ơn', completed: false },
  { title: '🚶 Đi bộ trong giờ ăn trưa', completed: false },
  { title: '🧘‍♀️ Tập yoga cho giải tỏa', completed: false },
]);

const physicalHabits = ref([
  { title: '🏋️‍♂️ Tập thể dục 30 phút', completed: false },
  { title: '💧 Uống 2 lít nước', completed: false },
  { title: '🚶 Đi bộ trong giờ ăn trưa', completed: false },
  { title: '🧘‍♀️ Tập yoga cho giải tỏa', completed: false },
]);

const healingHabits = ref([
  { title: '📖 Đọc sách 30 phút', completed: false },
  { title: '🌳 Để thời gian trong thiên nhiên', completed: false },
  { title: '🧘‍♂️ Tập trung chú ý', completed: false },
  { title: '🛁 Tắm nóng', completed: false },
]);

const recommendedHabits = computed(() => {
  if (props.stressLevel > 8) {
    return healingHabits.value;
  } else if (props.stressLevel > 4) {
    return mentalHabits.value;
  } else {
    return physicalHabits.value;
  }
});
</script>

<style scoped>
.checklist {
  margin-top: 20px;
}

.list-group-item {
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 10px;
}
</style>