<template>
    <div>
        <h2 class="mb-5 text-black">✨ What you want us to help you?✨</h2>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="d-flex flex-column gap-3" style="width: 80%">
                <button v-for="(option, index) in originalOptions" :key="'original-' + index"
                    class="btn btn-outline-primary rounded-pill text-start px-4 py-2 w-100"
                    :class="{ active: selectedOptions.includes(option) }" @click="toggleOption(option)"
                    style="color: black; padding: 0 8px;">
                    {{ option.text }}
                </button>
            </div>
        </div>
        <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
            <GlowingButton primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100"
                @click="submitSelection">Submit</GlowingButton>
        </div>
    </div>
</template>

<script>
import GlowingButton from '@/components/Common/GlowingButton.vue';

export default {
    components: { GlowingButton },
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