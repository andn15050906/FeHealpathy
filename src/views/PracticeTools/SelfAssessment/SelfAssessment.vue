<template>
  <div class="container">
    <h2 class="fw-bold text-center mb-5 text-dark">Đánh Giá Sức Khỏe Tinh Thần</h2>
    <div class="survey-grid">
      <SurveyCard v-for="(item, index) in surveys" :key="item.id" :survey="item" @click="openTest(item.id)" />
    </div>
  </div>

  <!-- Modal Popup (kept inside the same hierarchy) -->
  <div v-if="showPopup" class="popup">
    <div class="popup-content">
      <span class="close" @click="closePopup">&times;</span>
      <h4 class="popup-title">{{ currentSurvey.title }}</h4>
      <h5 class="popup-subtitle">{{ text.pleaseAnswer }}</h5>
      <div class="questions-container">
        <div class="survey-inner-container">
          <SingleSelectSurvey :options="currentSurveyOptions" :padding='"0"' :isSinglePage="true"
            ref="currentSurveyRef" />
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
import { forceUpdateMilestone } from '@/scripts/api/services/statisticsService';
import SingleSelectSurvey from '@/components/SurveyComponents/SingleSelectSurvey.vue';
import SurveyCard from '@/components/SurveyComponents/SurveyCard.vue';
import { getUserProfile } from '../../../scripts/api/services/authService';

const text = {
  pleaseAnswer: "Bạn hãy trả lời những câu hỏi sau:"
}
const surveys = ref([]);
const showPopup = ref(false);
const currentSurvey = ref({});
const currentSurveyRef = ref();
const currentQuestionIndex = ref(0);
const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
});

const surveysMapping = {
  "BSI": {
    image: "Survey_BSI-18.jfif",
    description: "Đánh giá các triệu chứng tâm lý phổ biến như lo âu, trầm cảm và các vấn đề thể chất"
  },
  "CD-RISC": {
    image: "Survey_CD-RISC-10.png",
    description: "Đánh giá khả năng phục hồi và đối phó với stress trong cuộc sống"
  },
  "DASS": {
    image: "Survey_DASS21.png",
    description: "Đánh giá mức độ trầm cảm, lo âu và stress trong 7 ngày qua"
  },
  "GAD": {
    image: "Survey_GAD-7.png",
    description: "Đánh giá mức độ lo âu tổng quát trong 2 tuần gần đây"
  },
  "RSE": {
    image: "Survey_RSE.png",
    description: "Đánh giá mức độ tự trọng và cách nhìn nhận bản thân"
  },
  "WHO-5": {
    image: "Survey_WHO-5.png",
    description: "Đánh giá mức độ hạnh phúc và sức khỏe tinh thần tổng quát"
  }
}

const getSurveyInfo = (name) => {
  for (let key in surveysMapping) {
    if (name.includes(key)) {
      return {
        icon: "/assets/images/surveys/" + surveysMapping[key].image,
        description: surveysMapping[key].description
      };
    }
  }
  return {
    icon: "/assets/images/surveys/Survey_Demographic.png",
    description: "Bài đánh giá tổng quát"
  };
}

onBeforeMount(async () => {
  surveys.value = (await getPagedSurveys()).items
    .filter(item => !item.name.includes("Wellness") && !item.name.includes("First"))
    .map(item => {
      const info = getSurveyInfo(item.name);
      return {
        ...item,
        icon: info.icon,
        description: info.description
      }
    });

  if (props.id) {
    openTest(props.id);
  }
})

const currentSurveyOptions = computed(() => new SurveyOptions(
  currentSurvey.value,
  '',
  null,
  submitCallback,
  false,
  true
))

const openTest = (testId) => {
  currentSurvey.value = surveys.value.find(survey => survey.id === testId);
  currentQuestionIndex.value = 0;
  if (currentSurvey.value) {
    showPopup.value = true;
  }
}

const closePopup = () => {
  showPopup.value = false;
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
  return await createSubmission(data);
}

const submitCallback = async (questionsWithAnswer) => {
  try {
    var response = await submitSurvey(currentSurvey.value, questionsWithAnswer);
    console.log(currentSurvey.value);
    if (currentSurvey.value.name && currentSurvey.value.name.includes('RSE')) {
      try {
        var currentRoadmap = getUserProfile().roadmapId;
        await forceUpdateMilestone(
          currentRoadmap == '8cacd52d-bad9-4dbb-b361-f388fd3d46de'
            ? '2C4407AB-5638-4D11-97DA-5999781F0DDF'
            : 'DD83AC77-5F83-4DFD-B448-629AACBD16F9',
          currentRoadmap == '8cacd52d-bad9-4dbb-b361-f388fd3d46de'
            ? 'D9FB3264-1FAC-408E-9F9A-F201E06E2468'
            : 'B71C303E-B69D-41D0-875E-C38CB62A03B6'
        );
      }
      catch(ex) { } 
    }
    router.push({ name: 'SubmissionReview', params: { id: response } });
  }
  catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 0 15px;
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close:hover {
  color: #47a3ff;
}

.popup-title {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.popup-subtitle {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #555;
  text-align: center;
}

.questions-container {
  padding: 10px 0;
}

.survey-inner-container {
  width: 100%;
}

.survey-card {
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.survey-card:hover {
  transform: translateY(-5px);
}

.survey-description {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
  padding: 0 10px;
}
</style>