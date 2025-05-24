<template>
  <div class="container mt-5 p-4 bg-white shadow rounded" style="max-width: 800px;">
    <LoadingSpinner ref="loadingSpinner" />
    <div v-if="status === 'pending'">
      <h1 class="text-center text-success">Đang đợi phê duyệt...</h1>
    </div>
    <div v-else>
      <h1 class="text-center mb-4">Yêu cầu trở thành Cố vấn</h1>

      <!-- Tabs navigation -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
          <button class="nav-link" :class="{ active: activeTab === index }" @click="activeTab = index">
            <component :is="tab.icon" class="me-2" size="18" />
            {{ tab.name }}
            <span v-if="getTabErrors(index).length > 0" class="badge bg-danger ms-2">{{ getTabErrors(index).length
            }}</span>
          </button>
        </li>
      </ul>

      <!-- Tab content -->
      <div class="tab-content">
        <!-- Tab 1: Basic Info -->
        <div v-show="activeTab === 0" class="tab-pane fade show active">
          <div class="mb-3">
            <label class="form-label fw-bold">Họ và tên: <span class="text-danger">*</span></label>
            <input v-model="fullName" type="text" class="form-control" :class="{ 'is-invalid': errors.fullName }"
              placeholder="Nhập họ và tên của bạn" />
            <div v-if="errors.fullName" class="invalid-feedback">{{ errors.fullName }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Tải lên CV của bạn: <span class="text-danger">*</span></label>
            <input type="file" accept=".pdf,.doc,.docx" @change="handleCVUpload" class="form-control"
              :class="{ 'is-invalid': errors.cvFile }" />
            <div v-if="errors.cvFile" class="invalid-feedback">{{ errors.cvFile }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Giới thiệu: <span class="text-danger">*</span></label>
            <textarea v-model="introduction" rows="3" placeholder="Viết về bản thân..." class="form-control"
              :class="{ 'is-invalid': errors.introduction }"></textarea>
            <div v-if="errors.introduction" class="invalid-feedback">{{ errors.introduction }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Kinh nghiệm: <span class="text-danger">*</span></label>
            <textarea v-model="experience" rows="3" placeholder="Mô tả kinh nghiệm của bạn..." class="form-control"
              :class="{ 'is-invalid': errors.experience }"></textarea>
            <div v-if="errors.experience" class="invalid-feedback">{{ errors.experience }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Số điện thoại: <span class="text-danger">*</span></label>
            <input v-model="phoneNumber" type="tel" class="form-control" :class="{ 'is-invalid': errors.phoneNumber }"
              placeholder="Nhập số điện thoại của bạn" />
            <div v-if="errors.phoneNumber" class="invalid-feedback">{{ errors.phoneNumber }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Liên kết mạng xã hội (không bắt buộc):</label>
            <div class="input-group mb-2">
              <span class="input-group-text">
                <Facebook size="18" />
              </span>
              <input v-model="socialLinks.facebook" type="text" class="form-control" placeholder="Facebook URL" />
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text">
                <Linkedin size="18" />
              </span>
              <input v-model="socialLinks.linkedin" type="text" class="form-control" placeholder="LinkedIn URL" />
            </div>
            <div class="input-group">
              <span class="input-group-text">
                <Instagram size="18" />
              </span>
              <input v-model="socialLinks.instagram" type="text" class="form-control" placeholder="Instagram URL" />
            </div>
          </div>
        </div>

        <div v-show="activeTab === 1" class="tab-pane fade show active">
          <div class="mb-3">
            <label class="form-label fw-bold">Chứng chỉ: <span class="text-danger">*</span></label>
            <div v-for="(cert, index) in certificateList" :key="index" class="mb-2">
              <div class="input-group">
                <input v-model="cert.name" type="text" class="form-control"
                  :class="{ 'is-invalid': errors[`certificate_${index}_name`] }" placeholder="Tên chứng chỉ" />
                <input type="file" @change="(e) => handleCertificateFile(e, index)" class="form-control"
                  :class="{ 'is-invalid': errors[`certificate_${index}_file`] }" accept=".pdf,.jpg,.png" />
                <button @click="removeCertificate(index)" class="btn btn-outline-danger">
                  <Trash2 size="18" />
                </button>
              </div>
              <div v-if="errors[`certificate_${index}_name`]" class="text-danger small">{{
                errors[`certificate_${index}_name`] }}</div>
              <div v-if="errors[`certificate_${index}_file`]" class="text-danger small">{{
                errors[`certificate_${index}_file`] }}</div>
            </div>
            <button @click="addCertificate" class="btn btn-outline-primary mt-2">
              <PlusCircle size="18" class="me-2" />
              Thêm chứng chỉ
            </button>
            <div v-if="errors.certificates" class="text-danger small mt-2">{{ errors.certificates }}</div>
          </div>
        </div>

        <div v-show="activeTab === 2" class="tab-pane fade show active">
          <div class="alert alert-info">
            <Info size="18" class="me-2" />
            Bạn có thể tải lên ảnh mã QR hoặc điền thông tin tài khoản ngân hàng.
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Tải lên ảnh mã QR thanh toán:</label>
            <div class="d-flex align-items-center">
              <input type="file" accept=".jpg,.jpeg,.png" @change="handleQRUpload" class="form-control"
                :class="{ 'is-invalid': errors.qrImage }" />
              <button v-if="bankInfo.qrImage" @click="clearQRImage" class="btn btn-outline-danger ms-2"
                title="Xóa ảnh QR">
                <X size="18" />
              </button>
            </div>
            <div v-if="errors.qrImage" class="invalid-feedback">{{ errors.qrImage }}</div>
            <div v-if="bankInfo.qrImage" class="mt-2">
              <img :src="qrPreviewUrl" alt="QR Preview" class="img-thumbnail" style="max-height: 150px;" />
            </div>
          </div>

          <hr />

          <div class="mb-3">
            <label class="form-label fw-bold">
              Số tài khoản (STK):
              <span v-if="!bankInfo.qrImage" class="text-danger">*</span>
              <span v-else class="text-muted">(không bắt buộc)</span>
            </label>
            <input v-model="bankInfo.accountNumber" type="text" class="form-control"
              :class="{ 'is-invalid': errors.accountNumber }" placeholder="Nhập số tài khoản của bạn" />
            <div v-if="errors.accountNumber" class="invalid-feedback">{{ errors.accountNumber }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">
              Ngân hàng:
              <span v-if="!bankInfo.qrImage" class="text-danger">*</span>
              <span v-else class="text-muted">(không bắt buộc)</span>
            </label>
            <select v-model="bankInfo.bankName" class="form-select" :class="{ 'is-invalid': errors.bankName }">
              <option value="">Chọn ngân hàng</option>
              <option v-for="bank in bankList" :key="bank" :value="bank">{{ bank }}</option>
            </select>
            <div v-if="errors.bankName" class="invalid-feedback">{{ errors.bankName }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">
              Tên chủ tài khoản:
              <span v-if="!bankInfo.qrImage" class="text-danger">*</span>
              <span v-else class="text-muted">(không bắt buộc)</span>
            </label>
            <input v-model="bankInfo.accountHolder" type="text" class="form-control"
              :class="{ 'is-invalid': errors.accountHolder }" placeholder="Nhập tên chủ tài khoản" />
            <div v-if="errors.accountHolder" class="invalid-feedback">{{ errors.accountHolder }}</div>
          </div>

          <div v-if="errors.banking" class="alert alert-danger">
            <AlertCircle size="18" class="me-2" />
            {{ errors.banking }}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button @click="prevTab" class="btn btn-outline-secondary" :disabled="activeTab === 0">
          <ChevronLeft size="18" class="me-1" />
          Quay lại
        </button>

        <button v-if="activeTab < 2" @click="nextTab" class="btn btn-outline-primary">
          Tiếp theo
          <ChevronRight size="18" class="ms-1" />
        </button>

        <button v-else @click="showConfirmDialog" class="btn btn-warning fw-bold">
          <Send size="18" class="me-1" />
          Gửi yêu cầu
        </button>
      </div>
    </div>

    <SaveConfirmPopup :message="'Bạn có chắc chắn muốn gửi yêu cầu trở thành cố vấn?'" :is-visible="showDialog"
      @confirm-save="handleConfirmation" @update:is-visible="showDialog = $event" />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { submitAdvisorRequest, getNotifications } from "@/scripts/api/services/notificationService";
import { toast } from "vue3-toastify";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';
import SaveConfirmPopup from '@/components/Common/Popup/SaveConfirmPopUp.vue';
import {
  User,
  FileText,
  CreditCard,
  Facebook,
  Linkedin,
  Instagram,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  Info,
  X,
  AlertCircle
} from 'lucide-vue-next';

export default {
  components: {
    LoadingSpinner,
    SaveConfirmPopup,
    User,
    FileText,
    CreditCard,
    Facebook,
    Linkedin,
    Instagram,
    PlusCircle,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Send,
    Info,
    X,
    AlertCircle
  },
  setup() {
    const loadingSpinner = ref(null);
    const activeTab = ref(0);
    const status = ref('');
    const errors = ref({});
    const showDialog = ref(false);
    const fullName = ref('');
    const introduction = ref('');
    const experience = ref('');
    const phoneNumber = ref('');
    const cvFile = ref(null);
    const socialLinks = ref({
      facebook: '',
      linkedin: '',
      instagram: ''
    });

    const certificateList = ref([
      { name: '', file: null }
    ]);

    const bankInfo = ref({
      accountNumber: '',
      bankName: '',
      accountHolder: '',
      qrImage: null
    });

    const qrPreviewUrl = computed(() => {
      if (bankInfo.value.qrImage) {
        return URL.createObjectURL(bankInfo.value.qrImage);
      }
      return '';
    });

    const bankList = [
      'Vietcombank',
      'BIDV',
      'Agribank',
      'Techcombank',
      'VPBank',
      'MBBank',
      'ACB',
      'TPBank',
      'Sacombank',
      'VIB'
    ];

    const tabs = [
      { name: 'Thông tin cơ bản', icon: 'User' },
      { name: 'Chứng chỉ', icon: 'FileText' },
      { name: 'Thông tin ngân hàng', icon: 'CreditCard' }
    ];

    watch(fullName, () => { if (errors.value.fullName) delete errors.value.fullName; });
    watch(introduction, () => { if (errors.value.introduction) delete errors.value.introduction; });
    watch(experience, () => { if (errors.value.experience) delete errors.value.experience; });
    watch(phoneNumber, () => { if (errors.value.phoneNumber) delete errors.value.phoneNumber; });
    watch(() => bankInfo.value.accountNumber, () => { if (errors.value.accountNumber) delete errors.value.accountNumber; });
    watch(() => bankInfo.value.bankName, () => { if (errors.value.bankName) delete errors.value.bankName; });
    watch(() => bankInfo.value.accountHolder, () => { if (errors.value.accountHolder) delete errors.value.accountHolder; });
    watch(() => bankInfo.value.qrImage, () => {
      if (errors.value.banking) delete errors.value.banking;
      if (errors.value.qrImage) delete errors.value.qrImage;
      if (bankInfo.value.qrImage) {
        delete errors.value.accountNumber;
        delete errors.value.bankName;
        delete errors.value.accountHolder;
      }
    });

    const getTabErrors = (tabIndex) => {
      const tabErrors = [];

      if (tabIndex === 0) {
        if (errors.value.fullName) tabErrors.push('fullName');
        if (errors.value.cvFile) tabErrors.push('cvFile');
        if (errors.value.introduction) tabErrors.push('introduction');
        if (errors.value.experience) tabErrors.push('experience');
        if (errors.value.phoneNumber) tabErrors.push('phoneNumber');
      } else if (tabIndex === 1) {
        if (errors.value.certificates) tabErrors.push('certificates');
        certificateList.value.forEach((_, index) => {
          if (errors.value[`certificate_${index}_name`]) tabErrors.push(`certificate_${index}_name`);
          if (errors.value[`certificate_${index}_file`]) tabErrors.push(`certificate_${index}_file`);
        });
      } else if (tabIndex === 2) {
        if (errors.value.banking) tabErrors.push('banking');
        if (errors.value.accountNumber) tabErrors.push('accountNumber');
        if (errors.value.bankName) tabErrors.push('bankName');
        if (errors.value.accountHolder) tabErrors.push('accountHolder');
        if (errors.value.qrImage) tabErrors.push('qrImage');
      }

      return tabErrors;
    };

    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        cvFile.value = file;
        if (errors.value.cvFile) delete errors.value.cvFile;
      }
    };

    const handleQRUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        bankInfo.value.qrImage = file;
      }
    };

    const clearQRImage = () => {
      bankInfo.value.qrImage = null;
    };

    const addCertificate = () => {
      certificateList.value.push({ name: '', file: null });
    };

    const removeCertificate = (index) => {
      delete errors.value[`certificate_${index}_name`];
      delete errors.value[`certificate_${index}_file`];

      certificateList.value.splice(index, 1);
      if (certificateList.value.length === 0) {
        addCertificate();
      }
    };

    const handleCertificateFile = (event, index) => {
      const file = event.target.files[0];
      if (file) {
        certificateList.value[index].file = file;
        if (errors.value[`certificate_${index}_file`]) delete errors.value[`certificate_${index}_file`];
      }
    };

    const nextTab = () => {
      validateCurrentTab();
      if (getTabErrors(activeTab.value).length === 0 && activeTab.value < 2) {
        activeTab.value++;
      }
    };

    const prevTab = () => {
      if (activeTab.value > 0) {
        activeTab.value--;
      }
    };

    const validateCurrentTab = () => {
      if (activeTab.value === 0) {
        validateBasicInfo();
      } else if (activeTab.value === 1) {
        validateCertificates();
      } else if (activeTab.value === 2) {
        validateBankingInfo();
      }
    };

    const validateBasicInfo = () => {
      if (!fullName.value.trim()) {
        errors.value.fullName = "Vui lòng nhập họ và tên của bạn";
      }

      if (!cvFile.value) {
        errors.value.cvFile = "Vui lòng tải lên CV của bạn";
      }

      if (!introduction.value.trim()) {
        errors.value.introduction = "Vui lòng nhập phần giới thiệu";
      }

      if (!experience.value.trim()) {
        errors.value.experience = "Vui lòng nhập kinh nghiệm của bạn";
      }

      if (!phoneNumber.value.trim()) {
        errors.value.phoneNumber = "Vui lòng nhập số điện thoại của bạn";
      }
    };

    const validateCertificates = () => {
      const validCertificates = certificateList.value.filter(cert => cert.name.trim() && cert.file);

      if (validCertificates.length === 0) {
        errors.value.certificates = "Vui lòng thêm ít nhất một chứng chỉ";
      }

      certificateList.value.forEach((cert, index) => {
        if (cert.name.trim() && !cert.file) {
          errors.value[`certificate_${index}_file`] = "Vui lòng tải lên file chứng chỉ";
        }
        if (!cert.name.trim() && cert.file) {
          errors.value[`certificate_${index}_name`] = "Vui lòng nhập tên chứng chỉ";
        }
      });
    };

    const validateBankingInfo = () => {
      if (!bankInfo.value.qrImage) {
        if (!bankInfo.value.accountNumber.trim()) {
          errors.value.accountNumber = "Vui lòng nhập số tài khoản";
        }

        if (!bankInfo.value.bankName) {
          errors.value.bankName = "Vui lòng chọn ngân hàng";
        }

        if (!bankInfo.value.accountHolder.trim()) {
          errors.value.accountHolder = "Vui lòng nhập tên chủ tài khoản";
        }

        if (!bankInfo.value.accountNumber.trim() &&
          !bankInfo.value.bankName &&
          !bankInfo.value.accountHolder.trim()) {
          errors.value.banking = "Vui lòng tải lên ảnh mã QR hoặc điền thông tin tài khoản ngân hàng";
        }
      }
    };

    const validateForm = () => {
      errors.value = {};
      validateBasicInfo();
      validateCertificates();
      validateBankingInfo();

      return Object.keys(errors.value).length === 0;
    };

    const showConfirmDialog = () => {
      if (validateForm()) {
        showDialog.value = true;
      } else {
        for (let i = 0; i < 3; i++) {
          if (getTabErrors(i).length > 0) {
            activeTab.value = i;
            break;
          }
        }
      }
    };

    const handleConfirmation = async (confirmed) => {
      if (confirmed) {
        await submitAdvisorRequestData();
      }
    };

    const submitAdvisorRequestData = async () => {
      try {
        loadingSpinner.value.showSpinner();
        const certificates = certificateList.value
          .filter(cert => cert.name.trim() && cert.file)
          .map(cert => ({
            name: cert.name.trim(),
            file: cert.file
          }));

        await submitAdvisorRequest({
          fullName: fullName.value.trim(),
          cvFile: cvFile.value,
          introduction: introduction.value.trim(),
          experience: experience.value.trim(),
          phoneNumber: phoneNumber.value.trim(),
          socialLinks: Object.fromEntries(
            Object.entries(socialLinks.value).filter(([_, value]) => value.trim())
          ),
          certificates: certificates,
          bankInfo: {
            accountNumber: bankInfo.value.accountNumber.trim(),
            bankName: bankInfo.value.bankName,
            accountHolder: bankInfo.value.accountHolder.trim(),
            qrImage: bankInfo.value.qrImage
          }
        });

        status.value = 'pending';
        localStorage.setItem('advisor_request_status', 'pending');
        toast.success("Yêu cầu của bạn đã được gửi thành công! Vui lòng đợi phê duyệt.");
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.");
      } finally {
        loadingSpinner.value.hideSpinner();
      }
    };

    const checkRequestStatus = async () => {
      try {
        loadingSpinner.value.showSpinner();

        const currentUserId = JSON.parse(localStorage.getItem('userProfile'))?.id;
        if (!currentUserId) {
          return;
        }

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
        console.error("Error checking request status:", error);
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
      activeTab,
      tabs,
      fullName,
      introduction,
      experience,
      phoneNumber,
      cvFile,
      socialLinks,
      certificateList,
      bankInfo,
      bankList,
      qrPreviewUrl,
      status,
      errors,
      showDialog,
      loadingSpinner,
      getTabErrors,
      handleCVUpload,
      handleQRUpload,
      clearQRImage,
      addCertificate,
      removeCertificate,
      handleCertificateFile,
      nextTab,
      prevTab,
      showConfirmDialog,
      handleConfirmation,
      submitAdvisorRequestData,
    };
  },
};
</script>

<style scoped>
.container {
  width: 72vw;
}

.nav-tabs .nav-link {
  display: flex;
  align-items: center;
}

.tab-pane {
  padding: 20px 0;
}

.invalid-feedback {
  display: block;
}
</style>