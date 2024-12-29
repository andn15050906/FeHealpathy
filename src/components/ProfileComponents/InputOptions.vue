<template>
    <div>
        <h2 class="mb-5 text-black">✨ Let us know about you more ✨</h2>
        <div class="d-flex flex-column gap-3">
            <div v-for="(option, index) in inputOptions" :key="'input-' + index">
                <input v-if="option.type !== 'select'" :type="option.type || 'text'"
                    class="form-control rounded-pill border-primary" :placeholder="option.text"
                    v-model="option.inputValue" />

                <div v-if="option.type === 'select'">
                    <select v-model="option.inputValue" class="form-control rounded-pill border-primary">
                        <option style="" value="" disabled selected>{{ option.text }}</option>
                        <option v-for="(answer, index) in option.options" :key="'select-' + index" :value="answer">
                            {{ answer }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <button class="btn btn-success rounded-pill w-100 mb-2" @click="continueSelection">Continue</button>
            <button class="btn btn-secondary rounded-pill w-100" @click="skipSelection">Skip for now</button>
        </div>
    </div>
</template>

<script>
export default {
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
</style>