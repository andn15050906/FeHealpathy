<template>
  <div class="container mt-5 p-4 bg-white shadow rounded" style="max-width: 600px;">
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
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const introduction = ref('');
    const experience = ref('');
    const cvFile = ref(null);
    const certificates = ref([]);

    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        cvFile.value = file;
      }
    };

    const handleCertificateUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        certificates.value.push(file);
      });
    };

    const submitRequest = () => {
      if (!cvFile.value || !introduction.value || !experience.value) {
        alert("Please upload CV, provide an introduction, and describe your experience.");
        return;
      }
      console.log("Submitting request with:", {
        cv: cvFile.value.name,
        introduction: introduction.value,
        experience: experience.value,
        certificates: certificates.value.map(cert => cert.name)
      });
      alert("Your request has been submitted successfully!");
    };

    return {
      introduction,
      experience,
      cvFile,
      certificates,
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