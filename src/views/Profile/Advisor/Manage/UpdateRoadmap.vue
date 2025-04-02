<template>
    <div class="roadmap-creation">
      <h1 class="title">✨ Update Roadmap ✨</h1>
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
          <div class="phase" v-for="(phase, index) in roadmap.phases?.sort((a, b) => a.index - b.index)" :key="index">
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
                  <select v-model="milestone.eventName" class="form-select">
                    <option v-for="eventType in TRACKED_EVENTS" :key="eventType.value" :value="eventType.label" @change="updateEventList(index, msIndex, milestone.eventName)">
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
                      <option v-for="content in getAvailableContents(index, msIndex, recIndex, milestone.eventName)" :key="content.id" :value="content.id">
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
                    <button type="button" class="btn remove" @click="removeRecommendation(index, msIndex, recIndex)" style="margin-top: 5px;">❌ Xóa Khuyến Nghị</button>
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
          <button type="submit" class="btn submit">✅ Cập nhật Roadmap</button>
        </div>
      </form>
    </div>
  </template>
  
<script setup>
  import { getCourses } from "@/scripts/api/services/courseService.js";
  import { getPagedMediaResources } from "@/scripts/api/services/mediaResourcesService";
  import { getPagedArticles } from '@/scripts/api/services/blogService';
  import { getPagedConversations } from '@/scripts/api/services/conversationService';
  import { getPagedSurveys } from '@/scripts/api/services/surveysService';
  import { TRACKED_EVENTS, ENTITY_TYPES, getEntityTypeByEventLabel } from '@/scripts/api/services/activityLogService';
  import { updateRoadmap, getRoadmapById } from '@/scripts/api/services/roadmapService';
  import { ref } from 'vue';
  import { onMounted } from "vue";
  import { toast } from "vue3-toastify";
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();

  const allCourses = ref([]);
  const allMediaResources = ref([]);
  const allArticles = ref([]);
  const allConversations = ref([]);
  const allSurveys = ref([]);

  const roadmap = ref({
    id: "",
    title: "",
    introText: "",
    phases: [],
  });
  
  async function fetchRoadmapData() {
    try {
      const roadmapId = route.params.id;
      const response = await getRoadmapById(roadmapId);
      roadmap.value = {
        id: response.id,
        title: response.title,
        introText: response.introText,
        phases: response.phases || [],
      };
      console.log("Roadmap Data:", roadmap.value);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast.error("Không thể tải dữ liệu roadmap");
    }
  }

  function addPhase() {
    roadmap.value.phases.push({
      title: "",
      description: "",
      timeSpan: 0,
      milestones: [],
    });
  }
  
  function removePhase(index) {
    roadmap.value.phases.splice(index, 1);
  }
    
  function removeMilestone(phaseIndex, milestoneIndex) {
    this.roadmap.phases[phaseIndex].milestones.splice(milestoneIndex, 1);
  }

  function addMilestone(phaseIndex) {
    const newMilestone = {
      title: "",
      eventName: "",
      repeatTimesRequired: 0,
      timeSpentRequired: 0,
      recommendations: []
    };
    roadmap.value.phases[phaseIndex].milestones.push(newMilestone);
  }

  function addRecommendation(phaseIndex, milestoneIndex) {
    const phase = roadmap.value.phases[phaseIndex];
    const milestone = phase && phase.milestones[milestoneIndex];
    if (milestone) {
      const newRecommendation = {
        targetEntityId: "00000000-0000-0000-0000-000000000000",
        entityType: "",
        milestoneId: "00000000-0000-0000-0000-000000000000",
        trait: "",
        traitDescription: ""
      };
      if (!milestone.recommendations) {
        milestone.recommendations = [];
      }
      milestone.recommendations.push(newRecommendation);
    } else {
      console.error("Invalid phaseIndex or milestoneIndex");
    }
  }

  function removeRecommendation(phaseIndex, milestoneIndex, recommendationIndex) {
      this.roadmap.phases[phaseIndex].milestones[milestoneIndex].recommendations.splice(recommendationIndex, 1);
  }
  
  async function submitRoadmap() {
    try {
      console.log("Dữ liệu roadmap gửi đi: ", roadmap.value);
      
      await updateRoadmap(roadmap.value); 
      toast.success("Cập nhật roadmap thành công");
      router.push('/advisor/content');
    } catch (error) {
      toast.error("Cập nhật roadmap thất bại");
      console.error('Error updating roadmap:', error);
    }
  }

  function isRecommendationAvailable(eventLabel) {
    switch(getEntityTypeByEventLabel(eventLabel)) {
      case ENTITY_TYPES.Course.en: return true;
      case ENTITY_TYPES.MediaResource.en: return true;
      case ENTITY_TYPES.Article.en: return true;
      case ENTITY_TYPES.Conversation.en: return true;
      case ENTITY_TYPES.Survey.en: return true;
    }
    return false;
  }

  function getPreloadedEntities(eventLabel) {
    switch(eventLabel) {
      case ENTITY_TYPES.Course.en: return allCourses.value;
      case ENTITY_TYPES.MediaResource.en: return allMediaResources.value;
      case ENTITY_TYPES.Article.en: return allArticles.value;
      case ENTITY_TYPES.Conversation.en: return allConversations.value;
      case ENTITY_TYPES.Survey.en: return allSurveys.value;
    }
    return [];
  }

  function updateEventList(phaseIndex, milestoneIndex) {
    const milestone = roadmap.value.phases[phaseIndex].milestones[milestoneIndex];
    milestone.entityType = getEntityTypeByEventLabel(milestone.eventName);
  }
  
  function getAvailableContents(phaseIndex, milestoneIndex, recIndex, eventLabel) {
    //const recommendation = roadmap.value.phases[phaseIndex].milestones[milestoneIndex].recommendations[recIndex];
    return getPreloadedEntities(getEntityTypeByEventLabel(eventLabel));
  }
  
  onMounted(async () => {
    await fetchRoadmapData();
    
    getCourses({ pageIndex: 0, pageSize: 10 }).then(res => allCourses.value = res.items);
    getPagedMediaResources({ pageIndex: 0, pageSize: 10 }).then(res => allMediaResources.value = res.items);
    getPagedArticles({ pageIndex: 0, pageSize: 10 }).then(res => allArticles.value = res.items);
    getPagedConversations({ pageIndex: 0, pageSize: 10 }).then(res => allConversations.value = res.items);
    getPagedSurveys({ pageIndex: 0, pageSize: 10 }).then(res => allSurveys.value = res.items);
  })
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
