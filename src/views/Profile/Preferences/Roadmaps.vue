<script setup>
import { ref } from "vue";
import RoadmapSelector from "@/views/Profile/Preferences/RoadmapSelector.vue";
import RoadmapComponent from "@/views/Profile/Preferences/RoadmapComponent.vue";
import { roadmaps } from "@/scripts/data/roadmaps.js";

const selectedRoadmap = ref(roadmaps["strict-personal-roadmap"]);

function changeRoadmap(name) {
  selectedRoadmap.value = roadmaps[name];
}
</script>

<template>
  <div>
    <h1>Roadmaps Page</h1>
    <RoadmapSelector @selectRoadmap="changeRoadmap" />
    <RoadmapComponent :roadmapData="selectedRoadmap" />
  </div>
</template>
