<template>
    <div class="container mt-4">
        <div v-if="showAddMedia">
            <AddMedia @cancel="toggleAddMedia" @add-media="createMedia" />
        </div>
        <div v-else-if="showEditMedia">
            <EditMedia :media="selectedMedia" @cancel="toggleEditMedia" @edit-media="updateMedia" />
        </div>
        <div v-else>
            <MediaList :mediaFiles="mediaFiles" @edit-media="editMedia" @delete-media="deleteMedia" />
            <div class="d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-primary" @click="toggleAddMedia">
                    <i class="fas fa-plus me-1"></i> Add Media
                </button>
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="fetchMediaResources" />
            </div>
        </div>
        <DeleteConfirmPopup v-model:isVisible="showDeletePopup" message="Are you sure you want to delete this media?"
            url="" @confirmDelete="handleDeleteConfirm" />
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import MediaList from "../../../components/MediaResourceComponents/MediaList.vue";
import Pagination from "../../../components/Common/Pagination.vue";
import AddMedia from "../../../components/MediaResourceComponents/AddMedia.vue";
import EditMedia from "../../../components/MediaResourceComponents/EditMedia.vue";
import {
    getPagedMediaResources,
    createMediaResource,
    updateMediaResource,
    deleteMediaResource,
} from "../../../scripts/api/services/mediaResourcesService";
import DeleteConfirmPopup from "../../../components/Common/Popup/DeleteConfirmPopup.vue";

export default {
    components: { MediaList, Pagination, AddMedia, EditMedia, DeleteConfirmPopup },
    data() {
        return {
            mediaFiles: [],
            currentPage: 1,
            totalPages: 1,
            showAddMedia: false,
            showEditMedia: false,
            selectedMedia: null,
            selectedMediaIndex: null,
            showDeletePopup: false,
            mediaToDelete: null,
        };
    },
    computed: {
        currentUser() {
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));
            return {
                id: userProfile?.id,
                advisorId: userProfile?.advisorId
            };
        }
    },
    methods: {
        async fetchMediaResources(page = 1) {
            this.currentPage = page;
            try {
                const params = {
                    Description: "",
                    Artist: "",
                    Title: "",
                    Type: null,
                    PageIndex: page - 1,
                    PageSize: 10,
                    CreatorId: this.currentUser.id,
                };
                const response = await getPagedMediaResources(params);
                if (response && response.items) {
                    this.mediaFiles = response.items;
                    this.totalPages = response.pageCount || 1;
                }
            } catch (error) {
                toast.error("Failed to fetch media resources.");
            }
        },
        toggleAddMedia() {
            this.showAddMedia = !this.showAddMedia;
        },
        toggleEditMedia() {
            this.showEditMedia = false;
            this.selectedMedia = null;
        },
        async createMedia(newMedia) {
            try {
                await createMediaResource(newMedia);
                this.showAddMedia = false;
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media added successfully!");
            } catch (error) {
                console.error("Failed to add media.");
            }
        },
        async updateMedia(updatedMediaFormData) {
            try {
                await updateMediaResource(updatedMediaFormData);
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media updated successfully!");
                this.showEditMedia = false;
                this.selectedMedia = null;
                
            } catch (error) {
                toast.error("Failed to update media.");
            }
        },
        editMedia(media, index) {
            this.selectedMedia = { ...media };
            this.selectedMediaIndex = index;
            this.showEditMedia = true;
        },
        deleteMedia(mediaId, index) {
            this.mediaToDelete = { id: mediaId, index: index };
            this.showDeletePopup = true;
        },
        async handleDeleteConfirm(confirm) {
            if (confirm && this.mediaToDelete) {
                try {
                    await deleteMediaResource(this.mediaToDelete.id);
                    this.mediaToDelete = null;
                    this.showDeletePopup = false;
                    await this.fetchMediaResources(this.currentPage);
                    toast.success("Media deleted successfully!");
                } catch (error) {
                    toast.error("Failed to delete media.");
                }
            } else {
                this.mediaToDelete = null;
                this.showDeletePopup = false;
            }
        }
    },
    mounted() {
        this.fetchMediaResources();
    }
};
</script>

<style scoped>
.table {
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.list-group-item {
    padding: 1rem;
}
</style>