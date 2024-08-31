<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <header id="page-header" class="row">
      <div class="col-12 pt-3 pb-3">
        <div class="card">
          <div class="card-body ">
            <div class="d-flex">
              <div class="mr-auto">
                <div class="page-context-header">
                  <div class="page-header-headings">
                    <h1>{{ assignment.name }}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <nav role="navigation" aria-label="Breadcrumb trail">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link :to="{ name: 'assignment-overview', params: { id: assignment.id } }">
                      {{ assignment.name }}
                    </router-link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div id="page-content" class="row">
      <div id="region-main-box" class="col-12">
        <section id="region-main" class="has-blocks mb-3">
          <div class="card">
            <div class="card-body">
              <span class="notifications" id="user-notifications"></span>
              <div role="main">
                <form @submit.prevent="submitAssignment" id="responseform">
                  <input v-model="timeSpent" type="hidden" id="time-spent" :value="assignment.duration" />
                  <input v-model="assignmentId" type="hidden" id="assignment-id" :value="assignment.id" />
                  <div>
                    <div v-for="(question, index) in assignment.questions" :key="question.id" class="que multichoice">
                      <div class="info">
                        <h3 class="no">Question <span class="qno">{{ index + 1 }}</span></h3>
                      </div>
                      <div class="content">
                        <div class="formulation clearfix">
                          <div class="qtext">{{ question.content }}</div>
                          <div class="ablock">
                            <div class="answer">
                              <input type="hidden" :value="index" />
                              <div v-for="choice in question.choices" :key="choice.id" class="r0">
                                <input type="radio" :name="'answer-' + index" :value="choice.id" v-model="answers[index]" />
                                <label :for="choice.id" class="m-l-1">
                                  {{ choice.content }}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div class="submission-area">
                  <button @click="submitAssignment" id="finish-btn">Finish attempt</button>
                  <div id="quiz-timer" role="timer">
                    Time left: <span id="quiz-time-left">{{ timeLeft }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { getAssignment } from '../services/assignmentService'; 

export default {
  data() {
    return {
      assignment: null,
      loading: true,
      error: null,
      timeLeft: 0,
      answers: [],
      timeSpent: 0,
      assignmentId: '',
    };
  },
  async created() {
    try {
      const id = this.$route.params.id; // Lấy ID từ route params
      const data = await getAssignment(id);
      this.assignment = data;
      this.timeLeft = data.duration;
      this.answers = new Array(data.questions.length).fill(null);

      this.startTimer();
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async submitAssignment() {
      // ...
      console.log('Submitting assignment', this.answers);

      clearInterval(this.timerInterval);
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.timeSpent = this.assignment.duration - this.timeLeft;
        } else {
          this.submitAssignment();
        }
      }, 1000);
    },
  },
  beforeDestroy() {
    clearInterval(this.timerInterval); 
  },
};
</script>

<style scoped>
/* Đưa các styles tương tự như trong Razor Page vào đây */
</style>
