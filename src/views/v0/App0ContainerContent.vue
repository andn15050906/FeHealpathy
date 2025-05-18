<template>
    
        <div v-if="currentPath">
          <roadmap-content 
            :current-path="currentPath"
            @phase-completed="handlePhaseCompleted"
            @update-progress="handleProgressUpdate"
            @path-completed="handlePathCompleted"
          />
        </div>
        <div v-else-if="showProgressTracker">
          <progress-tracker
            :active-days="activeDays"
            :total-days="totalDays"
            :completed-actions="completedActions"
            :total-required-actions="totalRequiredActions"
            :action-history="actionHistory"
            @suggest-new-route="startSurvey"
            @view-full-history="viewFullHistory"
          />
        </div>
        <div v-else>
          <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
            <v-card-title class="text-h5">Welcome to Your Mental Health Journey</v-card-title>
            <v-card-text>
              <p class="text-body-1 mb-4">
                This personalized roadmap will guide you through evidence-based practices to support your mental wellbeing.
              </p>
              <p class="text-body-1 mb-4">
                To get started, please take our assessment so we can recommend the most suitable path for your needs.
              </p>
              <div class="d-flex justify-center mt-6">
                <v-btn
                  color="primary"
                  size="large"
                  rounded="pill"
                  @click="startSurvey"
                  class="px-8"
                >
                  Start Assessment
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
</template>