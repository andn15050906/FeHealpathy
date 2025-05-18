<template>
  <div class="create-course-container">

    <SaveConfirmPopUp :message="saveMessage" :isVisible="showSaveConfirm" @confirmSave="onConfirmSave"
      @update:isVisible="showSaveConfirm = $event" />
    <DeleteConfirmPopUp :message="deleteMessage" :isVisible="showDeleteConfirm" @confirmDelete="onConfirmDelete"
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
              <h1 class="h3 mb-0">Cập nhật khóa học</h1>
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
                    <input type="text" id="courseName" class="form-control form-control-lg" v-model="course.title"
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
                        <div class="form-check form-check-inline">
                          <input type="radio" id="freeCourse" value="free" v-model="course.priceType"
                            class="form-check-input" />
                          <label class="form-check-label" for="freeCourse">Miễn phí</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input type="radio" id="paidCourse" value="paid" v-model="course.priceType"
                            class="form-check-input" />
                          <label class="form-check-label" for="paidCourse">Trả phí</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="course.priceType === 'paid'" class="row mb-4">
                    <div class="col-md-4">
                      <label for="coursePrice" class="form-label fw-medium">Giá tiền (VND) <span
                          class="text-danger">*</span></label>
                      <input type="number" id="coursePrice" class="form-control" v-model="course.price" min="10000"
                        step="1000" placeholder="Nhập giá khóa học" required
                        :class="{ 'is-invalid': validationErrors.course.price }" />
                      <div class="invalid-feedback" v-if="validationErrors.course.price">
                        {{ validationErrors.course.price }}
                      </div>
                      <small class="text-muted">Giá tối thiểu: 10,000 VND</small>
                    </div>
                    <div class="col-md-4">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" id="courseDiscount" class="form-control" v-model="course.discount" min="0"
                        max="100" step="1" placeholder="0-100%"
                        :class="{ 'is-invalid': validationErrors.course.discount }" />
                      <div class="invalid-feedback" v-if="validationErrors.course.discount">
                        {{ validationErrors.course.discount }}
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label for="discountExpiry" class="form-label fw-medium">Ngày hết hạn giảm giá</label>
                      <input type="date" id="discountExpiry" class="form-control" v-model="course.discountExpiry"
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
                    <textarea id="courseDescription" class="form-control" v-model="course.description" rows="4"
                      placeholder="Mô tả khóa học" required
                      :class="{ 'is-invalid': validationErrors.course.description }"></textarea>
                    <div class="invalid-feedback" v-if="validationErrors.course.description">
                      {{ validationErrors.course.description }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium">Ảnh khóa học <span class="text-danger">*</span></label>
                    <div class="input-group mb-2">
                      <input type="file" class="form-control" @change="handleImageUpload" accept="image/*"
                        :class="{ 'is-invalid': validationErrors.course.thumb }" />
                      <label class="input-group-text d-flex align-items-center">
                        <UploadIcon class="icon me-1" /> Tải lên
                      </label>
                    </div>
                    <div class="invalid-feedback" v-if="validationErrors.course.thumb">
                      {{ validationErrors.course.thumb }}
                    </div>
                    <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>
                    <div v-if="course.imagePreview || course.thumb.url" class="mt-3 border p-2 rounded">
                      <img :src="course.imagePreview || course.thumb.url" class="img-thumbnail"
                        style="max-height:150px" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium d-block">Trạng thái</label>
                    <div class="d-flex gap-3">
                      <div class="form-check form-check-inline">
                        <input type="radio" id="statusDraft" value="Draft" v-model="course.status"
                          class="form-check-input" />
                        <label class="form-check-label" for="statusDraft">Bản nháp</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input type="radio" id="statusActive" value="Active" v-model="course.status"
                          class="form-check-input" />
                        <label class="form-check-label" for="statusActive">Hoạt động</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input type="radio" id="statusInactive" value="Inactive" v-model="course.status"
                          class="form-check-input" />
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
                  <select id="courseDifficulty" class="form-select" v-model="course.level" required
                    :class="{ 'is-invalid': validationErrors.course.level }">
                    <option value="1">Mới bắt đầu</option>
                    <option value="2">Trung bình</option>
                    <option value="3">Nâng cao</option>
                  </select>
                  <div class="invalid-feedback" v-if="validationErrors.course.level">
                    {{ validationErrors.course.level }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="courseAdvisorExpectedOutcome" class="form-label fw-medium">Sau khóa học, học viên nhận
                    được gì? <span class="text-danger">*</span></label>
                  <textarea id="courseAdvisorExpectedOutcome" class="form-control" rows="3"
                    v-model="course.advisorExpectedOutcome" required
                    :class="{ 'is-invalid': validationErrors.course.advisorExpectedOutcome }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.advisorExpectedOutcome">
                    {{ validationErrors.course.advisorExpectedOutcome }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="courseExpectedOutcome" class="form-label fw-medium">Kết quả mong đợi <span
                      class="text-danger">*</span></label>
                  <textarea id="courseExpectedOutcome" class="form-control" rows="3" v-model="course.expectedOutcome"
                    required :class="{ 'is-invalid': validationErrors.course.expectedOutcome }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.expectedOutcome">
                    {{ validationErrors.course.expectedOutcome }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="courseRequirements" class="form-label fw-medium">Yêu cầu trước khi học <span
                      class="text-danger">*</span></label>
                  <textarea id="courseRequirements" class="form-control" rows="3" v-model="course.requirements" required
                    :class="{ 'is-invalid': validationErrors.course.requirements }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.requirements">
                    {{ validationErrors.course.requirements }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="courseOutcomes" class="form-label fw-medium">Mục tiêu khóa học <span
                      class="text-danger">*</span></label>
                  <textarea id="courseOutcomes" class="form-control" rows="3" v-model="course.outcomes" required
                    :class="{ 'is-invalid': validationErrors.course.outcomes }"></textarea>
                  <div class="invalid-feedback" v-if="validationErrors.course.outcomes">
                    {{ validationErrors.course.outcomes }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="courseCompletionTime" class="form-label fw-medium">Thời gian hoàn thành <span
                      class="text-danger">*</span></label>
                  <div class="input-group" :class="{ 'is-invalid': validationErrors.course.expectedCompletion }">
                    <input id="courseCompletionTime" type="number" class="form-control"
                      v-model="course.expectedCompletion" min="1" required
                      :class="{ 'is-invalid': validationErrors.course.expectedCompletion }" />
                    <span class="input-group-text">Phút</span>
                  </div>
                  <div class="invalid-feedback d-block" v-if="validationErrors.course.expectedCompletion">
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
              <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between">
                <h5 class="mb-0 fw-bold">Nội dung khóa học</h5>
                <button class="btn btn-primary" @click="addLecture">
                  <PlusIcon class="icon me-2" /> Thêm bài giảng
                </button>
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
                                    Tài nguyên hiện tại
                                  </h6>
                                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-3 bg-light">
                                    <div class="d-flex align-items-center flex-grow-1">
                                      <div v-if="media.type === 1" class="me-3">
                                        <img :src="media.url" class="img-thumbnail"
                                          style="width: 60px; height: 60px; object-fit: cover;" />
                                      </div>
                                      <div v-else-if="media.type === 2" class="me-3">
                                        <video :src="media.url" class="border rounded"
                                          style="width: 60px; height: 60px; object-fit: cover;" controls></video>
                                      </div>
                                      <div v-else class="me-3">
                                        <i class="bi bi-file-earmark fs-1 text-secondary"></i>
                                      </div>
                                      <div>
                                        <div class="fw-medium">{{ media.title }}</div>
                                        <small class="text-muted">
                                          {{ media.type === 1 ? 'Hình ảnh' : media.type === 2 ? 'Video' : 'Tài liệu' }}
                                        </small>
                                      </div>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                      @click="removeLectureMedia(index, mediaIndex)">
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>

                                <div v-if="lecture.addedMedias && lecture.addedMedias.length > 0"
                                  class="uploaded-files mt-3">
                                  <h6 class="mb-3 fw-medium">
                                    Tài nguyên mới thêm
                                  </h6>
                                  <div v-for="(media, mediaIndex) in lecture.addedMedias" :key="'added-' + mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-3 bg-success bg-opacity-10">
                                    <div class="d-flex align-items-center flex-grow-1">
                                      <div v-if="media.type === 1" class="me-3">
                                        <img :src="media.preview" class="img-thumbnail"
                                          style="width: 60px; height: 60px; object-fit: cover;" />
                                      </div>
                                      <div v-else-if="media.type === 2" class="me-3">
                                        <video :src="media.preview" class="border rounded"
                                          style="width: 60px; height: 60px; object-fit: cover;" controls></video>
                                      </div>
                                      <div v-else class="me-3">
                                        <i class="bi bi-file-earmark fs-1 text-secondary"></i>
                                      </div>
                                      <div>
                                        <div class="fw-medium">{{ media.title }}</div>
                                        <small class="text-muted">
                                          {{ media.type === 1 ? 'Hình ảnh' : media.type === 2 ? 'Video' : 'Tài liệu' }}
                                          <span class="badge bg-success ms-1">Mới</span>
                                        </small>
                                      </div>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                      @click="lecture.addedMedias.splice(mediaIndex, 1)">
                                      <i class="bi bi-trash"></i>
                                    </button>
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
              <button class="btn btn-danger" @click="goBack">
                <i class="bi bi-x-circle me-2"></i> Hủy
              </button>
              <button class="btn btn-primary" @click="saveCourse">
                <i class="bi bi-save me-2"></i> Cập nhật khóa học
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <LoadingSpinner ref="loadingSpinner" />
  </div>
</template>

<script>
import {
  getCourseById,
  updateCourse,
} from "@/scripts/api/services/courseService";
import {
  getLectures,
  updateLecture,
  createLecture,
  deleteLecture,
} from "@/scripts/api/services/lectureService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";
import SaveConfirmPopUp from "@/components/Common/Popup/SaveConfirmPopUp.vue";
import DeleteConfirmPopUp from "@/components/Common/Popup/DeleteConfirmPopup.vue";
import CancelConfirmPopup from "../../../../components/Common/Popup/CancelConfirmPopup.vue";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  UploadIcon,
  ListOrderedIcon,
  GripVerticalIcon,
} from "lucide-vue-next";

export default {
  name: "UpdateCourse",
  components: {
    LoadingSpinner,
    SaveConfirmPopUp,
    DeleteConfirmPopUp,
    CancelConfirmPopup,
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    SaveIcon,
    UploadIcon,
    ListOrderedIcon,
    GripVerticalIcon
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
        imagePreview: null,
        category: "",
        selectedCategories: []
      },
      categories: [
        { id: "1", value: "Sức khỏe tinh thần" },
        { id: "2", value: "Thiền và chánh niệm" },
        { id: "3", value: "Quản lý stress" },
        { id: "4", value: "Phát triển bản thân" },
        { id: "5", value: "Kỹ năng giao tiếp" },
        { id: "6", value: "Tâm lý học tích cực" },
        { id: "7", value: "Dinh dưỡng và sức khỏe" },
        { id: "8", value: "Yoga và thể dục" },
        { id: "9", value: "Giấc ngủ và nghỉ ngơi" },
        { id: "10", value: "Cân bằng cuộc sống" },
        { id: "11", value: "Phát triển sự nghiệp" },
        { id: "12", value: "Quản lý thời gian" },
        { id: "13", value: "Tài chính cá nhân" },
        { id: "14", value: "Mối quan hệ và tình yêu" },
        { id: "15", value: "Nuôi dạy con cái" },
        { id: "16", value: "Vượt qua nghịch cảnh" },
        { id: "17", value: "Tư duy tích cực" },
        { id: "18", value: "Kỹ năng lãnh đạo" },
        { id: "19", value: "Sáng tạo và đổi mới" },
        { id: "20", value: "Phòng chống kiệt sức" },
      ],
      showCategoryDropdown: false,
      categorySearchTerm: '',
      filteredCategories: [],
      previewImage: null,
      activeTab: 0,
      showSaveConfirm: false,
      showDeleteConfirm: false,
      showCancelConfirm: false,
      saveMessage: "Bạn có chắc muốn cập nhật khóa học?",
      deleteMessage: "Bạn có chắc muốn xóa bài giảng này?",
      cancelMessage: "Bạn có chắc muốn hủy và bỏ các thay đổi?",
      deleteIndex: null,
      isBackAction: false,
      deletedLectureIds: [],
      lectureErrors: [],
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
      },
      minDiscountDate: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
      })(),
    };
  },
  async mounted() {
    await this.fetchCourse();
    this.filterCategories();
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
            category.name.toLowerCase().includes(searchTerm) &&
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
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        this.$refs.loadingSpinner.showSpinner();

        const courseData = await getCourseById(courseId);
        if (courseData.discount) {
          courseData.discount *= 100;
        }
        if (courseData.discountExpiry) {
          const expiryDate = new Date(courseData.discountExpiry);
          courseData.discountExpiry = expiryDate.toISOString().split("T")[0];
        }

        let selectedCategories = [];
        if (courseData.categories) {
          try {
            const categoryIds = JSON.parse(courseData.categories);
            selectedCategories = categoryIds.map(id => {
              const category = this.categories.find(c => c.id === id);
              return category || { id, name: `Danh mục ${id}` };
            });
          } catch (e) {
          }
        }

        this.course = {
          id: courseData.id,
          title: courseData.title || "",
          intro: courseData.intro || "",
          description: courseData.description || "",
          price: courseData.price || 0,
          discount: courseData.discount || 0,
          discountExpiry: courseData.discountExpiry || "",
          level: courseData.level || 1,
          outcomes: courseData.outcomes || "",
          expectedOutcome: courseData.expectedOutcome || "",
          requirements: courseData.requirements || "",
          expectedCompletion: courseData.expectedCompletion || "",
          advisorExpectedOutcome: courseData.advisorExpectedOutcome || "",
          thumb: {
            url: courseData.thumbUrl || "",
            file: null,
            title: courseData.title || ""
          },
          priceType: courseData.priceType || "paid",
          status: courseData.status || "Draft",
          leafCategoryId: courseData.leafCategoryId || "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac",
          category: courseData.category || "",
          imagePreview: courseData.thumbUrl || "",
          lectures: [],
          selectedCategories: selectedCategories
        };

        this.previewImage = courseData.thumbUrl || "";

        const lectureResponse = await getLectures(courseId);
        const lectureList = lectureResponse?.items || [];
        this.course.lectures = lectureList.map((lecture) => ({
          id: lecture.id,
          title: lecture.title || "",
          content: lecture.content || "",
          contentSummary: lecture.contentSummary || "",
          isPreviewable: lecture.isPreviewable || false,
          lectureType: lecture.lectureType || this.determineLectureType(lecture),
          metaData: lecture.metaData || "",
          medias: (lecture.materials || lecture.medias || []).map((media) => ({
            id: media.id,
            type: media.type,
            preview: media.type === 1 || media.type === 2 ? media.url : "",
            url: media.url || "",
            title: media.title || "",
            file: null,
            isDeleted: false
          })),
          addedMedias: [],
          removedMedias: []
        }));

        this.initializeLectureErrors();
        if (this.course.lectures.length === 0) {
          this.addLecture();
        }
        this.filterCategories();

      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Không thể tải dữ liệu khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    determineLectureType(lecture) {
      if (lecture.medias && lecture.medias.some(m => m.type === 2)) {
        return "video";
      } else if (lecture.content && lecture.content.trim().length > 0) {
        return "text";
      } else {
        return "video";
      }
    },

    initializeLectureErrors() {
      this.validationErrors.lectures = [];
      this.course.lectures.forEach((_, index) => {
        this.ensureLectureValidationExists(index);
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
        addedMedias: [],
        removedMedias: []
      });

      const newIndex = this.course.lectures.length - 1;
      this.ensureLectureValidationExists(newIndex);

      this.$nextTick(() => {
        this.activeTab = this.course.lectures.length - 1;
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
      const lecture = this.course.lectures[index];
      const currentActive = this.activeTab;

      if (lecture.id) {
        this.deletedLectureIds.push(lecture.id);
      }

      this.course.lectures.splice(index, 1);
      this.validationErrors.lectures.splice(index, 1);

      if (this.course.lectures.length === 0) {
        this.addLecture();
        this.activeTab = 0;
      } else if (index === currentActive) {
        if (index === this.course.lectures.length) {
          this.activeTab = Math.max(0, index - 1);
        } else {
          this.activeTab = Math.min(index, this.course.lectures.length - 1);
        }
      } else if (index < currentActive) {
        this.activeTab = currentActive - 1;
      }

      toast.success(`Đã xóa bài giảng ${index + 1}`, {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT,
      });
    },

    removeLectureMedia(lectureIndex, mediaIndex) {
      const media = this.course.lectures[lectureIndex].medias[mediaIndex];
      if (media.id) {
        this.course.lectures[lectureIndex].removedMedias.push(media.id);
      }
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

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.validationErrors.course.thumb = "Kích thước file phải nhỏ hơn 5MB";
        return;
      }

      if (!file.type.startsWith("image/")) {
        this.validationErrors.course.thumb = "Chỉ cho phép tải lên file hình ảnh";
        return;
      }

      this.validationErrors.course.thumb = "";
      this.course.thumb.file = file;
      this.course.thumb.title = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.course.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    handleLectureMediaUpload(event, lectureIndex) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const fileType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
            ? "video"
            : "document";

        let mediaType;
        if (file.type.startsWith("image/")) {
          mediaType = 1;
        } else if (file.type.startsWith("video/")) {
          mediaType = 2;
        } else {
          mediaType = 3;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (!this.course.lectures[lectureIndex].medias) {
            this.course.lectures[lectureIndex].medias = [];
          }
          if (!this.course.lectures[lectureIndex].addedMedias) {
            this.course.lectures[lectureIndex].addedMedias = [];
          }

          const mediaItem = {
            type: mediaType,
            file: file,
            preview: e.target.result,
            url: "",
            title: file.name,
          };

          this.course.lectures[lectureIndex].medias.push({
            type: fileType,
            file: file,
            preview: e.target.result,
            url: "",
            title: file.name,
          });

          this.course.lectures[lectureIndex].addedMedias.push(mediaItem);
        };
        reader.readAsDataURL(file);
      });
    },

    onDrop(event, index) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.handleLectureMediaUpload({ target: { files } }, index);
      }
    },

    validateForm() {
      let isValid = true;
      let firstInvalidField = null;

      Object.keys(this.validationErrors.course).forEach(key => {
        this.validationErrors.course[key] = '';
      });

      this.validationErrors.lectures.forEach((lecture, index) => {
        if (lecture) {
          Object.keys(lecture).forEach(key => {
            this.validationErrors.lectures[index][key] = '';
          });
        }
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
        firstInvalidField = firstInvalidField || document.querySelector("input[type='file']");
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

      if (!this.course.expectedCompletion || this.course.expectedCompletion <= 0) {
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
          if ((!lecture.medias || lecture.medias.length === 0) && (!lecture.addedMedias || lecture.addedMedias.length === 0)) {
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
        courseFormData.append("Id", this.course.id);
        courseFormData.append("Title", this.course.title);
        courseFormData.append("Intro", this.course.intro);
        courseFormData.append("Description", this.course.description);
        courseFormData.append("Status", this.course.status);
        courseFormData.append("Price", this.course.price);
        courseFormData.append("Discount", this.course.discount / 100);
        courseFormData.append("DiscountExpiry", this.course.discountExpiry);
        courseFormData.append("Level", this.course.level);
        courseFormData.append("Outcomes", this.course.outcomes);
        courseFormData.append("ExpectedOutcome", this.course.expectedOutcome);
        courseFormData.append("Requirements", this.course.requirements);
        courseFormData.append("ExpectedCompletion", this.course.expectedCompletion);
        courseFormData.append("AdvisorExpectedOutcome", this.course.advisorExpectedOutcome);
        courseFormData.append("PriceType", this.course.priceType);
        courseFormData.append("LeafCategoryId", this.course.leafCategoryId);
        const categoriesJson = JSON.stringify(this.course.selectedCategories.map(cat => ({ id: cat.id, value: cat.value })));
        courseFormData.append("Categories", categoriesJson);

        if (this.course.thumb.file) {
          courseFormData.append("Thumb.File", this.course.thumb.file);
          courseFormData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          courseFormData.append("Thumb.Title", this.course.title);
          courseFormData.append("Thumb.Url", this.course.thumb.url);
        }

        await updateCourse(courseFormData);

        for (const lectureId of this.deletedLectureIds) {
          await deleteLecture(lectureId);
        }

        const existingLectures = this.course.lectures.filter(lecture => lecture.id);
        for (const lecture of existingLectures) {
          const formData = new FormData();
          formData.append("Id", lecture.id);
          formData.append("CourseId", this.course.id);
          formData.append("Title", lecture.title);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);
          formData.append("LectureType", lecture.lectureType);

          if (lecture.lectureType === 'text') {
            formData.append("MetaData", lecture.content);
          } else {
            formData.append("MetaData", lecture.metaData || "");
          }

          lecture.removedMedias.forEach((id, index) => {
            formData.append(`RemovedMedias[${index}]`, id);
          });

          lecture.addedMedias.forEach((media, index) => {
            if (media.file) {
              formData.append(`AddedMedias[${index}].File`, media.file);
              formData.append(`AddedMedias[${index}].Title`, media.title);
              formData.append(`AddedMedias[${index}].Type`, media.type);
            }
          });

          await updateLecture(formData);
        }

        const newLectures = this.course.lectures.filter(lecture => !lecture.id);
        for (const lecture of newLectures) {
          const formData = new FormData();
          formData.append("CourseId", this.course.id);
          formData.append("Title", lecture.title);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);
          formData.append("LectureType", lecture.lectureType);
          formData.append("Index", this.course.lectures.indexOf(lecture) + 1);

          if (lecture.lectureType === 'text') {
            formData.append("MetaData", lecture.content);
          } else {
            formData.append("MetaData", lecture.metaData || "");
          }

          lecture.addedMedias.forEach((media, index) => {
            if (media.file) {
              formData.append(`AddedMedias[${index}].File`, media.file);
              formData.append(`AddedMedias[${index}].Title`, media.title);
              formData.append(`AddedMedias[${index}].Type`, media.type);
            }
          });

          await createLecture(formData);
        }

        toast.success("Khóa học đã được cập nhật thành công!", {
          autoClose: 1000,
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          this.$router.push({
            path: "/course-management",
            query: {
              updateSuccess: true,
              message: "Khóa học đã được cập nhật thành công!",
            },
          });
        }, 1500);
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
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
  },
};
</script>

<style scoped>
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

.btn-primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
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

.tab-content {
  background: #fff;
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-top: none;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}

.lecture-settings {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 1rem;
}

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

.card-body .mb-4 textarea.form-control {
  min-height: 120px;
}
</style>