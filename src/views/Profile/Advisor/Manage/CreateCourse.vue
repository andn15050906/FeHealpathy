<template>
  <div class="create-course-container">
    <SaveConfirmPopUp :message="saveMessage" :isVisible="showSaveConfirm" @confirmSave="onConfirmSave"
      @update:isVisible="showSaveConfirm = $event" />
    <DeleteConfirmPopup :message="deleteMessage" :isVisible="showDeleteConfirm" @confirmDelete="onConfirmDelete"
      @update:isVisible="showDeleteConfirm = $event" />
    <CancelConfirmPopup :message="cancelMessage" :isVisible="showCancelConfirm" @confirmCancel="onConfirmCancel"
      @update:isVisible="showCancelConfirm = $event" />

    <div class="header-section py-2">
      <div class="container-fluid">
        <div class="row p-2">
          <div class="col-12">
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-secondary me-3 d-flex align-items-center" @click="goBack">
                <ArrowLeftIcon class="icon me-1" /> Quay lại
              </button>
              <h1 class="h3 mb-0">Thêm khóa học mới</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="container-fluid">
        <div class="row g-4 mb-2">
          <div class="col-lg-8">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white py-3 border-bottom">
                <h5 class="mb-0 fw-bold">Thông tin khóa học</h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveCourse">
                  <div class="mb-4">
                    <label for="courseName" class="form-label fw-medium">Tên khóa học <span
                        class="text-danger">*</span></label>
                    <input type="text" class="form-control form-control-lg" id="courseName" v-model="course.title"
                      placeholder="Nhập tên khóa học" required
                      :class="{ 'is-invalid': validationErrors.course.title }" />
                    <div class="invalid-feedback" v-if="validationErrors.course.title">
                      {{ validationErrors.course.title }}
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-8">
                      <label for="courseCategory" class="form-label fw-medium">Danh mục <span
                          class="text-danger">*</span></label>
                      <div class="position-relative" :class="{ 'is-invalid': validationErrors.course.category }">
                        <div class="form-control d-flex flex-wrap gap-1 min-height-auto"
                          @click="toggleCategoryDropdown">
                          <div v-if="course.selectedCategories.length === 0" class="text-muted">Chọn danh mục</div>
                          <div v-for="category in course.selectedCategories" :key="category.id"
                            class="badge bg-primary d-flex align-items-center me-1 mb-1">
                            {{ category.value }}
                            <button type="button" class="btn-close btn-close-white ms-2"
                              @click.stop="removeCategory(category)" style="font-size: 0.5rem"></button>
                          </div>
                        </div>
                        <div v-show="showCategoryDropdown" class="dropdown-menu position-absolute w-100 show"
                          style="max-height: 200px; overflow-y: auto;">
                          <div class="p-2">
                            <input type="text" class="form-control form-control-sm mb-2" placeholder="Tìm kiếm danh mục"
                              v-model="categorySearchTerm" @input="filterCategories">
                          </div>
                          <div v-if="filteredCategories.length === 0" class="dropdown-item disabled">Không tìm thấy danh
                            mục</div>
                          <button v-for="category in filteredCategories" :key="category.id" class="dropdown-item"
                            type="button" @click.stop="selectCategory(category)">
                            {{ category.value }}
                          </button>
                        </div>
                      </div>
                      <div class="invalid-feedback" v-if="validationErrors.course.category">
                        {{ validationErrors.course.category }}
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Giá khóa học <span class="text-danger">*</span></label>
                      <div class="d-flex flex-wrap align-items-center gap-3">
                        <div class="form-check form-check-inline mb-0">
                          <input class="form-check-input" type="radio" name="priceType" id="freeCourse" value="free"
                            v-model="course.priceType" required />
                          <label class="form-check-label" for="freeCourse">Miễn phí</label>
                        </div>
                        <div class="form-check form-check-inline mb-0">
                          <input class="form-check-input" type="radio" name="priceType" id="paidCourse" value="paid"
                            v-model="course.priceType" checked />
                          <label class="form-check-label" for="paidCourse">Trả phí</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="course.priceType === 'paid'" class="row mb-4">
                    <div class="col-md-4">
                      <label for="coursePrice" class="form-label fw-medium">Giá tiền (VND)
                        <span class="text-danger">*</span></label>
                      <input type="number" class="form-control" id="coursePrice" v-model="course.price" min="10000"
                        step="1000" placeholder="Nhập giá khóa học" required
                        :class="{ 'is-invalid': validationErrors.course.price }" />
                      <div class="invalid-feedback" v-if="validationErrors.course.price">
                        {{ validationErrors.course.price }}
                      </div>
                      <small class="text-muted">Giá tối thiểu: 10,000 VND</small>
                    </div>
                    <div class="col-md-4">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" class="form-control" id="courseDiscount" v-model="course.discount" min="0"
                        max="100" step="1" placeholder="0-100%"
                        :class="{ 'is-invalid': validationErrors.course.discount }" />
                      <div class="invalid-feedback" v-if="validationErrors.course.discount">
                        {{ validationErrors.course.discount }}
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label for="discountExpiry" class="form-label fw-medium">Ngày hết hạn giảm giá</label>
                      <input type="date" class="form-control" id="discountExpiry" v-model="course.discountExpiry"
                        :min="minDiscountDate" :required="course.discount > 0"
                        :class="{ 'is-invalid': validationErrors.course.discountExpiry }" />
                      <div class="invalid-feedback" v-if="validationErrors.course.discountExpiry">
                        {{ validationErrors.course.discountExpiry }}
                      </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="courseDescription" class="form-label fw-medium">Mô tả <span
                        class="text-danger">*</span></label>
                    <textarea class="form-control" id="courseDescription" v-model="course.description" rows="4"
                      placeholder="Mô tả khóa học" required
                      :class="{ 'is-invalid': validationErrors.course.description }"></textarea>
                    <div class="invalid-feedback" v-if="validationErrors.course.description">
                      {{ validationErrors.course.description }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="courseImage" class="form-label fw-medium">Ảnh khóa học <span
                        class="text-danger">*</span></label>
                    <div class="input-group mb-2">
                      <input type="file" class="form-control" id="courseImage" @change="handleImageUpload"
                        accept="image/*" required :class="{ 'is-invalid': validationErrors.course.thumb }" />
                      <label class="input-group-text d-flex align-items-center" for="courseImage">
                        <UploadIcon class="icon me-1" /> Tải lên
                      </label>
                    </div>
                    <div class="invalid-feedback" v-if="validationErrors.course.thumb">
                      {{ validationErrors.course.thumb }}
                    </div>
                    <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>

                    <div v-if="course.imagePreview" class="mt-3 border p-2 rounded">
                      <img :src="course.imagePreview" alt="Xem trước ảnh" class="img-thumbnail"
                        style="max-height: 200px" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium d-block">Trạng thái</label>
                    <div class="d-flex flex-wrap gap-3">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusDraft" value="Draft"
                          v-model="course.status" />
                        <label class="form-check-label" for="statusDraft">Bản nháp</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusActive"
                          value="Active" v-model="course.status" />
                        <label class="form-check-label" for="statusActive">Hoạt động</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusInactive"
                          value="Inactive" v-model="course.status" />
                        <label class="form-check-label" for="statusInactive">Không hoạt động</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white py-3 border-bottom">
                <h5 class="mb-0 fw-bold">Cài đặt khóa học</h5>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <label for="courseDifficulty" class="form-label fw-medium">Trình độ</label>
                  <select class="form-select" id="courseDifficulty" v-model="course.level" required
                    :class="{ 'is-invalid': validationErrors.course.level }">
                    <option value="" disabled>Chọn trình độ</option>
                    <option value="1">Mới bắt đầu</option>
                    <option value="2">Trung bình</option>
                    <option value="3">Nâng cao</option>
                  </select>
                  <div class="invalid-feedback" v-if="validationErrors.course.level">
                    {{ validationErrors.course.level }}
                  </div>
                </div>

                <div class="mb-4">
                  <label for="courseAdvisorExpectedOutcome" class="form-label fw-medium">
                    Sau khóa học, học viên nhận được gì?
                    <span class="text-danger">*</span>
                  </label>
                  <textarea class="form-control" id="courseAdvisorExpectedOutcome"
                    v-model="course.advisorExpectedOutcome" rows="3"
                    placeholder="Mô tả những gì học viên sẽ đạt được sau khi hoàn thành" required
                    :class="{ 'is-invalid': validationErrors.course.advisorExpectedOutcome }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.advisorExpectedOutcome">
                    {{ validationErrors.course.advisorExpectedOutcome }}
                  </div>
                </div>

                <div class="mb-4">
                  <label for="courseExpectedOutcome" class="form-label fw-medium">
                    Kết quả mong đợi <span class="text-danger">*</span>
                  </label>
                  <textarea class="form-control" id="courseExpectedOutcome" v-model="course.expectedOutcome" rows="3"
                    placeholder="Mô tả kết quả và kỹ năng học viên nhận được" required
                    :class="{ 'is-invalid': validationErrors.course.expectedOutcome }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.expectedOutcome">
                    {{ validationErrors.course.expectedOutcome }}
                  </div>
                </div>

                <div class="mb-4">
                  <label for="courseRequirements" class="form-label fw-medium">
                    Yêu cầu trước khi học <span class="text-danger">*</span>
                  </label>
                  <textarea class="form-control" id="courseRequirements" v-model="course.requirements" rows="3"
                    placeholder="Nhập các yêu cầu/học vấn cần có trước khi tham gia" required
                    :class="{ 'is-invalid': validationErrors.course.requirements }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.requirements">
                    {{ validationErrors.course.requirements }}
                  </div>
                </div>

                <div class="mb-4">
                  <label for="courseOutcomes" class="form-label fw-medium">
                    Mục tiêu khóa học <span class="text-danger">*</span>
                  </label>
                  <textarea class="form-control" id="courseOutcomes" v-model="course.outcomes" rows="3"
                    placeholder="Liệt kê các mục tiêu chính của khóa học" required
                    :class="{ 'is-invalid': validationErrors.course.outcomes }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.outcomes">
                    {{ validationErrors.course.outcomes }}
                  </div>
                </div>

                <div class="mb-4">
                  <label for="courseCompletionTime" class="form-label fw-medium">
                    Thời gian hoàn thành <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <input type="number" class="form-control" id="courseCompletionTime"
                      v-model="course.expectedCompletion" min="1" placeholder="Số giờ dự kiến" required
                      :class="{ 'is-invalid': validationErrors.course.expectedCompletion }" />
                    <span class="input-group-text">Phút</span>
                  </div>
                  <div class="invalid-feedback" v-if="validationErrors.course.expectedCompletion">
                    {{ validationErrors.course.expectedCompletion }}
                  </div>
                  <small class="text-muted">Thời gian ước tính để học viên hoàn thành</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-white py-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 fw-bold">Nội dung khóa học</h5>
                  <button class="btn btn-primary d-flex align-items-center" @click="addLecture">
                    <PlusIcon class="icon me-2" /> Thêm bài giảng
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="lecture-tabs">
                  <ul class="nav nav-tabs lecture-tabs-nav px-3 pt-3" role="tablist">
                    <li class="nav-item" v-for="(lecture, index) in course.lectures" :key="index">
                      <button class="nav-link lecture-tab" :class="{ active: activeTab === index }"
                        @click="activeTab = index" role="tab">
                        <span class="lecture-number">Bài {{ index + 1 }}</span>
                        <button type="button" class="lecture-close-btn" @click.stop="removeLecture(index)"
                          v-if="course.lectures.length > 1">
                          <i class="bi bi-x-circle-fill"></i>
                        </button>
                      </button>
                    </li>
                  </ul>

                  <div class="tab-content p-4 border border-top-0 rounded-bottom">
                    <div v-for="(lecture, index) in course.lectures" :key="index" class="tab-pane"
                      :class="{ active: activeTab === index }" role="tabpanel">
                      <div class="lecture-form">
                        <div class="row g-4">
                          <div class="col-md-8">
                            <div class="mb-4">
                              <label :for="`lectureTitle${index}`" class="form-label fw-medium">Tiêu đề bài giảng <span
                                  class="text-danger">*</span></label>
                              <input type="text" class="form-control form-control-lg" :id="`lectureTitle${index}`"
                                v-model="lecture.title" placeholder="Nhập tiêu đề bài giảng" required
                                :class="{ 'is-invalid': validationErrors.lectures[index]?.title }" />
                              <div class="invalid-feedback" v-if="validationErrors.lectures[index]?.title">
                                {{ validationErrors.lectures[index].title }}
                              </div>
                            </div>

                            <div class="mb-4">
                              <label :for="`lectureContentSummary${index}`" class="form-label fw-medium">Tóm tắt nội
                                dung <span class="text-danger">*</span></label>
                              <textarea class="form-control" :id="`lectureContentSummary${index}`"
                                v-model="lecture.contentSummary" rows="3"
                                placeholder="Tóm tắt ngắn gọn nội dung bài giảng" required
                                :class="{ 'is-invalid': validationErrors.lectures[index]?.contentSummary }"></textarea>
                              <div class="invalid-feedback" v-if="validationErrors.lectures[index]?.contentSummary">
                                {{ validationErrors.lectures[index].contentSummary }}
                              </div>
                            </div>

                            <div class="lecture-type-content mt-4">
                              <div v-if="lecture.lectureType === 'video'" class="resource-upload">
                                <h6 class="mb-3 fw-medium">Tài nguyên <span class="text-danger">*</span></h6>
                                <div class="upload-area p-4 border rounded border-dashed mb-3 text-center"
                                  :class="{ 'border-danger': validationErrors.lectures[index]?.medias }">
                                  <div class="mb-3">
                                    <i class="bi bi-cloud-upload fs-1 text-primary"></i>
                                  </div>
                                  <p class="mb-3">
                                    Kéo thả file hoặc nhấn để tải lên
                                  </p>
                                  <input type="file" class="form-control"
                                    @change="handleLectureMediaUpload($event, index)"
                                    accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" multiple />
                                  <small class="text-muted d-block mt-2">Hỗ trợ: Video, Hình ảnh, PDF, Word, PowerPoint,
                                    Excel</small>
                                </div>
                                <div class="text-danger small mb-3" v-if="validationErrors.lectures[index]?.medias">
                                  {{ validationErrors.lectures[index].medias }}
                                </div>
                                <div v-if="lecture.medias && lecture.medias.length > 0" class="uploaded-files">
                                  <h6 class="mb-3 fw-medium">
                                    Tài nguyên đã tải lên
                                  </h6>
                                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-2 bg-light">
                                    <i class="bi bi-file-earmark me-2 fs-5"></i>
                                    <span class="me-2">{{ media.title }}</span>
                                    <button type="button" class="btn-close ms-auto"
                                      @click="removeLectureMedia(index, mediaIndex)"></button>
                                  </div>
                                </div>
                              </div>

                              <div v-if="lecture.lectureType === 'text'" class="text-content">
                                <h6 class="mb-3 fw-medium">
                                  Nội dung chi tiết <span class="text-danger">*</span>
                                </h6>
                                <textarea class="form-control" v-model="lecture.content" rows="12"
                                  placeholder="Nhập nội dung chi tiết của bài giảng"
                                  :class="{ 'is-invalid': validationErrors.lectures[index]?.content }"></textarea>
                                <div class="invalid-feedback" v-if="validationErrors.lectures[index]?.content">
                                  {{ validationErrors.lectures[index].content }}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="lecture-settings p-3 border rounded h-100">
                              <h6 class="mb-4 fw-medium border-bottom pb-2">
                                Cài đặt bài giảng
                              </h6>

                              <div class="mb-3">
                                <label :for="`lectureType${index}`" class="form-label fw-medium">Loại bài giảng</label>
                                <select class="form-select" :id="`lectureType${index}`" v-model="lecture.lectureType">
                                  <option value="video">
                                    Tài nguyên (Video/Hình Ảnh/Tài Liệu)
                                  </option>
                                  <option value="text">Văn bản</option>
                                </select>
                              </div>

                              <div class="form-check form-switch mt-4">
                                <input class="form-check-input" type="checkbox" :id="`lecturePreview${index}`"
                                  v-model="lecture.isPreviewable" />
                                <label class="form-check-label" :for="`lecturePreview${index}`">
                                  Xem trước miễn phí
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-end gap-3 py-4">
              <button class="btn btn-danger d-flex align-items-center px-4" @click="goBack">
                <i class="bi bi-x-circle me-2"></i> Hủy
              </button>
              <button class="btn btn-primary d-flex align-items-center px-4" @click="saveCourse">
                <i class="bi bi-save me-2"></i> Lưu khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createCourse } from "@/scripts/api/services/courseService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import SaveConfirmPopUp from "../../../../components/Common/Popup/SaveConfirmPopUp.vue";
import DeleteConfirmPopup from "../../../../components/Common/Popup/DeleteConfirmPopup.vue";
import CancelConfirmPopup from "../../../../components/Common/Popup/CancelConfirmPopup.vue";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import { ArrowLeftIcon, PlusIcon, SaveIcon, UploadIcon } from "lucide-vue-next";
import { getPagedTags } from "@/scripts/api/services/tagService";

export default {
  name: "CreateCourse",
  components: {
    LoadingSpinner,
    ArrowLeftIcon,
    PlusIcon,
    SaveIcon,
    UploadIcon,
    SaveConfirmPopUp,
    DeleteConfirmPopup,
    CancelConfirmPopup,
  },
  data() {
    return {
      course: {
        id: "",
        title: "",
        intro: "",
        description: "",
        price: 0,
        discount: 0,
        discountExpiry: "",
        level: 1,
        outcomes: "",
        expectedOutcome: "",
        requirements: "",
        expectedCompletion: "",
        advisorExpectedOutcome: "",
        thumb: {
          url: "",
          file: null,
          title: "",
        },
        priceType: "paid",
        status: "Draft",
        leafCategoryId: "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac",
        lectures: [],
        selectedCategories: [],
      },
      categories: [],
      showCategoryDropdown: false,
      categorySearchTerm: '',
      filteredCategories: [],
      previewImage: null,
      activeTab: 0,
      showSaveConfirm: false,
      showDeleteConfirm: false,
      showCancelConfirm: false,
      deleteIndex: null,
      saveMessage: "Bạn có chắc muốn lưu khóa học?",
      deleteMessage: "Bạn có chắc muốn xóa bài giảng này?",
      cancelMessage: "Bạn có chắc muốn hủy và bỏ các thay đổi?",
      isBackAction: false,
      minDiscountDate: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
      })(),
      validationErrors: {
        course: {
          title: '',
          category: '',
          price: '',
          discount: '',
          discountExpiry: '',
          description: '',
          thumb: '',
          level: '',
          advisorExpectedOutcome: '',
          expectedOutcome: '',
          requirements: '',
          outcomes: '',
          expectedCompletion: ''
        },
        lectures: []
      }
    };
  },
  created() {
  },
  async mounted() {
    await this.fetchCategories();
    this.filterCategories();
    if (this.course.lectures.length === 0) {
      this.addLecture();
    } else {
      this.course.lectures.forEach((_, index) => {
        this.ensureLectureValidationExists(index);
      });
    }
  },
  watch: {
    "course.priceType": function (newValue) {
      if (newValue === "free") {
        this.course.price = 0;
        this.course.discount = 0;
        this.course.discountExpiry = "";
      }
    },
    "course.discount": function (newValue) {
      if (newValue === 0) {
        this.course.discountExpiry = "";
      }
    },
    activeTab: {
      handler(newActiveTab) {
        if (newActiveTab < 0 || newActiveTab >= this.course.lectures.length) {
          this.activeTab = 0;
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await getPagedTags();
        if (response && Array.isArray(response)) {
          this.categories = response.map(category => ({
            id: category.id,
            value: category.title
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục khóa học.");
      }
    },
    toggleCategoryDropdown() {
      this.showCategoryDropdown = !this.showCategoryDropdown;
      if (this.showCategoryDropdown) {
        this.filterCategories();
        setTimeout(() => {
          document.addEventListener('click', this.closeCategoryDropdown);
        }, 0);
      }
    },

    closeCategoryDropdown(event) {
      const dropdown = document.querySelector('.dropdown-menu');
      const trigger = document.querySelector('.form-control.d-flex');
      if (dropdown && trigger && !dropdown.contains(event.target) && !trigger.contains(event.target)) {
        this.showCategoryDropdown = false;
        document.removeEventListener('click', this.closeCategoryDropdown);
      }
    },

    filterCategories() {
      if (!this.categorySearchTerm) {
        this.filteredCategories = this.categories.filter(
          category => !this.course.selectedCategories.some(selected => selected.id === category.id)
        );
      } else {
        const searchTerm = this.categorySearchTerm.toLowerCase();
        this.filteredCategories = this.categories.filter(
          category =>
            category.value.toLowerCase().includes(searchTerm) &&
            !this.course.selectedCategories.some(selected => selected.id === category.id)
        );
      }
    },

    selectCategory(category) {
      this.course.selectedCategories.push(category);
      this.filterCategories();
      this.validationErrors.course.category = '';
    },

    removeCategory(category) {
      this.course.selectedCategories = this.course.selectedCategories.filter(
        selected => selected.id !== category.id
      );
      this.filterCategories();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.course.thumb.file = file;
        this.course.thumb.title = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.course.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleLectureMediaUpload(event, lectureIndex) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const fileType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
            ? "video"
            : "document";
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!this.course.lectures[lectureIndex].medias) {
            this.course.lectures[lectureIndex].medias = [];
          }
          this.course.lectures[lectureIndex].medias.push({
            type: fileType,
            file: file,
            preview: e.target.result,
            url: "",
            title: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    ensureLectureValidationExists(index) {
      if (!this.validationErrors.lectures[index]) {
        this.validationErrors.lectures[index] = {
          title: '',
          contentSummary: '',
          content: '',
          medias: ''
        };
      }
    },
    addLecture() {
      this.course.lectures.push({
        id: "",
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        lectureType: "video",
        metaData: "",
        medias: [],
      });

      const newIndex = this.course.lectures.length - 1;
      this.ensureLectureValidationExists(newIndex);

      this.$nextTick(() => {
        this.activeTab = newIndex;
      });
    },
    removeLecture(index) {
      this.deleteIndex = index;
      this.deleteMessage = `Bạn có chắc muốn xóa bài giảng ${index + 1}?`;
      this.isBackAction = false;
      this.showDeleteConfirm = true;
    },
    onConfirmDelete(confirmed) {
      if (confirmed) {
        if (this.isBackAction) {
          this.$router.back();
        } else if (this.deleteIndex !== null) {
          this.performRemoveLecture(this.deleteIndex);
          this.deleteIndex = null;
        }
      }
      this.showDeleteConfirm = false;
    },
    performRemoveLecture(index) {
      const currentActive = this.activeTab;
      this.course.lectures.splice(index, 1);
      this.validationErrors.lectures.splice(index, 1);

      if (this.course.lectures.length === 0) {
        this.addLecture();
        this.activeTab = 0;
      } else {
        if (index < currentActive) {
          this.activeTab = currentActive - 1;
        }
        else if (index === currentActive) {
          if (index === this.course.lectures.length) {
            this.activeTab = Math.max(0, index - 1);
          }
          else {
            this.activeTab = Math.min(index, this.course.lectures.length - 1);
          }
        }
      }
      toast.success(`Đã xóa bài giảng ${index + 1}`, {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);
      if (this.course.lectures[lectureIndex].medias.length === 0) {
        toast.warning(
          `Bài giảng ${lectureIndex + 1}: Vui lòng tải lên ít nhất một tài liệu`,
          {
            autoClose: 1000,
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    },
    goBack() {
      this.showCancelConfirm = true;
    },
    onConfirmCancel(confirmed) {
      if (confirmed) {
        this.$router.back();
      }
      this.showCancelConfirm = false;
    },
    validateForm() {
      let isValid = true;
      let firstInvalidField = null;

      Object.keys(this.validationErrors.course).forEach(key => {
        this.validationErrors.course[key] = '';
      });

      this.validationErrors.lectures.forEach((lecture, index) => {
        Object.keys(lecture).forEach(key => {
          this.validationErrors.lectures[index][key] = '';
        });
      });

      if (!this.course.title) {
        isValid = false;
        this.validationErrors.course.title = "Tên khóa học không được để trống";
        firstInvalidField = firstInvalidField || document.getElementById("courseName");
      } else if (this.course.title.length > 100) {
        isValid = false;
        this.validationErrors.course.title = "Tên khóa học không được vượt quá 100 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseName");
      }

      if (this.course.selectedCategories.length === 0) {
        isValid = false;
        this.validationErrors.course.category = "Vui lòng chọn ít nhất một danh mục";
        firstInvalidField = firstInvalidField || document.querySelector(".form-control.d-flex");
      }

      if (this.course.priceType === 'paid') {
        if (!this.course.price || this.course.price < 10000) {
          isValid = false;
          this.validationErrors.course.price = "Giá khóa học không được thấp hơn 10,000 VND";
          firstInvalidField = firstInvalidField || document.getElementById("coursePrice");
        }

        if (this.course.discount > 0 && !this.course.discountExpiry) {
          isValid = false;
          this.validationErrors.course.discountExpiry = "Vui lòng chọn ngày hết hạn giảm giá";
          firstInvalidField = firstInvalidField || document.getElementById("discountExpiry");
        }

        if (this.course.discountExpiry && !this.course.discount) {
          isValid = false;
          this.validationErrors.course.discount = "Vui lòng nhập giá trị giảm giá";
          firstInvalidField = firstInvalidField || document.getElementById("courseDiscount");
        }

        if (this.course.discountExpiry) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const expiryDate = new Date(this.course.discountExpiry);
          if (expiryDate <= today) {
            isValid = false;
            this.validationErrors.course.discountExpiry = "Ngày hết hạn phải lớn hơn ngày hiện tại";
            firstInvalidField = firstInvalidField || document.getElementById("discountExpiry");
          }
        }
      }

      if (!this.course.description) {
        isValid = false;
        this.validationErrors.course.description = "Mô tả khóa học không được để trống";
        firstInvalidField = firstInvalidField || document.getElementById("courseDescription");
      } else if (this.course.description.length > 500) {
        isValid = false;
        this.validationErrors.course.description = "Mô tả khóa học không được vượt quá 500 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseDescription");
      }

      if (!this.course.thumb.file && !this.course.thumb.url) {
        isValid = false;
        this.validationErrors.course.thumb = "Vui lòng tải lên ảnh khóa học";
        firstInvalidField = firstInvalidField || document.getElementById("courseImage");
      }

      if (!this.course.level) {
        isValid = false;
        this.validationErrors.course.level = "Vui lòng chọn trình độ khóa học";
        firstInvalidField = firstInvalidField || document.getElementById("courseDifficulty");
      }

      if (!this.course.advisorExpectedOutcome) {
        isValid = false;
        this.validationErrors.course.advisorExpectedOutcome = "Vui lòng nhập thông tin học viên nhận được sau khóa học";
        firstInvalidField = firstInvalidField || document.getElementById("courseAdvisorExpectedOutcome");
      } else if (this.course.advisorExpectedOutcome.length > 255) {
        isValid = false;
        this.validationErrors.course.advisorExpectedOutcome = "Thông tin học viên nhận được không được vượt quá 255 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseAdvisorExpectedOutcome");
      }

      if (!this.course.expectedOutcome) {
        isValid = false;
        this.validationErrors.course.expectedOutcome = "Vui lòng nhập kết quả mong đợi";
        firstInvalidField = firstInvalidField || document.getElementById("courseExpectedOutcome");
      } else if (this.course.expectedOutcome.length > 255) {
        isValid = false;
        this.validationErrors.course.expectedOutcome = "Kết quả mong đợi không được vượt quá 255 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseExpectedOutcome");
      }

      if (!this.course.requirements) {
        isValid = false;
        this.validationErrors.course.requirements = "Vui lòng nhập yêu cầu trước khi học";
        firstInvalidField = firstInvalidField || document.getElementById("courseRequirements");
      } else if (this.course.requirements.length > 255) {
        isValid = false;
        this.validationErrors.course.requirements = "Yêu cầu trước khi học không được vượt quá 255 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseRequirements");
      }

      if (!this.course.outcomes) {
        isValid = false;
        this.validationErrors.course.outcomes = "Vui lòng nhập mục tiêu khóa học";
        firstInvalidField = firstInvalidField || document.getElementById("courseOutcomes");
      } else if (this.course.outcomes.length > 255) {
        isValid = false;
        this.validationErrors.course.outcomes = "Mục tiêu khóa học không được vượt quá 255 ký tự";
        firstInvalidField = firstInvalidField || document.getElementById("courseOutcomes");
      }

      if (!this.course.expectedCompletion) {
        isValid = false;
        this.validationErrors.course.expectedCompletion = "Vui lòng nhập thời gian hoàn thành";
        firstInvalidField = firstInvalidField || document.getElementById("courseCompletionTime");
      }

      this.course.lectures.forEach((lecture, index) => {
        this.ensureLectureValidationExists(index);

        if (!lecture.title) {
          isValid = false;
          this.validationErrors.lectures[index].title = "Tiêu đề không được để trống";
          firstInvalidField = firstInvalidField || document.getElementById(`lectureTitle${index}`);
        } else if (lecture.title.length > 100) {
          isValid = false;
          this.validationErrors.lectures[index].title = "Tiêu đề không được vượt quá 100 ký tự";
          firstInvalidField = firstInvalidField || document.getElementById(`lectureTitle${index}`);
        }

        if (!lecture.contentSummary) {
          isValid = false;
          this.validationErrors.lectures[index].contentSummary = "Tóm tắt nội dung không được để trống";
          firstInvalidField = firstInvalidField || document.getElementById(`lectureContentSummary${index}`);
        } else if (lecture.contentSummary.length > 500) {
          isValid = false;
          this.validationErrors.lectures[index].contentSummary = "Tóm tắt nội dung không được vượt quá 500 ký tự";
          firstInvalidField = firstInvalidField || document.getElementById(`lectureContentSummary${index}`);
        }

        if (lecture.lectureType === 'text') {
          if (!lecture.content) {
            isValid = false;
            this.validationErrors.lectures[index].content = "Nội dung chi tiết không được để trống";
          } else if (lecture.content.length > 500) {
            isValid = false;
            this.validationErrors.lectures[index].content = "Nội dung chi tiết không được vượt quá 500 ký tự";
          }
        } else if (lecture.lectureType === 'video') {
          if (!lecture.medias || lecture.medias.length === 0) {
            isValid = false;
            this.validationErrors.lectures[index].medias = "Vui lòng tải lên ít nhất một tài liệu";
          }
        }
      });

      if (!isValid && firstInvalidField) {
        if (firstInvalidField.id.includes('lecture')) {
          const lectureIndex = parseInt(firstInvalidField.id.match(/\d+/)[0]);
          if (this.activeTab !== lectureIndex) {
            this.activeTab = lectureIndex;
            this.$nextTick(() => {
              firstInvalidField.focus();
              firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          } else {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          firstInvalidField.focus();
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      return isValid;
    },
    saveCourse() {
      if (this.validateForm()) {
        this.showSaveConfirm = true;
      }
    },
    onConfirmSave(confirmed) {
      if (confirmed) {
        this.processSaveCourse();
      }
      this.showSaveConfirm = false;
    },
    async processSaveCourse() {
      try {
        this.$refs.loadingSpinner.showSpinner();
        const courseFormData = new FormData();
        courseFormData.append("Id", this.course.id || "");
        courseFormData.append("Title", this.course.title);
        courseFormData.append("Intro", this.course.intro);
        courseFormData.append("Description", this.course.description);
        courseFormData.append("Status", this.course.status);
        courseFormData.append("Price", this.course.price);
        courseFormData.append("Discount", this.course.discount / 100);
        courseFormData.append("DiscountExpiry", this.course.discountExpiry);
        courseFormData.append("Level", this.course.level);
        courseFormData.append("Outcomes", this.course.outcomes);
        courseFormData.append("Requirements", this.course.requirements);
        courseFormData.append("ExpectedCompletion", this.course.expectedCompletion);
        courseFormData.append("AdvisorExpectedOutcome", this.course.advisorExpectedOutcome);
        courseFormData.append("ExpectedOutcome", this.course.expectedOutcome);

        const categoriesJson = JSON.stringify(this.course.selectedCategories.map(cat => ({ id: cat.id, value: cat.value })));
        courseFormData.append("Categories", categoriesJson);

        courseFormData.append("LeafCategoryId", this.course.leafCategoryId);
        if (this.course.thumb.file) {
          courseFormData.append("Thumb.File", this.course.thumb.file);
          courseFormData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          courseFormData.append("Thumb.Url", this.course.thumb.url);
          courseFormData.append("Thumb.Title", this.course.thumb.title || this.course.title);
        }
        this.course.lectures.forEach((lecture, lectureIndex) => {
          courseFormData.append(`Lectures[${lectureIndex}].Id`, lecture.id || "");
          courseFormData.append(`Lectures[${lectureIndex}].CourseId`, this.course.id || "");
          courseFormData.append(`Lectures[${lectureIndex}].Title`, lecture.title);
          courseFormData.append(`Lectures[${lectureIndex}].ContentSummary`, lecture.contentSummary || "");
          courseFormData.append(`Lectures[${lectureIndex}].IsPreviewable`, lecture.isPreviewable);
          courseFormData.append(`Lectures[${lectureIndex}].Index`, lectureIndex + 1);
          courseFormData.append(`Lectures[${lectureIndex}].LectureType`, lecture.lectureType);

          if (lecture.lectureType === 'text') {
            courseFormData.append(`Lectures[${lectureIndex}].MetaData`, lecture.content);
          } else {
            courseFormData.append(`Lectures[${lectureIndex}].MetaData`, lecture.metaData || "");
          }

          lecture.medias?.forEach((media, mediaIndex) => {
            if (media.file) {
              courseFormData.append(`Lectures[${lectureIndex}].Medias[${mediaIndex}].File`, media.file);
            } else if (media.url) {
              courseFormData.append(`Lectures[${lectureIndex}].Medias[${mediaIndex}].Url`, media.url);
            }
            courseFormData.append(`Lectures[${lectureIndex}].Medias[${mediaIndex}].Title`, media.title);
            courseFormData.append(`Lectures[${lectureIndex}].Medias[${mediaIndex}].Type`, media.type);
          });
          lecture.removedMedias?.forEach((id, index) => {
            courseFormData.append(`Lectures[${lectureIndex}].RemovedMedias[${index}]`, id);
          });
        });

        const response = await createCourse(courseFormData);

        toast.success("Khóa học đã được lưu thành công!", {
          autoClose: 1000,
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          this.$router.push("/course-management");
        }, 1500);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!",
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
  },
};
</script>

<style scoped>
.min-height-auto {
  min-height: 38px;
  height: auto;
  cursor: pointer;
}

.dropdown-menu {
  z-index: 1000;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
}

.btn-close-white {
  filter: brightness(0) invert(1);
}

.create-course-container {
  display: flex;
  flex-direction: column;
  width: 72vw;
  margin: 0 auto;
}

.header-section {
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-content {
  flex: 1;
}

.card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 1.5rem;
}

.card-header {
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  padding: 1rem;
}

.card-header h5 {
  font-weight: 600;
  margin: 0;
  color: #333;
}

.card-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  transition: border-color 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline-secondary {
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-outline-secondary:hover {
  background: #3b82f6;
  color: #fff;
}

.btn-outline-primary {
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-outline-primary:hover {
  background: #3b82f6;
  color: #fff;
}

.btn-outline-danger {
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
}

.input-group-text {
  background: #3b82f6;
  color: #fff;
  border: none;
  cursor: pointer;
}

.form-check-input {
  width: 1em;
  height: 1em;
  margin-top: 0.15em;
  border: 1px solid #ddd;
}

.form-check-input:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.img-thumbnail {
  border-radius: 4px;
  border: 1px solid #ddd;
}

hr {
  border: none;
  height: 1px;
  background: #e8e8e8;
  margin: 1.5rem 0;
}

.lecture-tabs-nav {
  border-bottom: 1px solid #e8e8e8;
  padding: 0.5rem 0.5rem 0;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
}

.lecture-tabs-nav::-webkit-scrollbar {
  height: 5px;
}

.lecture-tabs-nav::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}

.lecture-tab {
  border: 1px solid #e8e8e8;
  border-bottom: none;
  color: #333;
  padding: 0.6rem 1rem;
  border-radius: 6px 6px 0 0;
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
  min-width: 100px;
  justify-content: space-between;
  background-color: #f8f9fa;
  transition: background-color 0.2s;
  height: 40px;
  overflow: hidden;
}

.lecture-tab:hover {
  background-color: #e9ecef;
}

.lecture-tab.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  font-weight: 500;
}

.lecture-number {
  white-space: nowrap;
}

.lecture-close-btn {
  background: transparent;
  border: none;
  color: #dc3545;
  font-size: 1rem;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.lecture-tab.active .lecture-close-btn {
  color: white;
}

.lecture-close-btn:hover {
  color: #bb2d3b;
  transform: scale(1.1);
}

.tab-content {
  background: #fff;
  padding: 1.5rem;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.lecture-settings {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 1rem;
}

.upload-area {
  border: 1px dashed #3b82f6;
  border-radius: 4px;
  padding: 1rem;
}

.uploaded-file-item {
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.question-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.answer-item {
  background: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.assignment-type-item {
  cursor: pointer;
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.assignment-type-item:hover {
  background: #f5f5f5;
}

.assignment-type-item.selected {
  background: #f0f7ff;
  border-color: #3b82f6;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.border-danger {
  border-color: #dc3545 !important;
}
</style>