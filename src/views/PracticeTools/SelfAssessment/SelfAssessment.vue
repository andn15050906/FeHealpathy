<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-title">Tests</h2>
    <!--<div class="test-options">
      <div v-for="(item, index) in surveys" :key="item.id" class="test-option" @click="openTest(item.id)">
        <div class="test-option-image" :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
      </div>
    </div>-->

    <div class="survey-container">
      <div class="survey-grid">
        <SurveyCard v-for="(item, index) in surveys" :key="item.id" :survey="item" @click="openTest(item.id)" />
      </div>
    </div>

    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="closePopup">&times;</span>
        <h3 class="text-center text-title">{{ currentSurvey.title }}</h3>
        <h5 class="text-center">{{ text.pleaseAnswer }}</h5>
        <div class="questions-container">
          <div class="survey-container">
            <SingleSelectSurvey :options="currentSurveyOptions" :padding='"0"' :isSinglePage="true" ref="currentSurveyRef"></SingleSelectSurvey>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { SurveyOptions } from "@/scripts/types/SurveyOptions";
import { CreateMcqChoiceDto, CreateSubmissionDto } from '@/scripts/types/dtos';
import { useRouter } from 'vue-router';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import { createSubmission } from '@/scripts/api/services/submissionsService';
import SingleSelectSurvey from '@/components/SurveyComponents/SingleSelectSurvey.vue';
import SurveyCard from '@/components/SurveyComponents/SurveyCard.vue';

const text = {
  //Please answer the following questions:
  pleaseAnswer : "Bạn hãy trả lời những câu hỏi sau:"
}
const surveys = ref([]);
const showPopup = ref(false);
const currentSurvey = ref({});
const currentSurveyRef = ref();
const currentQuestionIndex = ref(0);
const router = useRouter();

const surveysMapping = {
  "BSI": "Survey_BSI-18.jfif",
  "CD-RISC": "Survey_CD-RISC-10.png",
  "DASS": "Survey_DASS21.png",
  "GAD": "Survey_GAD-7.png",
  "RSE": "Survey_RSE.png",
  "WHO-5": "Survey_WHO-5.png"
}

onBeforeMount(async () => {
  //...
  surveys.value = (await getPagedSurveys()).items
    .filter(item => !item.name.includes("Wellness") && !item.name.includes("First"))
    .map(item => {
      return {
        ...item,
        icon: getSurveyImage(item.name)
      }
    });
})

const getSurveyImage = (name) => {
    for (let key in surveysMapping) {
        if (name.includes(key)) {
            return "/assets/images/surveys/" + surveysMapping[key];
        }
    }
    return "/assets/images/surveys/Survey_Demographic.png";
}

const currentSurveyOptions = computed(() => new SurveyOptions(
  currentSurvey.value,
  '',
  null,
  currentSurvey.value.name.includes("DASS-21")
    ? submitDASS21
    : submitGAD7,
  false,
  true
))

const openTest = (testId) => {
  currentSurvey.value = surveys.value.find(survey => survey.id === testId);
  currentQuestionIndex.value = 0;
  showPopup.value = true;
}
const closePopup = () => {
  showPopup.value = false;
  //currentSurveyRef.resetSurvey();
}
const submitSurvey = async (survey, questionsWithAnswer) => {
  let data = new CreateSubmissionDto(
    survey.id,
    questionsWithAnswer
      .filter(item => survey.questions.find(question => question.id == item.questionId))
      .map(item => {
          return new CreateMcqChoiceDto(item.questionId, item.answerId)
      })
  );
  //return
  return await createSubmission(data);
}
const submitDASS21 = async (questionsWithAnswer) => {
  let survey = surveys.value.find(item => item.name.includes("DASS-21"));
  try {
    var response = await submitSurvey(survey, questionsWithAnswer);
    router.push({ name: 'SubmissionReview', params: { id: response }});
  }
  catch (error) {
    console.log(error);
  }
}
const submitGAD7 = async (questionsWithAnswer) => {
  let survey = surveys.value.find(item => item.name.includes("GAD-7"));
  try {
    var response = await submitSurvey(survey, questionsWithAnswer);
    router.push({ name: 'SubmissionReview', params: { id: response }});
  }
  catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.container {
  display: grid;
  gap: 20px;
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.icon-container {
  margin-bottom: 10px;
}

.icon {
  width: 50px;
  height: 50px;
}

.option-title {
  font-size: 18px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  min-height: 80vh;
  overflow-y: auto;
}

.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
}

.progress, .survey-container {
  width: 95%;
}

.questions-container {
  max-height: 600px;
  overflow-y: auto;
}

input[type="radio"] {
  margin-right: 10px;
}

.selected {
  background-color: #4CAF50;
}

.text-title {
  color: #007bff;
}
</style>