<template>
  <v-dialog
    v-model="modelValue"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar :color="$vuetify.theme.current.colors.primary" dark>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Mental Health Assessment</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-container v-if="!surveyCompleted" class="pa-6">
        <!-- Survey Introduction -->
        <v-alert
          color="primary"
          variant="tonal"
          border="start"
          class="mb-6"
        >
          <div class="d-flex">
            <v-icon class="mr-3">mdi-heart</v-icon>
            <div>
              <p>
                This assessment helps us understand your current mental health needs. Your answers are private and will only be used to provide personalized recommendations.
              </p>
            </div>
          </div>
        </v-alert>

        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="d-flex justify-space-between text-caption text-grey mb-2">
            <span>Question {{ currentQuestionIndex + 1 }} of {{ surveyQuestions.length }}</span>
            <span>{{ Math.round(((currentQuestionIndex + 1) / surveyQuestions.length) * 100) }}% Complete</span>
          </div>
          <v-progress-linear
            :model-value="((currentQuestionIndex + 1) / surveyQuestions.length) * 100"
            color="primary"
            height="10"
            rounded
          ></v-progress-linear>
        </div>
        
        <!-- Current question -->
        <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
          <v-card-title class="text-h6">{{ currentQuestion.question }}</v-card-title>
          
          <v-card-text>
            <!-- Multiple choice question -->
            <div v-if="currentQuestion.type === 'multiple-choice'">
              <v-radio-group v-model="currentQuestion.answer">
                <v-radio
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  :label="option.text"
                  :value="option.value"
                  color="primary"
                ></v-radio>
              </v-radio-group>
            </div>
            
            <!-- Scale question -->
            <div v-else-if="currentQuestion.type === 'scale'" class="pt-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption text-grey">{{ currentQuestion.minLabel }}</span>
                <span class="text-caption text-grey">{{ currentQuestion.maxLabel }}</span>
              </div>
              <v-btn-toggle
                v-model="currentQuestion.answer"
                mandatory
                divided
                color="primary"
                class="d-flex"
              >
                <v-btn
                  v-for="value in 5"
                  :key="value"
                  :value="value"
                  class="flex-grow-1"
                >
                  {{ value }}
                </v-btn>
              </v-btn-toggle>
            </div>
            
            <!-- Checkbox question -->
            <div v-else-if="currentQuestion.type === 'checkbox'">
              <v-checkbox
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                v-model="currentQuestion.selectedOptions"
                :label="option.text"
                :value="option.value"
                color="primary"
                hide-details
                class="mb-1"
              ></v-checkbox>
            </div>
            
            <!-- Text question -->
            <div v-else-if="currentQuestion.type === 'text'">
              <v-textarea
                v-model="currentQuestion.answer"
                :placeholder="currentQuestion.placeholder || 'Type your answer here...'"
                rows="4"
                variant="outlined"
              ></v-textarea>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Navigation buttons -->
        <div class="d-flex justify-space-between">
          <v-btn
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            rounded="pill"
          >
            Previous
          </v-btn>
          <div v-else></div>
          
          <v-btn
            v-if="currentQuestionIndex < surveyQuestions.length - 1"
            @click="nextQuestion"
            color="primary"
            append-icon="mdi-arrow-right"
            :disabled="!canProceed"
            rounded="pill"
          >
            Next
          </v-btn>
          <v-btn
            v-else
            @click="completeSurvey"
            color="primary"
            append-icon="mdi-check"
            :disabled="!canProceed"
            rounded="pill"
          >
            Complete Assessment
          </v-btn>
        </div>
      </v-container>
      
      <!-- Survey Results (shown when completed) -->
      <v-container v-if="surveyCompleted" class="pa-6">
        <v-sheet
          color="primary"
          class="text-center pa-8 rounded-lg mb-6 animate-fade-in"
        >
          <v-avatar
            color="white"
            class="mb-4"
            size="64"
          >
            <v-icon color="primary" size="36">mdi-heart</v-icon>
          </v-avatar>
          <h2 class="text-h4 font-weight-bold text-white mb-2">Your Mental Health Assessment</h2>
          <p class="text-h6 text-white-lighten-2 mx-auto" style="max-width: 600px">
            Thank you for completing the assessment. Remember, this is just a starting point for your mental health journey.
          </p>
        </v-sheet>
        
        <!-- Results Summary -->
        <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
          <v-card-title>Your Results</v-card-title>
          
          <v-card-text>
            <div class="mb-6">
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-subtitle-1 font-weight-medium">Overall Wellbeing Score</span>
                <span class="text-h6 font-weight-bold" :class="getScoreTextColor(surveyResults.score)">
                  {{ surveyResults.score }}/100
                </span>
              </div>
              <v-progress-linear
                :model-value="surveyResults.score"
                :color="getScoreColor(surveyResults.score)"
                height="12"
                rounded
              ></v-progress-linear>
            </div>
            
            <p class="text-body-1">{{ surveyResults.summary }}</p>
            
            <v-alert
              color="primary"
              variant="tonal"
              class="mt-6"
              rounded="lg"
            >
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Key Insights</h4>
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(insight, index) in surveyResults.insights"
                  :key="index"
                  :title="insight"
                  prepend-icon="mdi-lightbulb-outline"
                ></v-list-item>
              </v-list>
            </v-alert>
          </v-card-text>
        </v-card>
        
        <!-- Recommended Roadmaps -->
        <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
          <v-card-title>Recommended Roadmaps</v-card-title>
          <v-card-subtitle>Based on your responses, these roadmaps may be helpful for your journey:</v-card-subtitle>
          
          <v-card-text>
            <v-row>
              <v-col
                v-for="(roadmap, index) in surveyResults.recommendedRoadmaps"
                :key="index"
                cols="12"
                md="6"
              >
                <v-card
                  variant="outlined"
                  hover
                  @click="selectRecommendedRoadmap(roadmap.id)"
                  class="h-100 activity-card"
                  rounded="lg"
                >
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-avatar
                        color="primary-lighten-3"
                        class="text-primary"
                      >
                        <v-icon>{{ roadmap.mdiIcon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title>{{ roadmap.title }}</v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="text-body-2 mb-3">{{ roadmap.description }}</p>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-caption text-grey">{{ roadmap.duration }}</span>
                      <span class="text-primary text-caption font-weight-medium d-flex align-center">
                        Start Now
                        <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
                      </span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Recommended Content -->
        <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
          <v-card-title>Recommended Resources</v-card-title>
          <v-card-subtitle>Here are some resources that might be helpful:</v-card-subtitle>
          
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(resource, index) in surveyResults.recommendedResources"
                :key="index"
                :title="resource.title"
                :subtitle="resource.description"
                :prepend-icon="resource.mdiIcon"
                lines="two"
                rounded="lg"
                class="mb-2"
              >
                <template v-slot:append>
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    rounded="pill"
                  >
                    Learn more
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Action Buttons -->
        <div class="d-flex flex-column flex-sm-row justify-space-between gap-4">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-refresh"
            @click="restartSurvey"
            block
            class="flex-grow-1"
            rounded="pill"
          >
            Retake Assessment
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-check"
            @click="closeSurveyAndApplyResults"
            block
            class="flex-grow-1"
            rounded="pill"
          >
            Apply Recommendations & Continue
          </v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  defaultModelValue: Boolean,
  roadmapSteps: Array
})

const modelValue = ref(props.defaultModelValue);

const emit = defineEmits(['update:modelValue', 'select-roadmap'])

// Survey state
const surveyCompleted = ref(false)
const currentQuestionIndex = ref(0)

const nextQuestion = () => {
  if (currentQuestionIndex.value < surveyQuestions.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const currentQuestion = computed(() => surveyQuestions[currentQuestionIndex.value])

const canProceed = computed(() => {
  const question = currentQuestion.value
  if (question.type === 'checkbox') {
    return question.selectedOptions && question.selectedOptions.length > 0
  }
  return question.answer !== null && question.answer !== ''
})

const completeSurvey = () => {
  // Calculate results based on answers
  calculateSurveyResults()
  surveyCompleted.value = true
}

const restartSurvey = () => {
  surveyCompleted.value = false
  currentQuestionIndex.value = 0
  // Reset answers
  surveyQuestions.forEach(question => {
    if (question.type === 'checkbox') {
      question.selectedOptions = []
    } else {
      question.answer = null
    }
  })
}

const closeSurveyAndApplyResults = () => {
  // Apply recommended roadmap if any
  if (surveyResults.value.recommendedRoadmaps.length > 0) {
    emit('select-roadmap', surveyResults.value.recommendedRoadmaps[0].id)
  }
  
  emit('update:modelValue', false)
}

const selectRecommendedRoadmap = (roadmapId) => {
  emit('select-roadmap', roadmapId)
  emit('update:modelValue', false)
}

const getScoreColor = (score) => {
  if (score < 30) return 'error'
  if (score < 50) return 'warning'
  if (score < 70) return 'info'
  if (score < 85) return 'primary'
  return 'success'
}

const getScoreTextColor = (score) => {
  if (score < 30) return 'text-error'
  if (score < 50) return 'text-warning'
  if (score < 70) return 'text-info'
  if (score < 85) return 'text-primary'
  return 'text-success'
}

// Survey questions
const surveyQuestions = [
  {
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    type: "multiple-choice",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ],
    answer: null
  },
  {
    question: "How would you rate your overall energy levels?",
    type: "scale",
    minLabel: "Very low",
    maxLabel: "Very high",
    answer: null
  },
  {
    question: "Which of the following have you been experiencing? (Select all that apply)",
    type: "checkbox",
    options: [
      { text: "Difficulty sleeping", value: "sleep" },
      { text: "Changes in appetite", value: "appetite" },
      { text: "Trouble concentrating", value: "concentration" },
      { text: "Feeling overwhelmed", value: "overwhelmed" },
      { text: "Social withdrawal", value: "social" },
      { text: "Physical tension or pain", value: "physical" }
    ],
    selectedOptions: []
  },
  {
    question: "How often do you engage in activities specifically to support your mental wellbeing?",
    type: "multiple-choice",
    options: [
      { text: "Never", value: 0 },
      { text: "Rarely (a few times a month)", value: 1 },
      { text: "Sometimes (once a week)", value: 2 },
      { text: "Often (several times a week)", value: 3 },
      { text: "Daily", value: 4 }
    ],
    answer: null
  },
  {
    question: "How would you rate your ability to cope with stress?",
    type: "scale",
    minLabel: "Very poor",
    maxLabel: "Very good",
    answer: null
  },
  {
    question: "Which areas of your life would you like to focus on improving? (Select all that apply)",
    type: "checkbox",
    options: [
      { text: "Understanding my emotions better", value: "emotions" },
      { text: "Building a support network", value: "support" },
      { text: "Developing healthier daily habits", value: "habits" },
      { text: "Learning stress management techniques", value: "stress" },
      { text: "Improving sleep quality", value: "sleep" },
      { text: "Finding more meaning and purpose", value: "purpose" }
    ],
    selectedOptions: []
  },
  {
    question: "Is there anything specific you'd like to share about your mental health goals?",
    type: "text",
    placeholder: "Share your thoughts here...",
    answer: null
  }
]

// Survey results (will be calculated based on answers)
const surveyResults = ref({
  score: 0,
  summary: "",
  insights: [],
  recommendedRoadmaps: [],
  recommendedResources: []
})

const calculateSurveyResults = () => {
  // This is a simplified calculation for demo purposes
  // In a real app, you would have a more sophisticated algorithm
  
  // Calculate score (0-100)
  let totalScore = 0
  let maxPossibleScore = 0
  
  // Question 1: Depression frequency (reverse scored)
  if (surveyQuestions[0].answer !== null) {
    totalScore += (3 - surveyQuestions[0].answer) * 5
    maxPossibleScore += 15
  }
  
  // Question 2: Energy levels
  if (surveyQuestions[1].answer !== null) {
    totalScore += surveyQuestions[1].answer * 5
    maxPossibleScore += 25
  }
  
  // Question 3: Symptoms (reverse scored)
  const symptomsCount = surveyQuestions[2].selectedOptions.length
  totalScore += (6 - symptomsCount) * 2
  maxPossibleScore += 12
  
  // Question 4: Mental wellbeing activities
  if (surveyQuestions[3].answer !== null) {
    totalScore += surveyQuestions[3].answer * 5
    maxPossibleScore += 20
  }
  
  // Question 5: Coping with stress
  if (surveyQuestions[4].answer !== null) {
    totalScore += surveyQuestions[4].answer * 5
    maxPossibleScore += 25
  }
  
  // Convert to percentage
  const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100)
  
  // Determine focus areas based on checkbox selections
  const focusAreas = surveyQuestions[5].selectedOptions
  
  // Generate insights
  const insights = []
  
  if (surveyQuestions[0].answer > 1) {
    insights.push("You may be experiencing some symptoms of low mood that could benefit from attention.")
  }
  
  if (surveyQuestions[1].answer < 3) {
    insights.push("Your energy levels might be lower than optimal, which can affect overall wellbeing.")
  }
  
  if (surveyQuestions[2].selectedOptions.includes("sleep")) {
    insights.push("Improving sleep quality could significantly benefit your mental health.")
  }
  
  if (surveyQuestions[3].answer < 2) {
    insights.push("Incorporating more regular mental wellbeing activities could be beneficial.")
  }
  
  if (surveyQuestions[4].answer < 3) {
    insights.push("Developing stronger stress management skills may help you feel more resilient.")
  }
  
  // Generate summary based on score
  let summary = ""
  if (normalizedScore < 30) {
    summary = "Your responses suggest you may be experiencing significant challenges with your mental wellbeing. It's important to remember that seeking professional support is a sign of strength, not weakness. The recommendations below may help, but please consider reaching out to a mental health professional."
  } else if (normalizedScore < 50) {
    summary = "Your responses indicate you're facing some mental health challenges. This is completely normal - we all go through difficult periods. The good news is that there are many strategies that can help improve how you're feeling, and small steps can lead to meaningful progress."
  } else if (normalizedScore < 70) {
    summary = "Your mental wellbeing appears to be in a moderate range. You have strengths to build upon, and there are also areas where focused attention could help you thrive even more. Remember that mental health exists on a spectrum, and we all have room for growth."
  } else if (normalizedScore < 85) {
    summary = "Your responses suggest you're doing well in many aspects of mental wellbeing. You likely have developed some effective strategies for maintaining your mental health. The recommendations below can help you continue to strengthen these practices and address any specific areas you'd like to improve."
  } else {
    summary = "Your responses indicate strong mental wellbeing overall. You appear to have developed effective strategies for maintaining your mental health. The recommendations below focus on continuing to nurture your wellbeing and potentially sharing your strengths with others."
  }
  
  // Determine recommended roadmaps based on focus areas and score
  const recommendedRoadmaps = []
  
  if (focusAreas.includes("emotions") || surveyQuestions[0].answer > 1) {
    recommendedRoadmaps.push({
      id: 0,
      title: "Self-Awareness",
      description: "Develop a deeper understanding of your emotions, thoughts, and behaviors.",
      mdiIcon: "mdi-eye-outline",
      duration: "4-6 weeks"
    })
  }
  
  if (focusAreas.includes("support") || focusAreas.includes("social")) {
    recommendedRoadmaps.push({
      id: 1,
      title: "Seeking Support",
      description: "Build and strengthen your support network for better mental health.",
      mdiIcon: "mdi-account-group-outline",
      duration: "3-4 weeks"
    })
  }
  
  if (focusAreas.includes("habits") || focusAreas.includes("sleep")) {
    recommendedRoadmaps.push({
      id: 2,
      title: "Building Healthy Habits",
      description: "Establish daily routines that support your mental wellbeing.",
      mdiIcon: "mdi-heart-outline",
      duration: "6-8 weeks"
    })
  }
  
  if (focusAreas.includes("stress") || surveyQuestions[4].answer < 3) {
    recommendedRoadmaps.push({
      id: 3,
      title: "Developing Coping Strategies",
      description: "Learn effective techniques to manage stress and difficult emotions.",
      mdiIcon: "mdi-brain",
      duration: "4-6 weeks"
    })
  }
  
  if (focusAreas.includes("purpose") || normalizedScore > 70) {
    recommendedRoadmaps.push({
      id: 4,
      title: "Maintaining Mental Wellness",
      description: "Sustain your mental health and find deeper meaning and purpose.",
      mdiIcon: "mdi-white-balance-sunny",
      duration: "Ongoing"
    })
  }
  
  // If no specific roadmaps were recommended, recommend the first one
  if (recommendedRoadmaps.length === 0) {
    recommendedRoadmaps.push({
      id: 0,
      title: "Self-Awareness",
      description: "Develop a deeper understanding of your emotions, thoughts, and behaviors.",
      mdiIcon: "mdi-eye-outline",
      duration: "4-6 weeks"
    })
  }
  
  // Recommended resources
  const recommendedResources = [
    {
      title: "Understanding Your Emotions",
      description: "A guide to recognizing and processing different emotional states.",
      mdiIcon: "mdi-book-open-variant"
    },
    {
      title: "Stress Management Techniques",
      description: "Practical exercises to reduce stress and increase resilience.",
      mdiIcon: "mdi-file-document-outline"
    },
    {
      title: "Guided Meditation Series",
      description: "10-minute daily meditations to calm your mind and improve focus.",
      mdiIcon: "mdi-video-outline"
    },
    {
      title: "Sleep Improvement Program",
      description: "A structured approach to better sleep quality and habits.",
      mdiIcon: "mdi-music-note"
    }
  ]
  
  // Update survey results
  surveyResults.value = {
    score: normalizedScore,
    summary,
    insights: insights.length > 0 ? insights : ["You appear to be managing well overall."],
    recommendedRoadmaps,
    recommendedResources
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activity-card {
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>