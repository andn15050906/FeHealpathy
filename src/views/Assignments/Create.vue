<template>
    <div>
      <h2 style="text-align: center; font-size: 32px; margin-top: 24px;">Create assignment</h2>
  
      <div style="width: 50%; margin: 0 auto;">
        <div class="dropzone needsclick" @click="triggerFileUpload">
          <div id="dropzone">
            <div class="dz-message needsclick">
              <span class="text">
                <img src="@/assets/upload-icon.svg" style="width: 50px; margin-bottom: 15px; opacity: 0.6;" />
                <span id="dropzone-text">{{ dropzoneText }}</span>
              </span>
              <span class="plus" v-if="fileSelected">+</span>
            </div>
          </div>
        </div>
  
        <form @submit.prevent="submitForm" id="app-form-create">
          <input v-model="form.SectionId" type="hidden" />
          <label for="name">Assignment Name</label>
          <input v-model="form.Name" type="text" class="form-control" />
  
          <label for="duration">Duration</label>
          <input v-model.number="form.Duration" type="number" class="form-control" />
  
          <label for="grade">Grade to pass ( / 10)</label>
          <input v-model.number="form.GradeToPass" type="number" class="form-control" />
  
          <input ref="fileInput" type="file" @change="handleFileChange" hidden />
  
          <div class="row" style="margin-top: 24px; justify-content: center;">
            <button type="submit" class="btn btn-outline-success btn-lg">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dropzoneText: "Drop files here or click to upload.",
        fileSelected: false,
        form: {
          SectionId: "", // Section ID value
          Name: "",
          Duration: "",
          GradeToPass: "",
          File: null,
        },
      };
    },
    methods: {
      triggerFileUpload() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.dropzoneText = file.name;
          this.fileSelected = true;
          this.form.File = file;
        } else {
          this.dropzoneText = "Drop files here or click to upload.";
          this.fileSelected = false;
        }
      },
      submitForm() {
        const formData = new FormData();
        formData.append("Name", this.form.Name);
        formData.append("Duration", this.form.Duration);
        formData.append("GradeToPass", this.form.GradeToPass);
        formData.append("File", this.form.File);
  
        // Handle form submission with Axios or Fetch API
        console.log("Submitting form", formData);
      },
    },
  };
  </script>
  <style src="@/assets/css/Misc/dropzone.css"></style>
  <style scoped>
  .dropzone {
    width: 98%;
    margin: 1%;
    border: 2px dashed #3498db;
    border-radius: 5px;
    transition: 0.2s;
  }
  .dropzone:hover {
    cursor: pointer;
  }
  .dropzone.dz-drag-hover {
    border: 2px solid #3498db;
  }
  </style>
  