<template>
  <div class="container mt-5 p-4 bg-white shadow rounded" style="max-width: 600px;">
    <LoadingSpinner ref="loadingSpinner" />
    <div v-if="status === 'pending'">
      <h1 class="text-center text-success">Đang đợi phê duyệt...</h1>
    </div>
    <div v-else>
      <h1 class="text-center mb-4">Yêu cầu trở thành Cố vấn</h1>

      <div class="mb-3">
        <label class="form-label fw-bold">Tải lên CV của bạn:</label>
        <input type="file" accept=".pdf,.doc,.docx" @change="handleCVUpload" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Giới thiệu:</label>
        <textarea v-model="introduction" rows="4" placeholder="Viết về bản thân..." class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Kinh nghiệm:</label>
        <textarea v-model="experience" rows="4" placeholder="Mô tả kinh nghiệm của bạn..." class="form-control"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Tải lên Chứng chỉ:</label>
        <input type="file" multiple accept=".pdf,.jpg,.png" @change="handleCertificateUpload" class="form-control" />
        <ul class="list-group mt-3">
          <li v-for="(cert, index) in certificates" :key="index" class="list-group-item">{{ cert.name }}</li>
        </ul>
      </div>

      <button @click="submitRequest" class="btn btn-warning w-100 py-2 fw-bold">Gửi yêu cầu</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { submitAdvisorRequest, getNotifications } from "@/scripts/api/services/notificationService";
import { toast } from "vue3-toastify";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner
  },
  setup() {
    const loadingSpinner = ref(null);
    const introduction = ref('');
    const experience = ref('');
    const cvFile = ref(null);
    const certificates = ref([]);
    const status = ref('');

    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        cvFile.value = file;
      }
    };

    const handleCertificateUpload = (event) => {
      const files = Array.from(event.target.files);
      certificates.value.push(...files);
    };

    const submitRequest = async () => {
      if (!cvFile.value || !introduction.value.trim() || !experience.value.trim()) {
        toast.error("Vui lòng tải lên CV, cung cấp phần giới thiệu và mô tả kinh nghiệm của bạn.");
        return;
      }

      try {
        await submitAdvisorRequest({
          cvFile: cvFile.value,
          introduction: introduction.value.trim(),
          experience: experience.value.trim(),
          certificates: certificates.value
        });
        status.value = 'pending';
        localStorage.setItem('advisor_request_status', 'pending');
        toast.success("Yêu cầu của bạn đã được gửi thành công! Vui lòng đợi phê duyệt.");
      } catch (error) {
      }
    };

    const checkRequestStatus = async () => {
      try {
        loadingSpinner.value.showSpinner();

        const currentUserId = JSON.parse(localStorage.getItem('userProfile'))?.id;
        if (!currentUserId) {
          return;
        }

        // Load tất cả các trang
        const allItems = [];
        let pageIndex = 0;
        const pageSize = 20;
        let pageCount = 1;

        do {
          const response = await getNotifications({ 
            pageIndex, 
            pageSize,
            creatorId: currentUserId
          });
          
          if (response?.items?.length) {
            allItems.push(...response.items);
            pageCount = response.pageCount;
          }
          
          pageIndex++;
        } while (pageIndex < pageCount);

        const advisorRequest = allItems.find(n =>
          n.type === 2 &&
          n.status === 0 &&
          n.creatorId === currentUserId
        );

        if (advisorRequest) {
          status.value = 'pending';
          localStorage.setItem('advisor_request_status', 'pending');
        } else {
          localStorage.removeItem('advisor_request_status');
        }
      } catch (error) {
        
      } finally {
        loadingSpinner.value.hideSpinner();
      }
    };

    onMounted(async () => {
      const savedStatus = localStorage.getItem('advisor_request_status');
      if (savedStatus) {
        status.value = savedStatus;
      } else {
        await checkRequestStatus();
      }
    });

    return {
      introduction,
      experience,
      cvFile,
      certificates,
      status,
      loadingSpinner,
      handleCVUpload,
      handleCertificateUpload,
      submitRequest,
    };
  },
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
