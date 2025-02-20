<template>
    <v-tour name="roadmap-tour" v-if="isTourEnabled && isTourActive" :steps="steps" :options="tourOptions" @end="isTourActive = false" />

    <div>
        <div>
            CBT is a powerful therapeutic approach that equips individuals with the tools to understand and manage their
            thoughts and behaviors.
        </div>
        <div>
            At Healpathy, we are committed to guiding you through this roadmap, ensuring that you have the support and
            resources necessary for your mental health journey.
        </div>
        <div>
            Embrace the process, and take the first step toward a healthier mindset today!
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
                    header: { title: "Step 1" },
                    content: "About step 1...",
                },
                {
                    target: "#roadmap-step-2",
                    header: { title: "Step 2" },
                    content: "About step 2...",
                }
            ],
            timelineItems: [
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
                {
                    color: 'red-lighten-2',
                    icon: 'mdi-star',
                    title: 'Skills development',
                    //Improve interpersonal skills to enhance relationships and assertiveness.
                    //Learn coping strategies to manage anxiety during exposure.
                    //Role-play scenarios to practice new skills in a safe environment.
                    content: "The aim of exposure therapy is to reduce the patient's anxiety response to feared stimuli and increase the patient's ability to experience and tolerate anxiety. The process includes creating a thoughtfully constructed hierarchy of feared stimuli organized by the patient's reported degree of fear",
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'purple-lighten-2',
                    icon: 'mdi-star',
                    title: 'Exposure Therapy',
                    //Establish relationships
                    //Confront fears in a controlled, gradual manner to reduce avoidance behaviors.
                    content: "The aim of exposure therapy is to reduce the patient's anxiety response to feared stimuli and increase the patient's ability to experience and tolerate anxiety. The process includes creating a thoughtfully constructed hierarchy of feared stimuli organized by the patient's reported degree of fear",
                    link: '/practice',
                    linkTitle: 'Find out more!'
                },
                {
                    color: 'green-lighten-1',
                    icon: 'mdi-star',
                    title: 'Reflection and Maintaining Changes',
                    //Regularly review your progress toward therapy goals
                    //Discuss what strategies have been effective and where adjustments may be needed.
                    //Develop a plan to maintain gains achieved during therapy.
                    //Stay connected
                    content: 'Review skills learned in treatment, and to vocalize and problem-solve concerns about functioning outside treatment',
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
        //keep here for later use
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
</style>