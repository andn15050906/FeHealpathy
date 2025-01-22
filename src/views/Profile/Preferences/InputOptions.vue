<template>
    <div>
        <h2 class="mb-5 text-black">✨ Let us know about you more ✨</h2>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="d-flex flex-column gap-3" style="width: 80%">
                <div v-for="(option, index) in inputOptions" :key="'input-' + index">
                    <select v-model="option.inputValue" class="form-control rounded-pill border-primary"
                        style="padding: 8px 16px;">
                        <option value="" disabled selected>{{ option.text }}</option>
                        <option v-for="(answer, index) in option.options" :key="'select-' + index" :value="answer">
                            {{ answer }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
            <GlowingButton primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100"
                @click="continueSelection">Continue</GlowingButton>
            <GlowingButton primaryColor="#bdc3c7" secondaryColor="#2c3e50" padding="4px 8px" class="w-100"
                @click="skipSelection">Skip for now</GlowingButton>
        </div>
    </div>
</template>

<script>
import GlowingButton from '@/components/Common/GlowingButton.vue';

export default {
    components: { GlowingButton },
    props: ["inputOptions"],
    methods: {
        continueSelection() {
            this.$emit("change-component", "SelectOptions");
        },
        skipSelection() {
            this.inputOptions.forEach((option) => {
                option.inputValue = option.inputValue || "Skipped";
            });
            this.$emit("change-component", "SelectOptions");
        }
    }
};
</script>

<style scoped>
.text-black {
    color: black;
}

button.active {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
    opacity: 0.9;
}

.rounded-pill:hover:not(:focus) {
    background: rgba(0, 0, 0, 0.1);
}
</style>