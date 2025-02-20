<template>
    <div class="container text-center">
        <single-select-survey v-if="childIndex == 0" :options="firstEvaluationOptions"></single-select-survey>
        <PersonalRoadmap v-if="childIndex == 1" :nextScreenCallback="() => switchChild(true)" />
        <single-select-survey v-if="childIndex == 2" :options="wellnessSurveyOptions"></single-select-survey>
        <!--Additionally provided-->
        <multiple-select-survey v-if="childIndex == 3" :options="whatYouWantSurveyOptions"></multiple-select-survey>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import { createSubmission } from '@/scripts/api/services/submissionsService';
import { getAllPreferenceSurveys, updateUserPreference } from '@/scripts/api/services/preferencesService'
import SingleSelectSurvey from "./SingleSelectSurvey.vue";
import MultipleSelectSurvey from "./MultipleSelectSurvey.vue";
import { SurveyOptions } from "./SurveyOptions";
import { CreateMcqChoiceDto, CreateSubmissionDto } from '@/scripts/types/dtos';
import PersonalRoadmap from './PersonalRoadmap.vue';

const sweetAlert = inject('sweetAlert');
const childIndex = ref(0);
const firstEvaluationOptions = ref(new SurveyOptions({}, '', () => { }, () => { }));
const wellnessSurveyOptions = ref(new SurveyOptions({}, '', () => { }, () => { }));
const whatYouWantSurveyOptions = ref(new SurveyOptions({}, '', () => { }, () => { }));
const router = useRouter();

const submitSurvey = async (survey) => {
    let data = new CreateSubmissionDto(
        survey.id,
        survey.questions.filter(ele => ele.inputValue).map(ele => {
            return new CreateMcqChoiceDto(ele.id, ele.inputValue)
        })
    );
    await createSubmission(data);
}
const submitFirstEvaluation = async () => {
    await submitSurvey(firstEvaluationOptions.value.survey);
    await sweetAlert
        .showSuccess("Keep up with Healpathy!");
    switchChild(true);
}
const submitWellnessSurvey = async () => {
    await submitSurvey(wellnessSurveyOptions.value.survey);
    await sweetAlert
        .showSuccess("Keep up with Healpathy!");
    switchChild(true);
}
const submitWhatYouWantSurvey = async (selectedOptions) => {
    await updateUserPreference({
        sourceId: whatYouWantSurveyOptions.value.survey.id,
        preferenceValueIds: selectedOptions
    });

    await sweetAlert
        .showSuccess("Setting up successfully!")
        .then(() => { router.push({ path: '/' }); });
}

const switchChild = (isForward) => {
    childIndex.value = isForward ? childIndex.value + 1 : childIndex.value - 1;
}

(async () => {
    var surveys = await getPagedSurveys();
    var preferencesSurveys = await getAllPreferenceSurveys();

    firstEvaluationOptions.value = new SurveyOptions(
        surveys.items.find(item => item.name.includes("First Evaluation")),
        '✨ Let us know about you more ✨',
        () => { switchChild(true) },
        submitFirstEvaluation
    );
    wellnessSurveyOptions.value = new SurveyOptions(
        surveys.items.find(survey => survey.name.includes("Wellness Assessment")),
        '✨ Let us know about you more ✨',
        () => { switchChild(true) },
        submitWellnessSurvey
    );
    whatYouWantSurveyOptions.value = new SurveyOptions(
        preferencesSurveys.find(survey => survey.title.includes("What you want us to help you")),
        "✨ What you want us to help you? ✨",
        () => { },
        submitWhatYouWantSurvey
    );
})()
</script>

<style scoped>
.text-black {
    color: black;
}
</style>