<template>
    <div class="container">
        <header class="mb-4 text-center">
            <h2 class="mb-2" style="font-weight: bold;">Quản lý phương tiện truyền thông</h2>
        </header>

        <LoadingSpinner ref="loadingSpinner" />

        <transition name="fade" mode="out-in">
            <div v-if="showAddMedia" key="add">
                <div class="shadow-sm">
                    <div class="body">
                        <AddMedia @cancel="toggleAddMedia" @add-media="createMedia" />
                    </div>
                </div>
            </div>

            <div v-else-if="showEditMedia" key="edit">
                <div class="shadow-sm">
                    <div class="body">
                        <EditMedia :media="selectedMedia" @cancel="toggleEditMedia" @edit-media="updateMedia" />
                    </div>
                </div>
            </div>

            <div v-else key="list">
                <div class="shadow-sm mb-3">
                    <div class="header d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary mb-2" @click="toggleAddMedia">
                            <i class="fas fa-plus me-1"></i> Thêm mới
                        </button>
                    </div>
                    <div class="body p-0">
                        <MediaList :mediaFiles="mediaFiles" @edit-media="editMedia" @delete-media="deleteMedia" />
                    </div>
                </div>

                <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="fetchMediaResources" />
            </div>
        </transition>

        <DeleteConfirmPopup v-model:isVisible="showDeletePopup" message="Bạn có chắc chắn muốn xóa phương tiện truyền thông này?"
            url="" @confirmDelete="handleDeleteConfirm" />
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import MediaList from "../../../components/MediaResourceComponents/MediaList.vue";
import Pagination from "../../../components/Common/Pagination.vue";
import AddMedia from "../../../components/MediaResourceComponents/AddMedia.vue";
import EditMedia from "../../../components/MediaResourceComponents/EditMedia.vue";
import DeleteConfirmPopup from "../../../components/Common/Popup/DeleteConfirmPopup.vue";
import LoadingSpinner from "../../../components/Common/Popup/LoadingSpinner.vue";
import {
    getPagedMediaResources,
    createMediaResource,
    updateMediaResource,
    deleteMediaResource,
} from "../../../scripts/api/services/mediaResourcesService";

export default {
    components: {
        MediaList,
        Pagination,
        AddMedia,
        EditMedia,
        DeleteConfirmPopup,
        LoadingSpinner,
    },
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
                advisorId: userProfile?.advisorId,
            };
        },
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
                if (response) {
                    this.mediaFiles = response.items || [];
                    this.totalPages = response.pageCount || 1;
                }
            } catch (error) {
                console.error("Error fetching media resources:", error);
                this.mediaFiles = [];
                this.totalPages = 1;
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
                this.$refs.loadingSpinner.showSpinner();
                await createMediaResource(newMedia);
                this.showAddMedia = false;
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media added successfully!");
            } catch (error) {
                console.error("Failed to add media.", error);
                toast.error("Failed to add media.");
            } finally {
                this.$refs.loadingSpinner.hideSpinner();
            }
        },
        async updateMedia(updatedMediaFormData) {
            try {
                this.$refs.loadingSpinner.showSpinner();
                await updateMediaResource(updatedMediaFormData);
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media updated successfully!");
                this.showEditMedia = false;
                this.selectedMedia = null;
            } catch (error) {
                toast.error("Failed to update media.");
            } finally {
                this.$refs.loadingSpinner.hideSpinner();
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
        },
    },
    mounted() {
        this.fetchMediaResources();
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.btn {
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>