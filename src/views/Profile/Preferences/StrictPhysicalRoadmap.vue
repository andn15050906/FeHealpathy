<template>
    <v-tour name="strict-physical-roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            This roadmap is designed to challenge you and push you towards significant physical improvement and discipline.
        </div>
        <div class="roadmap-text">
            At Healpathy, we believe in the importance of commitment and consistency in achieving your physical health goals.
        </div>
        <div class="roadmap-text">
            Follow each step diligently, and hold yourself accountable for your progress to ensure a transformative experience.
        </div>
    </div>

    <Roadmap :timelineItems="timelineItems"></Roadmap>
</template>

<script>
import Roadmap from "@/components/PracticeComponents/Roadmap.vue";
import "vue3-tour/dist/vue3-tour.css";

export default {
    components: { Roadmap },
    props: {
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
            },
            steps: [
                {
                    target: "#roadmap-step-1",
                    header: { title: "Step 1: Intense Stretching" },
                    content: "Incorporate rigorous stretching into your daily routine to enhance flexibility and prevent injuries."
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2: Daily Cardio" },
                    content: "Commit to at least 30 minutes of cardio each day to boost your endurance and overall fitness."
                },
                {
                    target: "#roadmap-step-3",
                    header: { title: "Step 3: Strength Training" },
                    content: "Engage in strength training exercises at least three times a week to build muscle and improve strength."
                },
                {
                    target: "#roadmap-step-4",
                    header: { title: "Step 4: Hydration" },
                    content: "Maintain hydration by drinking sufficient water throughout the day. Proper hydration is crucial for performance."
                },
                {
                    target: "#roadmap-step-5",
                    header: { title: "Step 5: Reflect and Adjust" },
                    content: "Regularly assess your physical activities and make necessary adjustments to stay on track."
                }
            ],
            timelineItems: [
                {
                    color: '#F28076', 
                    icon: 'mdi-yoga',
                    title: 'Intense Stretching',
                    content: 'Incorporate rigorous stretching into your daily routine to enhance flexibility and prevent injuries.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#FFB6AF', 
                    icon: 'mdi-run',
                    title: 'Daily Cardio Commitment',
                    content: 'Commit to at least 30 minutes of cardio each day to boost your endurance and overall fitness.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#FAE0C7', 
                    icon: 'mdi-weight',
                    title: 'Strength Training Routine',
                    content: 'Engage in strength training exercises at least three times a week to build muscle and improve strength.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#FBC193', 
                    icon: 'mdi-water',
                    title: 'Hydration Discipline',
                    content: 'Maintain hydration by drinking sufficient water throughout the day.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#4EB09B',
                    icon: 'mdi-check-circle',
                    title: 'Evaluate and Adjust',
                    content: 'Regularly evaluate your physical activities and make necessary adjustments to stay on track.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['strict-physical-roadmap-tour'].start()
    },
    methods: {
        toggleTour() {
            this.isTourActive = !this.isTourActive;
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

.roadmap-text {
    font-size: 1.2rem; 
    color: #444; 
    margin-bottom: 15px; 
    line-height: 1.6; 
    font-family: 'Poppins', sans-serif; 
    text-align: center; 
}
</style> 