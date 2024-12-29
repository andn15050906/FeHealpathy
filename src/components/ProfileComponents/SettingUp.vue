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
                { text: "🧘‍♀️ How would you rate your stress level (on a scale of 1-10)?", inputValue: "", type: "number" },
                { text: "🏋️‍♂️ Do you regularly exercise or stay active (if yes, please describe briefly)?", inputValue: "", type: "text" },
                { text: "💤 Do you regularly get 7-8 hours of sleep every day?", inputValue: "", type: "text" },
                { text: "🍎 Do you feel that your current diet is healthy?", inputValue: "", type: "text" },
                {
                    text: "🌙 What is your ideal bedtime?",
                    inputValue: "",
                    type: "select",
                    options: ["Before 10 PM", "10 PM - 12 AM", "After 12 AM"]
                },
                {
                    text: "💆 What method helps you reduce stress the most?",
                    inputValue: "",
                    type: "select",
                    options: ["Meditation", "Exercise", "Reading", "Music", "Other"]
                }
            ],
            selectOptions: [
                { text: "🌙 Improve sleep quality" },
                { text: "💆 Reduce stress and anxiety" },
                { text: "🏋️‍♂️ Boost physical health" },
                { text: "🧠 Improve focus and mental clarity" },
                { text: "🍎 Build a healthy diet" }
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