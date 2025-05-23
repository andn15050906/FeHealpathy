<template>
  <div class="roadmap-fullscreen">
    <LoadingSpinner ref="loadingSpinner" />

    <div class="roadmap-header">
      <h1 class="roadmap-title">✨ Tạo lộ trình Mới ✨</h1>
    </div>

    <div class="roadmap-content">
      <form @submit.prevent="submitRoadmap" class="roadmap-form">
        <div class="form-section">
          <div class="section-title">
            <v-icon>mdi-information-outline</v-icon>
            <span>Thông tin cơ bản</span>
          </div>

          <div class="form-group">
            <label for="title">
              <v-icon small>mdi-pencil</v-icon>
              Tiêu đề lộ trình
            </label>
            <input
              type="text"
              id="title"
              v-model="roadmap.title"
              placeholder="Nhập tiêu đề lộ trình"
              required
            />
          </div>

          <div class="form-group">
            <label for="thumb">
              <v-icon small>mdi-image</v-icon>
              Ảnh bìa lộ trình
            </label>
            <div class="thumb-upload">
              <input
                type="file"
                id="thumb"
                @change="handleThumbUpload"
                accept="image/*"
                class="thumb-input"
              />
              <div class="thumb-preview" v-if="thumbPreview">
                <img :src="thumbPreview" alt="Thumbnail preview" />
                <v-btn icon small @click="removeThumb" class="remove-thumb">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="introText">
              <v-icon small>mdi-text-box-outline</v-icon>
              Giới thiệu
            </label>
            <textarea
              id="introText"
              v-model="roadmap.introText"
              placeholder="Nhập giới thiệu cho roadmap"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="isPaid">
              <v-icon small>mdi-cash</v-icon>
              Loại lộ trình
            </label>
            <div class="roadmap-type-selector">
              <v-radio-group v-model="isPaidLocal" inline>
                <v-radio label="Miễn phí" :value="false"></v-radio>
                <v-radio label="Trả phí" :value="true"></v-radio>
              </v-radio-group>
            </div>
          </div>

          <div class="form-group" v-if="roadmap.isPaid">
            <label for="price">
              <v-icon small>mdi-currency-usd</v-icon>
              Giá (VND)
            </label>
            <input type="number" id="price" v-model="roadmap.price" placeholder="Nhập giá roadmap" min="0"
              step="10000" />
          </div>
        </div>

        <div class="form-section">
          <div class="section-title">
            <v-icon>mdi-account-group-outline</v-icon>
            <span>Đối tượng & Vấn đề</span>
          </div>

          <div class="form-group">
            <label for="targetUserTypes">
              <v-icon small>mdi-account-multiple</v-icon>
              Đối tượng phù hợp
            </label>
            <v-select
              v-model="roadmap.targetUserTypes"
              :items="userTypeOptions"
              item-title="text"
              item-value="value"
              multiple
              chips
              label="Chọn đối tượng phù hợp"
              outlined
            ></v-select>
          </div>

          <div class="form-group">
            <label for="targetIssues">
              <v-icon small>mdi-target</v-icon>
              Vấn đề giải quyết
            </label>
            <v-select
              v-model="roadmap.targetIssues"
              :items="issueOptions"
              item-title="text"
              item-value="value"
              multiple
              chips
              label="Chọn vấn đề mà roadmap giải quyết"
              outlined
            ></v-select>
          </div>
        </div>

        <div class="form-section phases-section">
          <div class="section-title">
            <v-icon>mdi-chart-timeline-variant</v-icon>
            <span>Các Giai Đoạn</span>
          </div>

          <div
            class="phase"
            v-for="(phase, index) in roadmap.phases"
            :key="index"
          >
            <div class="phase-header">
              <h3>Giai đoạn {{ index + 1 }}</h3>
              <div class="phase-actions">
                <v-btn
                  icon
                  small
                  @click="movePhase(index, -1)"
                  :disabled="index === 0"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  @click="movePhase(index, 1)"
                  :disabled="index === roadmap.phases.length - 1"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
                <v-btn icon small @click="removePhase(index)" color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>

            <div class="form-group">
              <label>
                <v-icon small>mdi-tag</v-icon>
                Tiêu đề Giai Đoạn
              </label>
              <input
                type="text"
                v-model="phase.title"
                placeholder="Nhập tiêu đề giai đoạn"
                required
              />
            </div>
            <div class="form-group">
              <label>
                <v-icon small>mdi-text-box-outline</v-icon>
                Mô tả Giai Đoạn
              </label>
              <textarea
                v-model="phase.description"
                placeholder="Mô tả chi tiết giai đoạn"
                rows="3"
                required
              ></textarea>
            </div>

            <!-- Thêm phần công cụ (tools) -->
            <div class="form-group">
              <label>
                <v-icon small>mdi-tools</v-icon>
                Công cụ hỗ trợ
              </label>
              <v-select
                v-model="phase.tools"
                :items="availableTools"
                item-title="text"
                item-value="value"
                multiple
                chips
                label="Chọn công cụ hỗ trợ (tùy chọn)"
                outlined
              >
                <template v-slot:selection="{ item }">
                  <v-chip>
                    <v-icon left>{{ getToolIcon(item.value) }}</v-icon>
                    {{ item.text }}
                  </v-chip>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.description
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>

              <div class="text-caption text-grey">
                Các công cụ giúp người dùng thực hành trong giai đoạn này
              </div>
            </div>

            <!-- Thêm phần mẹo hữu ích -->
            <div class="form-group">
              <label>
                <v-icon small>mdi-lightbulb-outline</v-icon>
                Mẹo hữu ích
              </label>
              <textarea
                v-model="phase.tips"
                placeholder="Nhập các mẹo hữu ích cho giai đoạn này (tùy chọn)"
                rows="3"
              ></textarea>
              <div class="text-caption text-grey"
                >Các mẹo giúp người dùng vượt qua giai đoạn này dễ dàng hơn</div
              >
            </div>
          </div>

          <div class="add-phase-container">
            <v-btn color="primary" @click="addPhase" class="add-phase-btn">
              <v-icon left>mdi-plus</v-icon>
              Thêm Giai Đoạn
            </v-btn>
          </div>
        </div>

        <div class="form-actions">
          <v-btn
            type="submit"
            color="success"
            x-large
            :disabled="!isFormValid"
            class="submit-btn"
          >
            <v-icon left>mdi-check</v-icon>
            Tạo lộ trình
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { getCourses } from "@/scripts/api/services/courseService.js";
import { getPagedMediaResources } from "@/scripts/api/services/mediaResourcesService";
import { getPagedArticles } from "@/scripts/api/services/blogService";
import { getPagedConversations } from "@/scripts/api/services/conversationService";
import { getPagedSurveys } from "@/scripts/api/services/surveysService";
import {
  TRACKED_EVENTS,
  ENTITY_TYPES,
  getEntityTypeByEventLabel,
} from "@/scripts/api/services/activityLogService";
import { createRoadmap } from "@/scripts/api/services/roadmapService";
import { ref, computed, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/Common/Popup/LoadingSpinner.vue";

const router = useRouter();

const allCourses = ref([]);
const allMediaResources = ref([]);
const allArticles = ref([]);
const allConversations = ref([]);
const allSurveys = ref([]);

const roadmap = ref({
  title: "",
  introText: "",
  description: "",
  category: "mental-health",
  thumb: null,
  isPaid: false,
  price: 500000,
  discount: null,
  discountExpiry: null,
  coupons: null,
  targetUserTypes: [],
  targetIssues: [],
  phases: [
    {
      tools: [],
      tips: "",
    },
  ],
});

const isPaidLocal = ref(roadmap.value.isPaid);

watch(
  () => roadmap.value.isPaid,
  (newValue) => {
    isPaidLocal.value = newValue;
  }
);

watch(isPaidLocal, (newValue) => {
  roadmap.value.isPaid = newValue;
});

const userTypeOptions = ref([
  { text: "Học sinh", value: "student" },
  { text: "Sinh viên", value: "university" },
  { text: "Người đi làm", value: "worker" },
  { text: "Phụ huynh", value: "parent" },
  { text: "Người cao tuổi", value: "elderly" },
]);

const issueOptions = ref([
  { text: "Áp lực học tập, thi cử", value: "study_pressure" },
  { text: "Bị bắt nạt hoặc cô lập", value: "bullying" },
  { text: "Không có bạn thân", value: "no_close_friend" },
  { text: "Mâu thuẫn với cha mẹ", value: "parent_conflict" },
  { text: "Mất động lực", value: "no_motivation" },
  { text: "Lo lắng về tương lai", value: "future_worry" },
  { text: "Mất định hướng nghề nghiệp", value: "career_confusion" },
  { text: "Cô đơn", value: "loneliness" },
  { text: "Chán học", value: "boredom" },
  { text: "Stress vì thực tập/thi cử", value: "intern_stress" },
  { text: "Căng thẳng công việc", value: "work_stress" },
  { text: "Mâu thuẫn đồng nghiệp", value: "colleague_conflict" },
  { text: "Cảm giác không được công nhận", value: "not_recognized" },
  { text: "Không còn đam mê", value: "no_passion" },
  { text: "Mất cân bằng cuộc sống – công việc", value: "work_life_balance" },
]);

const loadingSpinner = ref(null);

const toastConfig = {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const isFormValid = computed(() => {
  return (
    roadmap.value.title.trim() !== "" &&
    roadmap.value.introText.trim() !== "" &&
    roadmap.value.phases.length > 0 &&
    roadmap.value.targetUserTypes.length > 0 &&
    roadmap.value.targetIssues.length > 0 &&
    (!isPaidLocal.value ||
      (isPaidLocal.value &&
        roadmap.value.price > 0))
  );
});

const availableTools = ref([
  {
    text: "Yoga",
    value: "yoga",
    description: "Khám phá sự cân bằng và thư giãn thông qua các bài tập yoga",
    route: "options/yoga",
  },
  {
    text: "Tự đánh giá",
    value: "self_assessment",
    description: "Đánh giá bản thân với các bài kiểm tra đã được kiểm chứng",
    route: "self-assessment",
  },
  {
    text: "Phương tiện truyền thông",
    value: "media_resources",
    description: "Truy cập nguồn tài nguyên đa phương tiện của bạn",
    route: "media-resources",
  },
  {
    text: "Nhật ký",
    value: "diary",
    description:
      "Ghi lại suy nghĩ, cảm xúc và xác định các yếu tố ảnh hưởng đến tâm trạng",
    route: "diary/diary-list",
  },
  {
    text: "Cập nhật trạng thái cảm xúc",
    value: "mood_tracking",
    description:
      "Xác định xu hướng tâm lý dựa trên tâm trạng hàng ngày của bạn",
    route: "mood-cart",
  },
  {
    text: "Theo dõi thói quen",
    value: "habit_tracking",
    description:
      "Xây dựng lối sống lành mạnh thông qua thực hành và điều chỉnh liên tục",
    route: "habit-tracking",
  },
]);

const thumbPreview = ref(null);

function addPhase() {
  roadmap.value.phases.push({
    title: "",
    description: "",
    timeSpan: 7,
    index: roadmap.value.phases.length,
    tools: [],
    tips: "",
  });
}

function removePhase(index) {
  roadmap.value.phases.splice(index, 1);
  // Update indices
  roadmap.value.phases.forEach((phase, idx) => {
    phase.index = idx;
  });
}

function movePhase(index, direction) {
  if (
    (direction < 0 && index === 0) ||
    (direction > 0 && index === roadmap.value.phases.length - 1)
  ) {
    return;
  }

  const newIndex = index + direction;
  const temp = roadmap.value.phases[index];
  roadmap.value.phases[index] = roadmap.value.phases[newIndex];
  roadmap.value.phases[newIndex] = temp;

  // Update indices
  roadmap.value.phases.forEach((phase, idx) => {
    phase.index = idx;
  });
}

function removeMilestone(phaseIndex, milestoneIndex) {
  roadmap.value.phases[phaseIndex].milestones.splice(milestoneIndex, 1);
}

function moveMilestone(phaseIndex, milestoneIndex, direction) {
  const milestones = roadmap.value.phases[phaseIndex].milestones;
  if (
    (direction < 0 && milestoneIndex === 0) ||
    (direction > 0 && milestoneIndex === milestones.length - 1)
  ) {
    return;
  }

  const newIndex = milestoneIndex + direction;
  const temp = milestones[milestoneIndex];
  milestones[milestoneIndex] = milestones[newIndex];
  milestones[newIndex] = temp;
}

function addMilestone(phaseIndex) {
  const newMilestone = {
    title: "",
    eventName: "",
    repeatTimesRequired: 1,
    timeSpentRequired: 30,
    recommendations: [],
  };
  roadmap.value.phases[phaseIndex].milestones.push(newMilestone);
}

function addRecommendation(phaseIndex, milestoneIndex) {
  const phase = roadmap.value.phases[phaseIndex];
  const milestone = phase && phase.milestones[milestoneIndex];
  if (milestone) {
    const newRecommendation = {
      targetEntityId: "",
      entityType: "",
      milestoneId: "",
      trait: "",
      traitDescription: "",
    };
    if (!milestone.recommendations) {
      milestone.recommendations = [];
    }
    milestone.recommendations.push(newRecommendation);
  } else {
    console.error("Pha hoặc mốc không hợp lệ");
  }
}

function removeRecommendation(phaseIndex, milestoneIndex, recommendationIndex) {
  roadmap.value.phases[phaseIndex].milestones[
    milestoneIndex
  ].recommendations.splice(recommendationIndex, 1);
}

function handleThumbUpload(event) {
  const file = event.target.files[0];
  if (file) {
    roadmap.value.thumb = {
      file: file,
      title: file.name,
      url: null
    };
    thumbPreview.value = URL.createObjectURL(file);
  }
}

function removeThumb() {
  roadmap.value.thumb = null;
  thumbPreview.value = null;
  const input = document.getElementById('thumb');
  if (input) input.value = '';
}

async function submitRoadmap() {
  if (!validateRoadmapBasicInfo() || !validatePhases()) {
    return;
  }

  try {
    loadingSpinner.value.showSpinner();

    const formData = new FormData();

    formData.append("Title", roadmap.value.title);
    formData.append("IntroText", roadmap.value.introText);
    formData.append("Description", roadmap.value.introText);
    formData.append("Category", "mental-health");
    formData.append("IsPaid", roadmap.value.isPaid);

    if (roadmap.value.thumb) {
      formData.append("Thumb.File", roadmap.value.thumb.file);
      formData.append("Thumb.Title", roadmap.value.thumb.title);
    }

    if (roadmap.value.isPaid) {
      formData.append("Price", roadmap.value.price);
      if (roadmap.value.discount) formData.append("Discount", roadmap.value.discount);
      if (roadmap.value.discountExpiry) formData.append("DiscountExpiry", roadmap.value.discountExpiry.toISOString());
      if (roadmap.value.coupons) formData.append("Coupons", roadmap.value.coupons);
    }

    roadmap.value.phases.forEach((phase, index) => {
      formData.append(`Phases[${index}].Title`, phase.title);
      formData.append(`Phases[${index}].Description`, phase.description);

      formData.append(`Phases[${index}].Introduction`, phase.tips || "");
      formData.append(`Phases[${index}].Index`, index);
      formData.append(`Phases[${index}].TimeSpan`, Number(phase.timeSpan) || 7);
      formData.append(`Phases[${index}].IsRequiredToAdvance`, false);

      const toolRecommendations = phase.tools
        .map((toolValue) => {
          const tool = availableTools.value.find((t) => t.value === toolValue);
          if (!tool) return null;

          return {
            Title: tool.text,
            Description: tool.description,
            IsAction: true,
            Duration: 30,
            MoodTags: JSON.stringify(["Công cụ hỗ trợ"]),
            IsGeneralTip: false,
            Source: tool.route,
          };
        })
        .filter(Boolean);

      const allRecommendations = toolRecommendations;

      allRecommendations.forEach((rec, recIndex) => {
        formData.append(`Phases[${index}].Recommendations[${recIndex}].Title`, rec.Title);
        if (rec.Content) {
          formData.append(`Phases[${index}].Recommendations[${recIndex}].Content`, rec.Content);
        }
        if (rec.Description) {
          formData.append(`Phases[${index}].Recommendations[${recIndex}].Description`, rec.Description);
        }
        formData.append(`Phases[${index}].Recommendations[${recIndex}].IsAction`, !!rec.IsAction);
        if (rec.Duration) {
          formData.append(`Phases[${index}].Recommendations[${recIndex}].Duration`, Number(rec.Duration));
        }
        if (rec.MoodTags) {
          formData.append(`Phases[${index}].Recommendations[${recIndex}].MoodTags`, rec.MoodTags);
        }
        formData.append(`Phases[${index}].Recommendations[${recIndex}].IsGeneralTip`, !!rec.IsGeneralTip);
      });
    });

    await createRoadmap(formData);
    router.push({
      name: "RoadmapBuilder",
      query: {
        createSuccess: true,
        message: "Tạo roadmap thành công!",
      },
    });
  } catch (error) {
    console.error("Lỗi tạo roadmap:", error);
    toast.error("Tạo roadmap thất bại! " + (error.message || ""), toastConfig);
  } finally {
    loadingSpinner.value.hideSpinner();
  }
}

function validateRoadmapBasicInfo() {
  if (!roadmap.value.title.trim()) {
    toast.error("Vui lòng nhập tiêu đề roadmap!", toastConfig);
    return false;
  }
  if (roadmap.value.title.length > 200) {
    toast.error("Tiêu đề roadmap không được vượt quá 200 ký tự!", toastConfig);
    return false;
  }
  if (!roadmap.value.introText.trim()) {
    toast.error("Vui lòng nhập giới thiệu roadmap!", toastConfig);
    return false;
  }
  if (roadmap.value.introText.length > 1000) {
    toast.error("Giới thiệu roadmap không được vượt quá 1000 ký tự!", toastConfig);
    return false;
  }
  if (roadmap.value.targetUserTypes.length === 0) {
    toast.error("Vui lòng chọn ít nhất một đối tượng phù hợp!", toastConfig);
    return false;
  }
  if (roadmap.value.targetIssues.length === 0) {
    toast.error("Vui lòng chọn ít nhất một vấn đề mà roadmap giải quyết!", toastConfig);
    return false;
  }
  if (roadmap.value.isPaid && roadmap.value.price <= 0) {
    toast.error("Giá roadmap phải lớn hơn 0!", toastConfig);
    return false;
  }
  return true;
}

function validatePhases() {
  if (!roadmap.value.phases || roadmap.value.phases.length === 0) {
    toast.error("Vui lòng thêm ít nhất một giai đoạn!", toastConfig);
    return false;
  }

  for (let i = 0; i < roadmap.value.phases.length; i++) {
    const phase = roadmap.value.phases[i];

    if (!phase.title.trim()) {
      toast.error(`Vui lòng nhập tiêu đề cho giai đoạn ${i + 1}!`, toastConfig);
      return false;
    }
    if (phase.title.length > 100) {
      toast.error(
        `Tiêu đề giai đoạn ${i + 1} không được vượt quá 100 ký tự!`,
        toastConfig
      );
      return false;
    }
    if (!phase.description.trim()) {
      toast.error(`Vui lòng nhập mô tả cho giai đoạn ${i + 1}!`, toastConfig);
      return false;
    }
    if (phase.timeSpan <= 0) {
      toast.error(
        `Thời gian dự kiến của giai đoạn ${i + 1} phải lớn hơn 0!`,
        toastConfig
      );
      return false;
    }
  }
  return true;
}

function validateRecommendations(recommendations, phaseIndex, milestoneIndex) {
  if (!recommendations || recommendations.length === 0) {
    return true;
  }

  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i];

    if (!rec.targetEntityId) {
      toast.error(
        `Vui lòng chọn nội dung khuyến nghị ${i + 1} cho mốc ${
          milestoneIndex + 1
        } của giai đoạn ${phaseIndex + 1}!`,
        toastConfig
      );
      return false;
    }
    if (!rec.trait.trim()) {
      toast.error(
        `Vui lòng nhập đặc tính cho khuyến nghị ${i + 1} của mốc ${
          milestoneIndex + 1
        } giai đoạn ${phaseIndex + 1}!`,
        toastConfig
      );
      return false;
    }
    if (!rec.traitDescription.trim()) {
      toast.error(
        `Vui lòng nhập mô tả đặc tính cho khuyến nghị ${i + 1} của mốc ${
          milestoneIndex + 1
        } giai đoạn ${phaseIndex + 1}!`,
        toastConfig
      );
      return false;
    }
  }
  return true;
}

function isRecommendationAvailable(eventLabel) {
  switch (getEntityTypeByEventLabel(eventLabel)) {
    case ENTITY_TYPES.Course.en:
      return true;
    case ENTITY_TYPES.MediaResource.en:
      return true;
    case ENTITY_TYPES.Article.en:
      return true;
    case ENTITY_TYPES.Conversation.en:
      return true;
    case ENTITY_TYPES.Survey.en:
      return true;
  }
  return false;
}

function getPreloadedEntities(eventLabel) {
  switch (getEntityTypeByEventLabel(eventLabel)) {
    case ENTITY_TYPES.Course.en:
      return allCourses.value;
    case ENTITY_TYPES.MediaResource.en:
      return allMediaResources.value;
    case ENTITY_TYPES.Article.en:
      return allArticles.value;
    case ENTITY_TYPES.Conversation.en:
      return allConversations.value;
    case ENTITY_TYPES.Survey.en:
      return allSurveys.value;
  }
  return [];
}

function updateEventList(phaseIndex, milestoneIndex, eventName) {
  const milestone = roadmap.value.phases[phaseIndex].milestones[milestoneIndex];
  milestone.entityType = getEntityTypeByEventLabel(eventName);
}

function getAvailableContents(
  phaseIndex,
  milestoneIndex,
  recIndex,
  eventLabel
) {
  return getPreloadedEntities(getEntityTypeByEventLabel(eventLabel));
}

onMounted(async () => {
  allCourses.value = await getCourses({ pageIndex: 0, pageSize: 10 });
  allMediaResources.value = await getPagedMediaResources({
    pageIndex: 0,
    pageSize: 10,
  });
  allArticles.value = await getPagedArticles({ pageIndex: 0, pageSize: 10 });
  allConversations.value = await getPagedConversations({
    pageIndex: 0,
    pageSize: 10,
  });
  allSurveys.value = await getPagedSurveys({ pageIndex: 0, pageSize: 10 });
});
</script>

<style scoped>
.roadmap-fullscreen {
  width: 100%;
  margin-bottom: 35px;
  min-width: 1200px;
  min-height: 100vh;
  background-color: #f0f7fa;
  display: flex;
  flex-direction: column;
}

.roadmap-header {
  background-color: #ffffff;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.roadmap-title {
  font-size: 2rem;
  color: #2196f3;
  margin: 0;
  font-weight: 600;
}

.roadmap-content {
  flex: 1;
  padding: 30px;
  width: 100%;
}

.roadmap-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: #2196f3;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.section-title .v-icon {
  margin-right: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group label .v-icon {
  margin-right: 8px;
  color: #2196f3;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.roadmap-type-selector {
  display: flex;
  gap: 20px;
}

.feature-item {
  margin-bottom: 10px;
}

.feature-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.phases-section {
  margin-top: 20px;
}

.phase {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
  border-left: 4px solid #2196f3;
}

.phase-header,
.milestone-header,
.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.phase-header h3 {
  color: #2196f3;
  margin: 0;
  font-size: 1.3rem;
}

.milestone-header h4,
.recommendation-header h5 {
  color: #2196f3;
  margin: 0;
  display: flex;
  align-items: center;
}

.milestone-header h4 .v-icon,
.recommendation-header h5 .v-icon {
  margin-right: 8px;
}

.phase-actions,
.milestone-actions {
  display: flex;
  gap: 5px;
}

.milestones {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.milestone {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  border-left: 3px solid #4caf50;
}

.milestone-header h5 {
  font-size: 1.1rem;
  color: #4caf50;
}

.recommendations {
  margin-top: 20px;
  background-color: #f0f7f0;
  padding: 20px;
  border-radius: 8px;
}

.recommendation {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  border-left: 3px solid #ff9800;
}

.add-phase-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.add-phase-btn {
  padding: 12px 24px;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 50px;
}

.submit-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  min-width: 250px;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {
  .roadmap-content {
    padding: 15px;
  }

  .roadmap-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 15px;
    margin-bottom: 15px;
  }

  .phase,
  .milestone,
  .recommendation {
    padding: 15px;
  }

  .submit-btn {
    width: 100%;
  }
}

.thumb-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumb-input {
  padding: 10px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumb-input:hover {
  border-color: #2196f3;
}

.thumb-preview {
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.thumb-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-thumb {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.remove-thumb .v-icon {
  color: white;
}
</style>
