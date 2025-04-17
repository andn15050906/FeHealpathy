<template>
    <div class="container text-center">
        <SingleSelectSurvey v-if="childIndex == 0" :options="firstEvaluationOptions"></SingleSelectSurvey>
        <SingleSelectSurvey v-if="childIndex == 1" :options="wellnessSurveyOptions"></SingleSelectSurvey>
        <MultipleSelectSurvey v-if="childIndex == 2" :options="whatYouWantSurveyOptions"></MultipleSelectSurvey>
        <PersonalRoadmap v-if="childIndex == 3" :nextScreenCallback="() => { router.push({ path: '/' }); }" :enableTour="true" />
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { SurveyOptions } from "@/scripts/types/SurveyOptions";
import { CreateMcqChoiceDto, CreateSubmissionDto } from '@/scripts/types/dtos';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import { createSubmission } from '@/scripts/api/services/submissionsService';
import { getAllPreferenceSurveys, updateUserPreference } from '@/scripts/api/services/preferencesService'
import { getRoadmap } from '@/scripts/api/services/recommendService';
import { updateRoadmap } from '@/scripts/api/services/userService';
import { getUserProfile, setUserProfile } from '@/scripts/api/services/authService';
import SingleSelectSurvey from "@/components/SurveyComponents/SingleSelectSurvey.vue";
import MultipleSelectSurvey from "@/components/SurveyComponents/MultipleSelectSurvey.vue";
import PersonalRoadmap from '../../components/RoadmapComponents/PersonalRoadmap.vue';
import { onBeforeMount } from 'vue';

const sweetAlert = inject('sweetAlert');
const spinner = inject('loadingSpinner');
const roadmapProgress = inject('roadmapProgress');
const childIndex = ref(-1);
const firstEvaluationOptions = ref(new SurveyOptions({}, '', () => { }, () => { }, false, false));
const wellnessSurveyOptions = ref(new SurveyOptions({}, '', () => { }, () => { }, false, false));
const whatYouWantSurveyOptions = ref(new SurveyOptions({}, '', () => { }, () => { }, false, false));
const router = useRouter();

const submitSurvey = async (survey, questionsWithAnswer) => {
    let data = new CreateSubmissionDto(
        survey.id,
        questionsWithAnswer
            .filter(item => survey.questions.find(question => question.id == item.questionId))
            .map(item => {
                return new CreateMcqChoiceDto(item.questionId, item.answerId)
            })
    );
    await createSubmission(data);
}
const submitFirstEvaluation = async (questionsWithAnswer) => {
    await submitSurvey(firstEvaluationOptions.value.survey, questionsWithAnswer);
    await sweetAlert.showSuccess("Tiếp tục với Healpathy!");
    switchChild(true);
}
const submitWellnessSurvey = async (questionsWithAnswer) => {
    await submitSurvey(wellnessSurveyOptions.value.survey, questionsWithAnswer);
    await sweetAlert.showSuccess("Tiếp tục với Healpathy!");
    switchChild(true);
}
const submitWhatYouWantSurvey = async (selectedOptions) => {
    spinner.showSpinner();
    await updateUserPreference({
        sourceId: whatYouWantSurveyOptions.value.survey.id,
        preferenceValueIds: selectedOptions
    });
    let recommendedRoadmap = await getRoadmap();
    if (recommendedRoadmap) {
        await updateRoadmap(recommendedRoadmap);

        let user = getUserProfile();
        user.roadmapId = recommendedRoadmap;
        setUserProfile(user);
        roadmapProgress.fetchPersonalRoadmap();
    }
    spinner.hideSpinner();

    await sweetAlert.showSuccess("Vui lòng đợi trong khi chúng tôi thiết lập lộ trình cho bạn!");
    switchChild(true);
}

const switchChild = (isForward) => {
    childIndex.value = isForward ? childIndex.value + 1 : childIndex.value - 1;
}

onBeforeMount(async () => {
    var surveys = await getPagedSurveys();
    var preferencesSurveys = await getAllPreferenceSurveys();

    firstEvaluationOptions.value = new SurveyOptions(
        surveys.items.find(item => item.name.includes("First Evaluation")),
        '✨ Hãy cho chúng tôi biết thêm về bạn ✨',
        () => { switchChild(true) },
        submitFirstEvaluation,
        false,
        false
    );
    wellnessSurveyOptions.value = new SurveyOptions(
        surveys.items.find(survey => survey.name.includes("Wellness Assessment")),
        '✨ Hãy cho chúng tôi biết thêm về bạn ✨',
        () => { switchChild(true) },
        submitWellnessSurvey,
        false,
        false
    );
    whatYouWantSurveyOptions.value = new SurveyOptions(
        preferencesSurveys.find(survey => survey.title.includes("What you want us to help you")),
        "✨ Bạn muốn chúng tôi giúp gì? ✨",
        null,
        submitWhatYouWantSurvey,
        false,
        false
    );

    childIndex.value = 0;
});
</script>

<style scoped>
.text-black {
    color: black;
}
</style>