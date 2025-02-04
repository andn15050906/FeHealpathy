<template>
    <div class="container my-5">
        <div v-if="!isCreatingSurvey && !isEditingSurvey">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Survey Management</h1>
                <button class="btn btn-primary" @click="isCreatingSurvey = true">
                    <i class="fas fa-plus"></i> Add Survey
                </button>
            </div>
            <div class="list-group">
                <div v-for="survey in surveys" :key="survey.id"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">{{ survey.name }}</h5>
                        <p class="mb-1 text-muted">{{ survey.description }}</p>
                        <small class="text-muted">
                            Questions: {{ survey.questions ? survey.questions.length : 0 }}
                        </small>
                    </div>
                    <div>
                        <button class="btn btn-warning btn-sm me-2" @click="editSurvey(survey)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" @click="confirmDelete(survey.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center align-items-center mt-3">
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
            </div>
        </div>

        <CreateSurvey v-if="isCreatingSurvey" @cancel="cancelCreate" @surveyCreated="handleSurveyCreated" />

        <EditSurvey v-if="isEditingSurvey" :surveyData="selectedSurvey" @cancel="cancelEdit"
            @surveyUpdated="handleSurveyUpdated" />

        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this survey?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteSurvey">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getPagedSurveys, deleteSurvey } from "../../scripts/api/services/surveysService";
import { Modal } from "bootstrap";
import CreateSurvey from "../../components/SurveyComponents/CreateSurvey.vue";
import EditSurvey from "../../components/SurveyComponents/EditSurvey.vue";
import Pagination from "../../components/Common/Pagination.vue";

export default {
    components: { CreateSurvey, EditSurvey, Pagination },
    data() {
        return {
            surveys: [],
            isCreatingSurvey: false,
            isEditingSurvey: false,
            selectedSurvey: null,
            surveyToDelete: null,
            deleteModal: null,
            currentPage: 1,
            totalPages: 1,
        };
    },
    methods: {
        async fetchSurveys(page = 1) {
            try {
                const response = await getPagedSurveys({ pageIndex: page - 1, pageSize: 10 });
                this.surveys = response.items;
                this.currentPage = response.pageIndex + 1;
                this.totalPages = response.pageCount;
            } catch (error) {
                console.error("Error fetching surveys", error);
            }
        },
        editSurvey(survey) {
            this.selectedSurvey = survey;
            this.isEditingSurvey = true;
        },
        confirmDelete(id) {
            this.surveyToDelete = id;
            this.deleteModal.show();
        },
        async deleteSurvey() {
            if (!this.surveyToDelete) return;
            try {
                await deleteSurvey(this.surveyToDelete);
                this.surveyToDelete = null;
                this.deleteModal.hide();
                this.fetchSurveys(this.currentPage);
            } catch (error) {
                console.error("Error deleting survey", error);
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
        this.deleteModal = new Modal(document.getElementById("deleteConfirmModal")); // Need common confirm modal
    },
};
</script>

<style scoped>
.list-group-item {
    padding: 1rem;
}
</style>