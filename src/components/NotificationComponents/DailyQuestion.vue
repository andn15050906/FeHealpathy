<template>
    <v-overlay v-model="overlay" @click.self="$emit('close')">
        <div class="question-container">
            <header class="header-section">
                <button class="back-button" @click="$emit('close')">
                    <i class="fas fa-arrow-left"></i>
                    <span>Quay lại</span>
                </button>
                <div class="date-display">
                    {{ getCurrentDate() }}
                </div>
            </header>

            <div class="question-content">
                <div class="question-header">
                    <i class="fas fa-comment-dots question-icon"></i>
                    <h1 class="question-text">{{ notification.content }}</h1>
                </div>

                <div class="answer-section">
                    <textarea v-model="answer" class="answer-input" placeholder="Chia sẻ suy nghĩ của bạn..."
                        :rows="5"></textarea>
                    <div class="character-count">{{ answer.length }}/500 ký tự</div>
                </div>

                <div class="action-buttons">
                    <button @click="$emit('close')" class="cancel-button">
                        <i class="fas fa-times"></i>
                        <span>Hủy</span>
                    </button>
                    <button @click="saveAndClose" class="save-button">
                        <i class="fas fa-check"></i>
                        <span>Trả lời</span>
                    </button>
                </div>
            </div>
        </div>
    </v-overlay>
</template>

<script>
export default {
    props: {
        notification: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            answer: '',
            overlay: true
        }
    },
    methods: {
        getCurrentDate() {
            return new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        saveAndClose() {
            this.$emit('close', this.notification.content, this.answer);
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.question-container {
    width: 100%;
    max-width: 600px;
    background: #f8f7fd;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    margin: 20px;
    overflow: hidden;
    animation: slideIn 0.3s ease;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 40px;
    background: #f8f7fd;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    font: 500 16px Manrope, sans-serif;
    color: #666;
    padding: 8px 16px;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.back-button:hover {
    background-color: rgba(124, 58, 237, 0.1);
    color: #7c3aed;
}

.date-display {
    font: 500 14px Manrope, sans-serif;
    color: #666;
    background: white;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.question-content {
    background: white;
    border-radius: 24px 24px 0 0;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.question-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
}

.question-icon {
    font-size: 24px;
    color: #7c3aed;
    margin-top: 4px;
}

.question-text {
    font: 600 24px Poppins, sans-serif;
    color: #282828;
    flex: 1;
    line-height: 1.4;
}

.answer-section {
    position: relative;
    margin-bottom: 32px;
}

.answer-input {
    width: 100%;
    padding: 20px;
    border: 2px solid rgba(124, 58, 237, 0.1);
    border-radius: 16px;
    background: #f8f7fd;
    font: 400 16px Manrope, sans-serif;
    resize: vertical;
    min-height: 120px;
    max-height: 300px;
    transition: border-color 0.2s;
}

.answer-input:focus {
    outline: none;
    border-color: #7c3aed;
}

.character-count {
    position: absolute;
    bottom: -24px;
    right: 0;
    font: 400 12px Manrope, sans-serif;
    color: #666;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 40px;
}

.cancel-button,
.save-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    font: 600 16px Manrope, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-button {
    background: none;
    border: 2px solid #e5e7eb;
    color: #666;
}

.cancel-button:hover {
    background: #f8f7fd;
    border-color: #d1d5db;
}

.save-button {
    background: #7c3aed;
    border: none;
    color: white;
}

.save-button:hover {
    background: #6d28d9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
}

.save-button:active {
    transform: translateY(0);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 640px) {
    .question-container {
        margin: 16px;
        max-height: 80vh;
    }

    .question-content {
        padding: 24px;
    }

    .header-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .cancel-button,
    .save-button {
        width: 100%;
        justify-content: center;
    }
}
</style>