<template>
    <div>
        <HighlightedNotification :noti="notification" />
        <DailyQuestion v-if="showModal" :notification="notification" @close="saveAndClose" />
    </div>
</template>

<script>
import HighlightedNotification from '@/components/NotificationComponents/HighlightedNotification.vue';
import DailyQuestion from './DailyQuestion.vue'
import { Noti } from '@/scripts/types/models';
import { logQuestionOfTheDay } from '@/scripts/api/services/activityLogService'

export default {
    name: 'QuestionNotification',
    components: {
        HighlightedNotification,
        DailyQuestion
    },
    data() {
        return {
            notification: new Noti(false, () => { }, '', ''),
            showModal: false,
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
                'what do you think about this?',
                'mind if I ask?',
                'quick question',
                'care to share?'
            ]
        }
    },
    created() {
        // cái này để apply thông báo thật
        // this.scheduleRandomNotification();

        setTimeout(() => {
            this.notification = new Noti(
                true,
                this.openQuestionModal,
                'Hey, ' + this.getRandomGreeting() + ' 👋',
                this.getRandomQuestionPreview()
            );
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
                this.notification.questionPreview = this.getRandomQuestionPreview();
                this.notification.isShown = true;
            }, timeUntilNotification);
        },
        getRandomQuestionPreview() {
            return this.questions[Math.floor(Math.random() * this.questions.length)];
        },
        getRandomGreeting() {
            return this.greetings[Math.floor(Math.random() * this.greetings.length)];
        },
        openQuestionModal() {
            this.showModal = true;
            this.notification.isShown = false;
        },
        saveAndClose(question, answer) {
            logQuestionOfTheDay(question, answer);
            this.showModal = false;
        }
    }
}
</script>