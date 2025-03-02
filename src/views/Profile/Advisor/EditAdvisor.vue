<template>
    <div class="content">
      <SweetAlert ref="sweetAlert" />
      <v-container id="advisor-profile" fluid tag="section">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-3">
              <div class="text-start mb-n6 v-sheet theme--dark elevation-6 success pa-7">
                <h4 class="white-text">Edit Advisor Profile</h4>
              </div>
  
              <v-form @submit.prevent="handleSubmit">
                <v-container class="py-0">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field label="Join Date" type="date" :value="formatDate(form.creationTime)" readonly />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="Balance" v-model="form.balance" type="number" readonly />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field label="Course Count" v-model="form.courseCount" type="number" readonly />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="Experience" v-model="form.experience" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea label="Introduction" v-model="form.intro" maxlength="500" counter />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="text-right">
                      <v-btn :loading="isSubmitting" :disabled="isSubmitting" @click="handleSubmit" color="success">
                        Update Profile
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, inject } from 'vue';
  import { getAdvisorProfile, updateAdvisorProfile } from '@/scripts/api/services/advisorService';
  import { handleFormSubmit } from '@/scripts/logic/validation';
  import SweetAlert from '../../../components/Common/Popup/SweetAlert.vue';

  
  export default {
    components: {
        SweetAlert,
  },
    setup() {
      const form = ref({
        creationTime: '',
        balance: 0,
        courseCount: 0,
        experience: '',
        intro: ''
      });
  
      const isSubmitting = ref(false);
      const sweetAlert = inject('sweetAlert');
      const loadingSpinner = inject('loadingSpinner');
  
      const fetchProfile = async () => {
        try {
          loadingSpinner?.showSpinner();
          const response = await getAdvisorProfile();
  
          if (response.items && response.items.length > 0) {
            Object.assign(form.value, response.items[0]);
          } else {
            console.warn("⚠️ Không có dữ liệu hợp lệ.");
          }
        } catch (error) {
          console.error("❌ Lỗi khi lấy dữ liệu:", error);
          await sweetAlert.showError('Không thể tải hồ sơ. Vui lòng thử lại sau.');
        } finally {
          loadingSpinner?.hideSpinner();
        }
      };
  
      const confirmChanges = async () => {
        try {
          isSubmitting.value = true;
          loadingSpinner?.showSpinner();
  
          const response = await updateAdvisorProfile(form.value);
  
          if (response) {
            Object.assign(form.value, response);
            
            await sweetAlert.showAlert({
              icon: 'success',
              title: 'Cập nhật thành công!',
              text: 'Hồ sơ của bạn đã được cập nhật.',
            });
          }
        } catch (error) {
          console.error("❌ Lỗi cập nhật:", error);
          await sweetAlert.showError(`Lỗi cập nhật: ${error.response?.data?.message || 'Vui lòng thử lại sau.'}`);
        } finally {
          isSubmitting.value = false;
          loadingSpinner?.hideSpinner();
        }
      };
  
      const handleSubmit = () => handleFormSubmit(confirmChanges, sweetAlert);
  
      const formatDate = (date) => {
        if (!date || typeof date !== 'string') return '';
        return date.split('T')[0];
      };
  
      onMounted(fetchProfile);
  
      return { form, handleSubmit, formatDate, isSubmitting };
    }
  };
  </script>
  
  <style scoped>
  .white-text {
    color: #fff;
  }
  </style>
  