<template>
  <div class="roadmap-creation">
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
              <!-- <div class="form-group">
                <label>📅 Sự Kiện</label>
                <input type="text" v-model="milestone.eventName" placeholder="Tên sự kiện liên quan" required />
              </div> -->
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
        <button type="submit" class="btn submit">✅ Tạo Roadmap</button>
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
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import {
  TRACKED_EVENTS,
  ENTITY_TYPES,
  getEntityTypeByEventLabel
} from '@/scripts/api/services/activityLogService';
import { createRoadmap } from "@/scripts/api/services/roadmapService";

export default {
  name: "roadmapCreation",
  components: { Multiselect },
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
      TRACKED_EVENTS // expose to template
    };
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

    async submitRoadmap() {
      try {
        console.log("Sending roadmap data:", this.roadmap);
        await createRoadmap(this.roadmap);
        toast.success("Tạo roadmap thành công!");
        this.$router.push({ name: 'ManageAdvisorContent' });
      } catch (error) {
        console.error(error);
        toast.error("Tạo roadmap thất bại!");
      }
    }
  },
  mounted() {
    getCourses({ pageIndex: 0, pageSize: 10 }).then(res => this.allCourses = res.items);
    getPagedMediaResources({ pageIndex: 0, pageSize: 10 }).then(res => this.allMediaResources = res.items);
    getPagedArticles({ pageIndex: 0, pageSize: 10 }).then(res => this.allArticles = res.items);
    getPagedConversations({ pageIndex: 0, pageSize: 10 }).then(res => this.allConversations = res.items);
    getPagedSurveys({ pageIndex: 0, pageSize: 10 }).then(res => this.allSurveys = res.items);
  }
};
</script>


  
<style scoped>
body {
    font-family: 'Arial', sans-serif;
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
  
  .image-preview img {
    width: 100%;
    max-width: 200px;
    border-radius: 10px;
    margin-top: 10px;
  }
  
  .sections {
    margin-top: 20px;
  }
  
  .section {
    background: #fafafa;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
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
  .multiselect {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
}

.multiselect__tags {
  min-height: 36px;
  display: flex;
  align-items: center;
}

.multiselect__input {
  font-size: 1rem;
  margin-left: 5px;
  padding: 5px;
  border: none;
  outline: none;
}

.multiselect--active {
  border-color: #007bff;
}

.multiselect__tag {
  background: #007bff;
  color: #fff;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 2px 5px 2px 0;
}

.multiselect__tag:hover {
  background: #0056b3;
}

.multiselect__clear {
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
}

.multiselect__clear:hover {
  color: #0056b3;
}
</style>  