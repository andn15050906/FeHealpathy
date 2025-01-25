<template>
    <div class="container text-center">
        <single-select-survey v-if="childIndex == 0" :options="wellnessSurveyOptions"></single-select-survey>
        <multiple-select-survey v-if="childIndex == 1" :options="whatYouWantSurveyOptions"></multiple-select-survey>
    </div>
</template>

<script>
import { inject } from 'vue';
import { getPagedSurveys } from '@/services/surveysService';
import { createSubmission } from '@/services/submissionsService';
import { getAllPreferenceSurveys, updateUserPreference } from '@/services/preferencesService'
import SingleSelectSurvey from "./SingleSelectSurvey.vue";
import MultipleSelectSurvey from "./MultipleSelectSurvey.vue";
import { SurveyOptions } from "./SurveyOptions";
import { CreateMcqChoiceDto, CreateSubmissionDto } from '@/api/dtos';

export default {
    components: { SingleSelectSurvey, MultipleSelectSurvey },
    methods: {
        submitWellnessSurvey() {
            let survey = this.wellnessSurveyOptions.survey;
            let data = new CreateSubmissionDto(
                survey.id,
                survey.questions.filter(ele => ele.inputValue).map(ele => {
                    return new CreateMcqChoiceDto(ele.id, ele.inputValue)
                })
            );
            createSubmission(data);
            this.switchChild(1);
        },
        async submitWhatYouWantSurvey(selectedOptions) {
            await updateUserPreference({
                sourceId: this.whatYouWantSurvey.id,
                preferenceValueIds: selectedOptions
            });

            await this.sweetAlert
                .showSuccess("Setting up successfully!")
                .then(() => { this.$router.push({ path: '/' }); });
        },
        switchChild(childComponentIndex) {
            this.childIndex = childComponentIndex;
        }
    },
    async mounted() {
        this.wellnessSurvey = (await getPagedSurveys()).items.find(survey => survey.name.includes("Wellness Assessment"));
        this.wellnessSurveyOptions = new SurveyOptions(this.wellnessSurvey, '✨ Let us know about you more ✨', () => { this.switchChild(1) }, this.submitWellnessSurvey);
        this.whatYouWantSurvey = (await getAllPreferenceSurveys()).find(survey => survey.title.includes("What you want us to help you"));
        this.whatYouWantSurveyOptions = new SurveyOptions(this.whatYouWantSurvey, this.whatYouWantSurvey.title, () => { }, this.submitWhatYouWantSurvey);
    },
    data() {
        const sweetAlert = inject('sweetAlert');
        return {
            childIndex: 0,
            wellnessSurvey: {},
            whatYouWantSurvey: {},
            wellnessSurveyOptions: new SurveyOptions({}, '', () => { }, () => { }),
            whatYouWantSurveyOptions: new SurveyOptions({}, '', () => { }, () => { }),
            sweetAlert
        };
    }
};
</script>

<style scoped>
.text-black {
    color: black;
}
</style>