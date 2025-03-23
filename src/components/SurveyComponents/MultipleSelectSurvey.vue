<template>
    <div>
        <h2 class="mb-5 text-black">{{ options.title }}</h2>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="d-flex flex-column gap-3" style="width: 80%">
                <button v-for="(val, index) in Object.keys(options.survey.values)" :key="'original-' + index"
                    class="btn btn-outline-primary rounded-pill text-start px-4 py-2 w-100"
                    :class="{ active: selectedOptions.includes(val) }" @click="toggleOption(val)"
                    style="color: black; padding: 0 8px;">
                    {{ options.survey.values[val] }}
                </button>
            </div>
        </div>
        <div class="mt-4" style="display: flex; justify-content: space-around; margin: 10px;">
            <GlowingButton @click="submitSelection"
                primaryColor="#00ffbb" secondaryColor="#32cd32" padding="4px 8px" class="w-100">{{ text.submit }}</GlowingButton>
            <GlowingButton v-if="options.switchCallback" @click="options.switchCallback"
                primaryColor="#bdc3c7" secondaryColor="#2c3e50" padding="4px 8px" class="w-100">{{ text.skipForNow }}</GlowingButton>
        </div>
    </div>
</template>

<script>
import GlowingButton from '@/components/Common/GlowingButton.vue';
import { SurveyOptions } from '@/scripts/types/SurveyOptions';

export default {
    components: { GlowingButton },
    props: {
        options: {
            type: SurveyOptions
        }
    },
    data() {
        return {
            selectedOptions: [],
            text: {
                result: "Kết Quả Test",
                score: "Điểm của bạn:",
                currentQuestion: "Câu hỏi",
                submit: "Gửi kết quả",
                next: "Câu kế tiếp",
                skipForNow: "Bỏ qua"
            }
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
            this.options.submitCallback(this.selectedOptions);
        }
    }
};
</script>