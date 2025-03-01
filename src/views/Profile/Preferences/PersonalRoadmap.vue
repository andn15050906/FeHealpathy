<template>
    <v-tour name="roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div class="roadmap-intro">
        <div class="roadmap-text">
            CBT is a gentle therapeutic approach that equips individuals with the tools to understand and manage their thoughts and behaviors at a comfortable pace.
        </div>
        <div class="roadmap-text">
            At Healpathy, we are committed to guiding you through this roadmap, ensuring that you have the support and resources necessary for your mental health journey.
        </div>
        <div class="roadmap-text">
            Embrace the process, and take the first step toward a healthier mindset today! Remember, small steps lead to significant changes.
        </div>
    </div>

    <Roadmap :timelineItems="timelineItems"></Roadmap>
    <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
        <GlowingButton v-if="nextScreenCallback" @click="nextScreenCallback"
            primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100">{{ data.nextScreen }}</GlowingButton>
    </div>
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
<script setup>
import Roadmap from '@/components/PracticeComponents/Roadmap.vue'
import GlowingButton from '@/components/Common/GlowingButton.vue';

const props = defineProps({
    nextScreenCallback: {
        type: Function,
        required: false
    }
});

var data = {
    nextScreen: "Next"
}

const timelineItems = [
    {
        color: 'red-lighten-2',
        icon: 'mdi-star',
        title: 'Treatment Planning',
        // Prioritize issues to address based on their impact on your life.
        // Gain knowledge about your specific mental health concerns.
        // Discuss how CBT has helped others with similar issues.
        content: 'Utilize Case Conceptualization framework to make initial assessment. It is quite frequent to address automatic thoughts and intermediate beliefs as foci of treatment, while addressing core beliefs is often difficult.',
        link: '/practice',
        linkTitle: 'Find out more!'
    },
    {
        color: 'purple-lighten-2',
        icon: 'mdi-book-variant',
        title: 'Goal Setting',
        // Collaboratively set clear, measurable, and realistic goals for therapy.
        content: "Goal setting is the process of collaboratively identifying specific therapeutic outcomes for treatment. Goals must be observable, measurable and achievable and relate to cognitive or behavioral changes relevant to the patient's presenting problem",
        link: '/practice',
        linkTitle: 'Find out more!'
    },
    {
        color: 'green-lighten-1',
        icon: 'mdi-airballoon',
        title: 'Relaxation',
        //Practice relaxation techniques such as deep breathing and mindfulness.
        //Identify activities that bring joy or a sense of accomplishment.
        //Gradually incorporate these activities into your routine to improve mood.
        content: "Relaxation techniques are important for brief therapy. Some people respond to physical procedures (e.g., muscle relaxation and/or deep breathing), while others respond favorably to guided imagery",
        link: '/practice',
        linkTitle: 'Find out more!'
    },
    {
        color: 'indigo-lighten-2',
        icon: 'mdi-layers-triple',
        title: 'Behavioral Activation',
        //Keep a journal to track negative thoughts and their triggers.
        //Challenge and reframe negative thoughts using evidence-based techniques.
        //Replace distorted thoughts with more balanced, realistic ones.
        content: "Make use of practice tools and monitor progress in mood, mastery and confidence",
        link: '/groups',
        linkTitle: 'Find out more!'
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
                    header: { title: "Step 1: Identify the Problem" },
                    content: "Gently define your emotions and issues to understand what you are feeling."
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2: Stabilize Your Mind" },
                    content: "Practice relaxation techniques to reduce stress before entering the change process."
                },
                {
                    target: "#roadmap-step-3",
                    header: { title: "Step 3: Build Positive Habits" },
                    content: "Create a foundation for long-term mental health by establishing small, positive routines."
                },
                {
                    target: "#roadmap-step-4",
                    header: { title: "Step 4: Manage Stress & Emotions" },
                    content: "Learn to maintain a positive mindset and expand your skills through gentle practices."
                },
                {
                    target: "#roadmap-step-5",
                    header: { title: "Step 5: Evaluate & Continue Maintenance" },
                    content: "Check your improvement and continue the process at your own pace."
                }
            ],
            timelineItems: [
                {
                    color: 'red-lighten-2',
                    icon: 'mdi-star',
                    title: 'Identify the Problem',
                    content: 'Utilize tools to define your emotions and issues clearly. This step is crucial for understanding the root causes of your feelings and behaviors, allowing for effective strategies to be developed.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'purple-lighten-2',
                    icon: 'mdi-book-variant',
                    title: 'Stabilize Your Mind',
                    content: 'Learn techniques to reduce stress and prepare for change. This includes mindfulness practices and relaxation techniques that can help you regain control over your thoughts and emotions.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'green-lighten-1',
                    icon: 'mdi-airballoon',
                    title: 'Build Positive Habits',
                    content: 'Establish routines that support long-term mental health. This step focuses on creating daily habits that promote well-being and resilience, ensuring a healthier lifestyle.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'indigo-lighten-2',
                    icon: 'mdi-layers-triple',
                    title: 'Manage Stress & Emotions',
                    content: 'Develop skills to maintain a positive mindset and emotional balance. This involves learning coping strategies and emotional regulation techniques to handle life’s challenges effectively.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'orange-lighten-2',
                    icon: 'mdi-check-circle',
                    title: 'Evaluate & Continue Maintenance',
                    content: 'Regularly assess your progress and adjust your strategies as needed. This step emphasizes the importance of reflection and adaptation in your mental health journey.',
                    link: '/practice',
                    linkTitle: 'Find out more!'
                }
            ]
        }
    },
    mounted() {
        this.$tours['roadmap-tour'].start()
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