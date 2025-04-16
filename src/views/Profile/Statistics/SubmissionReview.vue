<template>
  <!-- should be v-model ?-->
  <SingleSelectSurvey :options="surveyOptions" ref="surveyRef"></SingleSelectSurvey>
</template>

<script setup>
import { ref, useTemplateRef, onBeforeMount } from 'vue';
import { SurveyOptions } from "@/scripts/types/SurveyOptions";
import { getPagedSubmissions } from '@/scripts/api/services/submissionsService';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import SingleSelectSurvey from "@/components/SurveyComponents/SingleSelectSurvey.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

const surveyOptions = ref(new SurveyOptions({}, '', () => { }, () => { }, true, false));
const surveyRef = useTemplateRef("surveyRef");

onBeforeMount(async () => {
  let resultPromise = getPagedSubmissions({ id: props.id });
  let surveysPromise = getPagedSurveys();
  await Promise.all([resultPromise, surveysPromise]);
  let result = (await resultPromise).items.find(_ => _.id == props.id);
  let survey = (await surveysPromise).items.find(item => item.id == result.surveyId);
  surveyOptions.value = new SurveyOptions(survey, survey.name, null, null, true, false);
  surveyRef.value.setSurveyAndAnswers(surveyOptions.value, result.choices);
})
</script>