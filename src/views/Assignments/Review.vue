<template>
    <div id="page-wrapper">
      <div id="page" class="container-fluid">
        <header id="page-header" class="row">
          <div class="col-12 pt-3 pb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <div class="mr-auto">
                    <div class="page-context-header">
                      <div class="page-header-headings">
                        <h1>{{ assignmentName }}</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-wrap">
                  <div id="page-navbar">
                    <nav role="navigation" aria-label="Breadcrumb trail">
                      <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                          <router-link :to="{ name: 'AssignmentOverview', params: { id: assignmentId } }">
                            {{ assignmentName }}
                          </router-link>
                        </li>
                      </ol>
                    </nav>
                  </div>
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
                    <div v-for="(question, index) in assignment.questions" :key="question.id" class="que multichoice deferredfeedback notyetanswered">
                      <div class="info">
                        <h3 class="no">Question <span class="qno">{{ index + 1 }}</span></h3>
                      </div>
                      <div class="content">
                        <div class="formulation clearfix">
                          <div class="qtext">{{ question.content }}</div>
                          <div class="ablock">
                            <div class="answer">
                              <input name="AnswerChoices.Index" type="hidden" :value="index" />
                              <div v-for="choice in question.choices" :key="choice.id" class="r0">
                                <input type="radio" :value="choice.id" v-model="submission.answers[question.id]" />
                                <label :for="choice.id" class="m-l-1">{{ choice.content }}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="outcome clearfix">
                          <div class="feedback">
                            <div class="rightanswer">The correct answer is:</div>
                            <div v-for="choice in question.choices" v-if="choice.isCorrect" :key="choice.id">
                              {{ choice.content }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        assignmentId: 1, // Replace with actual data
        assignmentName: 'Python Bootcamp 2023',
        assignment: {
          questions: [
            // Example data, replace with actual data
            {
              id: 1,
              content: 'What is the output of print(2 + 3)?',
              choices: [
                { id: 1, content: '5', isCorrect: true },
                { id: 2, content: '23', isCorrect: false },
                { id: 3, content: 'Error', isCorrect: false },
              ],
            },
            {
              id: 2,
              content: 'Which of the following is a Python keyword?',
              choices: [
                { id: 4, content: 'function', isCorrect: false },
                { id: 5, content: 'def', isCorrect: true },
                { id: 6, content: 'loop', isCorrect: false },
              ],
            },
          ],
        },
        submission: {
          answers: {
            1: null, // User's answer for question 1
            2: null, // User's answer for question 2
          },
        },
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  #page-header .card:before {
    width: 0 !important;
  }
  
  * {
    border-top-color: #2f6473;
  }
  
  #responseform, .qtext, .othernav {
    font-size: 18px !important;
  }
  
  #region-main {
    overflow-x: unset;
  }
  
  #page-header {
    font-size: 16px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .info {
    margin: 2rem 0;
  }
  
  .othernav {
    margin: 0.5em 0;
  }
  
  .breadcrumb {
    background-color: unset;
  }
  </style>
  