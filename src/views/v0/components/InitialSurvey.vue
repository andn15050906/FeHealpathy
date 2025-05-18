<template>
  <v-dialog v-model="showDialog" persistent :theme="currentTheme" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar :color="$vuetify.theme.current.colors.primary" dark>
        <v-toolbar-title>Mental Health Assessment</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="!surveyStarted" icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container class="pa-6">
        <!-- Welcome Screen -->
        <div v-if="!surveyStarted && !surveyCompleted" class="text-center animate-fade-in">
          <v-avatar color="primary" size="96" class="mb-6">
            <v-icon size="64" color="white">mdi-heart-pulse</v-icon>
          </v-avatar>
          
          <h1 class="text-h4 font-weight-bold mb-4">Welcome to Your Mental Health Journey</h1>
          <p class="text-body-1 mb-8 mx-auto" style="max-width: 600px">
            To provide you with a personalized experience, we'd like to understand your current situation better. 
            This assessment will help us recommend the most suitable path for your mental health journey.
          </p>
          
          <v-btn color="primary" size="large" rounded="pill" @click="startSurvey" class="px-8">
            Start Assessment
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!-- Survey Questions -->
        <div v-if="surveyStarted && !surveyCompleted">
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
        </div>

        <!-- Survey Results and Path Selection -->
        <div v-if="surveyCompleted" class="animate-fade-in">
          <!-- Results Summary -->
          <v-card class="mb-6" rounded="lg" elevation="3">
            <v-card-title class="text-h5">Your Assessment Results</v-card-title>
            
            <v-card-text>
              <p class="text-h6 font-weight-medium mb-4">Current Situation Overview</p>
              <p class="text-body-1 mb-6">{{ analysisResults.overview }}</p>
              
              <v-divider class="mb-6"></v-divider>
              
              <p class="text-h6 font-weight-medium mb-4">Key Areas of Focus</p>
              <v-chip-group>
                <v-chip
                  v-for="(area, index) in analysisResults.keyAreas"
                  :key="index"
                  color="primary"
                  variant="outlined"
                  class="ma-1"
                >
                  {{ area }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
          
          <!-- Personalized Path Suggestions -->
          <p class="text-h5 font-weight-bold mb-4">Recommended Paths for You</p>
          <p class="text-body-1 mb-6">
            Based on your responses, we've identified three personalized paths that may help address your current needs.
            Please select the one that resonates most with you.
          </p>
          
          <v-row>
            <v-col
              v-for="(path, index) in analysisResults.suggestedPaths"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card
                :class="{ 'selected-path': selectedPathIndex === index }"
                height="100%"
                @click="selectPath(index)"
                hover
                rounded="lg"
                elevation="3"
              >
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar :color="path.color" class="text-white">
                      <v-icon>{{ path.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title>{{ path.name }}</v-card-title>
                  <v-card-subtitle>{{ path.target }}</v-card-subtitle>
                </v-card-item>
                
                <v-card-text>
                  <p class="mb-4">{{ path.description }}</p>
                  <p class="text-caption">
                    <v-icon small color="grey">mdi-information-outline</v-icon>
                    Based on {{ path.source }}
                  </p>
                </v-card-text>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click.stop="selectPath(index)"
                  >
                    {{ selectedPathIndex === index ? 'Selected' : 'Select This Path' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          
          <div class="d-flex justify-center mt-8">
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              :disabled="selectedPathIndex === null"
              @click="confirmPathSelection"
              class="px-8"
            >
              Begin Your Journey
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTheme } from 'vuetify';

const props = defineProps({
  modelValue: Boolean,
  currentTheme: {
    type: String,
    default: 'refreshing'
  }
});

const emit = defineEmits(['update:modelValue', 'path-selected', 'close']);

const theme = useTheme();

// Dialog control
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Survey state
const surveyStarted = ref(false);
const surveyCompleted = ref(false);
const currentQuestionIndex = ref(0);
const selectedPathIndex = ref(null);

const startSurvey = () => {
  surveyStarted.value = true;
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < surveyQuestions.length - 1) {
    currentQuestionIndex.value++;
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const currentQuestion = computed(() => surveyQuestions[currentQuestionIndex.value]);

const canProceed = computed(() => {
  const question = currentQuestion.value;
  if (question.type === 'checkbox') {
    return question.selectedOptions && question.selectedOptions.length > 0;
  }
  return question.answer !== null && question.answer !== '';
});

const completeSurvey = () => {
  analyzeResults();
  surveyCompleted.value = true;
};

const selectPath = (index) => {
  selectedPathIndex.value = index;
};

const confirmPathSelection = () => {
  if (selectedPathIndex.value !== null) {
    emit('path-selected', analysisResults.value.suggestedPaths[selectedPathIndex.value]);
    showDialog.value = false;
  }
};

// Survey questions
const surveyQuestions = [
  {
    question: "Which of the following best describes your current situation?",
    type: "multiple-choice",
    options: [
      { text: "I'm a student dealing with academic pressure", value: "student" },
      { text: "I'm a working professional managing work-life balance", value: "professional" },
      { text: "I'm a senior looking to maintain mental wellbeing", value: "senior" },
      { text: "I'm a caregiver supporting others", value: "caregiver" },
      { text: "Other/Prefer not to say", value: "other" }
    ],
    answer: null
  },
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
    question: "How would you rate your overall anxiety levels?",
    type: "scale",
    minLabel: "Very low",
    maxLabel: "Very high",
    answer: null
  },
  {
    question: "Which of the following symptoms have you been experiencing? (Select all that apply)",
    type: "checkbox",
    options: [
      { text: "Difficulty sleeping", value: "sleep" },
      { text: "Changes in appetite", value: "appetite" },
      { text: "Trouble concentrating", value: "concentration" },
      { text: "Feeling overwhelmed", value: "overwhelmed" },
      { text: "Social withdrawal", value: "social" },
      { text: "Loss of interest in activities", value: "interest" },
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
    question: "Which areas would you like to focus on improving? (Select all that apply)",
    type: "checkbox",
    options: [
      { text: "Managing stress and anxiety", value: "stress" },
      { text: "Improving mood and reducing depression", value: "mood" },
      { text: "Building better sleep habits", value: "sleep" },
      { text: "Developing healthier relationships", value: "relationships" },
      { text: "Increasing motivation and productivity", value: "motivation" },
      { text: "Finding more meaning and purpose", value: "purpose" }
    ],
    selectedOptions: []
  },
  {
    question: "Is there anything specific about your mental health concerns that you'd like to share?",
    type: "text",
    placeholder: "Share your thoughts here...",
    answer: null
  }
];

// Analysis results
const analysisResults = ref({
  overview: "",
  keyAreas: [],
  suggestedPaths: []
});

// Analyze survey results and generate personalized paths
const analyzeResults = () => {
  // Get user type
  const userType = surveyQuestions[0].answer;
  
  // Check depression levels
  const depressionLevel = surveyQuestions[1].answer;
  
  // Check anxiety levels
  const anxietyLevel = surveyQuestions[2].answer;
  
  // Get symptoms
  const symptoms = surveyQuestions[3].selectedOptions;
  
  // Get self-care frequency
  const selfCareFrequency = surveyQuestions[4].answer;
  
  // Get focus areas
  const focusAreas = surveyQuestions[5].selectedOptions;
  
  // Additional notes
  const additionalNotes = surveyQuestions[6].answer;

  // Generate overview based on responses
  let overview = "Based on your responses, ";
  
  if (depressionLevel >= 2) {
    overview += "you appear to be experiencing significant symptoms of depression. ";
  } else if (depressionLevel === 1) {
    overview += "you're showing some signs of low mood. ";
  }
  
  if (anxietyLevel >= 4) {
    overview += "Your anxiety levels seem to be quite high. ";
  } else if (anxietyLevel >= 3) {
    overview += "You're experiencing moderate levels of anxiety. ";
  }
  
  if (symptoms.includes("concentration") && symptoms.includes("motivation")) {
    overview += "You're having difficulties with concentration and motivation, which may be affecting your daily functioning. ";
  }
  
  if (symptoms.includes("sleep")) {
    overview += "Sleep difficulties are affecting your wellbeing. ";
  }
  
  if (selfCareFrequency <= 1) {
    overview += "You could benefit from incorporating more regular self-care practices into your routine.";
  } else if (selfCareFrequency >= 3) {
    overview += "You're already engaging in regular self-care, which is excellent.";
  }

  // Determine key areas based on symptoms and focus areas
  const keyAreas = [];
  
  if (depressionLevel >= 1) keyAreas.push("Mood Improvement");
  if (anxietyLevel >= 3) keyAreas.push("Anxiety Management");
  if (symptoms.includes("sleep")) keyAreas.push("Sleep Quality");
  if (symptoms.includes("concentration")) keyAreas.push("Focus & Concentration");
  if (symptoms.includes("social")) keyAreas.push("Social Connection");
  if (focusAreas.includes("motivation")) keyAreas.push("Motivation");
  if (focusAreas.includes("purpose")) keyAreas.push("Purpose & Meaning");
  if (focusAreas.includes("relationships")) keyAreas.push("Healthy Relationships");

  // Generate personalized path suggestions based on user type and needs
  const suggestedPaths = [];
  
  // Path A - Different for each user type
  if (userType === "student") {
    suggestedPaths.push({
      name: "Academic Resilience Path",
      target: "Designed for students",
      description: "This path focuses on managing academic stress, improving focus, and building resilience while balancing study demands with self-care.",
      source: "Dr. Martin Seligman's Positive Psychology framework",
      color: "indigo",
      icon: "mdi-school",
      phases: generatePhases("student", keyAreas)
    });
  } else if (userType === "professional") {
    suggestedPaths.push({
      name: "Work-Life Balance Path",
      target: "Designed for working professionals",
      description: "This path helps you manage workplace stress, set healthy boundaries, and develop strategies for maintaining wellbeing in a demanding career.",
      source: "Dr. David Burns' Cognitive Behavioral Therapy approach",
      color: "blue",
      icon: "mdi-briefcase",
      phases: generatePhases("professional", keyAreas)
    });
  } else if (userType === "senior") {
    suggestedPaths.push({
      name: "Healthy Aging Path",
      target: "Designed for seniors",
      description: "This path focuses on maintaining cognitive health, finding purpose in later life stages, and building social connections to support wellbeing.",
      source: "Dr. Dilip Jeste's research on successful aging",
      color: "purple",
      icon: "mdi-account-group",
      phases: generatePhases("senior", keyAreas)
    });
  } else if (userType === "caregiver") {
    suggestedPaths.push({
      name: "Caregiver Support Path",
      target: "Designed for caregivers",
      description: "This path helps you maintain your own wellbeing while supporting others, focusing on self-compassion and preventing burnout.",
      source: "Dr. Kristin Neff's Self-Compassion framework",
      color: "pink",
      icon: "mdi-hand-heart",
      phases: generatePhases("caregiver", keyAreas)
    });
  } else {
    suggestedPaths.push({
      name: "Core Wellbeing Path",
      target: "General approach",
      description: "A foundational path focusing on essential mental health skills applicable to various life situations and challenges.",
      source: "World Health Organization's wellbeing guidelines",
      color: "teal",
      icon: "mdi-heart-pulse",
      phases: generatePhases("general", keyAreas)
    });
  }
  
  // Path B - Based on symptoms
  if (depressionLevel >= 2 || anxietyLevel >= 4 || symptoms.includes("mood")) {
    suggestedPaths.push({
      name: "Mood & Anxiety Management Path",
      target: "For managing depression and anxiety",
      description: "This evidence-based path combines cognitive behavioral techniques with mindfulness to help reduce symptoms of depression and anxiety.",
      source: "Dr. Aaron Beck's Cognitive Therapy principles",
      color: "green",
      icon: "mdi-meditation",
      phases: generatePhases("mood", keyAreas)
    });
  } else if (symptoms.includes("sleep") || symptoms.includes("physical")) {
    suggestedPaths.push({
      name: "Mind-Body Connection Path",
      target: "For physical and sleep-related concerns",
      description: "This path focuses on the connection between physical and mental health, with emphasis on sleep hygiene, nutrition, and gentle movement.",
      source: "Dr. Andrew Weil's Integrative Medicine approach",
      color: "cyan",
      icon: "mdi-yoga",
      phases: generatePhases("physical", keyAreas)
    });
  } else {
    suggestedPaths.push({
      name: "Resilience Building Path",
      target: "For strengthening mental fortitude",
      description: "This path helps you develop psychological resilience to better handle life's challenges and bounce back from difficulties.",
      source: "Dr. Karen Reivich's resilience research",
      color: "amber",
      icon: "mdi-shield",
      phases: generatePhases("resilience", keyAreas)
    });
  }
  
  // Path C - Based on focus areas
  if (focusAreas.includes("purpose") || focusAreas.includes("motivation")) {
    suggestedPaths.push({
      name: "Purpose & Motivation Path",
      target: "For finding meaning and drive",
      description: "This path helps you connect with your values, discover meaningful goals, and build sustainable motivation for what matters most to you.",
      source: "Dr. Viktor Frankl's Logotherapy principles",
      color: "deep-orange",
      icon: "mdi-compass",
      phases: generatePhases("purpose", keyAreas)
    });
  } else if (focusAreas.includes("relationships")) {
    suggestedPaths.push({
      name: "Social Connection Path",
      target: "For building healthy relationships",
      description: "This path focuses on developing meaningful connections, improving communication, and building a supportive social network.",
      source: "Dr. John Gottman's relationship research",
      color: "red",
      icon: "mdi-account-multiple",
      phases: generatePhases("social", keyAreas)
    });
  } else {
    suggestedPaths.push({
      name: "Mindful Living Path",
      target: "For present-moment awareness",
      description: "This path helps you develop mindfulness skills to reduce stress, increase awareness, and live more fully in the present moment.",
      source: "Dr. Jon Kabat-Zinn's Mindfulness-Based Stress Reduction",
      color: "light-blue",
      icon: "mdi-leaf",
      phases: generatePhases("mindfulness", keyAreas)
    });
  }

  // Update analysis results
  analysisResults.value = {
    overview,
    keyAreas,
    suggestedPaths
  };
};

// Helper function to generate phases for each path
const generatePhases = (pathType, keyAreas) => {
  // This would be more sophisticated in a real application
  // Here we're just creating a simple structure
  
  const phases = [];
  
  // Different phase structures based on path type
  if (pathType === "student") {
    phases.push(
      {
        title: "Academic Stress Management",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("stress", keyAreas)
      },
      {
        title: "Focus & Concentration",
        duration: 10,
        requiredActions: 7,
        actions: generateActions("focus", keyAreas)
      },
      {
        title: "Test Anxiety Reduction",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("anxiety", keyAreas)
      }
    );
  } else if (pathType === "mood") {
    phases.push(
      {
        title: "Understanding Your Emotions",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("emotions", keyAreas)
      },
      {
        title: "Challenging Negative Thoughts",
        duration: 10,
        requiredActions: 7,
        actions: generateActions("thoughts", keyAreas)
      },
      {
        title: "Building Positive Habits",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("habits", keyAreas)
      }
    );
  } else {
    // Generic phases for other path types
    phases.push(
      {
        title: "Self-Awareness & Assessment",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("awareness", keyAreas)
      },
      {
        title: "Skill Building & Practice",
        duration: 10,
        requiredActions: 7,
        actions: generateActions("skills", keyAreas)
      },
      {
        title: "Integration & Maintenance",
        duration: 7,
        requiredActions: 5,
        actions: generateActions("maintenance", keyAreas)
      }
    );
  }
  
  return phases;
};

// Helper function to generate actions for each phase
const generateActions = (phaseType, keyAreas) => {
  // This would be more sophisticated in a real application
  // Here we're just creating sample actions
  
  const actions = [];
  
  if (phaseType === "stress") {
    actions.push(
      {
        title: "Stress Awareness Journal",
        type: "journaling",
        required: true,
        description: "Track your stress triggers and responses throughout the day",
        moods: ["stressed", "anxious"],
        concerns: ["stress", "academic"]
      },
      {
        title: "5-Minute Breathing Exercise",
        type: "meditation",
        required: true,
        description: "Quick breathing technique to use before or during stressful situations",
        moods: ["stressed", "overwhelmed"],
        concerns: ["stress", "focus"]
      },
      {
        title: "Time Management Workshop",
        type: "education",
        required: true,
        description: "Learn effective strategies for managing academic workload",
        moods: ["overwhelmed", "anxious"],
        concerns: ["academic", "productivity"]
      },
      {
        title: "Progressive Muscle Relaxation",
        type: "exercise",
        required: false,
        description: "Physical technique to release tension in your body",
        moods: ["tense", "stressed"],
        concerns: ["physical", "sleep"]
      },
      {
        title: "Study Environment Optimization",
        type: "activity",
        required: false,
        description: "Assess and improve your study space for better focus",
        moods: ["distracted", "frustrated"],
        concerns: ["focus", "productivity"]
      }
    );
  } else if (phaseType === "emotions") {
    actions.push(
      {
        title: "Emotion Tracking Journal",
        type: "journaling",
        required: true,
        description: "Record your emotions throughout the day and identify patterns",
        moods: ["sad", "anxious", "irritable"],
        concerns: ["mood", "awareness"]
      },
      {
        title: "Understanding Depression Article",
        type: "education",
        required: true,
        description: "Learn about the science behind depression and effective treatments",
        moods: ["sad", "apathetic"],
        concerns: ["mood", "education"]
      },
      {
        title: "Mindful Emotion Awareness",
        type: "meditation",
        required: true,
        description: "Guided practice for acknowledging emotions without judgment",
        moods: ["overwhelmed", "emotional"],
        concerns: ["awareness", "mindfulness"]
      },
      {
        title: "Pleasant Activity Scheduling",
        type: "activity",
        required: false,
        description: "Plan and engage in activities that bring you joy",
        moods: ["sad", "apathetic"],
        concerns: ["mood", "motivation"]
      },
      {
        title: "Self-Compassion Exercise",
        type: "CBT",
        required: false,
        description: "Practice treating yourself with kindness during difficult emotions",
        moods: ["self-critical", "sad"],
        concerns: ["self-esteem", "mood"]
      }
    );
  } else {
    // Generic actions for other phase types
    actions.push(
      {
        title: "Daily Reflection Journal",
        type: "journaling",
        required: true,
        description: "Record thoughts, feelings, and insights about your day",
        moods: ["any"],
        concerns: ["awareness", "reflection"]
      },
      {
        title: "Mindfulness Meditation",
        type: "meditation",
        required: true,
        description: "10-minute guided practice for present-moment awareness",
        moods: ["stressed", "anxious", "overwhelmed"],
        concerns: ["stress", "focus"]
      },
      {
        title: "Healthy Habit Builder",
        type: "activity",
        required: true,
        description: "Identify and implement one small healthy habit each day",
        moods: ["motivated", "determined"],
        concerns: ["habits", "wellness"]
      },
      {
        title: "Gratitude Practice",
        type: "CBT",
        required: false,
        description: "Write down three things you're grateful for today",
        moods: ["sad", "apathetic"],
        concerns: ["mood", "perspective"]
      },
      {
        title: "Nature Connection Walk",
        type: "exercise",
        required: false,
        description: "Take a mindful walk outdoors, focusing on your senses",
        moods: ["stressed", "overwhelmed"],
        concerns: ["stress", "physical"]
      }
    );
  }
  
  return actions;
};
</script>

<style scoped>
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

.selected-path {
  border: 2px solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
