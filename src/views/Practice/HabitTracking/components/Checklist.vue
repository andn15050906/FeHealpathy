<template>
  <div class="checklist mt-4">
    <h3 class="mb-3">Daily Checklist</h3>
    <div class="checklist-section" v-if="stressLevel !== null">
      <h4 v-if="stressLevel > 8" class="mb-3">Recommended Healing Habits</h4>
      <h4 v-else-if="stressLevel > 4" class="mb-3">Recommended Mental Habits</h4>
      <h4 v-else class="mb-3">Recommended Physical Habits</h4>
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
  { title: '🧘 Meditate for 10 minutes', completed: false },
  { title: '🙏 Practice gratitude', completed: false },
  { title: '🚶 Take a walk during lunch', completed: false },
  { title: '🧘‍♀️ Do yoga for relaxation', completed: false },
]);

const physicalHabits = ref([
  { title: '🏋️‍♂️ Exercise for 30 minutes', completed: false },
  { title: '💧 Drink 2 liters of water', completed: false },
  { title: '🚶 Take a walk during lunch', completed: false },
  { title: '🧘‍♀️ Do yoga for relaxation', completed: false },
]);

const healingHabits = ref([
  { title: '📖 Read a book for 30 minutes', completed: false },
  { title: '🌳 Spend time in nature', completed: false },
  { title: '🧘‍♂️ Practice mindfulness', completed: false },
  { title: '🛁 Take a warm bath', completed: false },
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