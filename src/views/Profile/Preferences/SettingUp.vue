<template>
    <div class="container text-center">
        <component :is="currentComponent" :input-options="inputOptions" :original-options="selectOptions"
            @update-original-options="updateOriginalOptions" @change-component="changeComponent" />
    </div>
</template>

<script>
import data from '@/api/data.json';
import InputOptions from "./InputOptions.vue";
import SelectOptions from "./SelectOptions.vue";

export default {
    components: { InputOptions, SelectOptions },
    data() {
        return {
            currentComponent: "InputOptions",
            inputOptions: data["SettingUp"]["survey"]["questions"].map(item => ({
                ...item, inputValue: ''
            })),
            selectOptions: [
                { "text": "🌙 Reduce stress, anxiety, and enhance emotional well-being" },
                { "text": "💆 Access self-help tools, guided meditations, and mindfulness exercises" },
                { "text": "🏋️‍♂️ Connect with like-minded individuals, share progress and seek advice" },
                { "text": "🧘 Boost physical health and increase energy levels" },
                { "text": "💆 Receive personalized recommendations, enhance skills and achieve personal goals" },
                { "text": "🍎 Establish a healthy routine and develop positive habits" },
                { "text": "🧠 Improve focus, memory, and mental clarity" }
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