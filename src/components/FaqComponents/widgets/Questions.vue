<template>
  <VaCard class="mb-4">
    <VaCardContent>
      <h2 class="va-h5">Popular questions</h2>
      <VaAccordion v-model="accordionState" :style="{ '--va-collapse-padding': '1rem 0' }" class="mb-1">
        <VaCollapse header="How do I track my daily activities?">
          <article class="max-w-3xl leading-5">
            <p class="mb-2">
              Tracking your daily activities in HEALPATHY is simple:
            </p>
            <ul class="list-disc list-inside leading-5 ml-4">
              <li>Go to the Activity Tracking section</li>
              <li>Click "Add Activity" to log new activities</li>
              <li>Select activity type and enter details</li>
              <li>Save your entry to update your health dashboard</li>
            </ul>
          </article>
        </VaCollapse>

        <VaCollapse header="How can I join health groups?">
          <article class="max-w-3xl text-sm">
            <p class="mb-4">
              To join health groups:
              - Browse available groups in the Community section
              - Click "Join Group" on groups that interest you
              - Participate in discussions and share experiences
              - Connect with others who have similar health goals
            </p>
          </article>
        </VaCollapse>

        <VaCollapse header="How do I set health goals?">
          <article class="max-w-3xl text-sm">
            <p class="mb-3">
              Setting health goals helps track your progress:
              - Visit your Profile Settings
              - Select "Health Goals"
              - Choose goal categories
              - Set specific targets and timeframes
              - Track progress through your dashboard
            </p>
          </article>
        </VaCollapse>
      </VaAccordion>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { reactive } from 'vue'

const accordionState = reactive([false, true, false, false])
</script>

<style scoped>
.va-h5 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #154EC1; 
}

article {
  margin-bottom: 1rem;
}

.max-w-3xl {
  max-width: 800px; 
}

.list-disc {
  margin-left: 1.5rem; 
}

.mb-4 {
  margin-bottom: 1rem; 
}
</style>
