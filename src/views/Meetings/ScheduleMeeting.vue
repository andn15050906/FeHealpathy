<template>
  <div class="schedule-meeting container">
    <h2 class="page-title text-center">Đặt lịch tư vấn với chuyên gia</h2>

    <div class="meeting-form card p-4 mb-5">
      <div class="form-group">
        <label>Chọn chuyên gia tư vấn:</label>
        <div class="row advisors-grid">
          <div v-for="advisor in advisors" :key="advisor.advisorId" class="col-3">
            <div class="advisor-card card text-center"
              :class="{ 'border-primary': selectedAdvisor === advisor.advisorId }"
              @click="selectAdvisor(advisor.advisorId)">
              <div class="advisor-avatar-container mx-auto mt-3">
                <img :src="advisor.avatarUrl" alt="avatar" class="avatar" />
              </div>
              <div class="card-body">
                <h3 class="advisor-name">{{ advisor.fullName }}</h3>
                <p class="bio">{{ advisor.intro }}</p>
                <RouterLink class="btn btn-outline-primary btn-md" :to="`/advisor/view-profile/${advisor.advisorId}`">
                  <i class="fas fa-user-circle"></i> Xem và đặt lịch
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
    </div>

    <div class="meetings-list mt-5">
      <h4 class="section-title">Lịch hẹn tư vấn của bạn</h4>

      <div v-if="meetings.length === 0" class="no-meetings card p-5 text-center">
        <i class="fas fa-calendar-times mb-3 text-dark"></i>
        <p>Chưa có cuộc hẹn tư vấn nào được đặt</p>
      </div>

      <div v-else class="row">
        <div v-for="meeting in meetings" :key="meeting.id" class="col-4 mb-4">
          <div class="meeting-card card h-100 shadow-sm">
            <div class="meeting-header card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold">{{ meeting.advisorName }}</h5>
              <span :class="['badge', getBadgeClass(meeting.status)]">
                {{ meeting.status }}
              </span>
            </div>

            <div class="card-body">
              <div class="meeting-details">
                <div class="info-row mb-2">
                  <i class="fas fa-calendar-day me-2"></i>
                  <span>{{ formatISODateWithHMS(meeting.startAt) }}</span>
                </div>
                <div class="info-row mb-2">
                  <i class="fas fa-clock me-2"></i>
                  <span>
                    {{ formatTime(meeting.startAt) }} - {{ formatTime(meeting.endAt) }}
                  </span>
                </div>
                <div v-if="meeting.description" class="info-row description-container p-2 mt-2">
                  <i class="fas fa-sticky-note me-2 align-self-start mt-1"></i>
                  <p class="m-0 text-start">{{ meeting.description }}</p>
                </div>
              </div>
            </div>

            <div class="card-footer border-top-0 bg-white pb-3">
              <button @click="joinMeeting(meeting.id)" class="btn btn-primary w-100"
                :disabled="!isMeetingJoinable(meeting.startAt, meeting.endAt)"
                :class="{ 'btn-secondary': !isMeetingJoinable(meeting.startAt, meeting.endAt) }">
                <i class="fas fa-video me-2"></i>
                <span v-if="isMeetingJoinable(meeting.startAt, meeting.endAt)">Tham gia tư vấn</span>
                <span v-else-if="new Date(meeting.startAt) > new Date()">Chưa đến giờ tư vấn</span>
                <span v-else>Đã kết thúc tư vấn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="userRole === 1" class="meetings-list mt-5">
      <h4 class="section-title">Lịch hẹn tư vấn với bạn</h4>

      <div v-if="advisorMeetings.length === 0" class="no-meetings card p-5 text-center">
        <i class="fas fa-calendar-times mb-3 text-dark"></i>
        <p>Chưa có cuộc hẹn tư vấn nào với bạn</p>
      </div>

      <div v-else class="row">
        <div v-for="meeting in advisorMeetings" :key="meeting.id" class="col-4 mb-4">
          <div class="meeting-card card h-100 shadow-sm">
            <div class="meeting-header card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold">{{ meeting.creatorName }}</h5>
              <span :class="['badge', getBadgeClass(meeting.status)]">
                {{ meeting.status }}
              </span>
            </div>

            <div class="card-body">
              <div class="meeting-details">
                <div class="info-row mb-2">
                  <i class="fas fa-calendar-day me-2"></i>
                  <span>{{ formatISODateWithHMS(meeting.startAt) }}</span>
                </div>
                <div class="info-row mb-2">
                  <i class="fas fa-clock me-2"></i>
                  <span>
                    {{ formatTime(meeting.startAt) }} - {{ formatTime(meeting.endAt) }}
                  </span>
                </div>
                <div v-if="meeting.description" class="info-row description-container p-2 mt-2">
                  <i class="fas fa-sticky-note me-2 align-self-start mt-1"></i>
                  <p class="m-0 text-start">{{ meeting.description }}</p>
                </div>
              </div>
            </div>

            <div class="card-footer border-top-0 bg-white pb-3">
              <button @click="joinMeeting(meeting.id)" class="btn btn-primary w-100"
                :disabled="!isMeetingJoinable(meeting.startAt, meeting.endAt)"
                :class="{ 'btn-secondary': !isMeetingJoinable(meeting.startAt, meeting.endAt) }">
                <i class="fas fa-video me-2"></i>
                <span v-if="isMeetingJoinable(meeting.startAt, meeting.endAt)">Tham gia tư vấn</span>
                <span v-else-if="new Date(meeting.startAt) > new Date()">Chưa đến giờ tư vấn</span>
                <span v-else>Đã kết thúc tư vấn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { getMeetings } from '@/scripts/api/services/meetingService';
import { getAllAdvisors } from '@/scripts/api/services/advisorService';
import { getUserProfile } from '@/scripts/api/services/authService';
import { formatISODateWithHMS } from '@/scripts/logic/common.js';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
import {
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

const router = useRouter();
const selectedAdvisor = ref('');
const isLoading = ref(false);
const meetings = ref([]);
const advisorMeetings = ref([]);
const advisors = ref([]);
const validationErrors = ref({ selectedAdvisor: '' });
const userRole = ref(0);

function selectAdvisor(id) {
  selectedAdvisor.value = id;
  validationErrors.value.selectedAdvisor = '';
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function getBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-warning text-dark';
    case 'confirmed': return 'bg-success';
    case 'cancelled': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

function isMeetingJoinable(startAt, endAt) {
  const now = new Date();
  const meetingStart = new Date(startAt);
  const meetingEnd = new Date(endAt);

  return meetingStart <= now && now <= meetingEnd;
}

async function loadMeetings() {
  const currentDate = new Date();
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const fromDate = format(firstDay, 'yyyy-MM-dd') + 'T00:00:00';
  const toDate = format(lastDay, 'yyyy-MM-dd') + 'T23:59:59';
  const cu = getUserProfile();
  const me = cu.id;
  userRole.value = cu.role;

  try {
    const creatorResp = await getMeetings({
      CreatorId: me,
      Start: fromDate,
      End: toDate
    });

    const creatorList = creatorResp.items || [];
    meetings.value = creatorList.map(m => ({
      ...m,
      advisorName: advisors.value.find(a => a.advisorId === m.advisorId)?.fullName || 'Chuyên gia',
    }));
  } catch (error) {
    meetings.value = [];
  }

  if (userRole.value === 1) {
    try {
      const advisorResp = await getMeetings({
        Participants: [me],
        Start: fromDate,
        End: toDate
      });
      
      const advisorList = advisorResp.items || [];
      advisorMeetings.value = advisorList
        .filter(meeting => {
          return meeting.participants.some(participant =>
            participant.creatorId === me && participant.isHost === true
          );
        })
        .map(m => ({
          ...m,
          creatorName: m.creatorName || 'Khách hàng',
        }));
    } catch (error) {
      advisorMeetings.value = [];
    }
  }
}

onBeforeMount(async () => {
  try {
    const resp = await getAllAdvisors();
    advisors.value = (resp || []).filter(a => a.userId !== getUserProfile().id);
    await loadMeetings();
  } catch {
  }
});

function joinMeeting(id) {
  router.push(`/call/${id}`);
}
</script>

<style scoped>
.container {
  width: 72vw;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;
}

.page-title {
  margin-bottom: 40px;
  font-weight: 700;
  font-size: 32px;
  position: relative;
  padding-bottom: 15px;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-radius: 2px;
}

.section-title {
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2c3e50;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(to bottom, #3498db, #2ecc71);
  border-radius: 2px;
}

.meeting-form {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  background: white;
  transition: all 0.3s ease;
}

.meeting-form:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.form-group {
  margin-bottom: 30px;
}

.form-group label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.advisors-grid .advisor-card {
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e9ecef;
  border-radius: 15px;
  overflow: hidden;
  background: white;
}

.advisors-grid .advisor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #3498db;
}

.advisor-avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e9ecef;
  transition: all 0.3s ease;
  margin: 1.5rem auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.advisor-card .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.border-primary .advisor-avatar-container {
  border-color: #3498db;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.advisor-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #2c3e50;
}

.advisor-card .bio {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.6;
  height: 66px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  padding: 0 15px;
}

.meeting-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  border-radius: 15px;
  overflow: hidden;
  background: white;
}

.meeting-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.meeting-header {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}

.meeting-details {
  padding: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  color: #495057;
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.info-row i {
  color: #3498db;
  width: 20px;
}

.description-container {
  display: flex;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 10px;
  border-left: 4px solid #3498db;
  margin-top: 15px;
  padding: 12px;
}

.description-container p {
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.6;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(to right, #3498db, #2ecc71);
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(52, 152, 219, 0.3);
  background: linear-gradient(to right, #2980b9, #27ae60);
}

.btn-primary:disabled,
.btn-primary.btn-secondary {
  background: linear-gradient(to right, #95a5a6, #7f8c8d) !important;
  transform: none !important;
  box-shadow: none !important;
  cursor: not-allowed;
  opacity: 0.8;
}

.btn-outline-primary {
  border: 2px solid #3498db;
  color: #3498db;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
}

.no-meetings {
  border: 2px dashed #e9ecef;
  border-radius: 15px;
  padding: 3rem !important;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

.no-meetings i {
  font-size: 56px;
  color: #3498db;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.badge {
  padding: 8px 12px;
  font-weight: 600;
  border-radius: 8px;
}

.bg-warning {
  background: linear-gradient(to right, #f1c40f, #f39c12) !important;
}

.bg-success {
  background: linear-gradient(to right, #2ecc71, #27ae60) !important;
}

.bg-danger {
  background: linear-gradient(to right, #e74c3c, #c0392b) !important;
}

.bg-secondary {
  background: linear-gradient(to right, #95a5a6, #7f8c8d) !important;
}
</style>