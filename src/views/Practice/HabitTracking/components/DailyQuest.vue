<template>
  <div class="daily-quests">
    <h3>Daily Wellness Goals</h3>
    
    <div class="quest-list">
      <div v-for="quest in dailyQuests" 
           :key="quest.id" 
           class="quest-item"
           :class="{ 'completed': quest.completed }">
        <div class="quest-info">
          <div class="quest-icon">{{ quest.icon }}</div>
          <div class="quest-details">
            <h4>{{ quest.title }}</h4>
            <p>{{ quest.description }}</p>
          </div>
        </div>
        
        <div class="quest-progress">
          <div class="progress-bar">
            <div :style="{ width: `${quest.progress}%` }" 
                 class="progress"></div>
          </div>
          <span>{{ quest.progress }}%</span>
        </div>
        
        <div class="quest-reward">
          <span>✨ {{ quest.reward }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dailyQuests = ref([
  {
    id: 1,
    icon: '🧘',
    title: 'Mindful Moments',
    description: 'Take 3 deep breathing breaks today',
    progress: 66,
    reward: 50,
    completed: false
  },
  {
    id: 2,
    icon: '😴',
    title: 'Restful Sleep',
    description: 'Get 8 hours of quality sleep',
    progress: 100,
    reward: 30,
    completed: true
  },
  {
    id: 3,
    icon: '🌱',
    title: 'Self-Care Goals',
    description: 'Complete 3 self-care activities',
    progress: 33,
    reward: 20,
    completed: false
  },
  {
    id: 4,
    icon: '🎵',
    title: 'Relaxation Time',
    description: 'Listen to calming music for 15 minutes',
    progress: 0,
    reward: 25,
    completed: false
  }
])

const emit = defineEmits(['reward-earned'])

const completeQuest = (questId) => {
  const quest = dailyQuests.value.find(q => q.id === questId)
  if (quest && quest.progress === 100) {
    quest.completed = true
    emit('reward-earned', quest.reward)
  }
}

const updateQuestProgress = (type, value) => {
  switch(type) {
    case 'mood':
      if(value === 'relaxed') {
        updateProgress(1, 15)
      }
      break
    case 'sleep':
      if(value.hours >= 8 && value.quality >= 8) {
        completeQuest(2)
      }
      break
    case 'meditation':
      updateProgress(4, 25)
      break
  }
}
</script>

<style scoped>
.daily-quests {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.quest-item.completed {
  background: #e8f5e9;
}

.quest-info {
  display: flex;
  gap: 10px;
  flex: 1;
}

.quest-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
}

.quest-details h4 {
  margin: 0;
  font-size: 16px;
}

.quest-details p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.quest-progress {
  width: 100px;
}

.progress-bar {
  height: 8px;
  background: #e1e1e1;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #75c9c8;
  transition: width 0.3s ease;
}

.quest-reward {
  font-size: 14px;
  color: #666;
  min-width: 80px;
  text-align: right;
}
</style>
