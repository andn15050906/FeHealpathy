<template>
  <div class="container mt-5 p-4 bg-white shadow rounded" style="max-width: 600px;">
    <div v-if="status === 'pending'">
      <h1 class="text-center text-success">Đang đợi phê duyệt...</h1>
    </div>
    <div v-else>
      <h1 class="text-center mb-4">Request To Be An Advisor</h1>

      <div class="mb-3">
        <label class="form-label fw-bold">Upload Your CV:</label>
        <input type="file" accept=".pdf,.doc,.docx" @change="handleCVUpload" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Introduction:</label>
        <textarea v-model="introduction" rows="4" placeholder="Write about yourself..." class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Experience:</label>
        <textarea v-model="experience" rows="4" placeholder="Describe your experience..." class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Upload Your Certificates:</label>
        <input type="file" multiple accept=".pdf,.jpg,.png" @change="handleCertificateUpload" class="form-control" />
        <ul class="list-group mt-3">
          <li v-for="(cert, index) in certificates" :key="index" class="list-group-item">{{ cert.name }}</li>
        </ul>
      </div>

      <button @click="submitRequest" class="btn btn-warning w-100 py-2 fw-bold">Submit Request</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { submitAdvisorRequest, getNotifications } from "@/scripts/api/services/notificationService";

export default {
  setup() {
    const introduction = ref('');
    const experience = ref('');
    const cvFile = ref(null);
    const certificates = ref([]);
    const status = ref('');

    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        cvFile.value = file;
      }
    };

    const handleCertificateUpload = (event) => {
      const files = Array.from(event.target.files);
      certificates.value.push(...files);
    };

    const submitRequest = async () => {
      if (!cvFile.value || !introduction.value || !experience.value) {
        alert("Please upload CV, provide an introduction, and describe your experience.");
        return;
      }

      try {
        await submitAdvisorRequest(cvFile.value, introduction.value, experience.value, certificates.value);
        status.value = 'pending';
        localStorage.setItem('advisor_request_status', 'pending');
      } catch (error) {
        alert("Error submitting request. Please try again.");
      }
    };

    const checkRequestStatus = async () => {
      try {
        const notifications = await getNotifications();
        const advisorRequest = notifications.find(n => n.type === 'advisor_request' && n.status === 'pending');
        if (advisorRequest) {
          status.value = 'pending';
          localStorage.setItem('advisor_request_status', 'pending');
        } else {
          localStorage.removeItem('advisor_request_status');
        }
      } catch (error) {
        console.error("Error checking advisor request status:", error);
      }
    };

    onMounted(async () => {
      const savedStatus = localStorage.getItem('advisor_request_status');
      if (savedStatus) {
        status.value = savedStatus;
      } else {
        await checkRequestStatus();
      }
    });

    return {
      introduction,
      experience,
      cvFile,
      certificates,
      status,
      handleCVUpload,
      handleCertificateUpload,
      submitRequest,
    };
  },
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>