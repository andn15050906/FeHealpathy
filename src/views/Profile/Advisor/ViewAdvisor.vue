<template>
  <div class="content">
      <div class="profile-container">
          <div class="profile-card">
              <div class="profile-image-section">
                  <div class="avatar-container">
                      <img :src="form.avatarUrl" alt="User Avatar" class="avatar-image" />
                  </div>
              </div>
              <div class="profile-card">
                  <div class="profile-form-section">
                      <form @submit.prevent="handleSubmit">
                      <div class="form-row">
                          <div class="form-group">
                          <label for="creationTime">Join Date</label>
                          <span class="form-control readonly-field">{{ form.creationTime }}</span>
                          </div>
                      </div>
                      <div class="form-row">
                          <div class="form-group">
                          <label for="courseCount">Course Count</label>
                          <span class="form-control readonly-field">{{ form.courseCount }}</span>
                          </div>
                          <div class="form-group">
                          <label for="experience">Experience</label>
                          <input type="text" readonly id="experience" v-model="form.experience" class="form-control" />
                          </div>
                      </div>
                      <div class="form-row">
                          <div class="form-group full-width">
                          <label for="intro">Introduction</label>
                          <textarea readonly id="intro" v-model="form.intro" maxlength="1000" class="form-control"></textarea>
                          </div>
                      </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <div>
    <Calendar :events="advisorCalendar" :initialDate="today" />
  </div>
</template>
  
<script setup>
import { useRoute } from 'vue-router';
import { ref, onBeforeMount, inject } from 'vue';
import dict from '@/scripts/data/dictionary.json';
import { getAllAdvisors } from '@/scripts/api/services/advisorService';
import Calendar from "@/components/Common/Misc/Calendar.vue";

const route = useRoute();
const form = ref({
    advisorId:'',
    userId: '',
    fullName: '',
    avatarUrl: '',
    creationTime: '',
    courseCount: 0,
    experience: '',
    intro: ''
});

const originalForm = ref({});
const loadingSpinner = inject('loadingSpinner');
const text = dict['en']

const fetchProfile = async (advisorId) => {
    try {
        loadingSpinner?.showSpinner();
        let advisors = await getAllAdvisors();
        console.log(advisors);
        const advisorData = advisors.find(_ => _.advisorId == advisorId);

        const advisor = advisorData.items ? advisorData.items[0] : advisorData;
        advisor.creationTime = formatDate(advisor.creationTime);
        advisor.intro = advisor.intro;

        Object.assign(form.value, advisor);
        originalForm.value = { ...form.value };
    } catch (error) {
        console.error(error);
    } finally {
        loadingSpinner?.hideSpinner();
    }
};

const formatDate = (date) => {
    if (!date || typeof date !== 'string') return '';
    return date.split('T')[0];
};

onBeforeMount(() => {
    fetchProfile(route.params.advisorId);
});
</script>
  
  <style scoped>
  .content {
    width: 100%;
    font-family: 'Roboto', sans-serif;
  }
  
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .profile-card {
    display: flex;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    /* */
    flex: 1;
  }
  
  .profile-image-section {
    flex: 0 0 350px;
    padding: 30px;
    background-color: #f7f7fc;
    display: flex;
    flex-direction: column;
  }
  
  .avatar-container {
    width: 150px;
    height: 150px;
    position: relative;
    margin: 0 auto 30px;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .camera-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-info {
    margin-bottom: 30px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 15px;
  }
  
  .info-label {
    width: 120px;
    color: #6c757d;
    font-weight: 500;
  }
  
  .info-value {
    flex: 1;
    color: #333;
    font-weight: 500;
  }
  
  .profile-form-section {
    flex: 1;
    padding: 30px;
  }
  
  .form-row {
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
  }
  
  .form-group {
    flex: 1;
  }
  
  .form-group.full-width {
    width: 100%;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #6c757d;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
  }
  
  textarea.form-control {
    height: 100px;
    resize: vertical;
  }
  
  .form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
  }
  
  .btn {
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-save {
    background-color: #5e72e4;
    color: white;
  }
  
  .btn-cancel {
    background-color: white;
    border: 1px solid #e0e0e0;
    color: #6c757d;
  }
  
  .btn-warning {
    background-color: #ff9800;
    color: white;
    margin-top: 20px;
  }
  
  .password-change-btn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .white-text {
    color: #fff;
  }
  
  .white-text a {
    color: whitesmoke;
  }
  </style>  