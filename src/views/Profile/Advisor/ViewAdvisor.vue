<template>
  <div class="content">
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-image-section">
          <div class="avatar-container">
            <img :src="form.avatarUrl" alt="User Avatar" class="avatar-image" />
          </div>
          <div class="advisor-name">{{ form.fullName }}</div>
        </div>
        <div class="profile-details-section">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">Giới thiệu</div>
              <div class="stat-value">{{ form.intro }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">Ngày tham gia</div>
              <div class="stat-value">{{ formattedDate }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">Số khóa học</div>
              <div class="stat-value">{{ form.courseCount }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <div class="stat-label">Kinh nghiệm</div>
              <div class="stat-value">{{ form.experience }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="calendar-container">
    <h2 class="section-title">Lịch làm việc</h2>
    <MeetingCalendar :events="advisorCalendar" :initialDate="today" @event-created="handleEventCreated" />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount, inject, computed } from 'vue';
import { toast } from 'vue3-toastify';
import dict from '@/scripts/data/dictionary.json';
import { getAllAdvisors } from '@/scripts/api/services/advisorService';
import MeetingCalendar from '../../../components/Common/Misc/MeetingCalendar.vue';

const route = useRoute();
const router = useRouter();
const form = ref({
  advisorId: '',
  userId: '',
  fullName: '',
  avatarUrl: '',
  creationTime: '',
  courseCount: 0,
  experience: '',
  intro: ''
});

const advisorCalendar = ref([]);
const today = new Date();
const originalForm = ref({});
const loadingSpinner = inject('loadingSpinner');
const text = dict['en'];

const formattedDate = computed(() => {
  if (!form.value.creationTime) return '';
  const parts = form.value.creationTime.split('-');
  if (parts.length !== 3) return form.value.creationTime;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

const fetchProfile = async (advisorId) => {
  try {
    loadingSpinner?.showSpinner();
    const advisors = await getAllAdvisors(advisorId);
    if (!advisors || advisors.length === 0) {
      toast.error("Advisor not found", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 500
      });
      return;
    }
    const advisor = advisors[0];
    advisor.creationTime = formatDate(advisor.creationTime);
    Object.assign(form.value, advisor);
    originalForm.value = { ...form.value };
  } catch (error) {
    console.error(`Error loading profile`);
  } finally {
    loadingSpinner?.hideSpinner();
  }
};

const formatDate = (date) => {
  if (!date || typeof date !== 'string') return '';
  return date.split('T')[0];
};

const handleEventCreated = (event) => {
  const meetingData = {
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime
  };

  const encodedMeeting = encodeURIComponent(JSON.stringify(meetingData));
  router.push({
    path: '/schedule-meeting',
    query: {
      advisorId: form.value.advisorId,
      meeting: encodedMeeting
    }
  });
};

onBeforeMount(() => {
  fetchProfile(route.params.advisorId);
});
</script>

<style scoped>
.content {
  width: 100%;
}

.profile-container {
  max-width: 1200px;
  margin: 10px auto;
}

.profile-card {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.profile-image-section {
  flex: 0 0 300px;
  padding: 40px 30px;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #eaedf0;
}

.avatar-container {
  width: 180px;
  height: 180px;
  position: relative;
  margin: 0 auto 24px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.advisor-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.advisor-stats {
  width: 100%;
}

.stat-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.intro-stat-item {
  background-color: #f8fcff;
  border-left: 3px solid #4a90e2;
}

.stat-icon {
  flex: 0 0 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
}

.stat-icon .fas.fa-calendar-alt {
  color: #4a6cf7;
}

.stat-icon .fas.fa-book {
  color: #38b2ac;
}

.stat-icon .fas.fa-star {
  color: #f6ad55;
}

.stat-icon .fas.fa-user-tie {
  color: #4a90e2;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.intro-value {
  font-weight: 400;
  line-height: 1.7;
  white-space: pre-line;
}

.profile-details-section {
  flex: 1;
  padding: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.intro-content {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  white-space: pre-line;
}

.calendar-container {
  max-width: 1200px;
  margin: 0 auto 10px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
  }

  .profile-image-section {
    flex: 0 0 auto;
    border-right: none;
    border-bottom: 1px solid #eaedf0;
  }
}
</style>