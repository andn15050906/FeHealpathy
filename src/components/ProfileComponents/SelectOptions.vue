<template>
    <div>
        <h2 class="mb-5 text-black">✨ What you want us to help you✨</h2>
        <div class="d-flex flex-column gap-3">
            <button v-for="(option, index) in originalOptions" :key="'original-' + index"
                class="btn btn-outline-primary rounded-pill text-start px-4 py-2 w-100"
                :class="{ active: selectedOptions.includes(option) }" @click="toggleOption(option)"
                style="color: black;">
                {{ option.text }}
            </button>
        </div>
        <div class="mt-4">
            <button class="btn btn-success rounded-pill w-100 mb-2" @click="submitSelection">Submit</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["originalOptions"],
    data() {
        return {
            selectedOptions: []
        };
    },
    methods: {
        toggleOption(option) {
            if (this.selectedOptions.includes(option)) {
                this.selectedOptions = this.selectedOptions.filter((o) => o !== option);
            } else {
                this.selectedOptions.push(option);
            }
        },
        submitSelection() {
            this.$emit("update-original-options", this.selectedOptions);
        }
    }
};
</script>