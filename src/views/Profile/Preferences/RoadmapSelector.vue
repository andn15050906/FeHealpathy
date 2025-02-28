<template>
    <div class="roadmap-selector">
        <button v-for="(roadmap, key) in allRoadmaps" :key="key" @click="selectRoadmap(key)">
            {{ roadmap.name }}
        </button>
    </div>
</template>

<script>
import { strictPersonalRoadmap, skillRoadmap, strictSkillRoadmap, personalRoadmap, physicalRoadmap, strictPhysicalRoadmap } from "@/scripts/data/roadmaps.js";

export default {
    data() {
        return {
            allRoadmaps: {
                strictPersonalRoadmap,
                skillRoadmap,
                strictSkillRoadmap,
                personalRoadmap,
                physicalRoadmap,
                strictPhysicalRoadmap
            }
        };
    },
    methods: {
        selectRoadmap(key) {
            this.$emit('selectRoadmap', key);
        }
    }
};
</script>
