<template>
    <div class="diary-list-container">
        <header class="header-section">
            <h1 class="diary-title">My Diary Entries</h1>
            <router-link to="/diary/diary-writing" class="new-entry-button">
                <span>New Entry</span>
                <svg class="add-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </router-link>
        </header>

        <div class="search-section">
            <input type="text" class="search-input" v-model="searchQuery" placeholder="Search your memories..." />
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else class="diary-entries">
            <div v-for="(entry, index) in filteredEntries" :key="entry.id" class="diary-card"
                @click="viewEntry(entry.id, entry.title)">
                <div class="diary-card-content">
                    <div class="diary-info">
                        <h2 class="entry-title">{{ entry.title }}</h2>
                        <p class="entry-date">{{ formatDate(entry.creationTime) }}</p>
                    </div>
                    <button class="delete-button" @click.stop="confirmDelete(entry.id)">Delete</button>
                </div>
            </div>
        </div>

        <DeleteConfirmPopup :message="'Are you sure you want to delete this diary entry?'" :isVisible="showDeletePopup"
            :url="entryToDeleteUrl" @confirmDelete="handleDelete" @update:isVisible="showDeletePopup = $event" />
    </div>
</template>

<script>
import DeleteConfirmPopup from '@/components/Common/DeleteConfirmPopup.vue';
import { getPagedDiaryNotes, deleteDiaryNote } from '@/services/diaryNoteService';

export default {
    name: 'DiaryList',
    components: {
        DeleteConfirmPopup
    },
    data() {
        return {
            searchQuery: '',
            showDeletePopup: false,
            entryToDelete: null,
            entryToDeleteUrl: '',
            entries: [],
            loading: true,
            error: null,
        };
    },
    computed: {
        filteredEntries() {
            return this.entries.filter(entry =>
                (entry.title && entry.title.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                (entry.creationTime && entry.creationTime.includes(this.searchQuery))
            );
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        async fetchDiaryNotes() {
            this.loading = true;
            this.errorMessage = "";
            try {
                const data = await getPagedDiaryNotes();
                console.log('data', data)
                if (data.length === 0) {
                    this.entries = [];
                    this.errorMessage = "No diary notes found.";
                } else {
                    this.entries = data.items;
                }
            } catch (error) {
                this.errorMessage = "Failed to fetch diary notes. Please try again.";
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        viewEntry(diaryId, diaryTitle) {
            this.$router.push({
                name: 'DiaryWriting', params: {
                    id: diaryId,
                    title: diaryTitle
                }
            });
        },
        confirmDelete(entryId) {
            this.entryToDelete = entryId;
            this.entryToDeleteUrl = `api/diary/${entryId}`;
            this.showDeletePopup = true;
        },
        async handleDelete(confirm) {
            if (confirm && this.entryToDelete !== null) {
                try {
                    await deleteDiaryNote(this.entryToDelete);

                    this.entries = this.entries.filter(entry => entry.id !== this.entryToDelete);
                    alert("Diary entry deleted successfully.");
                } catch (error) {
                    alert("Failed to delete diary entry. Please try again.");
                } finally {
                    this.showDeletePopup = false;
                    this.entryToDelete = null;
                    this.entryToDeleteUrl = '';
                }
            } else {
                this.showDeletePopup = false;
                this.entryToDelete = null;
                this.entryToDeleteUrl = '';
            }
        }
    },
    mounted() {
        this.fetchDiaryNotes();
    }
};
</script>

<style scoped>
.diary-list-container {
    background: #fff;
    padding: 40px;
    max-width: 1286px;
    margin: 0 auto;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.diary-title {
    font: 700 32px Poppins, sans-serif;
    color: #282828;
}

.new-entry-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #282828;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font: 600 16px Manrope, sans-serif;
    cursor: pointer;
}

.search-section {
    margin-bottom: 24px;
}

.search-input {
    width: 100%;
    padding: 16px;
    border-radius: 11px;
    background-color: rgba(220, 210, 247, 0.4);
    border: none;
    font: 400 16px Manrope, sans-serif;
}

.diary-entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.diary-card {
    background-color: rgba(220, 210, 247, 0.4);
    border-radius: 11px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.diary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.diary-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -10px;
}

.diary-info {
    flex: 1;
}

.entry-title {
    font: 600 18px Manrope, sans-serif;
    color: #282828;
    margin-bottom: 8px;
}

.entry-date {
    font: 400 14px Manrope, sans-serif;
    color: #666;
}

.delete-button {
    background-color: transparent;
    border: none;
    color: red;
    cursor: pointer;
    font-weight: bold;
}

.delete-button:hover {
    text-decoration: underline;
}

@media (max-width: 991px) {
    .diary-list-container {
        padding: 20px;
    }

    .diary-entries {
        grid-template-columns: 1fr;
    }

    .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .new-entry-button {
        justify-content: center;
    }
}
</style>