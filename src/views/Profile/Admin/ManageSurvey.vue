<template>
    <div class="container my-5">
        <div v-if="!isCreatingSurvey && !isEditingSurvey">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Quản lý khảo sát</h1>
                <button class="btn btn-primary" @click="isCreatingSurvey = true">
                    <i class="fas fa-plus"></i> Thêm khảo sát
                </button>
            </div>
            <div v-if="surveys && surveys.length" class="list-group">
                <div v-for="survey in surveys" :key="survey.id"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">{{ survey.name }}</h5>
                        <p class="mb-1 text-muted">{{ survey.description }}</p>
                        <small class="text-muted">
                            Câu hỏi: {{ survey.questions ? survey.questions.length : 0 }}
                        </small>
                    </div>
                    <div>
                        <button class="btn btn-warning btn-md me-2" @click="editSurvey(survey)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-md" @click="confirmDelete(survey.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center mb-3">
                <p>Không tìm thấy khảo sát.</p>
            </div>
            <div class="d-flex justify-content-center align-items-center mt-3">
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="goToPage" />
            </div>
        </div>

        <CreateSurvey v-if="isCreatingSurvey" @cancel="cancelCreate" @surveyCreated="handleSurveyCreated" />
        <EditSurvey v-if="isEditingSurvey" :surveyData="selectedSurvey" @cancel="cancelEdit"
            @surveyUpdated="handleSurveyUpdated" />

        <DeleteConfirmPopup v-model:isVisible="showDeleteConfirm" message="Bạn có chắc chắn muốn xóa khảo sát này?"
            url="" @confirmDelete="handleDeleteConfirm" />
    </div>
</template>

<script>
import { getPagedSurveys, deleteSurvey } from "@/scripts/api/services/surveysService";
import CreateSurvey from "@/components/SurveyComponents/CreateSurvey.vue";
import EditSurvey from "@/components/SurveyComponents/EditSurvey.vue";
import Pagination from "@/components/Common/Pagination.vue";
import DeleteConfirmPopup from "@/components/Common/Popup/DeleteConfirmPopup.vue";

export default {
    components: { CreateSurvey, EditSurvey, Pagination, DeleteConfirmPopup },
    data() {
        return {
            surveys: [],
            isCreatingSurvey: false,
            isEditingSurvey: false,
            selectedSurvey: null,
            surveyToDelete: null,
            showDeleteConfirm: false,
            currentPage: 1,
            totalPages: 1,
        };
    },
    methods: {
        async fetchSurveys(page = 1) {
            try {
                const response = await getPagedSurveys({ pageIndex: page - 1, pageSize: 10 });
                this.surveys = [];
                await new Promise((resolve) => setTimeout(resolve, 100));
                this.surveys = response.items || [];
                this.currentPage = response.pageIndex + 1 || 1;
                this.totalPages = response.pageCount || 1;
            } catch (error) { }
        },
        editSurvey(survey) {
            this.selectedSurvey = survey;
            this.isEditingSurvey = true;
        },
        confirmDelete(id) {
            this.surveyToDelete = id;
            this.showDeleteConfirm = true;
        },
        async handleDeleteConfirm(confirm) {
            if (confirm && this.surveyToDelete) {
                try {
                    await deleteSurvey(this.surveyToDelete);
                    this.surveyToDelete = null;
                    this.showDeleteConfirm = false;
                    await this.fetchSurveys(this.currentPage);
                } catch (error) { }
            } else {
                this.showDeleteConfirm = false;
            }
        },
        handleSurveyCreated() {
            this.isCreatingSurvey = false;
            this.fetchSurveys(this.currentPage);
        },
        cancelCreate() {
            this.isCreatingSurvey = false;
        },
        handleSurveyUpdated() {
            this.isEditingSurvey = false;
            this.selectedSurvey = null;
            this.fetchSurveys(this.currentPage);
        },
        cancelEdit() {
            this.isEditingSurvey = false;
            this.selectedSurvey = null;
        },
        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.fetchSurveys(page);
        },
    },
    mounted() {
        this.fetchSurveys();
    },
};
</script>

<style scoped>
.list-group-item {
    padding: 1rem;
}
</style>