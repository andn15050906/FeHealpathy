<template>
    <div class="notification" v-if="noti.isShown" @click="noti.callback">
        <div class="notification-content">
            <i class="fas fa-comment-dots notification-icon"></i>
            <div class="notification-text">
                <p class="notification-title">{{ noti.title }}</p>
                <p class="notification-preview">{{ noti.content }}</p>
            </div>
        </div>
    </div>
</template>


<script>
import { Noti } from '@/scripts/types/models';

export default {
    name: 'HighlightedNotification',
    props: {
        noti: Noti
    }
}
</script>


<style scoped>
.notification {
    background: white;
    border-radius: 17px;
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 1000;
    max-width: 340px;
    animation: slideIn 0.5s ease-out;
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
        padding: 12px 16px;
    }
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
</style>