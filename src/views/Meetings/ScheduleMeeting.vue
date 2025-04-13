<template>
  <div class="schedule-meeting">
    <h2 class="page-title">Đặt lịch họp với Advisor</h2>

    <!-- Form đặt lịch -->
    <div class="meeting-form">
      <div class="form-group">
        <label>Chọn ngày họp:</label>
        <input 
          type="date" 
          v-model="meetingDate" 
          :min="today"
          class="form-input" 
        />
      </div>

      <div class="form-group">
        <label>Chọn giờ bắt đầu:</label>
        <input 
          type="time" 
          v-model="startTime" 
          class="form-input" 
        />
        <small class="form-text" v-if="startTime">
          {{ new Date(`${meetingDate}T${startTime}`).toLocaleTimeString('vi-VN') }}
        </small>
      </div>

      <div class="form-group">
        <label>Chọn giờ kết thúc:</label>
        <input 
          type="time" 
          v-model="endTime" 
          class="form-input" 
        />
        <small class="form-text" v-if="endTime">
          {{ new Date(`${meetingDate}T${endTime}`).toLocaleTimeString('vi-VN') }}
          <span v-if="endTime < startTime">(Ngày hôm sau)</span>
        </small>
      </div>

      <div class="form-group">
        <label>Chọn Advisor:</label>
        <select v-model="selectedAdvisor" class="form-input">
          <option value="">-- Chọn Advisor --</option>
          <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">
            {{ advisor.fullName }} {{ advisor.email ? `(${advisor.email})` : '' }}
          </option>
        </select>
        <small v-if="advisors.length === 0" class="form-text text-muted">
          Đang tải danh sách advisor...
        </small>
        <small v-else class="form-text text-muted">
          Có {{ advisors.length }} advisor
        </small>
      </div>

      <div class="form-group">
        <label>Ghi chú:</label>
        <textarea v-model="notes" class="form-input" rows="3" placeholder="Nhập ghi chú cho cuộc họp..."></textarea>
      </div>

      <div class="form-error" v-if="!isValidTime && startTime && endTime">
        Thời gian kết thúc phải sau thời gian bắt đầu
      </div>

      <button @click="scheduleMeeting" class="btn btn-primary" :disabled="isLoading || !isValidTime">
        {{ isLoading ? 'Đang xử lý...' : 'Đặt lịch họp' }}
      </button>
    </div>

    <!-- Danh sách các cuộc họp đã đặt -->
    <div class="meetings-list">
      <h3>Lịch họp của bạn</h3>
      <div v-if="meetings.length === 0" class="no-meetings">
        Chưa có cuộc họp nào được đặt
      </div>
      <div v-else class="meetings-grid">
        <div v-for="meeting in meetings" :key="meeting.id" class="meeting-card">
          <div class="meeting-header">
            <h4>Cuộc họp với {{ meeting.advisorName }}</h4>
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
              Tham gia
            </button>
            <!--<button v-if="meeting.status === 'pending'" 
                    @click="cancelMeeting(meeting.id)" 
                    class="btn btn-danger">
              Hủy lịch
            </button>
            <button v-if="meeting.status === 'confirmed'" 
                    @click="joinMeeting(meeting.id)" 
                    class="btn btn-success">
              Tham gia
            </button>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { createMeeting, getMeetings, deleteMeeting, joinMeeting as joinMeetingApi } from '@/scripts/api/services/meetingService';
import { getUsers } from '@/scripts/api/services/userService';
import { getUserProfile } from '@/scripts/api/services/authService';
import { formatISODateWithHMS } from '@/scripts/logic/common.js';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const meetingDate = ref('');
const startTime = ref('');
const endTime = ref('');
const selectedAdvisor = ref('');
const notes = ref('');
const isLoading = ref(false);
const meetings = ref([]);
const advisors = ref([]);
const today = new Date().toISOString().split('T')[0];
const router = useRouter();

const isValidTime = computed(() => {
  if (!startTime.value || !endTime.value || !meetingDate.value) return true;

  const startDateTime = new Date(`${meetingDate.value}T${startTime.value}`);
  const endDateTime = new Date(`${meetingDate.value}T${endTime.value}`);

  // Nếu giờ kết thúc < giờ bắt đầu, tự động đẩy sang ngày hôm sau
  if (endDateTime < startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  return startDateTime < endDateTime;
});

onBeforeMount(async () => {
  try {
    const response = await getUsers({ 
      Role: 1,
      PageIndex: 0,
      PageSize: 100
    });
    
    if (response?.items) {
      advisors.value = response.items.map(advisor => ({
        id: advisor.id,
        fullName: advisor.fullName || advisor.userName || 'Advisor',
        email: advisor.email
      }));

      await loadMeetings();
    }
  } catch (error) {
    toast.error('Không thể tải danh sách advisor');
  }
});

const loadMeetings = async () => {
  try {
    const response = await getMeetings({
      PageIndex: 0,
      PageSize: 10
    });

    if (response?.items) {
      meetings.value = response.items.map(meeting => ({
        ...meeting,
        advisorName: advisors.value.find(a => a.id === meeting.advisorId)?.fullName || 'Advisor'
      }));
    } else {
      meetings.value = [];
    }
  } catch (error) {
    //toast.error('Không thể tải danh sách cuộc họp');
  }
};

// Đặt lịch họp mới
const scheduleMeeting = async () => {
  if (!meetingDate.value || !startTime.value || !endTime.value || !selectedAdvisor.value) {
    toast.error('Vui lòng điền đầy đủ thông tin');
    return;
  }

  if (!isValidTime.value) {
    toast.error('Thời gian không hợp lệ');
    return;
  }

  isLoading.value = true;
  try {
    const startDateTime = new Date(`${meetingDate.value}T${startTime.value}`);
    const endDateTime = new Date(`${meetingDate.value}T${endTime.value}`);
    
    // Nếu giờ kết thúc < giờ bắt đầu, tự động đẩy sang ngày hôm sau
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    const dto = {
      title: 'Cuộc họp với Advisor',
      startAt: startDateTime,
      endAt: endDateTime,
      maxParticipants: 2,
      participants: [
        { userId: getUserProfile().id, isHost: true },
        { userId: selectedAdvisor.value, isHost: false },
      ],
      description: notes.value || ''
    };

    const response = await createMeeting(dto);
    
    if (response) {
      toast.success('Đặt lịch họp thành công');
      
      meetingDate.value = '';
      startTime.value = '';
      endTime.value = '';
      selectedAdvisor.value = '';
      notes.value = '';
      
      await loadMeetings();
    }
  } catch (error) {
    //toast.error('Không thể đặt lịch họp');
  } finally {
    isLoading.value = false;
  }
};

// Hủy lịch họp
const cancelMeeting = async (meetingId) => {
  if (!confirm('Bạn có chắc chắn muốn hủy lịch họp này?')) return;

  try {
    await deleteMeeting(meetingId);
    toast.success('Hủy lịch họp thành công');
    await loadMeetings();
  } catch (error) {
    toast.error('Không thể hủy lịch họp');
  }
};

// Tham gia cuộc họp
const joinMeeting = async (meetingId) => {
  try {
    console.log(meetingId);
    //await joinMeetingApi(meetingId);
    router.push(`/call/${meetingId}`);
  } catch (error) {
    toast.error('Không thể tham gia cuộc họp');
  }
};
</script>

<style scoped>
.schedule-meeting {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.meeting-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

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
  padding: 20px;
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

.form-text {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.form-error {
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 10px;
}

.form-group small {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Thêm style cho Calendar component */
.form-input[type="date"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style> 