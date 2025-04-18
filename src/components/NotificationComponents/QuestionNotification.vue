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
                'Bạn thường làm gì khi khó ngủ?',
                'Điều gì mang lại cho bạn sự bình yên nhất?',
                'Bạn đối phó với căng thẳng như thế nào?',
                'Điều gì khiến bạn mỉm cười hôm nay?',
                'Hôm nay bạn đã làm gì cho bản thân chưa?',
                'Bạn biết ơn điều gì nhất?',
                'Điều gì khiến bạn cảm thấy sống động nhất?',
                'Bạn nạp lại năng lượng như thế nào khi cảm thấy quá tải?',
                'Điều nhỏ nhặt nào mang lại niềm vui cho bạn hôm nay?',
                'Điều gì giúp bạn duy trì động lực?'
            ],
            greetings: [
                'bạn có rảnh một chút không?',
                'tôi có một câu hỏi',
                'tôi có thể hỏi bạn một điều không?',
                'bạn có rảnh không?',
                'tôi đang thắc mắc',
                'bạn nghĩ gì về điều này?',
                'bạn có phiền nếu tôi hỏi không?',
                'câu hỏi nhanh nhé',
                'bạn có muốn chia sẻ không?'
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