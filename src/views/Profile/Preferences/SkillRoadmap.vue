<template>
    <v-tour name="skill-roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            This roadmap is designed to help you develop essential skills at a comfortable pace.
        </div>
        <div class="roadmap-text">
            At Healpathy, we believe that learning should be enjoyable and gradual. 
            Embrace the process and take your time to master each skill.
        </div>
        <div class="roadmap-text">
            Start your journey today and enjoy the learning experience!
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
                    header: { title: "Step 1: Identify Your Interests" },
                    content: "Take time to explore and identify the skills that interest you the most."
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2: Set Small Goals" },
                    content: "Set achievable goals for each skill you want to develop."
                },
                {
                    target: "#roadmap-step-3",
                    header: { title: "Step 3: Practice Regularly" },
                    content: "Dedicate time each week to practice and improve your skills."
                },
                {
                    target: "#roadmap-step-4",
                    header: { title: "Step 4: Seek Feedback" },
                    content: "Share your progress with others and seek constructive feedback."
                },
                {
                    target: "#roadmap-step-5",
                    header: { title: "Step 5: Reflect on Your Progress" },
                    content: "Regularly reflect on your learning journey and adjust your goals as needed."
                }
            ],
            timelineItems: [
                {
                    color: '#001c44',
                    icon: 'mdi-lightbulb',
                    title: 'Identify Your Interests',
                    content: 'Take time to explore and identify the skills that interest you the most.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#0c5776',
                    icon: 'mdi-target',
                    title: 'Set Small Goals',
                    content: 'Set achievable goals for each skill you want to develop.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#2d99ae',
                    icon: 'mdi-pencil',
                    title: 'Practice Regularly',
                    content: 'Dedicate time each week to practice and improve your skills.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#bcfefe',
                    icon: 'mdi-comment-check',
                    title: 'Seek Feedback',
                    content: 'Share your progress with others and seek constructive feedback.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: '#f8dad0',
                    icon: 'mdi-check-circle',
                    title: 'Reflect on Your Progress',
                    content: 'Regularly reflect on your learning journey and adjust your goals as needed.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['skill-roadmap-tour'].start()
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