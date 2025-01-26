<template>
    <div class="container mt-4">
        <h3 class="p-2">Media Control</h3>
        <div v-if="showAddMusic">
            <AddMusic @cancel="toggleAddMusic" @add-music="createMedia" />
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
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import MediaList from "../../components/MediaResourceComponents/MediaList.vue";
import Pagination from "../../components/Common/Pagination.vue";
import AddMusic from "../../components/MediaResourceComponents/AddMusic.vue";
import EditMusic from "../../components/MediaResourceComponents/EditMusic.vue";
import {
    getPagedMediaResources,
    createMediaResource,
    updateMediaResource,
    deleteMediaResource,
} from "../../services/mediaResourcesService";

export default {
    components: { MediaList, Pagination, AddMusic, EditMusic },
    data() {
        return {
            mediaFiles: [],
            currentPage: 1,
            totalPages: 1,
            showAddMusic: false,
            showEditMusic: false,
            selectedMusic: null,
            selectedMusicIndex: null,
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
                    PageSize: 10,
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
            this.showEditMusic = !this.showEditMusic;
        },
        async createMedia(newMusic) {
            try {
                const response = await createMediaResource(newMusic);
                this.mediaFiles.push(response.data);
                this.showAddMusic = false;
                await this.fetchMediaResources(this.currentPage);
                toast.success("Media added successfully!");
            } catch (error) {
                toast.error("Failed to add media.");
            }
        },
        async updateMedia(updatedMusic) {
            try {
                await updateMediaResource(updatedMusic.id, updatedMusic);
                if (this.selectedMusicIndex !== null) {
                    this.$set(this.mediaFiles, this.selectedMusicIndex, updatedMusic);
                }
                this.showEditMusic = false;
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
        async deleteMedia(mediaId, index) {
            if (confirm("Are you sure you want to delete this media?")) {
                try {
                    await deleteMediaResource(mediaId);
                    this.mediaFiles.splice(index, 1);
                    await this.fetchMediaResources(this.currentPage);
                    toast.success("Media deleted successfully!");
                } catch (error) {
                    toast.error("Failed to delete media.");
                }
            }
        },
    },
    mounted() {
        this.fetchMediaResources();
    },
};
</script>