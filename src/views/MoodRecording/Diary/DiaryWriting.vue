<template>
    <form class="memory-entry-container" @submit.prevent="handleSubmit">
        <header class="header-section">
            <button class="back-button" @click="handleBack">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d9b58e3b5db27ef7508f6ec31fd50ca2a91cd5f71d18910c95741bcb028f9bba?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Back arrow" class="back-icon" />
                <span>Back</span>
            </button>
        </header>

        <input type="text" class="memory-title-input" v-model="memoryTitle" aria-label="Memory title"
            placeholder="My Memory #1" />

        <input type="date" class="memory-date-input" v-model="memoryDate" aria-label="Memory date" />

        <div class="content-section">
            <div class="content-header">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e44458ef9434dde6ea240cbe1e7b2a82dca59ee4b66564ddcbe76fbf7ddf52c?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Upload image" class="upload-icon" tabindex="0" @click="triggerFileInput" />
                <input type="file" ref="fileInput" class="visually-hidden" @change="handleFileChange" multiple
                    accept="image/*" />
            </div>
            <textarea class="memory-content" placeholder="Type any things.." v-model="memoryContent"
                aria-label="Memory content">
            </textarea>

            <div class="preview-section">
                <div v-for="(file, index) in mediaFiles" :key="index" class="preview-item">
                    <img :src="file.preview" alt="Preview" class="preview-image" />
                    <button type="button" @click="removeFile(file.id)" class="remove-button">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>

        <button type="submit" class="save-button">Save</button>
    </form>
</template>

<script>
import { createDiaryNote, getPagedDiaryNotes, updateDiaryNote } from "@/services/diaryNoteService";

export default {
    name: 'DiaryWriting',
    props: ['title'],
    created() {
        if (this.$route.path === '/diary/diary-writing') {
            this.memoryDate = new Date().toISOString().split('T')[0]
        }
    },
    data() {
        return {
            memoryTitle: '',
            memoryDate: '',
            memoryContent: '',
            mediaFiles: [],
            removedFileIds: [],
            isEdit: false
        }
    },
    async mounted() {
        const title = this.$route.params.title;
        if (title) {
            this.isEdit = true;
            await this.fetchDiaryNote(title);
        }
    },
    methods: {
        async fetchDiaryNote(title) {
            try {
                const filter = { Title: title };
                const response = await getPagedDiaryNotes(filter);

                if (response.items && response.items.length > 0) {
                    const diary = response.items[0];
                    this.memoryTitle = diary.title;
                    this.memoryDate = diary.creationTime ? diary.creationTime.split("T")[0] : new Date().toISOString().split("T")[0];
                    this.memoryContent = diary.content || "";
                    this.mediaFiles = (diary.medias || []).map((media) => ({
                        id: media.id,
                        isOld: true,
                        file: null,
                        preview: media.url,
                        url: media.url,
                    }));
                } else {
                    alert("Diary note not found.");
                }
            } catch (error) {
                alert("Failed to load diary. Please try again.");
            }
        },
        async handleSubmit() {
            if (!this.memoryTitle || !this.memoryDate || !this.memoryContent) {
                alert("Please fill in all fields before saving.");
                return;
            }

            const formData = new FormData();
            formData.append("Id", this.isEdit ? this.$route.params.id : "");
            formData.append("Title", this.memoryTitle);
            formData.append("Content", this.memoryContent);

            if (this.mediaFiles && this.mediaFiles.length > 0) {
                this.mediaFiles.filter(file => !file.isOld).forEach((file, index) => {
                    if (file.url) {
                        // If the file has URL (existing media), append the URL
                        formData.append(
                            !this.isEdit ? `Medias[${index}].Url` : `AddedMedias[${index}].Url`,
                            file.url
                        );
                    } else if (file.file) {
                        // If the file is new (uploaded), append the actual file
                        formData.append(
                            !this.isEdit ? `Medias[${index}].File` : `AddedMedias[${index}].File`,
                            file.file
                        );
                    }
                    formData.append(
                        !this.isEdit ? `Medias[${index}].Title` : `AddedMedias[${index}].Title`,
                        file.file ? file.file.name : `Existing Media ${index}`);
                });
            }
            if (this.removedFileIds && this.removedFileIds.length > 0) {
                this.removedFileIds.forEach(id => {
                    formData.append(`RemovedMedias[]`, id)
                });
            }

            console.log([...formData.entries()]);

            try {
                if (this.isEdit) {
                    await updateDiaryNote(formData);
                    alert("Memory updated successfully!");
                } else {
                    await createDiaryNote(formData);
                    alert("Memory saved successfully!");
                }
                this.$router.push('/diary/diary-list');
            } catch (error) {
                console.error("Error saving memory:", error);
                alert("Failed to save memory. Please try again.");
            }
        },
        handleBack() {
            this.$router.push('/diary/diary-list')
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const files = event.target.files;
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.mediaFiles.push({
                        id: crypto.randomUUID(),    // Local id, not saved to DB
                        file,
                        preview: e.target.result,
                        url: null
                    });
                };
                reader.readAsDataURL(file);
            });
        },
        removeFile(fileId) {
            this.removedFileIds.push(fileId);
            this.mediaFiles = this.mediaFiles.filter(file => file.id != fileId);
        }
    }
}
</script>

<style scoped>
.memory-entry-container {
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: end;
    padding: 23px 23px 39px 23px;
}

.header-section {
    align-self: start;
}

.back-button {
    display: flex;
    gap: 5px;
    color: #000;
    font: 400 18px Manrope, sans-serif;
    background: none;
    border: none;
    cursor: pointer;
    align-items: center;
}

.back-icon {
    aspect-ratio: 1;
    width: 26px;
}

.memory-title-input {
    border-radius: 11px;
    background-color: rgba(220, 210, 247, 0.4);
    margin-top: 24px;
    width: 1286px;
    max-width: 100%;
    color: #251d1d;
    padding: 13px;
    font: 400 18px Manrope, sans-serif;
    border: none;
}

.memory-date-input {
    border-radius: 11px;
    background-color: rgba(220, 210, 247, 0.4);
    margin-top: 16px;
    width: 1286px;
    max-width: 100%;
    color: #161616;
    padding: 14px;
    font: 400 18px Manrope, sans-serif;
    border: none;
}

.content-section {
    border-radius: 11px;
    background-color: rgba(220, 210, 247, 0.4);
    margin-top: 13px;
    width: 100%;
    max-width: 1286px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.content-header {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
}

.upload-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.upload-icon:hover {
    transform: scale(1.1);
}

.memory-content {
    color: #2d2828;
    font: 400 18px Manrope, sans-serif;
    margin: 0 44px 20px;
    background: transparent;
    border: none;
    min-height: 700px;
    resize: vertical;
    margin-top: -35px;
}

.memory-content:focus {
    outline: none;
}

.formatting-toolbar {
    background-color: #fff9f9;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 10;
    display: flex;
    justify-content: flex-end;
    padding: 23px 76px;
}

.format-icon {
    aspect-ratio: 1;
    width: 40px;
    cursor: pointer;
}

.save-button {
    align-self: center;
    border-radius: 7.72px;
    background: var(--Black, #282828);
    margin-top: 32px;
    width: 383px;
    max-width: 100%;
    color: #fff;
    padding: 15px;
    font: 700 17px Manrope, sans-serif;
    border: none;
    cursor: pointer;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}


.preview-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    /* Increased gap between items */
    justify-content: flex-start;
}

.preview-item {
    position: relative;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.preview-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
    display: block;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 22px;
    color: #ff0000;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.remove-button:hover {
    transform: scale(1.2);
}

.remove-button i {
    margin: 0;
}

.preview-item:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 991px) {
    .memory-entry-container {
        padding: 0 20px;
    }

    .memory-title-input,
    .memory-date-input {
        padding-right: 20px;
    }

    .memory-content {
        margin-left: 10px;
    }

    .formatting-toolbar {
        max-width: 100%;
        margin: 40px 0 10px;
        padding: 0 20px;
    }

    .save-button {
        padding: 15px 20px;
    }

    .content-header {
        padding: 12px;
    }

    .memory-content {
        margin: 0 20px 20px;
    }
}
</style>