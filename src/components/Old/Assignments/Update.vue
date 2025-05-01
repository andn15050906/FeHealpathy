<template>
    <div>
      <h2 class="text-center" style="font-size: 32px; margin-top: 24px;">Cập nhật bài tập</h2>
  
      <div style="width: 50%; margin: 0 auto;">
        <div style="display: flex; justify-content: end;">
          <button id="app-delete-open-btn" type="button" class="btn btn-danger" @click="openDeleteModal">
            Xóa bài tập
          </button>
        </div>
  
        <!-- Dropzone -->
        <div class="dropzone needsclick" @click="triggerFileInput">
          <div id="dropzone">
            <div class="dz-message needsclick">
              <span class="text">
                <object data="/img/upload-icon.svg" type="image/svg+xml"></object>
                <span id="dropzone-text">{{ fileName || 'Đặt tập tin vào đây hoặc nhấp để tải lên.' }}</span>
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
            <label for="name">Tên bài tập</label>
            <input v-model="form.name" type="text" class="form-control" />
          </div>
  
          <div class="form-group">
            <label for="duration">Thời gian (giây)</label>
            <input v-model="form.duration" type="number" class="form-control" />
          </div>
  
          <div class="form-group">
            <label for="gradeToPass">Điểm để đạt (/10)</label>
            <input v-model="form.gradeToPass" type="number" class="form-control" />
          </div>
  
          <div class="row" style="margin-top: 24px; justify-content: center;">
            <button type="submit" class="btn btn-outline-success btn-lg">Gửi</button>
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
        console.log('Bài tập đã xóa:', this.form.id);
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
  