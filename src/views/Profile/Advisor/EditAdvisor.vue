<template>
  <div class="content">
    <SweetAlert ref="sweetAlert" />
    <v-container id="advisor-profile" fluid tag="section">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-4 rounded-lg elevation-8">
            <div class="header px-6 py-4 d-flex align-center justify-space-between">
              <h3 class="white-text font-weight-bold">Edit Advisor Profile</h3>
            </div>

            <v-form @submit.prevent="handleSubmit" class="px-6 py-4">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="Join Date" type="date" :value="formatDate(form.creationTime)" readonly outlined dense />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Balance" v-model="form.balance" type="number" readonly outlined dense />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="Course Count" v-model="form.courseCount" type="number" readonly outlined dense />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Experience" v-model="form.experience" outlined dense />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea label="Introduction" v-model="form.intro" maxlength="500" counter outlined dense />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-right">
                    <v-btn :loading="isSubmitting" :disabled="isSubmitting" @click="handleSubmit" color="success" class="rounded-lg px-6 py-3" elevation="4">
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
.header {
  background-color: #4CAF50;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.white-text {
  color: #fff;
}
.v-card {
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.v-btn {
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s;
}
.v-btn:hover {
  transform: scale(1.05);
}
</style>
