<template>
  <div class="roadmap-creation">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="title">✨ Tạo Roadmap Mới ✨</h1>
    <form @submit.prevent="submitRoadmap" class="roadmap-form">
      <div class="form-group">
        <label for="title">🖋️ Tiêu đề Roadmap</label>
        <input type="text" id="title" v-model="roadmap.title" placeholder="Nhập tiêu đề Roadmap" required />
      </div>

      <div class="form-group">
        <label for="introText">📝 Giới thiệu</label>
        <textarea id="introText" v-model="roadmap.introText" placeholder="Nhập giới thiệu cho roadmap" rows="3" required></textarea>
      </div>

      <div class="phases">
        <h2>📈 Các Giai Đoạn</h2>
        <div class="phase" v-for="(phase, index) in roadmap.phases" :key="index">
          <div class="form-group">
            <label>🏷️ Tiêu đề Giai Đoạn</label>
            <input type="text" v-model="phase.title" placeholder="Nhập tiêu đề giai đoạn" required />
          </div>
          <div class="form-group">
            <label>📝 Mô tả Giai Đoạn</label>
            <textarea v-model="phase.description" placeholder="Mô tả chi tiết giai đoạn" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>⏳ Thời Gian Dự Kiến (ngày)</label>
            <input type="number" v-model="phase.timeSpan" placeholder="Thời gian dự kiến hoàn thành giai đoạn" required />
          </div>

          <div class="milestones">
            <h3>🚩 Các Mốc Quan Trọng</h3>
            <div class="milestone" v-for="(milestone, msIndex) in phase.milestones" :key="msIndex">
              <div class="form-group">
                <label>🏷️ Tiêu đề Mốc</label>
                <input type="text" v-model="milestone.title" placeholder="Nhập tiêu đề mốc" required />
              </div>

              <div class="form-group">
                  <label>📅 Sự Kiện</label>
                  <select v-model="milestone.eventName" class="form-select" @change="updateEventList(index, msIndex)">
                    <option v-for="eventType in TRACKED_EVENTS" :key="eventType.value" :value="eventType.label">
                    {{ eventType.displayName.length > 0 ? eventType.displayName : 'General' }}
                     </option>
                  </select>

                </div>
              <div class="form-group">
                <label>🔁 Lần lặp lại yêu cầu</label>
                <input type="number" v-model="milestone.repeatTimesRequired" placeholder="Số lần lặp lại sự kiện" required />
              </div>
              <div class="form-group">
                <label>⏱ Thời gian cần thiết (phút)</label>
                <input type="number" v-model="milestone.timeSpentRequired" placeholder="Thời gian cần thiết để hoàn thành mốc" required />
              </div>
              <div class="recommendations" v-if="isRecommendationAvailable(milestone.eventName) && milestone.recommendations">
  <h4>📘 Khuyến Nghị</h4>
  <div class="recommendation" v-for="(recommendation, recIndex) in milestone.recommendations" :key="recIndex">
    <select v-model="recommendation.entityType" class="hidden">
      <option :key="milestone.eventName" :value="milestone.eventName"></option>
    </select>

    <div class="form-group">
      <label>🆔 Nội dung khuyến nghị</label>
      <select v-model="recommendation.targetEntityId" class="form-select">
        <option v-for="content in getAvailableContents(milestone.eventName)" :key="content.id" :value="content.id">
          {{ content.name ?? content.title }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>🏷️ Đặc Tính</label>
      <input type="text" v-model="recommendation.trait" placeholder="Nhập đặc tính" required />
    </div>

    <div class="form-group">
      <label>📝 Mô Tả Đặc Tính</label>
      <textarea v-model="recommendation.traitDescription" placeholder="Mô tả đặc tính" rows="2" required></textarea>
    </div>

    <button type="button" class="btn remove" @click="removeRecommendation(index, msIndex, recIndex)">❌ Xóa Khuyến Nghị</button>
  </div>
  <button type="button" class="btn add" @click="addRecommendation(index, msIndex)">➕ Thêm Khuyến Nghị</button>
</div>

              <button type="button" class="btn remove" @click="removeMilestone(index, msIndex)" style="margin-top: 5px;">❌ Xóa Mốc</button>
            </div>
            <button type="button" class="btn add" @click="addMilestone(index)">➕ Thêm Mốc</button>
          </div>

          <button type="button" class="btn remove" @click="removePhase(index)" style="margin-top: 5px;">❌ Xóa Giai Đoạn</button>
          <div class="divider"></div>
        </div>
        <button type="button" class="btn add" @click="addPhase">➕ Thêm Giai Đoạn</button>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn submit" :disabled="!isFormValid">✅ Tạo Roadmap</button>
      </div>
    </form>
  </div>
</template>


<script>
import { getCourses } from "@/scripts/api/services/courseService.js";
import { getPagedMediaResources } from "@/scripts/api/services/mediaResourcesService";
import { getPagedArticles } from '@/scripts/api/services/blogService';
import { getPagedConversations } from '@/scripts/api/services/conversationService';
import { getPagedSurveys } from '@/scripts/api/services/surveysService';
import { toast } from "vue3-toastify";
import {
  TRACKED_EVENTS,
  ENTITY_TYPES,
  getEntityTypeByEventLabel
} from '@/scripts/api/services/activityLogService';
import { createRoadmap } from "@/scripts/api/services/roadmapService";
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';

export default {
  name: "roadmapCreation",
  components: { LoadingSpinner },
  data() {
    return {
      roadmap: {
        title: "",
        introText: "",
        phases: []
      },
      allCourses: [],
      allMediaResources: [],
      allArticles: [],
      allConversations: [],
      allSurveys: [],
      TRACKED_EVENTS
    };
  },
  computed: {
    isFormValid() {
        return this.roadmap.title.trim() !== '' && 
               this.roadmap.introText.trim() !== '' && 
               this.roadmap.phases.length > 0;
    }
  },
  methods: {
    updateEventList(phaseIndex, milestoneIndex) {
      const milestone = this.roadmap.phases[phaseIndex].milestones[milestoneIndex];
      milestone.entityType = getEntityTypeByEventLabel(milestone.eventName);
    },

    addPhase() {
      this.roadmap.phases.push({
        title: "",
        description: "",
        timeSpan: 0,
        milestones: []
      });
    },

    addMilestone(phaseIndex) {
      if (!this.roadmap.phases[phaseIndex].milestones) {
        this.$set(this.roadmap.phases[phaseIndex], 'milestones', []);
      }
      const newMilestone = {
        title: "",
        eventName: "",
        repeatTimesRequired: 0,
        timeSpentRequired: 0,
        recommendations: []
      };
      this.roadmap.phases[phaseIndex].milestones.push(newMilestone);
    },

    removePhase(index) {
      this.roadmap.phases.splice(index, 1);
    },

    removeMilestone(phaseIndex, milestoneIndex) {
      this.roadmap.phases[phaseIndex].milestones.splice(milestoneIndex, 1);
    },

    addRecommendation(phaseIndex, milestoneIndex) {
      const phase = this.roadmap.phases[phaseIndex];
      const milestone = phase && phase.milestones[milestoneIndex];
      if (milestone) {
        const newRecommendation = {
          targetEntityId: "00000000-0000-0000-0000-000000000000",
          entityType: getEntityTypeByEventLabel(milestone.eventName),
          milestoneId: "00000000-0000-0000-0000-000000000000",
          trait: "",
          traitDescription: ""
        };
        if (!milestone.recommendations) {
          this.$set(milestone, 'recommendations', []);
        }
        milestone.recommendations.push(newRecommendation);
      } else {
        console.error("Invalid phaseIndex or milestoneIndex");
      }
    },

    removeRecommendation(phaseIndex, milestoneIndex, recommendationIndex) {
      this.roadmap.phases[phaseIndex].milestones[milestoneIndex].recommendations.splice(recommendationIndex, 1);
    },

    isRecommendationAvailable(eventLabel) {
      switch (getEntityTypeByEventLabel(eventLabel)) {
        case ENTITY_TYPES.Course.en:
        case ENTITY_TYPES.MediaResource.en:
        case ENTITY_TYPES.Article.en:
        case ENTITY_TYPES.Conversation.en:
        case ENTITY_TYPES.Survey.en:
          return true;
        default:
          return false;
      }
    },

    getAvailableContents(eventLabel) {
      switch (getEntityTypeByEventLabel(eventLabel)) {
        case ENTITY_TYPES.Course.en:
          return this.allCourses;
        case ENTITY_TYPES.MediaResource.en:
          return this.allMediaResources;
        case ENTITY_TYPES.Article.en:
          return this.allArticles;
        case ENTITY_TYPES.Conversation.en:
          return this.allConversations;
        case ENTITY_TYPES.Survey.en:
          return this.allSurveys;
        default:
          return [];
      }
    },

    validateRoadmapBasicInfo() {
      if (!this.roadmap.title.trim()) {
        toast.error("Vui lòng nhập tiêu đề roadmap!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }
      if (this.roadmap.title.length > 200) {
        toast.error("Tiêu đề roadmap không được vượt quá 200 ký tự!");
        return false;
      }
      if (!this.roadmap.introText.trim()) {
        toast.error("Vui lòng nhập giới thiệu roadmap!");
        return false;
      }
      if (this.roadmap.introText.length > 1000) {
        toast.error("Giới thiệu roadmap không được vượt quá 1000 ký tự!");
        return false;
      }
      return true;
    },

    validatePhases() {
      if (this.roadmap.phases.length === 0) {
        toast.error("Vui lòng thêm ít nhất một giai đoạn!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }

      for (let i = 0; i < this.roadmap.phases.length; i++) {
        const phase = this.roadmap.phases[i];
        
        if (!phase.title.trim()) {
          toast.error(`Vui lòng nhập tiêu đề cho giai đoạn ${i + 1}!`);
          return false;
        }
        if (phase.title.length > 100) {
          toast.error(`Tiêu đề giai đoạn ${i + 1} không được vượt quá 100 ký tự!`);
          return false;
        }
        if (!phase.description.trim()) {
          toast.error(`Vui lòng nhập mô tả cho giai đoạn ${i + 1}!`);
          return false;
        }
        if (phase.timeSpan <= 0) {
          toast.error(`Thời gian dự kiến của giai đoạn ${i + 1} phải lớn hơn 0!`);
          return false;
        }
        
        if (!this.validateMilestones(phase.milestones, i)) {
          return false;
        }
      }
      return true;
    },

    validateMilestones(milestones, phaseIndex) {
      if (!milestones || milestones.length === 0) {
        toast.error(`Vui lòng thêm ít nhất một mốc cho giai đoạn ${phaseIndex + 1}!`);
        return false;
      }

      for (let i = 0; i < milestones.length; i++) {
        const milestone = milestones[i];
        
        if (!milestone.title.trim()) {
          toast.error(`Vui lòng nhập tiêu đề cho mốc ${i + 1} của giai đoạn ${phaseIndex + 1}!`);
          return false;
        }
        if (!milestone.eventName) {
          toast.error(`Vui lòng chọn sự kiện cho mốc ${i + 1} của giai đoạn ${phaseIndex + 1}!`);
          return false;
        }
        if (milestone.repeatTimesRequired <= 0) {
          toast.error(`Số lần lặp lại của mốc ${i + 1} giai đoạn ${phaseIndex + 1} phải lớn hơn 0!`);
          return false;
        }
        if (milestone.timeSpentRequired <= 0) {
          toast.error(`Thời gian cần thiết của mốc ${i + 1} giai đoạn ${phaseIndex + 1} phải lớn hơn 0!`);
          return false;
        }

        if (this.isRecommendationAvailable(milestone.eventName) && 
            milestone.recommendations && 
            milestone.recommendations.length > 0) {
            if (!this.validateRecommendations(milestone.recommendations, phaseIndex, i)) {
                return false;
            }
        }
      }
      return true;
    },

    validateRecommendations(recommendations, phaseIndex, milestoneIndex) {
      if (!recommendations || recommendations.length === 0) {
        return true;
      }

      for (let i = 0; i < recommendations.length; i++) {
        const rec = recommendations[i];
        
        if (!rec.targetEntityId || rec.targetEntityId === "00000000-0000-0000-0000-000000000000") {
          toast.error(`Vui lòng chọn nội dung khuyến nghị ${i + 1} cho mốc ${milestoneIndex + 1} của giai đoạn ${phaseIndex + 1}!`);
          return false;
        }
        if (!rec.trait.trim()) {
          toast.error(`Vui lòng nhập đặc tính cho khuyến nghị ${i + 1} của mốc ${milestoneIndex + 1} giai đoạn ${phaseIndex + 1}!`);
          return false;
        }
        if (!rec.traitDescription.trim()) {
          toast.error(`Vui lòng nhập mô tả đặc tính cho khuyến nghị ${i + 1} của mốc ${milestoneIndex + 1} giai đoạn ${phaseIndex + 1}!`);
          return false;
        }
      }
      return true;
    },

    async submitRoadmap() {
      if (!this.validateRoadmapBasicInfo() || !this.validatePhases()) {
        return;
      }

      try {
        this.$refs.loadingSpinner.showSpinner();
        console.log("Sending roadmap data:", this.roadmap);
        await createRoadmap(this.roadmap);
        
        this.$router.push({ 
            name: 'ManageAdvisorContent',
            query: { 
                createSuccess: true,
                message: 'Tạo roadmap thành công!'
            }
        });
      } catch (error) {
        console.error(error);
        toast.error("Tạo roadmap thất bại! " + (error.message || ''), {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    }
  },
  mounted() {
    const pageConfig = { pageIndex: 0, pageSize: 10 };
    Promise.all([
        getCourses(pageConfig),
        getPagedMediaResources(pageConfig),
        getPagedArticles(pageConfig),
        getPagedConversations(pageConfig),
        getPagedSurveys(pageConfig)
    ]).then(([courses, media, articles, conversations, surveys]) => {
        this.allCourses = courses.items;
        this.allMediaResources = media.items;
        this.allArticles = articles.items;
        this.allConversations = conversations.items;
        this.allSurveys = surveys.items;
    });
  }
};
</script>


  
<style scoped>
body {
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
}
  
.title {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  .form-group label {
    font-weight: bold;
    color: #555;
  }
  
  .form-group input,
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  textarea {
    resize: none;
  }
  
  .divider {
    border-top: 1px dashed #ddd;
    margin: 15px 0;
  }
  
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .btn.add {
    background: #007bff;
    color: white;
    display: block;
    margin: 0 auto;
  }
  
  .btn.remove {
    background: #ff6868;
    color: white;
  }
  
  .btn.submit {
    margin-top: 20px;
    background: #28a745;
    color: white;
    width: 100%;
    text-align: center;
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  
  .btn.submit:disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>  