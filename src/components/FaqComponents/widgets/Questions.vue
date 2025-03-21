<template>
  <VaCard class="faq-card">
    <VaCardContent>
      <h2 class="faq-title">Popular Questions</h2>
      <VaAccordion v-model="accordionState" class="faq-accordion">
        <VaCollapse v-for="(item, index) in faqItems" :key="index">
          <template #header>
            <div class="faq-header">
              <span>{{ item.question }}</span>
              <font-awesome-icon icon="chevron-down" class="faq-icon"
                :class="{ expanded: accordionState.includes(index) }" />
            </div>
          </template>
          <article class="faq-content">
            <p>{{ item.answer }}</p>
            <ul v-if="item.list" class="faq-list">
              <li style="color: green;" v-for="(listItem, i) in item.list" :key="i">{{ listItem }}</li>
            </ul>
          </article>
        </VaCollapse>
      </VaAccordion>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { reactive } from 'vue';

const accordionState = reactive([]);

const faqItems = [
  {
    question: 'How do I track my daily activities?',
    answer: 'Tracking your daily activities in HEALPATHY is simple:',
    list: [
      'Go to the Activity Tracking section',
      'Click "Add Activity" to log new activities',
      'Select activity type and enter details',
      'Save your entry to update your health dashboard',
    ],
  },
  {
    question: 'How can I join health groups?',
    answer: 'To join health groups:',
    list: [
      'Browse available groups in the Community section',
      'Click "Join Group" on groups that interest you',
      'Participate in discussions and share experiences',
      'Connect with others who have similar health goals',
    ],
  },
  {
    question: 'How do I set health goals?',
    answer: 'Setting health goals helps track your progress:',
    list: [
      'Visit your Profile Settings',
      'Select "Health Goals"',
      'Choose goal categories',
      'Set specific targets and timeframes',
      'Track progress through your dashboard',
    ],
  },
];
</script>

<style scoped>
.faq-card {
  padding: 0 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.faq-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #154EC1;
  margin-bottom: 1rem;
}

.faq-accordion {
  border-top: 1px solid #ddd;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  padding: 0.7rem 0;
  cursor: pointer;
}

.faq-icon {
  color: #154EC1;
  transition: transform 0.3s ease-in-out;
}

.faq-icon.expanded {
  transform: rotate(180deg);
}

.faq-content {
  padding: 0;
  line-height: 1.6;
  color: #555;
}

.faq-list {
  padding: 0 5px;
  list-style-type: disc;
}
</style>