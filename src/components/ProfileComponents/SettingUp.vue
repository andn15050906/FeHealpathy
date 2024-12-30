<template>
    <div class="calm-component container text-center">
        <component :is="currentComponent" :input-options="inputOptions" :original-options="selectOptions"
            @update-original-options="updateOriginalOptions" @change-component="changeComponent" />
    </div>
</template>

<script>
import InputOptions from "./InputOptions.vue";
import SelectOptions from "./SelectOptions.vue";

export default {
    components: { InputOptions, SelectOptions },
    data() {
        return {
            currentComponent: "InputOptions",
            inputOptions: [
                {
                    text: "🧘‍♀️ How would you rate your overall mental well-being?",
                    inputValue: "",
                    options: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"]
                },
                {
                    text: "🏋️‍♂️ How often do you engage in physical activities or exercise?",
                    inputValue: "",
                    options: ["Daily", "A few times a week", "Once a week", "Rarely", "Never"]
                },
                {
                    text: "💤 How would you describe the quality of your sleep?",
                    inputValue: "",
                    options: ["Very Poor", "Poor", "Average", "Good", "Very Good"]
                },
                {
                    text: "🍎 How balanced and nutritious do you think your current diet is?",
                    inputValue: "",
                    options: ["Very Poor", "Poor", "Average", "Good", "Very Good"]
                },
                {
                    text: "📆 How often do you take time to relax or practice self-care?",
                    inputValue: "",
                    options: ["Daily", "A few times a week", "Once a week", "Rarely", "Never"]
                },
                {
                    text: "🌞 Do you spend time outdoors or get regular sunlight exposure?",
                    inputValue: "",
                    options: ["Yes", "No"]
                },
                {
                    text: "📱 On average, how many hours a day do you spend on screens (e.g., phone, computer, TV)?",
                    inputValue: "",
                    options: ["Less than 2 hours", "2-4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"]
                },
                {
                    text: "🧘 What activity helps you relax and recharge the most?",
                    inputValue: "",
                    options: ["Meditation", "Exercise", "Spending time with loved ones", "Hobbies", "Other"]
                }
            ],
            selectOptions: [
                { "text": "🌙 Improve sleep quality and establish a healthy routine" },
                { "text": "💆 Reduce stress, anxiety, and enhance emotional well-being" },
                { "text": "🏋️‍♂️ Boost physical health and increase energy levels" },
                { "text": "🧠 Improve focus, memory, and mental clarity" },
                { "text": "🍎 Build and maintain a balanced, healthy diet" },
                { "text": "🧘 Cultivate mindfulness and a positive mindset" }
            ],
            selectedOptions: []
        };
    },
    methods: {
        updateOriginalOptions(updatedOptions) {
            this.selectedOptions = updatedOptions;
        },
        changeComponent(newComponent) {
            this.currentComponent = newComponent;
        }
    }
};
</script>

<style scoped>
.text-black {
    color: black;
}
</style>