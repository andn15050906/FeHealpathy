<template>
    <div class="mood-tracker">
        <div class="mood-div">
            <div class="tracker-container">
                <section class="emotion-container" role="region" aria-label="Emotional state display">
                    <p class="emotion-pretext">I'm feeling</p>
                    <h1 class="emotion-state">{{ selectedMood }}</h1>
                </section>
                <div class="mood-display">
                    <img loading="lazy" :src="moodImage" class="mood-icon" />
                </div>
                <div class="mood-selection">
                    <div class="mood-row">
                        <button @click="selectMood('Happy')" class="mood-button mood-happy">Happy</button>
                        <button @click="selectMood('Eager')" class="mood-button mood-eager">Eager</button>
                    </div>
                    <div class="mood-row">
                        <button @click="selectMood('Anxiety')" class="mood-button mood-anxiety">Anxiety</button>
                        <button @click="selectMood('Angry')" class="mood-button mood-angry">Angry</button>
                        <button @click="selectMood('Sad')" class="mood-button mood-sad">Sad</button>
                    </div>
                </div>
                <DiaryButton />
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPagedDiaryNotes, createDiaryNote, updateDiaryNote } from '@/scripts/api/services/diaryNoteService';
import { ConvertTo_yyyy_mm_dd } from '@/scripts/logic/common.js';
import DiaryButton from '@/components/MoodComponents/DiaryButton.vue';

export default {
    name: 'MoodTracker',
    components: { DiaryButton },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const selectedMood = ref('Happy');
        const diaryNoteId = ref(null);
        const moodImage = ref('');

        const moodImages = {
            Happy: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e3ff816f600031f96b3bf75fa2c76bb2ac0a60cc572a49c3ab196222543d81c9',
            Eager: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e3ff816f600031f96b3bf75fa2c76bb2ac0a60cc572a49c3ab196222543d81c9',
            Anxiety: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ca79fb5af2e302375e06008c34767d0e50c971b995463146cc44f1d7af0af355',
            Angry: 'https://cdn.builder.io/api/v1/image/assets/TEMP/18a46ba70d2e22dcd7f14d6f252f6cdf532f122c91567146069b4e9b27f2d023',
            Sad: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f5da17250d1078f13adbfd2de8c4c3dc53bb8c93c0a029d60459b4cb4091bbe6'
        };

        onMounted(async () => {
            const today = ConvertTo_yyyy_mm_dd(new Date());
            const queryParams = { StartAfter: today };
            try {
                const diaryNote = await getPagedDiaryNotes(queryParams);

                if (diaryNote) {
                    selectedMood.value = diaryNote.mood;
                    diaryNoteId.value = diaryNote.id;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    try {
                        const response = await createDiaryNote({ mood: "Happy"});
                        diaryNoteId.value = response.id;
                        selectedMood.value = "Happy";
                    } catch (createError) {
                        console.error("Failed to create default mood:", createError);
                    }
                } else {
                    console.error("Failed to fetch diary note:", error);
                }
            }
            moodImage.value = moodImages[selectedMood.value];
        });

        async function selectMood(mood) {
            selectedMood.value = mood;
            moodImage.value = moodImages[mood];

            try {
                if (diaryNoteId.value) {
                    await updateDiaryNote({ id: diaryNoteId.value, mood });
                    console.log(`Mood updated: ${mood}`);
                } else {
                    const today = ConvertTo_yyyy_mm_dd(new Date());
                    const response = await createDiaryNote({ mood });
                    diaryNoteId.value = response.id;
                    console.log(`Mood created: ${mood}`);
                }
            } catch (error) {
                console.error('Failed to save mood:', error);
            }

            router.push(`/mood-cart/${mood.toLowerCase()}`);
        }

        return {
            selectedMood,
            moodImage,
            selectMood
        };
    }
};
</script>

<style scoped>
.emotion-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Poppins, sans-serif;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.emotion-pretext {
    font-size: 20px;
    font-weight: 500;
    line-height: 1;
    margin: 0;
}

.emotion-state {
    font-size: 36px;
    font-weight: 600;
    line-height: 41px;
    margin: 8px 0 0;
}

.mood-tracker {
    background-color: rgba(249, 114, 67, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 156px 80px;
    font: 700 20px/1 Poppins, sans-serif;
}

.tracker-container {
    display: flex;
    width: 767px;
    max-width: 100%;
    flex-direction: column;
}

.mood-icon {
    margin-top: 150px;
    width: 400px;
    height: auto;
    object-fit: contain;
}

.mood-display {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 528px;
}

.mood-selection {
    align-self: center;
    display: flex;
    margin-top: 73px;
    width: 327px;
    max-width: 100%;
    flex-direction: column;
    justify-content: start;
}

.mood-row {
    display: flex;
    width: 100%;
    max-width: 327px;
    align-items: start;
    gap: 8px;
    justify-content: start;
}

.mood-row:not(:first-child) {
    margin-top: 8px;
}

.mood-button {
    align-self: stretch;
    border-radius: 12px;
    border: none;
    gap: 10px;
    flex: 1;
    padding: 10px;
    cursor: pointer;
    font: inherit;
}

.mood-button:focus {
    outline: 3px solid #fff;
    outline-offset: 2px;
}

.mood-happy {
    background-color: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 1);
}

.mood-eager,
.mood-anxiety,
.mood-angry,
.mood-sad {
    background-color: rgba(187, 161, 255, 1);
    color: rgba(255, 255, 255, 1);
}

@media (max-width: 991px) {
    .mood-tracker {
        padding: 100px 20px;
    }

    .tracker-container,
    .mood-display,
    .mood-selection,
    .mood-row,
    .mood-button {
        max-width: 100%;
    }

    .mood-selection {
        margin-top: 40px;
    }
}
</style>