<template>
  <div class="schedule-meeting">
    <h2 class="page-title">Đặt lịch họp với Advisor</h2>

    <!-- Form đặt lịch -->
    <div class="meeting-form">
      <div class="form-group">
        <label>Chọn ngày họp:</label>
        <input type="date" v-model="meetingDate" :min="today" class="form-input" />
      </div>

      <div class="form-group">
        <label>Chọn giờ bắt đầu:</label>
        <input type="time" v-model="startTime" class="form-input" />
      </div>

      <div class="form-group">
        <label>Chọn giờ kết thúc:</label>
        <input type="time" v-model="endTime" class="form-input" />
      </div>

      <div class="form-group">
        <label>Chọn Advisor:</label>
        <select v-model="selectedAdvisor" class="form-input">
          <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">
            {{ advisor.fullName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Ghi chú:</label>
        <textarea v-model="notes" class="form-input" rows="3"></textarea>
      </div>

      <button @click="scheduleMeeting" class="btn btn-primary" :disabled="isLoading">
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
            <p><i class="fas fa-calendar"></i> {{ formatDate(meeting.date) }}</p>
            <p><i class="fas fa-clock"></i> {{ meeting.startTime }} - {{ meeting.endTime }}</p>
            <p v-if="meeting.notes"><i class="fas fa-sticky-note"></i> {{ meeting.notes }}</p>
          </div>
          <div class="meeting-actions">
            <button v-if="meeting.status === 'pending'" 
                    @click="cancelMeeting(meeting.id)" 
                    class="btn btn-danger">
              Hủy lịch
            </button>
            <button v-if="meeting.status === 'confirmed'" 
                    @click="joinMeeting(meeting.id)" 
                    class="btn btn-success">
              Tham gia
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createMeeting, getMeetings, deleteMeeting, joinMeeting as joinMeetingApi } from '@/scripts/api/services/meetingService';
import { getUsers } from '@/scripts/api/services/userService';
import { toast } from 'vue3-toastify';

// Khai báo các reactive states
const meetingDate = ref('');
const startTime = ref('');
const endTime = ref('');
const selectedAdvisor = ref('');
const notes = ref('');
const isLoading = ref(false);
const meetings = ref([]);
const advisors = ref([]);
const today = new Date().toISOString().split('T')[0];

// Lấy danh sách advisors khi component được mount
onMounted(async () => {
  try {
    const response = await getUsers({ role: 'Advisor' });
    advisors.value = response.items;
    await loadMeetings();
  } catch (error) {
    console.error('Error loading advisors:', error);
    toast.error('Không thể tải danh sách advisor');
  }
});

// Lấy danh sách các cuộc họp
const loadMeetings = async () => {
  try {
    const response = await getMeetings({
      pageIndex: 0,
      pageSize: 10
    });
    meetings.value = (response.items || []).map(meeting => ({
      ...meeting,
      advisorName: advisors.value.find(a => a.id === meeting.advisorId)?.fullName || 'Unknown'
    }));
  } catch (error) {
    console.error('Error loading meetings:', error);
    toast.error('Không thể tải danh sách cuộc họp');
  }
};

// Đặt lịch họp mới
const scheduleMeeting = async () => {
  if (!meetingDate.value || !startTime.value || !endTime.value || !selectedAdvisor.value) {
    toast.error('Vui lòng điền đầy đủ thông tin');
    return;
  }

  isLoading.value = true;
  try {
    const startDateTime = new Date(`${meetingDate.value}T${startTime.value}`);
    const endDateTime = new Date(`${meetingDate.value}T${endTime.value}`);
    
    const dto = {
      id: crypto.randomUUID(), // Generate new GUID
      title: 'Cuộc họp với Advisor',
      startAfter: startDateTime.toISOString(),
      endAfter: endDateTime.toISOString(),
      maxParticipants: 2,
      participants: [selectedAdvisor.value],
      description: notes.value || ''
    };

    await createMeeting(dto);
    toast.success('Đặt lịch họp thành công');
    
    // Reset form
    meetingDate.value = '';
    startTime.value = '';
    endTime.value = '';
    selectedAdvisor.value = '';
    notes.value = '';
    
    // Tải lại danh sách cuộc họp
    await loadMeetings();
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors?.join(', ')
      || 'Không thể đặt lịch họp';
    toast.error(errorMessage);
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
    console.error('Error canceling meeting:', error);
    toast.error('Không thể hủy lịch họp');
  }
};

// Tham gia cuộc họp
const joinMeeting = async (meetingId) => {
  try {
    await joinMeetingApi(meetingId);
    toast.success('Đã tham gia cuộc họp');
    // Có thể thêm logic để mở video call ở đây
  } catch (error) {
    console.error('Error joining meeting:', error);
    toast.error('Không thể tham gia cuộc họp');
  }
};

// Format ngày tháng
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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
</style> 