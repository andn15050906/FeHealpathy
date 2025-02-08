<template>
    <div class="container mt-4">
        <div v-if="showAddMusic">
            <AddMusic @cancel="toggleAddMusic" @add-music="createMedia" />
        </div>
        <div v-else-if="showEditMusic">
            <EditMusic :music="selectedMusic" @cancel="toggleEditMusic" @edit-music="updateMedia" />
        </div>
        <div v-else>
            <MediaList :mediaFiles="mediaFiles" @edit-media="editMedia" @delete-media="deleteMedia" />
            <div class="d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-primary" @click="toggleAddMusic">
                    <i class="fas fa-plus me-1"></i> Add Media
                </button>
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @go-to-page="fetchMediaResources" />
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
import AddMusic from "../../../components/MediaResourceComponents/AddMusic.vue";
import EditMusic from "../../../components/MediaResourceComponents/EditMusic.vue";
import {
    getPagedMediaResources,
    createMediaResource,
    updateMediaResource,
    deleteMediaResource,
} from "../../../scripts/api/services/mediaResourcesService";
import DeleteConfirmPopup from "../../../components/Common/Popup/DeleteConfirmPopup.vue";

export default {
    components: { MediaList, Pagination, AddMusic, EditMusic, DeleteConfirmPopup },
    data() {
        return {
            mediaFiles: [],
            currentPage: 1,
            totalPages: 1,
            showAddMusic: false,
            showEditMusic: false,
            selectedMusic: null,
            selectedMusicIndex: null,
            showDeletePopup: false,
            mediaToDelete: null
        };
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
                    PageSize: 10
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
        toggleAddMusic() {
            this.showAddMusic = !this.showAddMusic;
        },
        toggleEditMusic() {
            this.showEditMusic = false;
            this.selectedMusic = null;
        },
        async createMedia(newMusic) {
            try {
                await createMediaResource(newMusic);
                this.showAddMusic = false;
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media added successfully!");
            } catch (error) {
                toast.error("Failed to add media.");
            }
        },
        async updateMedia(updatedMusicFormData) {
            try {
                await updateMediaResource(updatedMusicFormData);
                this.showEditMusic = false;
                this.selectedMusic = null;
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media updated successfully!");
            } catch (error) {
                toast.error("Failed to update media.");
            }
        },
        editMedia(media, index) {
            this.selectedMusic = { ...media };
            this.selectedMusicIndex = index;
            this.showEditMusic = true;
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