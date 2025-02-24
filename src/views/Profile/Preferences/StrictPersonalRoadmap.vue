<template>
    <v-tour name="strict-roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            This roadmap is designed to challenge you and push you towards significant personal growth and self-discovery.
        </div>
        <div class="roadmap-text">
            At Healpathy, we believe in the power of discipline and commitment to achieve mental wellness and emotional stability.
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
                    target: "#strict-roadmap-step-1",
                    header: { title: "Step 1: Acknowledge Your Challenges" },
                    content: "Identify and write down the specific challenges you face in your daily life."
                },
                {
                    target: "#strict-roadmap-step-2",
                    header: { title: "Step 2: Set Clear Goals" },
                    content: "Define measurable and achievable goals to overcome these challenges effectively."
                },
                {
                    target: "#strict-roadmap-step-3",
                    header: { title: "Step 3: Create a Daily Routine" },
                    content: "Establish a strict daily routine that includes time for self-care and reflection."
                },
                {
                    target: "#strict-roadmap-step-4",
                    header: { title: "Step 4: Monitor Your Progress" },
                    content: "Keep a daily journal to track your feelings and progress towards your goals."
                },
                {
                    target: "#strict-roadmap-step-5",
                    header: { title: "Step 5: Seek Accountability" },
                    content: "Share your goals with a trusted friend or therapist to hold yourself accountable."
                }
            ],
            timelineItems: [
                {
                    color: 'red',
                    icon: 'mdi-alert',
                    title: 'Acknowledge Your Challenges',
                    content: 'Write down your challenges to confront them directly. This step is crucial for understanding what holds you back and how to address it effectively.',
                    link: '/practice',
                    linkTitle: 'Learn more!'
                },
                {
                    color: 'orange',
                    icon: 'mdi-target',
                    title: 'Set Clear Goals',
                    content: 'Define specific goals to work towards overcoming your challenges. Clear goals provide direction and motivation for your journey.',
                    link: '/practice',
                    linkTitle: 'Learn more!'
                },
                {
                    color: 'yellow',
                    icon: 'mdi-calendar',
                    title: 'Create a Daily Routine',
                    content: 'Establish a strict routine that prioritizes your mental health. A consistent routine helps build healthy habits and reduces stress.',
                    link: '/practice',
                    linkTitle: 'Learn more!'
                },
                {
                    color: 'green',
                    icon: 'mdi-check-circle',
                    title: 'Monitor Your Progress',
                    content: 'Use a journal to reflect on your daily experiences and progress. Regular reflection helps you stay aware of your growth and areas for improvement.',
                    link: '/practice',
                    linkTitle: 'Learn more!'
                },
                {
                    color: 'blue',
                    icon: 'mdi-account-check',
                    title: 'Seek Accountability',
                    content: 'Engage with a friend or therapist to keep you accountable. Sharing your goals with others increases your commitment and support.',
                    link: '/practice',
                    linkTitle: 'Learn more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['strict-roadmap-tour'].start()
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

.roadmap-intro:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px); 
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

/* Tour Button Styling */
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

/* Links */
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
