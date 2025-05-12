<template>
  <div class="roadmap-container">
    <RoadmapSidebar :steps="roadmapSteps" :activeStep="activeStep" />
    <div class="roadmap-content">
      <RoadmapHeader />
      <v-container>
        <RoadmapProgress :steps="roadmapSteps" :activeStep="activeStep" />
        <StepDetail :step="currentStep" />
      </v-container>
    </div>
  </div>
</template>

<script>
import RoadmapSidebar from "@/components/RoadmapSidebar.vue";
import RoadmapHeader from "@/components/RoadmapHeader.vue";
import RoadmapProgress from "@/components/RoadmapProgress.vue";
import StepDetail from "@/components/StepDetail.vue";

export default {
  name: "RoadmapView",
  components: {
    RoadmapSidebar,
    RoadmapHeader,
    RoadmapProgress,
    StepDetail,
  },
  data() {
    return {
      activeStep: 3,
      roadmapSteps: [
        {
          id: 1,
          title: "Self-Awareness",
          completed: true,
          icon: "mdi-eye-outline",
        },
        {
          id: 2,
          title: "Seeking Support",
          completed: true,
          icon: "mdi-hand-heart-outline",
        },
        {
          id: 3,
          title: "Building Healthy Habits",
          completed: false,
          active: true,
          icon: "mdi-sprout-outline",
        },
        {
          id: 4,
          title: "Developing Coping Strategies",
          completed: false,
          icon: "mdi-brain",
        },
        {
          id: 5,
          title: "Maintaining Mental Wellness",
          completed: false,
          icon: "mdi-heart-pulse",
        },
      ],
      currentStep: {
        id: 3,
        title: "Building Healthy Habits",
        description:
          "Developing consistent healthy habits creates a foundation for good mental health. Small, sustainable changes to your daily routine can have a significant positive impact over time.",
        focusAreas: [
          "Establish regular sleep patterns",
          "Incorporate physical activity into your routine",
          "Develop healthy eating habits",
          "Create boundaries between work and personal time",
        ],
        activities: [
          {
            id: 1,
            title: "Sleep Hygiene Checklist",
            description:
              "Create and implement a bedtime routine to improve sleep quality.",
            recommended: true,
            icon: "mdi-sleep",
          },
          {
            id: 2,
            title: "Movement Calendar",
            description:
              "Schedule regular physical activity that you enjoy, even if it's just a short daily walk.",
            recommended: true,
            icon: "mdi-run",
          },
          {
            id: 3,
            title: "Meal Planning",
            description:
              "Plan balanced meals that include mood-supporting foods like omega-3s and complex carbohydrates.",
            recommended: false,
            icon: "mdi-food-apple-outline",
          },
          {
            id: 4,
            title: "Digital Boundaries",
            description:
              "Set specific times to disconnect from work emails and notifications.",
            recommended: false,
            icon: "mdi-cellphone-off",
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
}

.roadmap-content {
  flex: 1;
  padding: 0;
}
</style>
