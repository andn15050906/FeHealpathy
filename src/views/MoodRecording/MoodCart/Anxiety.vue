<template>
    <div class="mood-tracker">
        <div class="mood-div">
            <div class="tracker-container">
                <div class="mood-display">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca79fb5af2e302375e06008c34767d0e50c971b995463146cc44f1d7af0af355?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        class="mood-icon" />
                </div>
                <div class="mood-selection">
                    <div class="mood-row">
                        <button class="mood-button mood-happy" tabindex="0" role="button"
                            aria-label="Select Happy mood">
                            Happy
                        </button>
                        <button class="mood-button mood-moved" tabindex="0" role="button"
                            aria-label="Select Moved mood">
                            Moved
                        </button>
                    </div>
                    <div class="mood-row">
                        <button class="mood-button mood-anxiety" tabindex="0" role="button"
                            aria-label="Select Anxiety mood">
                            Anxiety
                        </button>
                        <button class="mood-button mood-angry" tabindex="0" role="button"
                            aria-label="Select Angry mood">
                            Angry
                        </button>
                        <button class="mood-button mood-sad" tabindex="0" role="button" aria-label="Select Sad mood">
                            Sad
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mood-tracker {
    background-color: rgba(114, 67, 249, 1);
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

.mood-anxiety {
    background-color: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 1);
}

.mood-moved,
.mood-happy,
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

<script>
export default {
    name: 'AnxietyMoodTracker'
}
</script>