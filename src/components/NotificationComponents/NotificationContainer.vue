<template>
    <div class="noti-container">
        <div v-for="[id, notification] in notiMap" :key="id">
            <HighlightedNotification :noti="notification" />
        </div>
        <QuestionNotification />
    </div>
</template>



<script>
import HighlightedNotification from '@/components/NotificationComponents/HighlightedNotification.vue';
import QuestionNotification from './QuestionNotification.vue';
import { Noti } from '@/scripts/types/models';

export default {
    name: 'NotificationContainer',
    components: {
        HighlightedNotification,
        QuestionNotification
    },
    data() {
        return {
            notiMap: new Map()
        }
    },
    methods: {
        addNotification(data) {
            if (data instanceof Noti) {
                //safeguard
                if ([...this.notiMap.values()].find(item => item.title == data.title))
                    return;
                this.notiMap.set(data.id, data);
            }
        },
        removeNotification(id) {
            this.notiMap.delete(id);
        }
    }
}
</script>

<style>
.noti-container {
    position: fixed;
    top: 20px;
    right: 20px;
    margin-top: 50px;
    z-index: 100;
}
</style>