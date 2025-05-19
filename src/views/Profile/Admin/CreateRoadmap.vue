<template>
  <div class="roadmap-creation">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="title">✨ Tạo Roadmap Mới ✨</h1>
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

      <div class="mb-6">
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
      <v-btn color="primary" block large type="submit">Lưu Roadmap</v-btn>
    </v-container>
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
        introText: [],
        phases: []
      },
      allCourses: [],
      allMediaResources: [],
      allArticles: [],
      allConversations: [],
      allSurveys: [],
      TRACKED_EVENTS,
      iconOptions: [
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
      ],
    };
  },
  computed: {
    isFormValid() {
        return this.roadmap.title.trim() !== '' && 
               this.roadmap.introText.length > 0 && 
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
      if (this.roadmap.introText.length === 0) {
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
    },

    addIntro() {
      this.roadmap.introText.push("");
    },

    removeIntro(index) {
      this.roadmap.introText.splice(index, 1);
    },

    addTip(index) {
      if (!this.roadmap.phases[index].tips) {
        this.$set(this.roadmap.phases[index], 'tips', []);
      }
      this.roadmap.phases[index].tips.push({
        title: "",
        content: "",
        icon: ""
      });
    },

    removeTip(phaseIndex, tipIndex) {
      this.roadmap.phases[phaseIndex].tips.splice(tipIndex, 1);
    },

    addAction(index) {
      if (!this.roadmap.phases[index].actions) {
        this.$set(this.roadmap.phases[index], 'actions', []);
      }
      this.roadmap.phases[index].actions.push({
        title: "",
        description: "",
        duration: ""
      });
    },

    removeAction(phaseIndex, actionIndex) {
      this.roadmap.phases[phaseIndex].actions.splice(actionIndex, 1);
    },

    addCriteria(index) {
      if (!this.roadmap.phases[index].completionCriteria) {
        this.$set(this.roadmap.phases[index], 'completionCriteria', []);
      }
      this.roadmap.phases[index].completionCriteria.push({
        title: "",
        description: ""
      });
    },

    removeCriteria(phaseIndex, criteriaIndex) {
      this.roadmap.phases[phaseIndex].completionCriteria.splice(criteriaIndex, 1);
    },

    showColorPicker(pIdx) {
      if (!this.roadmap.phases[pIdx]._showColorPicker) {
        this.$set(this.roadmap.phases[pIdx], '_showColorPicker', true);
      } else {
        this.roadmap.phases[pIdx]._showColorPicker = !this.roadmap.phases[pIdx]._showColorPicker;
      }
    },
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