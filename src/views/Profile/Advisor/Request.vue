<template>
    <div class="container">
      <h1 class="title">Request To Be An Advisor</h1>
      
      <div class="form-group">
        <label style="font-weight: bold;">Upload Your CV:</label>
        <input type="file" accept=".pdf,.doc,.docx" @change="handleCVUpload" class="form-control" />
      </div>
      
      <div class="form-group">
        <label style="font-weight: bold;">Introduction:</label>
        <textarea v-model="introduction" rows="4" placeholder="Write about yourself..." class="form-control"></textarea>
      </div>
      
      <div class="form-group">
        <label style="font-weight: bold;">Upload Activity Images:</label>
        <input type="file" multiple accept="image/*" @change="handleImageUpload" class="form-control" />
        <div class="image-preview mt-3">
          <img v-for="(image, index) in activityImages" :key="index" :src="image" class="img-thumbnail" />
        </div>
      </div>
      
      <div class="form-group">
        <label style="font-weight: bold;">Upload Your Certificates:</label>
        <input type="file" multiple accept=".pdf,.jpg,.png" @change="handleCertificateUpload" class="form-control" />
        <ul class="certificate-list">
          <li v-for="(cert, index) in certificates" :key="index" class="list-group-item">{{ cert.name }}</li>
        </ul>
      </div>
      
      <div class="text-center">
        <button @click="submitRequest" class="submit-btn">Submit Request</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const introduction = ref('');
      const cvFile = ref(null);
      const activityImages = ref([]);
      const certificates = ref([]);
  
      const handleCVUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          cvFile.value = file;
        }
      };
  
      const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            activityImages.value.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      };
  
      const handleCertificateUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
          certificates.value.push(file);
        });
      };
  
      const submitRequest = () => {
        if (!cvFile.value || !introduction.value) {
          alert("Please upload CV and provide an introduction.");
          return;
        }
        console.log("Submitting request with:", {
          cv: cvFile.value.name,
          introduction: introduction.value,
          certificates: certificates.value.map(cert => cert.name)
        });
        alert("Your request has been submitted successfully!");
      };
  
      return {
        introduction,
        cvFile,
        activityImages,
        certificates,
        handleCVUpload,
        handleImageUpload,
        handleCertificateUpload,
        submitRequest,
      };
    },
  };
  </script>
  
  <style scoped>
  @import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';

  .container {
    max-width: 500px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }
  
  .image-preview img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .certificate-list {
    list-style-type: none;
    padding: 0;
  }
  
  .certificate-list li {
    background: #e9ecef;
    padding: 10px;
    border-radius: 2px;
  }

  .submit-btn {
  width: 100%;
  padding: 12px;
  background: #ff8c00;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}
  </style>
  