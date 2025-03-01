<template>
    <v-tour name="strict-skill-roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            This roadmap is designed to challenge you and push you towards mastering essential skills with discipline.
        </div>
        <div class="roadmap-text">
            At Healpathy, we believe in the importance of commitment and consistency in achieving your skill development goals.
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
                    header: { title: "Step 1: Define Your Goals" },
                    content: "Clearly define the skills you want to master and set specific, measurable goals."
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2: Create a Structured Plan" },
                    content: "Develop a structured plan that outlines the steps you need to take to achieve your goals."
                },
                {
                    target: "#roadmap-step-3",
                    header: { title: "Step 3: Commit to Daily Practice" },
                    content: "Dedicate time each day to practice and refine your skills."
                },
                {
                    target: "#roadmap-step-4",
                    header: { title: "Step 4: Seek Expert Guidance" },
                    content: "Find a mentor or expert who can provide guidance and feedback on your progress."
                },
                {
                    target: "#roadmap-step-5",
                    header: { title: "Step 5: Evaluate and Adjust" },
                    content: "Regularly evaluate your progress and adjust your plan as needed to stay on track."
                }
            ],
            timelineItems: [
                {
                    color: '#FFD273', 
                    icon: 'mdi-lightbulb',
                    title: 'Define Your Goals',
                    content: 'Clearly define the skills you want to master and set specific, measurable goals.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#E17A8D', 
                    icon: 'mdi-target',
                    title: 'Create a Structured Plan',
                    content: 'Develop a structured plan that outlines the steps you need to take to achieve your goals.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#001949', 
                    icon: 'mdi-pencil',
                    title: 'Commit to Daily Practice',
                    content: 'Dedicate time each day to practice and refine your skills.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#5567C9', 
                    icon: 'mdi-comment-check',
                    title: 'Seek Expert Guidance',
                    content: 'Find a mentor or expert who can provide guidance and feedback on your progress.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#8D9AC5', 
                    icon: 'mdi-check-circle',
                    title: 'Evaluate and Adjust',
                    content: 'Regularly evaluate your progress and adjust your plan as needed to stay on track.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['strict-skill-roadmap-tour'].start()
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