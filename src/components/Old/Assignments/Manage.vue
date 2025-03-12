<template>
  <div class="container-fluid" style="margin-top: 40px;">
    <h1 style="font-size: 36px; text-align: center; margin-bottom: 12px">Manage Assignments</h1>

    <div class="card shadow mb-4">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Duration (sec)</th>
                <th class="text-center">Number of questions</th>
                <th class="text-center">Section</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="assignments.length === 0">
                <th style="text-align: center; color: red" colspan="4">Empty</th>
              </tr>
              <tr v-for="assignment in assignments" :key="assignment.id">
                <td>
                  <router-link :to="{ name: 'UpdateAssignment', params: { id: assignment.id } }">
                    {{ assignment.name }}
                  </router-link>
                </td>
                <td>
                  <div>{{ assignment.duration }}</div>
                </td>
                <td>
                  <div>{{ assignment.questionCount }}</div>
                </td>
                <td>
                  <router-link :to="{ name: 'UpdateSection', params: { sectionId: assignment.section?.id } }">
                    {{ assignment.section?.title }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getByCourse } from '@/scripts/api/services/assignmentService';
import { getCourseDetail } from '@/scripts/api/services/courseService';

export default {
  props: {
    courseId: String,
  },
  data() {
    return {
      courseId: this.courseId,
      course: {},
      assignments: [], // Array to hold assignment data
    };
  },
  mounted() {
    // Fetch the assignment data when the component is mounted
    this.getCourseDetail();
    this.getByCourse();
  },
  methods: {
    async getByCourse() {
      const data = await getByCourse(this.courseId);
      this.assignments = data;
    },
    async getCourseDetail() {
      const data = await getCourseDetail(this.courseId);
      this.course = data;
    },
  },
};
</script>

<style scoped>
.app-btn-container {
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 20px;
}

.app-btn-container a {
  width: 200px;
  height: 50px;
  text-align: center;
  font-size: 16px;
  padding: 10px;
}

#dataTable th,
#dataTable td {
  text-align: center;
  vertical-align: middle;
}
</style>