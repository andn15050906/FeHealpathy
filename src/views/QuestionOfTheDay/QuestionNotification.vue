<template>
    <div>
        <div class="notification" v-if="showNotification" @click="openQuestionModal">
            <div class="notification-content">
                <i class="fas fa-comment-dots notification-icon"></i>
                <div class="notification-text">
                    <p class="notification-title">Hey, {{ getRandomGreeting() }} 👋</p>
                    <p class="notification-preview">{{ questionPreview }}</p>
                </div>
            </div>
        </div>
        
        <DailyQuestion 
            v-if="showModal" 
            :question="questionPreview"
            @close="showModal = false"
        />
    </div>
</template>

<script>
import DailyQuestion from './DailyQuestion.vue'

export default {
    name: 'QuestionNotification',
    components: {
        DailyQuestion
    },
    data() {
        return {
            showNotification: false,
            showModal: false,
            questionPreview: '',
            questions: [
                'What do you usually do when you have trouble sleeping?',
                'What brings you the most peace?',
                'How do you deal with stress?',
                'What made you smile today?',
                'Have you done something for yourself today?',
                'What are you most grateful for?',
                'What makes you feel most alive?',
                'How do you recharge when feeling overwhelmed?',
                'What small thing brought you joy today?',
                'What helps you stay motivated?'
            ],
            greetings: [
                'got a minute?',
                'I have a question',
                'can I ask you something?',
                'are you free?',
                'I was wondering',
                'what do you think about this',
                'mind if I ask',
                'quick question',
                'care to share'
            ]
        }
    },
    created() {
        // cái này để apply thông báo thật
        // this.scheduleRandomNotification();

        // cái này set time về 3s kể từ lúc load page dùng để test thông báo
        setTimeout(() => {
            this.showNotification = true;
            this.questionPreview = this.getRandomQuestionPreview();
        }, 3000);
    },
    methods: {
        scheduleRandomNotification() {
            const now = new Date();
            const randomHour = Math.floor(Math.random() * 24);
            const randomMinute = Math.floor(Math.random() * 60);

            const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), randomHour, randomMinute);
            const timeUntilNotification = notificationTime - now;

            if (timeUntilNotification < 0) {
                // If the random time is in the past, schedule for the next day
                notificationTime.setDate(notificationTime.getDate() + 1);
            }

            setTimeout(() => {
                this.showNotification = true;
                this.questionPreview = this.getRandomQuestionPreview();
            }, timeUntilNotification);
        },
        getRandomQuestionPreview() {
            return this.questions[Math.floor(Math.random() * this.questions.length)];
        },
        openQuestionModal() {
            this.showModal = true;
            this.showNotification = false;
        },
        getRandomGreeting() {
            return this.greetings[Math.floor(Math.random() * this.greetings.length)];
        }
    }
}
</script>

<style scoped>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 17px;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 1000;
    max-width: 380px;
    animation: slideIn 0.5s ease-out;
    margin-top: 50px;
}

.notification-content {
    display: flex;
    gap: 12px;
    align-items: center;
}

.notification-icon {
    font-size: 24px;
    color: #7c3aed;
}

.notification-text {
    flex: 1;
}

.notification-title {
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #7c3aed;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
}

.notification-preview {
    margin: 0;
    color: #666;
    font-size: 14px;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
        padding: 15px 20px;
    }
}
</style>