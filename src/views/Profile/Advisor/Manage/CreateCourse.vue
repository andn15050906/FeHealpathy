<template>
  <div class="create-course-container">
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
                    <label for="courseName" class="form-label fw-medium">Tên khóa học</label>
                    <input type="text" class="form-control form-control-lg" id="courseName" v-model="course.name"
                      placeholder="Nhập tên khóa học" required />
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-4">
                      <label for="courseCategory" class="form-label fw-medium">Danh mục</label>
                      <select class="form-select" id="courseCategory" v-model="course.category" required>
                        <option value="" disabled>Chọn danh mục</option>
                        <option value="Student">Học sinh</option>
                        <option value="College">Sinh viên</option>
                        <option value="Working">Người đi làm</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Giá khóa học</label>
                      <div class="d-flex flex-wrap align-items-center gap-3">
                        <div class="form-check form-check-inline mb-0">
                          <input class="form-check-input" type="radio" name="priceType" id="freeCourse" value="free"
                            v-model="course.priceType" />
                          <label class="form-check-label" for="freeCourse">Miễn phí</label>
                        </div>
                        <div class="form-check form-check-inline mb-0">
                          <input class="form-check-input" type="radio" name="priceType" id="paidCourse" value="paid"
                            v-model="course.priceType" />
                          <label class="form-check-label" for="paidCourse">Trả phí</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="course.priceType === 'paid'" class="row mb-4">
                    <div class="col-md-4">
                      <label for="coursePrice" class="form-label fw-medium">Giá tiền (VND)</label>
                      <input type="number" class="form-control" id="coursePrice" v-model="course.price" min="10000"
                        step="1000" placeholder="Nhập giá khóa học" required />
                      <small class="text-muted">Giá tối thiểu: 10,000 VND</small>
                    </div>
                    <div class="col-md-8">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" class="form-control" id="courseDiscount" v-model="course.discount" min="0"
                        max="100" step="1" placeholder="0-100%" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="courseDescription" class="form-label fw-medium">Mô tả</label>
                    <textarea class="form-control" id="courseDescription" v-model="course.description" rows="4"
                      placeholder="Mô tả khóa học" required></textarea>
                  </div>

                  <div class="mb-4">
                    <label for="courseImage" class="form-label fw-medium">Ảnh khóa học</label>
                    <div class="input-group mb-2">
                      <input type="file" class="form-control" id="courseImage" @change="handleImageUpload"
                        accept="image/*" />
                      <label class="input-group-text d-flex align-items-center" for="courseImage">
                        <UploadIcon class="icon me-1" /> Tải lên
                      </label>
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
                  <select class="form-select" id="courseDifficulty" v-model="course.difficulty">
                    <option value="Beginner">Sơ cấp</option>
                    <option value="Intermediate">Trung cấp</option>
                    <option value="Advanced">Cao cấp</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Tính năng khóa học</label>
                  <div class="feature-list p-3 border rounded">
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="hasCertificate"
                        v-model="course.hasCertificate" />
                      <label class="form-check-label" for="hasCertificate">
                        Chứng chỉ hoàn thành
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="hasDownloadable"
                        v-model="course.hasDownloadable" />
                      <label class="form-check-label" for="hasDownloadable">
                        Hỗ trợ trực tiếp với cố vấn
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="hasAssignments"
                        v-model="course.hasAssignments" />
                      <label class="form-check-label" for="hasAssignments">
                        Cộng đồng cùng phát triển
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="hasForumSupport"
                        v-model="course.hasForumSupport" />
                      <label class="form-check-label" for="hasForumSupport">
                        Hỗ trợ chuyên sâu
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="coursePrerequisites" class="form-label fw-medium">Yêu cầu trước khi học</label>
                  <textarea class="form-control" id="coursePrerequisites" v-model="course.prerequisites" rows="3"
                    placeholder="Học viên cần biết gì trước khi tham gia khóa học?"></textarea>
                </div>

                <div class="mb-4">
                  <label for="courseTargetAudience" class="form-label fw-medium">Mục tiêu khóa học</label>
                  <textarea class="form-control" id="courseTargetAudience" v-model="course.targetAudience" rows="3"
                    placeholder="Khóa học này dành cho ai?"></textarea>
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
                  <ul class="nav nav-tabs px-3 pt-3" role="tablist">
                    <li class="nav-item" v-for="(lecture, index) in course.lectures" :key="index">
                      <button class="nav-link" :class="{ active: activeTab === index }" @click="activeTab = index"
                        role="tab">
                        <span class="lecture-number">Bài {{ index + 1 }}</span>
                        <button type="button" class="btn-close ms-2" style="font-size: 0.5rem;"
                          @click.stop="removeLecture(index)" v-if="course.lectures.length > 1"></button>
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
                              <label :for="`lectureTitle${index}`" class="form-label fw-medium">Tiêu đề bài
                                giảng</label>
                              <input type="text" class="form-control form-control-lg" :id="`lectureTitle${index}`"
                                v-model="lecture.title" placeholder="Nhập tiêu đề bài giảng" required />
                            </div>

                            <div class="mb-4">
                              <label :for="`lectureContentSummary${index}`" class="form-label fw-medium">Tóm tắt nội
                                dung</label>
                              <textarea class="form-control" :id="`lectureContentSummary${index}`"
                                v-model="lecture.contentSummary" rows="3"
                                placeholder="Tóm tắt ngắn gọn nội dung bài giảng" required></textarea>
                            </div>

                            <div class="lecture-type-content mt-4">
                              <div v-if="lecture.type === 'Video'" class="resource-upload">
                                <h6 class="mb-3 fw-medium">Tài nguyên</h6>
                                <div class="upload-area p-4 border rounded border-dashed mb-3 text-center">
                                  <div class="mb-3">
                                    <i class="bi bi-cloud-upload fs-1 text-primary"></i>
                                  </div>
                                  <p class="mb-3">Kéo thả file hoặc nhấn để tải lên</p>
                                  <input type="file" class="form-control"
                                    @change="handleLectureMediaUpload($event, index)"
                                    accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" multiple />
                                  <small class="text-muted d-block mt-2">Hỗ trợ: Video, Hình ảnh, PDF, Word, PowerPoint,
                                    Excel</small>
                                </div>
                                <div v-if="lecture.medias && lecture.medias.length > 0" class="uploaded-files">
                                  <h6 class="mb-3 fw-medium">Tài nguyên đã tải lên</h6>
                                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-2 bg-light">
                                    <i class="bi bi-file-earmark me-2 fs-5"></i>
                                    <span class="me-2">{{ media.title }}</span>
                                    <button type="button" class="btn-close ms-auto"
                                      @click="removeLectureMedia(index, mediaIndex)"></button>
                                  </div>
                                </div>
                              </div>

                              <div v-if="lecture.type === 'Text'" class="text-content">
                                <h6 class="mb-3 fw-medium">Nội dung chi tiết</h6>
                                <textarea class="form-control" v-model="lecture.content" rows="12"
                                  placeholder="Nhập nội dung chi tiết của bài giảng"></textarea>
                              </div>

                              <div v-if="lecture.type === 'Quiz'" class="quiz-content">
                                <h6 class="mb-3 fw-medium">Câu hỏi trắc nghiệm</h6>
                                <div v-for="(question, qIndex) in lecture.questions" :key="qIndex"
                                  class="question-item p-4 border rounded mb-4 bg-light">
                                  <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0 fw-medium">Câu hỏi {{ qIndex + 1 }}</h6>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                      @click="removeQuestion(index, qIndex)">
                                      <i class="bi bi-trash me-1"></i> Xóa
                                    </button>
                                  </div>
                                  <input type="text" class="form-control mb-3" v-model="question.text"
                                    placeholder="Nhập câu hỏi" />

                                  <div class="answers">
                                    <p class="fw-medium mb-2">Các câu trả lời:</p>
                                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex"
                                      class="answer-item d-flex align-items-center mb-3">
                                      <input type="radio" class="form-check-input me-2" :name="`question${qIndex}`"
                                        :checked="answer.isCorrect" @change="setCorrectAnswer(index, qIndex, aIndex)" />
                                      <input type="text" class="form-control" v-model="answer.text"
                                        placeholder="Nhập câu trả lời" />
                                      <button type="button" class="btn-close ms-2"
                                        @click="removeAnswer(index, qIndex, aIndex)"></button>
                                    </div>
                                  </div>

                                  <button type="button" class="btn btn-outline-primary btn-sm mt-2"
                                    @click="addAnswer(index, qIndex)">
                                    <i class="bi bi-plus me-1"></i> Thêm câu trả lời
                                  </button>
                                </div>

                                <button type="button" class="btn btn-outline-primary" @click="addQuestion(index)">
                                  <i class="bi bi-plus-circle me-2"></i> Thêm câu hỏi
                                </button>
                              </div>

                              <div v-if="lecture.type === 'Assignment'" class="assignment-content">
                                <h6 class="mb-3 fw-medium">Chọn loại bài tập</h6>
                                <p class="text-muted fst-italic mb-3">Các công cụ này hoàn toàn miễn phí trong hệ thống,
                                  hãy khuyến khích học viên sử dụng nhé!</p>
                                <div class="assignment-types">
                                  <div class="row g-3">
                                    <div class="col-md-6" v-for="(type, typeIndex) in assignmentTypes" :key="typeIndex">
                                      <div class="assignment-type-item p-3 border rounded h-100"
                                        :class="{ 'selected border-primary bg-light': lecture.assignmentType === type.value }"
                                        @click="selectAssignmentType(index, type.value)">
                                        <div class="d-flex align-items-center mb-2">
                                          <i :class="type.icon + ' me-2 fs-4 text-primary'"></i>
                                          <h6 class="mb-0 fw-medium">{{ type.label }}</h6>
                                        </div>
                                        <p class="text-muted small mb-0">{{ type.description }}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="lecture-settings p-3 border rounded h-100">
                              <h6 class="mb-4 fw-medium border-bottom pb-2">Cài đặt bài giảng</h6>

                              <div class="mb-3">
                                <label :for="`lectureType${index}`" class="form-label fw-medium">Loại bài giảng</label>
                                <select class="form-select" :id="`lectureType${index}`" v-model="lecture.type">
                                  <option value="Video">Tài nguyên (Video/Hình Ảnh/Tài Liệu)</option>
                                  <option value="Text">Văn bản</option>
                                  <option value="Quiz">Trắc nghiệm</option>
                                  <option value="Assignment">Bài tập</option>
                                </select>
                              </div>

                              <div class="mb-3">
                                <label :for="`lectureDuration${index}`" class="form-label fw-medium">Thời lượng
                                  (phút)</label>
                                <input type="number" class="form-control" :id="`lectureDuration${index}`"
                                  v-model="lecture.duration" min="1" placeholder="Nhập thời lượng" />
                              </div>

                              <div class="form-check form-switch mt-4">
                                <input class="form-check-input" type="checkbox" :id="`lecturePreview${index}`"
                                  v-model="lecture.isPreviewable">
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
import SaveConfirmPopUp from '../../../../components/Common/Popup/SaveConfirmPopUp.vue';
import { createCourse } from '@/scripts/api/services/courseService';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  UploadIcon,
} from "lucide-vue-next";

export default {
  name: "CreateCourse",
  components: {
    SaveConfirmPopUp,
    LoadingSpinner,
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    SaveIcon,
    UploadIcon
  },
  data() {
    return {
      course: {
        title: "",
        intro: "",
        description: "",
        price: 0,
        priceType: "free",
        level: "",
        outcomes: "",
        requirements: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac",
        lectures: []
      },
      previewImage: null,
      showSavePopup: false,
      activeTab: 0,
      assignmentTypes: [
        {
          value: 'yoga',
          label: 'Yoga',
          description: 'Bài tập yoga với hướng dẫn chi tiết'
        },
        {
          value: 'self-assessment',
          label: 'Tự đánh giá bản thân',
          description: 'Khám phá và đánh giá bản thân'
        },
        {
          value: 'media',
          label: 'Media',
          description: 'Xem và tương tác với nội dung đa phương tiện'
        },
        {
          value: 'journal',
          label: 'Viết nhật ký',
          description: 'Ghi lại suy nghĩ và cảm xúc của bạn'
        },
        {
          value: 'mood-tracker',
          label: 'Cập nhật trạng thái cảm xúc',
          description: 'Theo dõi và phân tích tâm trạng'
        },
        {
          value: 'habit-tracker',
          label: 'Thiết lập và theo dõi thói quen',
          description: 'Xây dựng và duy trì thói quen tốt'
        },
        {
          value: 'reading',
          label: 'Đọc bài viết',
          description: 'Đọc và tương tác với nội dung bài viết'
        },
        {
          value: 'community',
          label: 'Nhắn tin cộng đồng',
          description: 'Kết nối và chia sẻ với cộng đồng'
        }
      ]
    };
  },
  watch: {
    'course.priceType': function (newValue) {
      if (newValue === 'free') {
        this.course.price = 0;
      }
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.course.thumb.file = file;
        this.course.thumb.title = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
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
            title: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },
    addLecture() {
      this.course.lectures.push({
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        type: "Video",
        medias: [],
        questions: [],
        assignmentType: null
      });

      this.$nextTick(() => {
        this.activeTab = this.course.lectures.length - 1;
        const lectureTabs = document.querySelector('.lecture-tabs');
        if (lectureTabs) {
          lectureTabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
    removeLecture(index) {
      this.course.lectures.splice(index, 1);
      if (this.course.lectures.length === 0) {
        this.activeTab = 0;
        return;
      }
      if (index === this.activeTab) {
        if (index > 0) {
          this.activeTab = index - 1;
        } else {
          this.activeTab = 0;
        }
      } else if (index < this.activeTab) {
        this.activeTab--;
      }
      this.$nextTick(() => {
        const newTab = document.querySelector(`.nav-tabs .nav-link:nth-child(${this.activeTab + 1})`);
        if (newTab) {
          newTab.click();
        }
      });
    },
    removeLectureMedia(lectureIndex, mediaIndex) {
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);

      if (this.course.lectures[lectureIndex].medias.length === 0) {
        toast.warning(`Bài giảng ${lectureIndex + 1}: Vui lòng tải lên ít nhất một tài liệu`, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
      }
    },
    openSavePopup() {
      this.showSavePopup = true;
    },

    validateForm() {
      //TODO: Implement form validation logic later
      return true;
    },

    async handleSave(confirm) {
      if (!confirm) return;

      if (!this.validateForm()) {
        return;
      }

      this.$refs.loadingSpinner.showSpinner();

      try {
        const formData = new FormData();

        formData.append('Title', this.course.title);
        formData.append('Intro', this.course.intro);
        formData.append('Description', this.course.description);
        formData.append('Price', this.course.price);
        formData.append('Level', this.course.level);
        formData.append('Outcomes', this.course.outcomes);
        formData.append('Requirements', this.course.requirements);
        formData.append('LeafCategoryId', this.course.leafCategoryId);

        if (this.course.thumb.file) {
          formData.append('Thumb.File', this.course.thumb.file, this.course.thumb.title);
          formData.append('Thumb.Title', this.course.thumb.title || 'thumbnail');
        }

        if (this.course.thumb.url) {
          formData.append('Thumb.Url', this.course.thumb.url);
        }

        this.course.lectures.forEach((lecture, index) => {
          formData.append(`Lectures[${index}].Title`, lecture.title);
          formData.append(`Lectures[${index}].Content`, lecture.content);
          formData.append(`Lectures[${index}].ContentSummary`, lecture.contentSummary);
          formData.append(`Lectures[${index}].IsPreviewable`, lecture.isPreviewable.toString());

          lecture.medias.forEach((media, mediaIndex) => {
            formData.append(`Lectures[${index}].Medias[${mediaIndex}].File`, media.file);
            formData.append(`Lectures[${index}].Medias[${mediaIndex}].Title`, media.title);
          });
        });

        const response = await createCourse(formData);
        console.log('Course created successfully:', response);

        toast.success("Tạo khóa học thành công!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });

        this.$router.push({
          path: '/advisor/content',
          query: {
            createSuccess: true,
            message: 'Tạo khóa học thành công!'
          }
        });

      } catch (error) {
        console.error('Failed to create course:', error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!", {
          autoClose: 1000,
          position: toast.POSITION.TOP_RIGHT
        });
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    resetForm() {
      this.course = {
        title: "",
        intro: "",
        description: "",
        price: 0,
        priceType: "free",
        level: "",
        outcomes: "",
        requirements: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "",
        lectures: []
      };
      this.previewImage = null;
    },

    addQuestion(lectureIndex) {
      if (!this.course.lectures[lectureIndex].questions) {
        this.course.lectures[lectureIndex].questions = [];
      }
      this.course.lectures[lectureIndex].questions.push({
        text: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ]
      });
    },

    removeQuestion(lectureIndex, questionIndex) {
      this.course.lectures[lectureIndex].questions.splice(questionIndex, 1);
    },

    addAnswer(lectureIndex, questionIndex) {
      this.course.lectures[lectureIndex].questions[questionIndex].answers.push({
        text: "",
        isCorrect: false
      });
    },

    removeAnswer(lectureIndex, questionIndex, answerIndex) {
      this.course.lectures[lectureIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    },

    setCorrectAnswer(lectureIndex, questionIndex, answerIndex) {
      const question = this.course.lectures[lectureIndex].questions[questionIndex];
      question.answers.forEach((answer, index) => {
        answer.isCorrect = index === answerIndex;
      });
    },

    selectAssignmentType(lectureIndex, type) {
      this.course.lectures[lectureIndex].assignmentType = type;
    },

    goBack() {
      this.$router.back();
    },

    async saveCourse() {
      if (!this.validateForm()) {
        return;
      }

      this.$refs.loadingSpinner.showSpinner();

      try {
        const formData = new FormData();
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
        courseFormData.append("Requirements", this.course.requirements);
        courseFormData.append("LeafCategoryId", this.course.leafCategoryId);
        
        if (this.course.thumb.file) {
          courseFormData.append("Thumb.File", this.course.thumb.file);
          courseFormData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          courseFormData.append("Thumb.Title", this.course.title);
          courseFormData.append("Thumb.Url", this.course.thumb.url);
        }
        for (const lecture of this.course.lectures) {
          const formData = new FormData();
          formData.append("Id", lecture.id);
          formData.append("CourseId", this.course.id);
          formData.append("Title", lecture.title);
          formData.append("Content", lecture.content);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);
          
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
        }
        await createCourse(formData);
      } catch (error) {
        console.error('Failed to create course:', error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    }
  }
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

.nav-tabs {
  border-bottom: 1px solid #e8e8e8;
  padding: 0.5rem 0.5rem 0;
}

.nav-tabs .nav-link {
  border: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px 4px 0 0;
  margin-right: 0.25rem;
}

.nav-tabs .nav-link:hover {
  background-color: #f5f5f5;
}

.nav-tabs .nav-link.active {
  background-color: #3b82f6;
  color: white;
}

.tab-content {
  background: #fff;
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-top: none;
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
</style>