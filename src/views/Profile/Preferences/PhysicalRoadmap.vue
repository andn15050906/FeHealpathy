<template>
    <v-tour name="physical-roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            This roadmap is designed to guide you towards a healthier lifestyle through gentle physical activities. 
            We believe that small, consistent changes can lead to significant improvements in your overall well-being.
        </div>
        <div class="roadmap-text">
            At Healpathy, we emphasize the importance of balance and gradual progress in your physical health journey. 
            Remember, every step counts, and it's essential to listen to your body as you embark on this journey.
        </div>
        <div class="roadmap-text">
            Embrace the journey, and take the first step towards a healthier body today! 
            Your commitment to these activities will pave the way for a more vibrant and energetic life.
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
                    header: { title: "Step 1: Start with Stretching" },
                    content: "Incorporate gentle stretching into your daily routine to improve flexibility and reduce tension."
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2: Daily Walks" },
                    content: "Aim for a 20-minute walk each day to boost your mood and energy. Walking is a simple yet effective way to enhance your physical health."
                },
                {
                    target: "#roadmap-step-3",
                    header: { title: "Step 3: Explore Yoga" },
                    content: "Try beginner yoga sessions to improve flexibility and relaxation. Yoga can also help reduce stress and promote mindfulness."
                },
                {
                    target: "#roadmap-step-4",
                    header: { title: "Step 4: Hydration" },
                    content: "Stay hydrated by drinking plenty of water throughout the day. Proper hydration is crucial for maintaining energy levels and overall health."
                },
                {
                    target: "#roadmap-step-5",
                    header: { title: "Step 5: Reflect and Adjust" },
                    content: "Regularly assess your physical activities and make adjustments as needed. Reflection helps you stay on track and motivated."
                }
            ],
            timelineItems: [
                {
                    color: '#5d7b6f',
                    icon: 'mdi-yoga',
                    title: 'Gentle Stretching',
                    content: 'Incorporate gentle stretching into your daily routine to improve flexibility and reduce tension.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#a4c3a2',
                    icon: 'mdi-walk',
                    title: 'Relaxed Daily Walks',
                    content: 'Aim for a 20-minute walk each day to boost your mood and energy levels.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#b0d4b8',
                    icon: 'mdi-yoga',
                    title: 'Beginner Yoga',
                    content: 'Try beginner yoga sessions to enhance flexibility and promote relaxation.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#eae7d6',
                    icon: 'mdi-water',
                    title: 'Stay Hydrated',
                    content: 'Stay hydrated by drinking plenty of water throughout the day.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#d7f9fa',
                    icon: 'mdi-check-circle',
                    title: 'Reflect and Adjust',
                    content: 'Regularly assess your physical activities and make adjustments as needed for continuous improvement.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['physical-roadmap-tour'].start()
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