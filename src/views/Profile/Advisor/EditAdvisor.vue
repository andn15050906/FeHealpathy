<template>
  <div class="content">
    <SweetAlert ref="sweetAlert" />
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-form-section">
          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="creationTime">Ngày tham gia</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="Trường này không thể chỉnh sửa">{{ form.creationTime }}</span>
              </div>
              <div class="form-group">
                <label for="courseCount">Số khóa học</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="Trường này không thể chỉnh sửa">{{ form.courseCount }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="experience">Kinh nghiệm</label>
                <input type="text" id="experience" v-model="form.experience" class="form-control" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label for="intro">Giới thiệu</label>
                <textarea id="intro" v-model="form.intro" maxlength="1000" class="form-control"></textarea>
              </div>
            </div>
            <div class="form-buttons">
              <button type="submit" class="btn btn-save">LƯU</button>
              <button type="button" class="btn btn-cancel" @click="openCancelPopup">HỦY</button>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="balance">Số dư</label>
                <span class="form-control readonly-field" style="cursor: not-allowed;" title="Trường này không thể chỉnh sửa">{{ form.balance }}</span>
                <div class="form-buttons">
                  <div class="btn btn-warning white-text" @click="openWithdrawalPopup">Rút tiền</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <UpdateConfirmPopup :isVisible="confirmDialogVisible" message="Bạn có chắc chắn muốn cập nhật thông tin cố vấn của mình?"
      url="dummyUrl" @confirmUpdate="handleConfirmUpdate" @update:isVisible="confirmDialogVisible = $event" />
    <CancelConfirmPopup :isVisible="cancelDialogVisible" message="Bạn có chắc chắn muốn hủy các thay đổi?"
      @confirmCancel="handleConfirmCancel" @update:isVisible="cancelDialogVisible = $event" />
    <v-dialog v-if="withdrawDialogVisible" persistent max-width="400px">
        <v-card>
            <v-card-title class="d-flex align-center title-section">
                <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
                <span class="title">Xác nhận hủy</span>
            </v-card-title>
            <RequestWithdrawal />
        </v-card>
    </v-dialog>
  </div>
  <div>
    <div class="meetings-list">
      <h3>Lịch hẹn của bạn</h3>
      <div v-if="meetings.length === 0" class="no-meetings">
        Chưa có cuộc hẹn nào được đặt
      </div>
      <div v-else class="meetings-grid">
        <div v-for="meeting in meetings" :key="meeting.id" class="meeting-card">
          <div class="meeting-header">
            <h4>{{ meeting.displayTitle ?? 'Cuộc hẹn với người dùng' }}</h4>
            <span :class="['status-badge', meeting.status]">{{ meeting.status }}</span>
          </div>
          <div class="meeting-details">
            <p><i class="fas fa-calendar"></i> {{ formatISODateWithHMS(meeting.startAt) }}</p>
            <p><i class="fas fa-clock"></i> 
              {{ new Date(meeting.startAt).toLocaleTimeString('vi-VN') }} - 
              {{ new Date(meeting.endAt).toLocaleTimeString('vi-VN') }}
            </p>
            <p v-if="meeting.description"><i class="fas fa-sticky-note"></i> {{ meeting.description }}</p>
          </div>
          <div class="meeting-actions">
            <button @click="joinMeeting(meeting.id)" class="btn btn-success">
              Tham gia cuộc gọi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, inject } from 'vue';
import dict from '@/scripts/data/dictionary.json';
import { getAdvisorProfile, updateAdvisorProfile } from '@/scripts/api/services/advisorService';
import SweetAlert from '../../../components/Common/Popup/SweetAlert.vue';
import UpdateConfirmPopup from '../../../components/Common/Popup/UpdateConfirmPopup.vue';
import CancelConfirmPopup from '../../../components/Common/Popup/CancelConfirmPopup.vue';
import RequestWithdrawal from '@/views/Profile/Advisor/Manage/RequestWithdrawal.vue'
import { formatISODateWithHMS } from '@/scripts/logic/common.js';
import { getMeetings } from '@/scripts/api/services/meetingService';
import { getUsers } from '@/scripts/api/services/userService.js';
import { useRouter } from 'vue-router';

export default {
  components: {
    SweetAlert,
    UpdateConfirmPopup, 
    CancelConfirmPopup,
    RequestWithdrawal
  },
  setup() {
    const form = ref({
      id:'',
      creationTime: '',
      balance: 0,
      courseCount: 0,
      experience: '',
      intro: ''
    });
    const meetings = ref([]);
    const router = useRouter();
    const originalForm = ref({});
    const confirmDialogVisible = ref(false);
    const cancelDialogVisible = ref(false);
    const withdrawDialogVisible = ref(false);
    const loadingSpinner = inject('loadingSpinner');
    const sweetAlert = inject('sweetAlert');
    const text = dict['en']
    const userId = JSON.parse(localStorage.getItem('userProfile'))?.id;
    const allUsers = ref([]);

    const fetchProfile = async () => {
      try {
        loadingSpinner?.showSpinner();

        const advisorData = await getAdvisorProfile(userId);

        const advisor = advisorData.items ? advisorData.items[0] : advisorData;
        advisor.creationTime = formatDate(advisor.creationTime);
        advisor.intro = advisor.intro;

        Object.assign(form.value, advisor);
        originalForm.value = { ...form.value };
      } catch (error) {
        console.error(error);
        await sweetAlert.showError('Không thể tải thông tin cố vấn');
      } finally {
        loadingSpinner?.hideSpinner();
      }
    };

    const confirmChanges = async () => {
      try {
        loadingSpinner?.showSpinner();

        const formData = new FormData();

        formData.append("Id", form.value.id);
        formData.append("Experience", form.value.experience);
        formData.append("intro", form.value.intro); 

        const response = await updateAdvisorProfile(formData);
        if (response !== false) {
          loadingSpinner.hideSpinner();
          await sweetAlert.showAlert({
            icon: 'success',
            title: 'Cập nhật thành công',
            text: 'Thông tin cố vấn của bạn đã được cập nhật thành công!'
          });
        } else {
          throw new Error(response?.message || 'Cập nhật thất bại.');
        }
      } catch (error) {
        sweetAlert.showError('Lỗi khi cập nhật thông tin cố vấn.');
      } finally {
        loadingSpinner?.hideSpinner();
      }
    };

    const validateExperience = () => {
      const wordCount = form.value.experience.trim().split(/\s+/).length;
      if (wordCount < 5) {
        sweetAlert.showError('Kinh nghiệm phải có ít nhất 5 từ.');
        return false;
      }
      return true;
    };

    const validateIntroduction = () => {
      const wordCount = form.value.intro.trim().split(/\s+/).length;
      if (wordCount < 5) {
        sweetAlert.showError('Giới thiệu phải có ít nhất 5 từ.');
        return false;
      }
      return true;
    };

    const handleSubmit = () => {
      if (validateExperience() && validateIntroduction()) {
        confirmDialogVisible.value = true;
      }
    };

    const handleConfirmUpdate = (confirm) => {
      if (confirm) {
        confirmChanges();
      }
    };

    const openCancelPopup = () => {
      cancelDialogVisible.value = true;
    };

    const openWithdrawalPopup = () => {
      withdrawDialogVisible.value = true;
    }

    const handleConfirmCancel = (confirm) => {
      if (confirm) {
        form.value = { ...originalForm.value };
      }
    };

    const formatDate = (date) => {
      if (!date || typeof date !== 'string') return '';
      return date.split('T')[0];
    };

    const loadMeetings = async () => {
      try {
        const response = await getMeetings();
        if (response?.items) {
          meetings.value = response.items
            .filter(_ => _.participants.find(_ => _.creatorId == userId))
            .map(meeting => {
              var partnerParticipant = meeting.participants.find(_ => _.creatorId != userId);
              var partner = allUsers.value?.find(_ => _.id == partnerParticipant?.creatorId);
              return {
                ...meeting,
                displayTitle: partner ? 'Cuộc hẹn với ' + partner.fullName : 'Cuộc hẹn với người dùng'
              }
            });
        } else {
          meetings.value = [];
        }
      } catch (error) {
      }
    };

    const joinMeeting = async (meetingId) => {
      try {
        router.push(`/call/${meetingId}`);
      } catch (error) {
        console.log(error);
      }
    };

    onBeforeMount(async () => {
      await fetchProfile();
      allUsers.value = (await getUsers({pageSize: 60})).items;
      await loadMeetings();
    });

    return {
      form,
      meetings,
      text,
      handleSubmit,
      openCancelPopup,
      openWithdrawalPopup,
      confirmDialogVisible,
      cancelDialogVisible,
      handleConfirmUpdate,
      handleConfirmCancel,
      formatISODateWithHMS,
      joinMeeting
    };
  }
};
</script>

<style scoped>
.content {
  width: 100%;
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

/*meeting */
  
.meetings-list {
  margin-top: 40px;
}

.meetings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.meeting-card {
  background: #fff;
  padding: 20px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.meeting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.pending {
  background-color: #ffc107;
  color: #000;
}

.status-badge.confirmed {
  background-color: #28a745;
  color: white;
}

.status-badge.cancelled {
  background-color: #dc3545;
  color: white;
}

.meeting-details {
  margin-bottom: 15px;
}

.meeting-details p {
  margin: 5px 0;
  color: #666;
}

.meeting-details i {
  margin-right: 8px;
  color: #007bff;
}

.meeting-actions {
  display: flex;
  gap: 10px;
}

.no-meetings {
  text-align: center;
  color: #666;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>