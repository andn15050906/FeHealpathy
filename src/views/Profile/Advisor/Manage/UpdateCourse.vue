<template>
  <div class="create-course-container">

    <SaveConfirmPopUp :message="saveMessage" :isVisible="showSaveConfirm" @confirmSave="onConfirmSave"
      @update:isVisible="showSaveConfirm = $event" />
    <DeleteConfirmPopUp :message="deleteMessage" :isVisible="showDeleteConfirm" @confirmDelete="onConfirmDelete"
      @update:isVisible="showDeleteConfirm = $event" />

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
                      placeholder="Nhập tên khóa học" required />
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-4">
                      <label for="courseCategory" class="form-label fw-medium">Danh mục</label>
                      <select id="courseCategory" class="form-select" v-model="course.category" required>
                        <option value="" disabled>Chọn danh mục</option>
                        <option value="Student">Học sinh</option>
                        <option value="College">Sinh viên</option>
                        <option value="Working">Người đi làm</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Giá khóa học</label>
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
                        step="1000" placeholder="Nhập giá khóa học" required />
                      <small class="text-muted">Giá tối thiểu: 10,000 VND</small>
                    </div>
                    <div class="col-md-4">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" id="courseDiscount" class="form-control" v-model="course.discount" min="0"
                        max="100" step="1" placeholder="0-100%" />
                    </div>
                    <div class="col-md-4">
                      <label for="discountExpiry" class="form-label fw-medium">Ngày hết hạn giảm giá</label>
                      <input type="date" id="discountExpiry" class="form-control" v-model="course.discountExpiry"
                        :min="minDiscountDate" :required="course.discount > 0" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="courseDescription" class="form-label fw-medium">Mô tả <span
                        class="text-danger">*</span></label>
                    <textarea id="courseDescription" class="form-control" v-model="course.description" rows="4"
                      placeholder="Mô tả khóa học" required></textarea>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium">Ảnh khóa học <span class="text-danger">*</span></label>
                    <div class="input-group mb-2">
                      <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" required />
                      <label class="input-group-text d-flex align-items-center">
                        <UploadIcon class="icon me-1" /> Tải lên
                      </label>
                    </div>
                    <small class="text-muted">Kích thước khuyến nghị: 1280x720px (16:9)</small>
                    <div v-if="course.imagePreview || course.thumb.url" class="mt-3 border p-2 rounded">
                      <img :src="course.imagePreview || course.thumb.url" class="img-thumbnail" style="max-height:200px" />
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
                  <select id="courseDifficulty" class="form-select" v-model="course.level" required>
                    <option value="1">Mới bắt đầu</option>
                    <option value="2">Trung bình</option>
                    <option value="3">Nâng cao</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Sau khóa học, học viên nhận được gì? <span
                      class="text-danger">*</span></label>
                  <textarea class="form-control" rows="3" v-model="course.advisorExpectedOutcome" required></textarea>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Kết quả mong đợi <span class="text-danger">*</span></label>
                  <textarea class="form-control" rows="3" v-model="course.expectedOutcome" required></textarea>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Yêu cầu trước khi học <span class="text-danger">*</span></label>
                  <textarea class="form-control" rows="3" v-model="course.requirements" required></textarea>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Mục tiêu khóa học <span class="text-danger">*</span></label>
                  <textarea class="form-control" rows="3" v-model="course.outcomes" required></textarea>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-medium">Thời gian hoàn thành <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input type="number" class="form-control" v-model="course.expectedCompletion" min="1" required />
                    <span class="input-group-text">Phút</span>
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
                  <ul class="nav nav-tabs px-3 pt-3" role="tablist">
                    <li class="nav-item" v-for="(lecture, index) in course.lectures" :key="index">
                      <button class="nav-link" :class="{ active: activeTab === index }" @click="activeTab = index"
                        role="tab">
                        <span class="lecture-number">Bài {{ index + 1 }}</span>
                        <button type="button" class="btn-close ms-2" style="font-size: 0.5rem"
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
                              <label :for="`lectureTitle${index}`" class="form-label fw-medium">Tiêu đề bài giảng <span
                                  class="text-danger">*</span></label>
                              <input type="text" class="form-control form-control-lg" :id="`lectureTitle${index}`"
                                v-model="lecture.title" placeholder="Nhập tiêu đề bài giảng" required />
                            </div>

                            <div class="mb-4">
                              <label :for="`lectureContentSummary${index}`" class="form-label fw-medium">Tóm tắt nội
                                dung <span class="text-danger">*</span></label>
                              <textarea class="form-control" :id="`lectureContentSummary${index}`"
                                v-model="lecture.contentSummary" rows="3"
                                placeholder="Tóm tắt ngắn gọn nội dung bài giảng" required></textarea>
                            </div>

                            <div class="lecture-type-content mt-4">
                              <div v-if="lecture.lectureType === 'video'" class="resource-upload">
                                <h6 class="mb-3 fw-medium">Tài nguyên <span class="text-danger">*</span></h6>
                                <div class="upload-area p-4 border rounded border-dashed mb-3 text-center">
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
                                
                                <div v-if="lecture.medias && lecture.medias.length > 0" class="uploaded-files">
                                  <h6 class="mb-3 fw-medium">
                                    Tài nguyên hiện tại
                                  </h6>
                                  <div v-for="(media, mediaIndex) in lecture.medias" :key="mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-3 bg-light">
                                    <div class="d-flex align-items-center flex-grow-1">
                                      <div v-if="media.type === 1" class="me-3">
                                        <img :src="media.url" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;" />
                                      </div>
                                      <div v-else-if="media.type === 2" class="me-3">
                                        <video :src="media.url" class="border rounded" style="width: 60px; height: 60px; object-fit: cover;" controls></video>
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

                                <div v-if="lecture.addedMedias && lecture.addedMedias.length > 0" class="uploaded-files mt-3">
                                  <h6 class="mb-3 fw-medium">
                                    Tài nguyên mới thêm
                                  </h6>
                                  <div v-for="(media, mediaIndex) in lecture.addedMedias" :key="'added-' + mediaIndex"
                                    class="uploaded-file-item d-flex align-items-center p-3 border rounded mb-3 bg-success bg-opacity-10">
                                    <div class="d-flex align-items-center flex-grow-1">
                                      <div v-if="media.type === 1" class="me-3">
                                        <img :src="media.preview" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;" />
                                      </div>
                                      <div v-else-if="media.type === 2" class="me-3">
                                        <video :src="media.preview" class="border rounded" style="width: 60px; height: 60px; object-fit: cover;" controls></video>
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
                                  placeholder="Nhập nội dung chi tiết của bài giảng"></textarea>
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
      },
      categories: [
        { id: "4b35a4fc-ab0c-4f7b-874f-d8e60ad33bac", name: "Student" },
        { id: "5c46b5fd-bc1d-5e8c-985f-e9f71be45cbd", name: "College" },
        { id: "6d57c6ge-cd2e-6f9d-096g-f0g82cf56dce", name: "Working" },
      ],
      previewImage: null,
      activeTab: 0,
      showSaveConfirm: false,
      showDeleteConfirm: false,
      saveMessage: "Bạn có chắc muốn cập nhật khóa học?",
      deleteMessage: "Bạn có chắc muốn xóa bài giảng này?",
      cancelMessage: "Bạn có chắc muốn hủy và bỏ các thay đổi?",
      deleteIndex: null,
      isBackAction: false,
      deletedLectureIds: [],
      lectureErrors: [],
      errors: {
        title: "",
        intro: "",
        description: "",
        price: "",
        level: "",
        outcomes: "",
        requirements: "",
        thumb: ""
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
          lectures: []
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
        return "assignment";
      }
    },

    initializeLectureErrors() {
      this.lectureErrors = Array(this.course.lectures.length)
        .fill()
        .map(() => ({
          title: "",
          content: "",
          contentSummary: ""
        }));
    },

    addLecture() {
      this.course.lectures.push({
        id: "",
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        lectureType: "video",
        medias: [],
        addedMedias: [],
        removedMedias: []
      });

      this.lectureErrors.push({
        title: "",
        content: "",
        contentSummary: ""
      });

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

      if (lecture.id) {
        this.deletedLectureIds.push(lecture.id);
      }

      this.course.lectures.splice(index, 1);
      this.lectureErrors.splice(index, 1);

      if (this.course.lectures.length === 0) {
        this.addLecture();
        this.activeTab = 0;
      } else if (index === this.activeTab) {
        this.activeTab = Math.max(0, index - 1);
      } else if (index < this.activeTab) {
        this.activeTab--;
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
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errors.thumb = "Kích thước file phải nhỏ hơn 5MB";
        return;
      }

      if (!file.type.startsWith("image/")) {
        this.errors.thumb = "Chỉ cho phép tải lên file hình ảnh";
        return;
      }

      this.errors.thumb = "";
      this.course.thumb.file = file;
      this.course.thumb.title = file.name;

      const reader = new FileReader();
      reader.onload = (e) => (this.course.imagePreview = e.target.result);
      reader.readAsDataURL(file);
    },

    handleLectureMediaUpload(event, lectureIndex) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
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
          if (!this.course.lectures[lectureIndex].addedMedias) {
            this.course.lectures[lectureIndex].addedMedias = [];
          }
          this.course.lectures[lectureIndex].addedMedias.push({
            type: mediaType,
            file: file,
            preview: e.target.result,
            url: "",
            title: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },

    onDrop(event, index) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.onVideoSelected({ target: { files } }, index);
      }
    },

    onVideoSelected(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        toast.error("Vui lòng chọn file video.");
        return;
      }

      const lecture = this.course.lectures[index];
      lecture.videoFile = file;
      const newMedia = {
        type: 2,
        file: file,
        title: file.name,
        url: ""
      };

      lecture.addedMedias.push(newMedia);
      const reader = new FileReader();
      reader.onload = (e) => {
        lecture.preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    validateForm() {
      return true;
    },

    saveCourse() {
      if (!this.validateForm()) {
        return;
      }
      this.showSaveConfirm = true;
    },

    onConfirmSave(confirmed) {
      if (confirmed) {
        this.processSaveCourse();
      }
      this.showSaveConfirm = false;
    },

    async processSaveCourse() {
      this.$refs.loadingSpinner.showSpinner();

      try {
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
          formData.append("Content", lecture.content);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);
          formData.append("LectureType", lecture.lectureType);

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
          formData.append("Content", lecture.content);
          formData.append("ContentSummary", lecture.contentSummary);
          formData.append("IsPreviewable", lecture.isPreviewable);
          formData.append("LectureType", lecture.lectureType);

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
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });

        this.$router.push({
          path: "/advisor/content",
          query: {
            updateSuccess: true,
            message: "Khóa học đã được cập nhật thành công!", 
          },
        });
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    goBack() {
      this.deleteMessage = this.cancelMessage;
      this.isBackAction = true;
      this.showDeleteConfirm = true;
    }
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

.upload-area {
  border: 1px dashed #3b82f6;
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
}

.icon {
  width: 16px;
  height: 16px;
}

.icon-large {
  width: 32px;
  height: 32px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>