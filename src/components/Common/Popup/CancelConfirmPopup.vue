<template>
    <v-dialog v-model="localVisible" persistent max-width="400px" class="cancel-confirm-popup">
        <v-card>
            <v-card-title class="d-flex align-center title-section">
                <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
                <span class="title">Xác nhận hủy</span>
            </v-card-title>
            <v-card-text class="d-flex align-center text-section">
                <span>{{ message }}</span>
            </v-card-text>
            <v-card-actions class="justify-end action-section">
                <v-btn color="blue darken-1" class="keep-btn" @click="handleClick(false)">
                    <span class="keep-text">Tiếp tục chỉnh sửa</span>
                </v-btn>
                <v-btn color="grey" text class="cancel-btn" @click="handleClick(true)">
                    Xác nhận hủy
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["confirmCancel", "update:isVisible"]);

const localVisible = ref(props.isVisible);

watch(
    () => props.isVisible,
    (newValue) => {
        localVisible.value = newValue;
    }
);

function handleClick(confirm) {
    emit("confirmCancel", confirm);
    emit("update:isVisible", false);
}
</script>

<style scoped>
.v-card {
    padding: 20px;
    background-color: #ffffff;
}

.title-section {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.text-section {
    font-size: 16px;
    color: #555;
    margin-top: 10px;
    margin-bottom: 20px;
}

.action-section {
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
}

.v-btn {
    font-weight: 600;
    text-transform: capitalize;
    border-radius: 8px;
    padding: 8px 16px;
    transition: background-color 0.3s, color 0.3s;
}

.cancel-btn {
    color: #757575;
}

.cancel-btn:hover {
    background-color: #f5f5f5;
}

.keep-btn {
    background-color: #1976d2;
    color: white;
    font-weight: bold;
    position: relative;
    overflow: hidden;
}

.keep-btn:hover {
    background-color: #1565c0;
}

.keep-btn .keep-text {
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    color: white;
}

.fas.fa-exclamation-triangle {
    font-size: 24px;
    color: #ff9800;
}

.text-warning {
    color: #ff9800 !important;
}
</style>