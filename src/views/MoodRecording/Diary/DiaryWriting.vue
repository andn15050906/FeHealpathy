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
            <textarea class="memory-content" placeholder="Type any things.." v-model="memoryContent"
                aria-label="Memory content"></textarea>

            <div class="formatting-toolbar">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ce2ba640e48b0f6047639ef95f62933d5af9c74bf20744a57f0fe85f8cd208e?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Bold text" class="format-icon" tabindex="0" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e44458ef9434dde6ea240cbe1e7b2a82dca59ee4b66564ddcbe76fbf7ddf52c?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Italic text" class="format-icon" tabindex="0" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b7a143212a48e9975055abaea5516887776e583d1a73b1fafae2c15dde81c3f?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Underline text" class="format-icon" tabindex="0" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e6fb3659abbd2f91a37ba996ae340300b76a894dc776c4c045afdf4d51c2e6a0?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="List format" class="format-icon" tabindex="0" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/cceae661958fad4ec96c42b440f8a8c35a81aaa659a973ae143dda70e51a6e2e?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Image insert" class="format-icon" tabindex="0" />
            </div>
        </div>

        <div class="mood-section">
            <label for="moodSelection">Mood Entry:</label>
            <div class="mood-options" role="radiogroup" aria-label="Select mood">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/043686cbbf78022708fec22ca80a902f57abad9fc42b9f1e36b42603ed4d3765?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Very sad mood" class="mood-icon" :class="{ active: selectedMood === 'very-sad' }"
                    @click="selectMood('very-sad')" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3293582c94a47068c7d253c75b4dfc429b8270402ffc3b71a7b7a3b7c841e81?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Sad mood" class="mood-icon" :class="{ active: selectedMood === 'sad' }"
                    @click="selectMood('sad')" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b08e9dcbcdfb2618f02b4a2293a914c1c92b9d58c21e5bf018dbe03cff35c2d?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Neutral mood" class="mood-icon" :class="{ active: selectedMood === 'neutral' }"
                    @click="selectMood('neutral')" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68f23974a28e2ee613607ad4e8f9086a623c81fd8d04436f7b8862eb0bcd72?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                    alt="Very happy mood" class="mood-icon" :class="{ active: selectedMood === 'very-happy' }"
                    @click="selectMood('very-happy')" />
            </div>
        </div>

        <button type="submit" class="save-button">Save</button>
    </form>
</template>

<script>
export default {
    name: 'MemoryEntryForm',
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
            selectedMood: null
        }
    },
    methods: {
        handleSubmit() {
            // Form submission logic
        },
        handleBack() {
            this.$router.push('/diary/diary-list')
        },
        selectMood(mood) {
            this.selectedMood = mood;
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
    padding: 23px 67px 39px 23px;
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
}

.memory-content {
    color: #2d2828;
    font: 600 18px Manrope, sans-serif;
    margin: 7px 44px;
    margin-top: 20px;
    background: transparent;
    border: none;
    min-height: 400px;
    resize: vertical;
}

.memory-content:focus {
    outline: none;
    border-radius: 11px;
}

.formatting-toolbar {
    background-color: #fff9f9;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 10;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    padding: 23px 76px;
}

.format-icon {
    aspect-ratio: 1;
    width: 40px;
    cursor: pointer;
}

.mood-section {
    background-color: rgba(220, 210, 247, 0.4);
    margin-top: 24px;
    width: 1286px;
    max-width: 100%;
    display: flex;
    align-items: center;
    padding: 20px 40px;
    font: 400 20px Poppins, sans-serif;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 11px;
    gap: 30px;
}

.mood-options {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
    padding: 0 40px;
    gap: 40px;
}

.mood-icon {
    aspect-ratio: 1;
    width: 65px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.6;
    filter: grayscale(40%);
    outline: none;
}

.mood-icon:hover {
    opacity: 0.85;
    transform: scale(1.15);
    filter: grayscale(20%);
}

.mood-icon.active {
    opacity: 1;
    transform: scale(1.1);
    filter: grayscale(0%);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}

.mood-icon.active:hover {
    transform: scale(1.1);
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

    .mood-section {
        padding: 15px;
    }

    .mood-options {
        gap: 20px;
        justify-content: center;
        padding: 0 10px;
    }

    .mood-icon {
        width: 50px;
    }

    .save-button {
        padding: 15px 20px;
    }
}
</style>