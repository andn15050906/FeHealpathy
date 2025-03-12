<template>
    <div>
      <h2 class="text-center" style="font-size: 32px; margin-top: 24px;">Update Assignment</h2>
  
      <div style="width: 50%; margin: 0 auto;">
        <div style="display: flex; justify-content: end;">
          <button id="app-delete-open-btn" type="button" class="btn btn-danger" @click="openDeleteModal">
            Delete Assignment
          </button>
        </div>
  
        <!-- Dropzone -->
        <div class="dropzone needsclick" @click="triggerFileInput">
          <div id="dropzone">
            <div class="dz-message needsclick">
              <span class="text">
                <object data="/img/upload-icon.svg" type="image/svg+xml"></object>
                <span id="dropzone-text">{{ fileName || 'Drop files here or click to upload.' }}</span>
              </span>
              <span class="plus">+</span>
            </div>
          </div>
        </div>
  
        <!-- File Input -->
        <input ref="fileInput" type="file" hidden @change="handleFileChange" />
  
        <!-- Form -->
        <form @submit.prevent="submitForm" class="mt-4">
          <div class="form-group">
            <label for="name">Assignment Name</label>
            <input v-model="form.name" type="text" class="form-control" />
          </div>
  
          <div class="form-group">
            <label for="duration">Duration (seconds)</label>
            <input v-model="form.duration" type="number" class="form-control" />
          </div>
  
          <div class="form-group">
            <label for="gradeToPass">Grade to Pass (/10)</label>
            <input v-model="form.gradeToPass" type="number" class="form-control" />
          </div>
  
          <div class="row" style="margin-top: 24px; justify-content: center;">
            <button type="submit" class="btn btn-outline-success btn-lg">Submit</button>
          </div>
        </form>
      </div>
  
      <!-- Delete Modal -->
      <delete-modal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="deleteAssignment" />
    </div>
  </template>
  
  <script>
  import DeleteModal from './DeleteModal.vue'; // Import your delete modal component
  
  export default {
    components: {
      DeleteModal,
    },
    data() {
      return {
        form: {
          id: 1, // Sample assignment id, replace with real data
          name: 'Sample Assignment', // Replace with real assignment name
          duration: 60, // Replace with real duration
          gradeToPass: 8, // Replace with real grade
        },
        fileName: '', // File name after selection
        isDeleteModalOpen: false,
      };
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.fileName = file.name;
        } else {
          this.fileName = '';
        }
      },
      submitForm() {
        // Handle form submission logic here, e.g., sending data to the server
        console.log('Form data:', this.form);
      },
      openDeleteModal() {
        this.isDeleteModalOpen = true;
      },
      deleteAssignment() {
        // Handle deletion logic here, e.g., sending delete request to the server
        console.log('Assignment deleted:', this.form.id);
        this.$router.push({ name: 'CourseManage' }); // Redirect after deletion
      },
    },
  };
  </script>
  
  <style scoped>
  .dropzone:hover {
    cursor: pointer;
  }
  
  #app-delete-open-btn {
    margin: 8px 12px;
    font-size: 18px;
  }
  </style>
  