<template>
    <div>
      <button @click="startTour">Start Tour</button>
      <Vue3Tour v-if="isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />
    </div>
  
    <div>
      CBT is a powerful therapeutic approach that equips individuals with the tools to understand and manage their
      thoughts and behaviors.
    </div>
    <div>
      At Healpathy, we are committed to guiding you through this roadmap, ensuring that you have the support and
      resources necessary for your mental health journey.
    </div>
    <div>
      Embrace the process, and take the first step toward a healthier mindset today!
    </div>
  
    <Roadmap :timelineItems="timelineItems"></Roadmap>
  </template>
  
  <script setup>
  import Roadmap from "@/components/PracticeComponents/Roadmap.vue";
  import { ref } from "vue";
  import Vue3Tour from "vue3-tour";
  import "vue3-tour/dist/vue3-tour.css";
  
  const isTourActive = ref(false);
  
  const steps = [
    {
      target: ".roadmap-section",
      header: { title: "Step 1" },
      content: "This is your roadmap section.",
    },
    {
      target: ".timeline-item",
      header: { title: "Step 2" },
      content: "Click here to see details.",
    },
  ];
  
  const tourOptions = {
    highlight: true,
    labels: {
      buttonSkip: "Skip",
      buttonPrevious: "Back",
      buttonNext: "Next",
      buttonStop: "Finish",
    },
  };
  
  const startTour = () => {
    isTourActive.value = true;
  };
  
  const timelineItems = [
    {
      color: "red-lighten-2",
      icon: "mdi-star",
      title: "Treatment Planning",
      content:
        "Utilize Case Conceptualization framework to make initial assessment. It is quite frequent to address automatic thoughts and intermediate beliefs as foci of treatment, while addressing core beliefs is often difficult.",
      link: "/practice",
      linkTitle: "Find out more!",
    },
    {
      color: "purple-lighten-2",
      icon: "mdi-book-variant",
      title: "Goal Setting",
      content:
        "Goal setting is the process of collaboratively identifying specific therapeutic outcomes for treatment. Goals must be observable, measurable and achievable and relate to cognitive or behavioral changes relevant to the patient's presenting problem",
      link: "/practice",
      linkTitle: "Find out more!",
    },
    {
      color: "green-lighten-1",
      icon: "mdi-airballoon",
      title: "Relaxation",
      content:
        "Relaxation techniques are important for brief therapy. Some people respond to physical procedures (e.g., muscle relaxation and/or deep breathing), while others respond favorably to guided imagery",
      link: "/practice",
      linkTitle: "Find out more!",
    },
    {
      color: "indigo-lighten-2",
      icon: "mdi-layers-triple",
      title: "Behavioral Activation",
      content: "Make use of practice tools and monitor progress in mood, mastery and confidence",
      link: "/groups",
      linkTitle: "Find out more!",
    },
    {
      color: "red-lighten-2",
      icon: "mdi-star",
      title: "Skills development",
      content:
        "The aim of exposure therapy is to reduce the patient's anxiety response to feared stimuli and increase the patient's ability to experience and tolerate anxiety. The process includes creating a thoughtfully constructed hierarchy of feared stimuli organized by the patient's reported degree of fear",
      link: "/practice",
      linkTitle: "Find out more!",
    },
    {
      color: "purple-lighten-2",
      icon: "mdi-star",
      title: "Exposure Therapy",
      content:
        "The aim of exposure therapy is to reduce the patient's anxiety response to feared stimuli and increase the patient's ability to experience and tolerate anxiety. The process includes creating a thoughtfully constructed hierarchy of feared stimuli organized by the patient's reported degree of fear",
      link: "/practice",
      linkTitle: "Find out more!",
    },
    {
      color: "green-lighten-1",
      icon: "mdi-star",
      title: "Reflection and Maintaining Changes",
      content:
        "Review skills learned in treatment, and to vocalize and problem-solve concerns about functioning outside treatment",
      link: "/practice",
      linkTitle: "Find out more!",
    },
  ];
  </script>
  