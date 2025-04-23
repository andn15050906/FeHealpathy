<template>
  <div class="schedule-meeting container">
    <h2 class="page-title text-center">Đặt lịch họp với chuyên gia</h2>

    <div class="meeting-form card p-4 mb-5">
      <div class="form-group">
        <label for="meeting-date">Chọn ngày họp:</label>
        <input id="meeting-date" type="date" v-model="meetingDate" :min="today" class="form-control" />
        <small class="text-danger" v-if="validationErrors.meetingDate">
          {{ validationErrors.meetingDate }}
        </small>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="start-time">Chọn giờ bắt đầu:</label>
            <input id="start-time" type="time" v-model="startTime" class="form-control" />
            <small class="text-danger" v-if="validationErrors.startTime">
              {{ validationErrors.startTime }}
            </small>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="end-time">Chọn giờ kết thúc:</label>
            <input id="end-time" type="time" v-model="endTime" class="form-control" />
            <small class="text-danger" v-if="validationErrors.endTime">
              {{ validationErrors.endTime }}
            </small>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Chọn chuyên gia tư vấn:</label>
        <div class="row advisors-grid">
          <div v-for="advisor in advisors" :key="advisor.advisorId" class="col-3 mb-4">
            <div class="advisor-card card text-center"
              :class="{ 'border-primary': selectedAdvisor === advisor.advisorId }"
              @click="selectedAdvisor = advisor.advisorId">
              <div class="advisor-avatar-container mx-auto mt-3">
                <img :src="advisor.avatarUrl" alt="avatar" class="avatar" />
              </div>
              <div class="card-body">
                <h3 class="advisor-name">{{ advisor.fullName }}</h3>
                <p class="bio">{{ advisor.intro }}</p>
                <RouterLink class="btn btn-outline-primary btn-sm" :to="`/advisor/view-profile/${advisor.advisorId}`">
                  <i class="fas fa-user-circle"></i> Đặt lịch
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div v-if="advisors.length === 0" class="text-center p-4">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách chuyên gia...
        </div>
        <small class="text-danger" v-if="validationErrors.selectedAdvisor">
          {{ validationErrors.selectedAdvisor }}
        </small>
      </div>

      <div class="form-group">
        <label for="meeting-notes">Ghi chú:</label>
        <textarea id="meeting-notes" v-model="notes" class="form-control" rows="3"
          placeholder="Nhập ghi chú cho cuộc họp..."></textarea>
      </div>

      <button @click="scheduleMeeting" class="btn btn-primary w-100" :disabled="isLoading">
        <i class="fas fa-calendar-plus"></i>
        {{ isLoading ? 'Đang xử lý...' : 'Đặt lịch họp' }}
      </button>
    </div>

    <div class="meetings-list mt-5">
      <h4 class="section-title">Lịch hẹn của bạn</h4>

      <div v-if="meetings.length === 0" class="no-meetings card p-5 text-center">
        <i class="fas fa-calendar-times mb-3 text-dark"></i>
        <p>Chưa có cuộc hẹn nào được đặt</p>
      </div>

      <div v-else class="row">
        <div v-for="meeting in meetings" :key="meeting.id" class="col-4 mb-4">
          <div class="meeting-card card h-100 border-2">
            <div class="meeting-header card-header d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Cuộc hẹn với {{ meeting.advisorName }}</h4>
              <span :class="['badge', getBadgeClass(meeting.status)]">
                {{ meeting.status }}
              </span>
            </div>

            <div class="card-body text-center">
              <div class="meeting-details">
                <p>
                  <i class="fas fa-calendar-day text-dark"></i>
                  {{ formatISODateWithHMS(meeting.startAt) }}
                </p>
                <p>
                  <i class="fas fa-clock text-dark"></i>
                  {{ new Date(meeting.startAt).toLocaleTimeString('vi-VN') }} -
                  {{ new Date(meeting.endAt).toLocaleTimeString('vi-VN') }}
                </p>
                <p v-if="meeting.description" class="meeting-description">
                  <i class="fas fa-sticky-note text-dark"></i>
                  {{ meeting.description }}
                </p>
              </div>
            </div>

            <div class="card-footer text-center">
              <button @click="joinMeeting(meeting.id)" class="btn btn-success w-100">
                <i class="fas fa-video"></i> Tham gia cuộc gọi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import { createMeeting, getMeetings, deleteMeeting } from '@/scripts/api/services/meetingService';
import { getAllAdvisors } from '@/scripts/api/services/advisorService';
import { getUserProfile } from '@/scripts/api/services/authService';
import { formatISODateWithHMS } from '@/scripts/logic/common.js';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const router = useRouter();
const today = new Date().toLocaleDateString('en-CA');
const meetingDate = ref('');
const startTime = ref('');
const endTime = ref('');
const selectedAdvisor = ref('');
const notes = ref('');
const isLoading = ref(false);
const meetings = ref([]);
const advisors = ref([]);

const validationErrors = ref({
  meetingDate: '',
  startTime: '',
  endTime: '',
  selectedAdvisor: '',
});

function formatTimeForInput(date) {
  return date.toTimeString().substring(0, 5);
}

function setDefaultValues() {
  const now = new Date();
  meetingDate.value = now.toLocaleDateString('en-CA');
  startTime.value = formatTimeForInput(now);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  endTime.value = formatTimeForInput(oneHourLater);
}

onMounted(setDefaultValues);

const isValidTime = computed(() => {
  if (!startTime.value || !endTime.value) return true;
  const [sh, sm] = startTime.value.split(':').map(Number);
  const [eh, em] = endTime.value.split(':').map(Number);
  return (eh > sh) || (eh === sh && em > sm);
});

function getBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-warning text-dark';
    case 'confirmed': return 'bg-success';
    case 'cancelled': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

async function loadMeetings() {
  try {
    const resp = await getMeetings();
    const me = getUserProfile().id;
    const list = resp.items || [];
    meetings.value = list
      .filter(m => m.participants.some(p => p.creatorId === me))
      .map(m => ({
        ...m,
        advisorName:
          advisors.value.find(a => a.advisorId === m.advisorId)?.fullName ||
          'Advisor',
      }));
  } catch {
    console.error('Không thể tải danh sách cuộc họp');
  }
}

onBeforeMount(async () => {
  try {
    const resp = await getAllAdvisors();
    advisors.value = (resp || []).filter(a => a.userId !== getUserProfile().id);
    await loadMeetings();
  } catch {
    toast.error('Không thể tải danh sách chuyên gia');
  }
});

function validateForm() {
  let ok = true;
  validationErrors.value = {
    meetingDate: '',
    startTime: '',
    endTime: '',
    selectedAdvisor: '',
  };
  if (!meetingDate.value) {
    validationErrors.value.meetingDate = 'Vui lòng chọn ngày họp';
    ok = false;
  }
  if (!startTime.value) {
    validationErrors.value.startTime = 'Vui lòng chọn giờ bắt đầu';
    ok = false;
  }
  if (!endTime.value) {
    validationErrors.value.endTime = 'Vui lòng chọn giờ kết thúc';
    ok = false;
  }
  if (!selectedAdvisor.value) {
    validationErrors.value.selectedAdvisor = 'Vui lòng chọn chuyên gia tư vấn';
    ok = false;
  }
  if (startTime.value && endTime.value && !isValidTime.value) {
    validationErrors.value.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    ok = false;
  }
  return ok;
}

async function scheduleMeeting() {
  if (!validateForm()) return;
  isLoading.value = true;
  try {
    const startAt = new Date(`${meetingDate.value}T${startTime.value}`);
    const endAt = new Date(`${meetingDate.value}T${endTime.value}`);
    await createMeeting({
      title: 'Cuộc họp với Advisor',
      startAt, endAt, maxParticipants: 2,
      participants: [
        { userId: getUserProfile().id, isHost: true },
        { userId: selectedAdvisor.value, isHost: false },
      ],
      description: notes.value || '',
    });
    toast.success('Đặt lịch họp thành công');
    setDefaultValues();
    selectedAdvisor.value = '';
    notes.value = '';
    await loadMeetings();
  } catch {
    console.error('Không thể đặt lịch họp');
  } finally {
    isLoading.value = false;
  }
}

async function cancelMeeting(id) {
  if (!confirm('Bạn có chắc chắn muốn hủy lịch họp này?')) return;
  try {
    await deleteMeeting(id);
    toast.success('Hủy lịch họp thành công');
    await loadMeetings();
  } catch {
    toast.error('Không thể hủy lịch họp');
  }
}

function joinMeeting(id) {
  router.push(`/call/${id}`);
}
</script>

<style scoped>
.schedule-meeting {
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page-title {
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 28px;
  position: relative;
  padding-bottom: 12px;
  color: #000000;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #000000;
}

.section-title {
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
}

.section-title i {
  color: #000000;
}

.meeting-form {
  border: 2px solid #dee2e6;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.text-danger {
  font-size: 12px;
  margin-top: 2px;
  display: block;
}

.next-day-indicator {
  color: #000000;
  font-weight: 500;
}

.advisors-grid .advisor-card {
  height: 100%;
  transition: all 0.3s ease;
  border-width: 2px;
  text-align: center;
}

.advisors-grid .advisor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.advisor-avatar-container {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #dee2e6;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.border-primary .advisor-avatar-container {
  border-color: #000000;
}

.advisor-card .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.advisor-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
  text-align: center;
}

.advisor-card .bio {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 0px;
  line-height: 1.5;
  height: 63px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: center;
}

.meeting-card {
  transition: all 0.3s ease;
  border-width: 2px !important;
}

.meeting-card:hover {
  border-color: #000000 !important;
  transform: translateY(-4px);
}

.meeting-header {
  border-bottom: 2px solid #dee2e6;
  text-align: center;
}

.meeting-details {
  margin: 0 auto;
}

.meeting-details p {
  margin: 10px 0;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.meeting-details i {
  color: #000000;
  font-size: 16px;
}

.no-meetings {
  border: 2px dashed #dee2e6;
}

.no-meetings i {
  font-size: 48px;
  color: #000000;
  opacity: 0.5;
}

.meeting-description {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-style: italic;
  text-align: center;
}

.border-2 {
  border-width: 2px !important;
}

.btn {
  text-align: center;
}

.border-primary {
  border-color: #000000 !important;
}
</style>