<template>
  <div class="checklist">
    <h3>Daily Checklist</h3>
    <div class="checklist-section" v-if="stressLevel !== null">
      <h4 v-if="stressLevel > 8">Recommended Healing Habits</h4>
      <h4 v-else-if="stressLevel > 4">Recommended Mental Habits</h4>
      <h4 v-else>Recommended Physical Habits</h4>
      <ul>
        <li v-for="habit in recommendedHabits" :key="habit.id">
          <input type="checkbox" v-model="habit.completed" />
          {{ habit.title }}
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
  { id: 1, title: 'Meditate for 10 minutes', completed: false },
  { id: 2, title: 'Practice gratitude', completed: false },
  { id: 3, title: 'Take a walk during lunch', completed: false },
  { id: 4, title: 'Do yoga for relaxation', completed: false },
]);

const physicalHabits = ref([
  { id: 1, title: 'Exercise for 30 minutes', completed: false },
  { id: 2, title: 'Drink 2 liters of water', completed: false },
  { id: 3, title: 'Take a walk during lunch', completed: false },
  { id: 4, title: 'Do yoga for relaxation', completed: false },
]);

const healingHabits = ref([
  { id: 1, title: 'Read a book for 30 minutes', completed: false },
  { id: 2, title: 'Spend time in nature', completed: false },
  { id: 3, title: 'Practice mindfulness', completed: false },
  { id: 4, title: 'Take a warm bath', completed: false },
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

.checklist-section {
  margin-bottom: 20px;
}
</style> 