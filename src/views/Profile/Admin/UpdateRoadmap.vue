<template>
    <div class="roadmap-creation">
      <LoadingSpinner ref="loadingSpinner" />
      <h1 class="title">✨ Cập nhật Roadmap ✨</h1>
      <v-container class="py-8" style="max-width: 1300px; margin: 0 auto;">
        <v-card class="pa-8 mb-8" elevation="3">
          <v-row class="mb-2">
            <v-col cols="12">
              <v-text-field v-model="roadmap.title" label="Tiêu đề Roadmap" outlined dense required />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-text-field v-model="roadmap.category" label="Danh mục (category)" outlined dense />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-textarea v-model="roadmap.description" label="Mô tả Roadmap" outlined dense required />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-text-field v-model="roadmap.steps" label="Số bước (steps)" type="number" outlined dense />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <div class="mb-2 font-weight-bold">Giới thiệu (Intro Text)</div>
              <div v-for="(intro, idx) in roadmap.introText" :key="idx" class="d-flex align-center mb-2">
                <v-text-field v-model="roadmap.introText[idx]" label="Dòng giới thiệu" outlined dense class="flex-grow-1" />
                <v-btn icon color="error" @click="removeIntro(idx)" class="ml-2"><v-icon>mdi-delete</v-icon></v-btn>
              </div>
              <v-btn color="primary" outlined small @click="addIntro"><v-icon left>mdi-plus</v-icon> Thêm dòng</v-btn>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-text-field v-model="roadmap.image" label="Link ảnh minh họa" outlined dense />
              <v-img v-if="roadmap.image" :src="roadmap.image" max-width="220" class="mt-2 rounded-lg" />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-checkbox v-model="roadmap.featured" label="Nổi bật (featured)" />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-slider v-model="roadmap.completionRate" label="Tỉ lệ hoàn thành (%)" min="0" max="100" step="1" thumb-label />
            </v-col>
          </v-row>
        </v-card>
        <div class="phases">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-timeline</v-icon>
            <span class="text-h5 font-weight-bold">Các Giai Đoạn (Phases)</span>
            <v-spacer />
            <v-btn color="success" @click="addPhase"><v-icon left>mdi-plus</v-icon> Thêm giai đoạn</v-btn>
          </div>
          <v-card v-for="(phase, pIdx) in roadmap.phases" :key="pIdx" class="mb-6 pa-6" elevation="2">
            <v-row align="center" class="mb-2">
              <v-icon color="primary" class="mr-2">mdi-flag</v-icon>
              <span class="text-h6 font-weight-bold">Giai đoạn {{ pIdx + 1 }}: {{ phase.title }}</span>
              <v-spacer />
              <v-btn icon color="error" @click="removePhase(pIdx)"><v-icon>mdi-delete</v-icon></v-btn>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12">
                <v-text-field v-model="phase.title" label="Tiêu đề giai đoạn" outlined dense />
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" md="6">
                <v-text-field v-model="phase.themeColor" label="Màu chủ đề" outlined dense readonly @click:append="() => showColorPicker(pIdx)" append-icon="mdi-chevron-down" />
                <v-menu v-model="phase._showColorPicker" :close-on-content-click="false" offset-y>
                  <v-color-picker v-model="phase.themeColor" hide-inputs mode="hexa" />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="phase.icon"
                  :items="iconOptions"
                  label="Icon (mdi-xxx)"
                  outlined
                  dense
                  clearable
                  item-text="name"
                  item-value="value"
                  :menu-props="{ maxHeight: '300px' }"
                  prepend-inner-icon="mdi-magnify"
                >
                  <template v-slot:item="{ item }">
                    <v-icon left>{{ item.value }}</v-icon>
                    <span>{{ item.name }}</span>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-icon left>{{ item.value }}</v-icon>
                    <span>{{ item.name }}</span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12">
                <v-checkbox v-model="phase.canSkip" label="Có thể bỏ qua" />
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12">
                <v-textarea v-model="phase.description" label="Mô tả giai đoạn" outlined dense />
              </v-col>
            </v-row>
            <v-row class="mb-4">
              <v-col cols="12">
                <v-textarea v-model="phase.introduction" label="Giới thiệu giai đoạn (introduction)" outlined dense />
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <div class="mb-2 font-weight-bold">Tips (Mẹo)</div>
            <v-row v-for="(tip, tIdx) in phase.tips" :key="tIdx" class="align-center mb-2">
              <v-col cols="12" md="4">
                <v-text-field v-model="tip.title" label="Tiêu đề mẹo" outlined dense />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="tip.content" label="Nội dung mẹo" outlined dense />
              </v-col>
              <v-col cols="12" md="1">
                <v-text-field v-model="tip.icon" label="Icon" outlined dense />
              </v-col>
              <v-col cols="12" md="1" class="d-flex align-center">
                <v-btn icon color="error" @click="removeTip(pIdx, tIdx)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="primary" outlined small @click="addTip(pIdx)"><v-icon left>mdi-plus</v-icon> Thêm mẹo</v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <div class="mb-2 font-weight-bold">Actions (Hành động)</div>
            <v-row v-for="(action, aIdx) in phase.actions" :key="aIdx" class="align-center mb-2">
              <v-col cols="12" md="4">
                <v-text-field v-model="action.title" label="Tiêu đề hành động" outlined dense />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field v-model="action.description" label="Mô tả hành động" outlined dense />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field v-model="action.duration" label="Thời lượng" outlined dense />
              </v-col>
              <v-col cols="12" md="1" class="d-flex align-center">
                <v-btn icon color="error" @click="removeAction(pIdx, aIdx)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="primary" outlined small @click="addAction(pIdx)"><v-icon left>mdi-plus</v-icon> Thêm hành động</v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <div class="mb-2 font-weight-bold">Tiêu chí hoàn thành (Completion Criteria)</div>
            <v-row v-for="(cri, cIdx) in phase.completionCriteria" :key="cIdx" class="align-center mb-2">
              <v-col cols="12" md="5">
                <v-text-field v-model="cri.title" label="Tiêu đề tiêu chí" outlined dense />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="cri.description" label="Mô tả tiêu chí" outlined dense />
              </v-col>
              <v-col cols="12" md="1" class="d-flex align-center">
                <v-btn icon color="error" @click="removeCriteria(pIdx, cIdx)"><v-icon>mdi-delete</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="primary" outlined small @click="addCriteria(pIdx)"><v-icon left>mdi-plus</v-icon> Thêm tiêu chí</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-container>
      <v-btn color="primary" block large type="submit" @click="submitRoadmap">Cập nhật Roadmap</v-btn>
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
  import { ref, computed } from 'vue';
  import { onMounted } from "vue";
  import { toast } from "vue3-toastify";
  import { useRouter, useRoute } from 'vue-router';
  import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue';
  
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
    introText: [],
    category: "",
    description: "",
    steps: 0,
    image: "",
    featured: false,
    completionRate: 0,
    phases: [],
  });
  
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
    return roadmap.value.title.trim() !== '' && 
           roadmap.value.introText.length > 0 && 
           roadmap.value.phases.length > 0;
  });

  const iconOptions = [
    { name: 'Flag', value: 'mdi-flag' },
    { name: 'Star', value: 'mdi-star' },
    { name: 'Check', value: 'mdi-check' },
    { name: 'Trophy', value: 'mdi-trophy' },
    { name: 'Lightbulb', value: 'mdi-lightbulb' },
    { name: 'Heart', value: 'mdi-heart' },
    { name: 'Fire', value: 'mdi-fire' },
    { name: 'Rocket', value: 'mdi-rocket' },
    { name: 'Book', value: 'mdi-book' },
    { name: 'Account', value: 'mdi-account' },
    { name: 'Calendar', value: 'mdi-calendar' },
    { name: 'Clock', value: 'mdi-clock' },
    { name: 'School', value: 'mdi-school' },
    { name: 'Brain', value: 'mdi-brain' },
    { name: 'Leaf', value: 'mdi-leaf' },
    { name: 'Run', value: 'mdi-run' },
    { name: 'Meditation', value: 'mdi-meditation' },
    { name: 'Music', value: 'mdi-music' },
    { name: 'Sleep', value: 'mdi-sleep' },
    { name: 'Smile', value: 'mdi-emoticon-happy' },
  ];

  async function fetchRoadmapData() {
    try {
      const roadmapId = route.params.id;
      const response = await getRoadmapById(roadmapId);
      roadmap.value = {
        id: response.id,
        title: response.title,
        introText: response.introText,
        category: response.category,
        description: response.description,
        steps: response.steps,
        image: response.image,
        featured: response.featured,
        completionRate: response.completionRate,
        phases: response.phases || [],
      };
      console.log("Dữ liệu roadmap:", roadmap.value);
    } catch (error) {
      console.error("Lỗi tải dữ liệu roadmap:", error);
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
      console.error("Pha hoặc mốc không hợp lệ");
    }
  }

  function removeRecommendation(phaseIndex, milestoneIndex, recommendationIndex) {
      this.roadmap.phases[phaseIndex].milestones[milestoneIndex].recommendations.splice(recommendationIndex, 1);
  }
  
  async function submitRoadmap() {
    if (!validateRoadmapBasicInfo() || !validatePhases()) {
        return;
    }

    try {
        loadingSpinner.value.showSpinner();
        console.log("Dữ liệu roadmap gửi đi: ", roadmap.value);
        
        await updateRoadmap(roadmap.value);
        router.push({ 
            name: 'ManageAdvisorContent',
            query: { 
                updateSuccess: true,
                message: 'Cập nhật roadmap thành công!'
            }
        });
    } catch (error) {
        console.error('Lỗi cập nhật roadmap:', error);
        toast.error("Cập nhật roadmap thất bại! " + (error.message || ''), toastConfig);
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
    if (!roadmap.value.introText.length > 0) {
        toast.error("Vui lòng nhập giới thiệu roadmap!", toastConfig);
        return false;
    }
    if (roadmap.value.description.length > 1000) {
        toast.error("Mô tả roadmap không được vượt quá 1000 ký tự!", toastConfig);
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
            toast.error(`Tiêu đề giai đoạn ${i + 1} không được vượt quá 100 ký tự!`, toastConfig);
            return false;
        }
        if (!phase.description.trim()) {
            toast.error(`Vui lòng nhập mô tả cho giai đoạn ${i + 1}!`, toastConfig);
            return false;
        }
        if (phase.timeSpan <= 0) {
            toast.error(`Thời gian dự kiến của giai đoạn ${i + 1} phải lớn hơn 0!`, toastConfig);
            return false;
        }
        
        if (!validateMilestones(phase.milestones, i)) {
            return false;
        }
    }
    return true;
  }

  function validateMilestones(milestones, phaseIndex) {
    if (!milestones || milestones.length === 0) {
        toast.error(`Vui lòng thêm ít nhất một mốc cho giai đoạn ${phaseIndex + 1}!`, toastConfig);
        return false;
    }

    for (let i = 0; i < milestones.length; i++) {
        const milestone = milestones[i];
        
        if (!milestone.title.trim()) {
            toast.error(`Vui lòng nhập tiêu đề cho mốc ${i + 1} của giai đoạn ${phaseIndex + 1}!`, toastConfig);
            return false;
        }
        if (!milestone.eventName) {
            toast.error(`Vui lòng chọn sự kiện cho mốc ${i + 1} của giai đoạn ${phaseIndex + 1}!`, toastConfig);
            return false;
        }
        if (milestone.repeatTimesRequired <= 0) {
            toast.error(`Số lần lặp lại của mốc ${i + 1} giai đoạn ${phaseIndex + 1} phải lớn hơn 0!`, toastConfig);
            return false;
        }
        if (milestone.timeSpentRequired <= 0) {
            toast.error(`Thời gian cần thiết của mốc ${i + 1} giai đoạn ${phaseIndex + 1} phải lớn hơn 0!`, toastConfig);
            return false;
        }

        if (isRecommendationAvailable(milestone.eventName) && 
            milestone.recommendations && 
            milestone.recommendations.length > 0) {
            if (!validateRecommendations(milestone.recommendations, phaseIndex, i)) {
                return false;
            }
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
        
        if (!rec.targetEntityId || rec.targetEntityId === "00000000-0000-0000-0000-000000000000") {
            toast.error(`Vui lòng chọn nội dung khuyến nghị ${i + 1} cho mốc ${milestoneIndex + 1} của giai đoạn ${phaseIndex + 1}!`, toastConfig);
            return false;
        }
        if (!rec.trait.trim()) {
            toast.error(`Vui lòng nhập đặc tính cho khuyến nghị ${i + 1} của mốc ${milestoneIndex + 1} giai đoạn ${phaseIndex + 1}!`, toastConfig);
            return false;
        }
        if (!rec.traitDescription.trim()) {
            toast.error(`Vui lòng nhập mô tả đặc tính cho khuyến nghị ${i + 1} của mốc ${milestoneIndex + 1} giai đoạn ${phaseIndex + 1}!`, toastConfig);
            return false;
        }
    }
    return true;
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
    return getPreloadedEntities(getEntityTypeByEventLabel(eventLabel));
  }
  
  function showColorPicker(pIdx) {
    if (!roadmap.value.phases[pIdx]._showColorPicker) {
      roadmap.value.phases[pIdx]._showColorPicker = true;
    } else {
      roadmap.value.phases[pIdx]._showColorPicker = !roadmap.value.phases[pIdx]._showColorPicker;
    }
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
  
  .btn.submit:disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
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
