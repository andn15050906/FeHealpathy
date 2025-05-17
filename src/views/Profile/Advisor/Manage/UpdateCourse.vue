<template>
  <div class="create-course-container">
    <LoadingSpinner ref="loadingSpinner" />
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
                <form @submit.prevent="updateCourse">
                  <div class="mb-4">
                    <label for="title" class="form-label fw-medium">Tên khóa học</label>
                    <input type="text" class="form-control form-control-lg" id="courseTitle" v-model="course.title"
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
                    <div class="col-md-4">
                      <label for="courseDiscount" class="form-label fw-medium">Giảm giá (%)</label>
                      <input type="number" class="form-control" id="courseDiscount" v-model="course.discount" min="0"
                        max="100" step="1" placeholder="0-100%" />
                    </div>
                    <div class="col-md-4">
                      <label for="discountExpiry" class="form-label fw-medium">Ngày hết hạn giảm giá</label>
                      <input type="date" class="form-control" id="discountExpiry" v-model="course.discountExpiry" 
                        :min="minDiscountDate" required />
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

                    <div v-if="course.imagePreview || course.thumb.url" class="mt-3 border p-2 rounded">
                      <img :src="course.imagePreview || course.thumb.url" alt="Xem trước ảnh" class="img-thumbnail"
                        style="max-height: 200px" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium d-block">Trạng thái</label>
                    <div class="d-flex flex-wrap gap-3">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusDraft" :value="0"
                          v-model="course.status" />
                        <label class="form-check-label" for="statusDraft">Bản nháp</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusPublished"
                          :value="1" v-model="course.status" />
                        <label class="form-check-label" for="statusPublished">Đã xuất bản</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusOngoing"
                          :value="2" v-model="course.status" />
                        <label class="form-check-label" for="statusOngoing">Đang diễn ra</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusPostponed"
                          :value="3" v-model="course.status" />
                        <label class="form-check-label" for="statusPostponed">Tạm hoãn</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="courseStatus" id="statusCompleted"
                          :value="4" v-model="course.status" />
                        <label class="form-check-label" for="statusCompleted">Đã hoàn thành</label>
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
                  <select class="form-select" id="courseDifficulty" v-model="course.level">
                    <option :value="0">Sơ cấp</option>
                    <option :value="1">Trung cấp</option>
                    <option :value="2">Cao cấp</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="courseAdvisorExpectedOutcome" class="form-label fw-medium">Sau khóa học, học viên nhận được gì?</label>
                  <textarea class="form-control" id="courseAdvisorExpectedOutcome" v-model="course.advisorExpectedOutcome" rows="3"
                    placeholder=""></textarea>
                </div>

                <div class="mb-4">
                  <label for="courseOutcomes" class="form-label fw-medium">Mục tiêu khóa học</label>
                  <textarea class="form-control" id="courseOutcomes" v-model="course.outcomes" rows="3"
                    placeholder=""></textarea>
                </div>

                <div class="mb-4">
                  <label for="coursePrerequisites" class="form-label fw-medium">Yêu cầu trước khi học</label>
                  <textarea class="form-control" id="coursePrerequisites" v-model="course.requirements" rows="3"
                    placeholder="Học viên cần biết gì trước khi tham gia khóa học?"></textarea>
                </div>

                <div class="mb-4">
                  <label for="courseCompletionTime" class="form-label fw-medium">Thời gian hoàn thành</label>
                  <div class="input-group">
                    <input type="number" class="form-control" id="courseCompletionTime" v-model="course.completionTime" 
                      min="1" placeholder="Nhập số giờ" />
                    <span class="input-group-text">giờ</span>
                  </div>
                  <small class="text-muted">Thời gian ước tính để học viên hoàn thành khóa học</small>
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

                            <div class="mb-4">
                              <label :for="`lectureContent${index}`" class="form-label fw-medium">Nội
                                dung</label>
                              <textarea class="form-control" :id="`lectureContent${index}`"
                                v-model="lecture.content" rows="3"
                                placeholder="Nội dung bài giảng" required></textarea>
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
                                </select>
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
              <button class="btn btn-primary d-flex align-items-center px-4" @click="updateCourse">
                <i class="bi bi-save me-2"></i> Cập nhật khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    GripVerticalIcon,
  },
  data() {
    return {
      course: {
        id: "",
        title: "",
        intro: "",
        description: "",
        thumb: { url: "", file: null, title: "" },
        leafCategoryId: "",
        status: 0,
        price: 0,
        priceType: "free",
        level: 0,
        outcomes: "",
        requirements: "",
        discount: 0,
        discountExpiry: "",
        advisorExpectedOutcome: "",
        completionTime: "",
        lectures: [],
      },
      previewImage: null,
      showSavePopup: false,
      showDeletePopup: false,
      lectureToDeleteIndex: null,
      activeTab: 0,
      errors: {
        title: "",
        intro: "",
        description: "",
        price: "",
        level: "",
        outcomes: "",
        requirements: "",
        thumb: "",
      },
      lectureErrors: [],
      originalLectures: [],
      deletedLectureIds: [],
      minDiscountDate: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      })()
    };
  },
  methods: {
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        this.$refs.loadingSpinner.showSpinner();
        const courseData = await getCourseById(courseId);
        
        // Convert discount from decimal to percentage
        courseData.discount = courseData.discount * 100;
        
        // Format discount expiry date
        if (courseData.discountExpiry) {
          const expiryDate = new Date(courseData.discountExpiry);
          courseData.discountExpiry = expiryDate.toISOString().split("T")[0];
        }

        // Set price type based on price
        courseData.priceType = courseData.price === 0 ? "free" : "paid";

        this.course = {
          ...courseData,
          thumb: {
            url: courseData.thumbUrl || "",
            file: null,
            title: courseData.title || "",
          },
          lectures: [],
        };

        this.previewImage = courseData.thumbUrl || "";

        // Fetch lectures
        const lectureResponse = await getLectures(courseId);
        const lectureList = lectureResponse?.items || [];
        
        this.course.lectures = lectureList.map((l) => ({
          id: l.id,
          title: l.title,
          content: l.content,
          contentSummary: l.contentSummary,
          isPreviewable: l.isPreviewable,
          type: l.type || "Video",
          medias: (l.materials || l.medias || []).map((m) => ({
            id: m.id,
            type: m.type,
            preview: m.type === 1 || m.type === 2 ? m.url : "",
            url: m.url,
            title: m.title,
            file: null,
            isDeleted: false,
          })),
          addedMedias: [],
          removedMedias: [],
          isNew: false,
        }));

        this.originalLectures = JSON.parse(JSON.stringify(this.course.lectures));
        this.initializeLectureErrors();
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error("Không thể tải dữ liệu khóa học.");
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    initializeLectureErrors() {
      this.lectureErrors = Array(this.course.lectures.length)
        .fill()
        .map(() => ({
          title: "",
          content: "",
          contentSummary: "",
        }));
    },

    addLecture() {
      this.course.lectures.push({
        title: "",
        content: "",
        contentSummary: "",
        isPreviewable: false,
        type: "Video",
        medias: [],
        addedMedias: [],
        removedMedias: [],
        isNew: true,
      });
      this.lectureErrors.push({
        title: "",
        content: "",
        contentSummary: "",
      });
      this.activeTab = this.course.lectures.length - 1;
    },

    removeLecture(index) {
      const lecture = this.course.lectures[index];
      if (lecture.id && !lecture.isNew) {
        this.deletedLectureIds.push(lecture.id);
      }
      this.course.lectures.splice(index, 1);
      this.lectureErrors.splice(index, 1);
      
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
    },

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
        const type = file.type.startsWith("image")
          ? 1
          : file.type.startsWith("video")
            ? 2
            : 3;
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia = {
            type,
            file,
            preview: type < 3 ? e.target.result : "",
            url: "",
            title: file.name,
          };

          if (!this.course.lectures[lectureIndex].medias) {
            this.course.lectures[lectureIndex].medias = [];
          }
          
          this.course.lectures[lectureIndex].medias.push(newMedia);
          this.course.lectures[lectureIndex].addedMedias.push(newMedia);
        };
        reader.readAsDataURL(file);
      });
    },

    removeLectureMedia(lectureIndex, mediaIndex) {
      const media = this.course.lectures[lectureIndex].medias[mediaIndex];
      if (media.id) {
        this.course.lectures[lectureIndex].removedMedias.push(media.id);
      }
      this.course.lectures[lectureIndex].medias.splice(mediaIndex, 1);
    },

    goBack() {
      this.$router.back();
    },

    async updateCourse() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.$refs.loadingSpinner.showSpinner();
        const formData = new FormData();
        
        // Basic course information
        formData.append("Id", this.course.id);
        formData.append("Title", this.course.title);
        formData.append("Intro", this.course.intro);
        formData.append("Description", this.course.description);
        formData.append("Status", this.course.status);
        formData.append("Price", this.course.priceType === "free" ? 0 : this.course.price);
        formData.append("Discount", this.course.discount / 100);
        
        if (this.course.discount > 0) {
          formData.append("DiscountExpiry", this.course.discountExpiry);
        }
        
        formData.append("Level", this.course.level);
        formData.append("Outcomes", this.course.outcomes);
        formData.append("Requirements", this.course.requirements);
        formData.append("AdvisorExpectedOutcome", this.course.advisorExpectedOutcome);
        formData.append("ExpectedCompletion", this.course.completionTime);
        formData.append("LeafCategoryId", this.course.leafCategoryId);

        // Handle thumbnail
        if (this.course.thumb.file) {
          formData.append("Thumb.File", this.course.thumb.file);
          formData.append("Thumb.Title", this.course.thumb.title);
        } else if (this.course.thumb.url) {
          formData.append("Thumb.Url", this.course.thumb.url);
          formData.append("Thumb.Title", this.course.thumb.title);
        }

        // Update course
        await updateCourse(formData);

        // Handle deleted lectures
        for (const lectureId of this.deletedLectureIds) {
          await deleteLecture(lectureId);
        }

        // Update existing lectures
        const existingLectures = this.course.lectures.filter(
          (lecture) => !lecture.isNew
        );
        for (const lecture of existingLectures) {
          const lectureFormData = new FormData();
          lectureFormData.append("Id", lecture.id);
          lectureFormData.append("CourseId", this.course.id);
          lectureFormData.append("Title", lecture.title);
          lectureFormData.append("Content", lecture.content);
          lectureFormData.append("ContentSummary", lecture.contentSummary);
          lectureFormData.append("IsPreviewable", lecture.isPreviewable);
          lectureFormData.append("Type", lecture.type);

          // Handle removed media
          lecture.removedMedias.forEach((id, index) => {
            lectureFormData.append(`RemovedMedias[${index}]`, id);
          });

          // Handle added media
          if (lecture.addedMedias.length > 0) {
            lecture.addedMedias.forEach((media, index) => {
              if (media.file) {
                lectureFormData.append(`AddedMedias[${index}].File`, media.file);
                lectureFormData.append(`AddedMedias[${index}].Title`, media.title);
                lectureFormData.append(`AddedMedias[${index}].Type`, media.type);
              }
            });
          }

          await updateLecture(lectureFormData);
        }

        // Create new lectures
        const newLectures = this.course.lectures.filter(
          (lecture) => lecture.isNew
        );
        for (const lecture of newLectures) {
          const lectureFormData = new FormData();
          lectureFormData.append("CourseId", this.course.id);
          lectureFormData.append("Title", lecture.title);
          lectureFormData.append("Content", lecture.content);
          lectureFormData.append("ContentSummary", lecture.contentSummary);
          lectureFormData.append("IsPreviewable", lecture.isPreviewable);
          lectureFormData.append("Type", lecture.type);

          // Handle media for new lecture
          lecture.addedMedias.forEach((media, index) => {
            if (media.file) {
              lectureFormData.append(`AddedMedias[${index}].File`, media.file);
              lectureFormData.append(`AddedMedias[${index}].Title`, media.title);
              lectureFormData.append(`AddedMedias[${index}].Type`, media.type);
            }
          });

          await createLecture(lectureFormData);
        }

        toast.success("Cập nhật khóa học thành công!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });

        this.$router.push({
          path: "/advisor/content",
          query: {
            updateSuccess: true,
            message: "Khóa học đã được cập nhật thành công!",
          },
        });
      } catch (error) {
        console.error('Error updating course:', error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },

    validateForm() {
      // Validate required fields
      if (!this.course.title) {
        toast.error("Vui lòng nhập tên khóa học!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }

      // Validate lectures
      if (this.course.lectures.length === 0) {
        toast.error("Vui lòng thêm ít nhất một bài giảng!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }

      // Validate each lecture
      for (let i = 0; i < this.course.lectures.length; i++) {
        const lecture = this.course.lectures[i];
        if (!lecture.title) {
          toast.error(`Vui lòng nhập tiêu đề cho bài giảng ${i + 1}!`, {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT
          });
          return false;
        }
        if (!lecture.content) {
          toast.error(`Vui lòng nhập nội dung cho bài giảng ${i + 1}!`, {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT
          });
          return false;
        }
      }

      // Validate discount expiry
      if (this.course.discount > 0 && !this.course.discountExpiry) {
        toast.error("Vui lòng chọn ngày hết hạn giảm giá!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }

      return true;
    }
  },
  mounted() {
    this.fetchCourse();
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

.icon {
  width: 16px;
  height: 16px;
}

.lecture-tabs {
  position: relative;
}

.lecture-tabs .nav-tabs {
  overflow-x: auto;
  white-space: nowrap;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.lecture-tabs .nav-tabs::-webkit-scrollbar {
  display: none;
}

.lecture-tabs .nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-right: 0.25rem;
  border: none;
  border-radius: 4px 4px 0 0;
  color: #333;
  background: #f5f5f5;
  transition: all 0.2s;
}

.lecture-tabs .nav-link:hover {
  background: #e8e8e8;
}

.lecture-tabs .nav-link.active {
  background: #3b82f6;
  color: white;
}

.lecture-tabs .btn-close {
  margin-left: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.lecture-tabs .btn-close:hover {
  opacity: 1;
}

.lecture-number {
  font-weight: 500;
}

.tab-content {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.upload-area {
  border: 2px dashed #3b82f6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f8fafc;
  transition: all 0.2s;
}

.upload-area:hover {
  background: #f0f7ff;
}

.uploaded-files {
  margin-top: 1rem;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.uploaded-file-item i {
  color: #3b82f6;
  margin-right: 0.5rem;
}

.uploaded-file-item .btn-close {
  margin-left: auto;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.uploaded-file-item .btn-close:hover {
  opacity: 1;
}

.form-check-switch {
  padding-left: 2.5rem;
}

.form-check-switch .form-check-input {
  width: 2.5rem;
  height: 1.25rem;
  margin-left: -2.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
  background-position: left center;
  border-radius: 2rem;
  transition: background-position .15s ease-in-out;
}

.form-check-switch .form-check-input:checked {
  background-position: right center;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.form-check-switch .form-check-label {
  padding-top: 0.125rem;
}
</style>