<template>
    <v-tour name="roadmap-tour" v-if="isTourActive" :steps="roadmap?.tourSteps" :options="tourOptions" @end="isTourActive = false" />
    <div class="roadmap-intro">
        <div v-for="introText in roadmap?.introTexts" class="roadmap-text">
            {{ introText }}
        </div>
    </div>
    <Roadmap :timelineItems="roadmap?.timelineItems ?? []"></Roadmap>
    <div v-if="nextScreenCallback" class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
        <GlowingButton @click="nextScreenCallback" primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100">{{ text.nextScreen }}</GlowingButton>
    </div>
</template>

<script>
//import { inject } from 'vue';
import "vue3-tour/dist/vue3-tour.css";
import Roadmap from "@/components/RoadmapComponents/Roadmap.vue";
import GlowingButton from "@/components/Common/GlowingButton.vue";
import { inject } from "vue";
import { roadmaps } from '@/scripts/data/roadmaps.js';

export default {
    components: { Roadmap, GlowingButton },
    props: {
        enableTour: {
            type: Boolean,
            default: false,
            required: false
        },
        nextScreenCallback: {
            type: Function,
            required: false
        }
    },
    data() {
        return {
            text: {
                nextScreen: "Next"
            },
            isTourEnabled: false,
            isTourActive: true,
            tourOptions: {
                highlight: true,
                labels: {
                    buttonSkip: "Skip",
                    buttonPrevious: "Back",
                    buttonNext: "Next",
                    buttonStop: "Finish",
                }
            },
            roadmap: roadmaps["mental-roadmap"],
            roadmapProgress: inject('roadmapProgress')
            //guider: inject('guider')
        }
    },
    async mounted() {
        if (this.enableTour) {
            this.$tours['roadmap-tour'].start();
        }

        setTimeout(() => {
            this.setRoadmap();
        }, 5000)
        /*this.guider.highlight(`roadmap-btn-${1}`);*/
    },
    methods: {
        toggleTour() {
            this.isTourActive = !this.isTourActive;
        },
        setRoadmap() {
            if (!this.roadmapProgress || !this.roadmapProgress.getPersonalRoadmap)
                return;

            let personalRoadmap = this.roadmapProgress.getPersonalRoadmap();
            this.roadmap = {
                name: personalRoadmap.title,
                introTexts: personalRoadmap.introText?.split('.') || '',
                steps: personalRoadmap.phases.sort((a, b) => a.index - b.index).map((_, index) => {
                    return {
                        target: `#roadmap-step-${index}`,
                        header: { title: `Step ${index}: ${_.title}` }
                    }
                }),
                timelineItems: personalRoadmap.phases.sort((a, b) => a.index - b.index).map((_, index) => {
                    return {
                        color: index == 0 ? '#FF8A80' : index == 1 ? '#BA68C8' : index == 2 ? '#7986CB' : index == 3 ? '#81C784' : '#64B5F6',
                        icon: index == 0 ? 'mdi-account-heart': index == 1 ? 'mdi-bullseye' : index == 2 ? 'mdi-clock-outline' : index == 3 ? 'mdi-emoticon-happy' : 'mdi-rocket-launch',
                        title: _.title,
                        content: _.description,
                        link: '/practice'
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}

.roadmap-intro {
    background-color: #ffffff; 
    padding: 30px;
    border-radius: 12px; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
    margin-bottom: 30px; 
    border: 1px solid #e0e0e0; 
    transition: all 0.3s ease; 
}

.roadmap-intro:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px); 
}

.roadmap-header {
    font-size: 2.5rem; 
    font-weight: bold; 
    color: #154EC1; 
    text-align: center; 
    margin-bottom: 20px; 
}

.roadmap-text {
    font-size: 1.2rem; 
    color: #444; 
    margin-bottom: 15px; 
    line-height: 1.6; 
    font-family: 'Poppins', sans-serif; 
    text-align: center; 
}

.v-tour__target {
    outline: 3px solid #ff6f61 !important; 
    border-radius: 8px; 
}

.v-tour__button {
    background-color: #007bff !important; 
    color: white !important;
    font-weight: bold;
    border-radius: 6px;
    padding: 8px 16px;
    transition: 0.3s;
}

.v-tour__button:hover {
    background-color: #0056b3 !important;
}

.timeline-item {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    background: #f8f9fa;
    transition: 0.3s;
    font-size: 3.5rem;
}

.timeline-item:hover {
    background: #e9ecef;
    transform: translateY(-3px);
}

.timeline-item-content {
    margin-top: 10px;
    font-size: 2rem;
}

.timeline-item-title {
    font-size: 2.5rem;
}

.roadmap-intro a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
    transition: 0.3s;
}

.roadmap-intro a:hover {
    color: #0056b3;
    text-decoration: underline;
}

.roadmap-step {
    margin-bottom: 24px; 
}

</style>