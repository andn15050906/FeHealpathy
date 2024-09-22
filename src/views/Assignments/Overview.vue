<template>
    <div id="page-content" class="row">
      <div id="region-main-box" class="col-12">
        <section id="region-main">
          <div class="card">
            <div class="card-body">
              <span class="notifications" id="user-notifications"></span>
              <div role="main">
                <span id="maincontent"></span>
                <h2>{{ assignment.name }}</h2>
                <div class="box quizinfo py-3">
                  <p>Time limit: {{ assignment.duration }} seconds</p>
                  <p>Grade to pass: {{ passGrade }} / 10</p>
                </div>
  
                <div v-if="submissions.length > 0">
                  <h3 style="text-align: center; font-weight: bold;">Summary of your previous attempts</h3>
                  <table class="generaltable quizattemptsummary">
                    <thead>
                      <tr>
                        <th class="header c0" style="text-align:center;">Attempt</th>
                        <th class="header c1" style="text-align:left;">State</th>
                        <th class="header c2" style="text-align:center;">Grade</th>
                        <th class="header c3" style="text-align:center;">Time Spent</th>
                        <th class="header c4 lastcol" style="text-align:center;">Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(submission, index) in submissions" :key="submission.id" class="bestrow">
                        <td class="cell c0" style="text-align:center;">{{ index + 1 }}</td>
                        <td class="cell c1" style="text-align:left;">
                          <span class="statedetails">Submitted at {{ submission.lastModificationTime }}</span>
                        </td>
                        <td class="cell c3" style="text-align:center;">{{ submission.mark }}</td>
                        <td class="cell c3" style="text-align:center;">{{ submission.timeSpentInSec }} seconds</td>
                        <td class="cell c4 lastcol" style="text-align:center;">
                          <router-link :to="{ name: 'ReviewAssignment', params: { assignmentId: assignment.id, submissionId: submission.id } }">
                            Review
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div v-if="submissions.length > 0" id="feedback" class="box generalbox py-3" style="text-align: center; margin-top: 40px;">
                    <h3>Highest grade: {{ highestGrade.toFixed(2) }} / 10.00.</h3>
                    <h3>Status: 
                      <span :style="{ color: highestGrade < passGrade ? 'red' : 'forestgreen' }">
                        {{ highestGrade < passGrade ? 'Not Passed' : 'Passed' }}
                      </span>
                    </h3>
                  </div>
                </div>
  
                <div class="box quizattempt py-3">
                  <div class="singlebutton quizstartbuttondiv">
                    <router-link :to="{ name: 'AttemptAssignment', params: { id: assignment.id } }" class="btn btn-secondary">
                      Attempt quiz
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import { getMin, getByAssignmentId } from '@/services/assignmentService'; 

  export default {
    props: {
      id: String,
    },
    data() {
      return {
        assignment: {},
        passGrade: 8,
        submissions: [],
      };
    },
    method :{
    },
    computed: {
      highestGrade() {
        return this.submissions.length > 0
          ? Math.max(...this.submissions.map(submission => submission.mark))
          : 0;
      },
    },
    mounted() {
      this.assignment = getMin(this.id);
      this.submissions = getByAssignmentId(this.id);
    },
  };
  </script>
  
  <style scoped>
  #region-main-box {
    min-height: 0;
  }
  
  #page-content {
    max-width: 100%;
  }
  
  h2 {
    font-size: 24px;
  }
  
  p {
    font-size: 18px;
  }
  
  .quizattempt {
    display: flex;
    justify-content: center;
  }
  
  .quizattempt a {
    font-size: 18px;
  }
  
  .quizattemptsummary {
    margin-top: 20px;
    width: 100%;
  }
  
  table th,
  table td {
    padding: 0.75rem;
  }
  </style>
  