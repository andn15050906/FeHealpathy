<template>
    <v-tour 
        v-if="isTourEnabled && isTourActive && roadmapData && roadmapData.tourName" 
        :name="roadmapData.tourName" 
        :steps="roadmapData.steps" 
        :options="tourOptions" 
        @end="isTourActive = false" 
    />

    <div class="roadmap-intro" v-if="roadmapData && roadmapData.introTexts">
        <div class="roadmap-text" v-for="(text, index) in roadmapData.introTexts" :key="index">
            {{ text }}
        </div>
    </div>

    <Roadmap v-if="roadmapData && roadmapData.timelineItems" :timelineItems="roadmapData.timelineItems" />
</template>

<script>
import Roadmap from "@/components/PracticeComponents/Roadmap.vue";
import "vue3-tour/dist/vue3-tour.css";

export default {
    components: { Roadmap },
    props: {
        roadmapData: {
            type: Object,
            required: true
        },
        isTourEnabled: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isTourActive: true,
            tourOptions: {
                highlight: true,
                labels: {
                    buttonSkip: "Skip",
                    buttonPrevious: "Back",
                    buttonNext: "Next",
                    buttonStop: "Finish",
                }
            }
        };
    },
    mounted() {
        if (this.roadmapData && this.roadmapData.tourName) {
            this.$tours[this.roadmapData.tourName]?.start();
        }
    }
};
</script>
