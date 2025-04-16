<template>
    <v-dialog v-model="localVisible" persistent max-width="400px" class="save-confirm-popup" :scrim="false">
        <v-card>
            <v-card-title class="d-flex align-center title-section">
                <i class="fas fa-save text-primary mr-2"></i>
                <span class="title">Confirm Save</span>
            </v-card-title>
            <v-card-text class="d-flex align-center text-section">
                <span>{{ message }}</span>
            </v-card-text>
            <v-card-actions class="justify-end action-section">
                <v-btn color="grey" text class="cancel-btn" @click="handleClick(false)">Cancel</v-btn>
                <v-btn color="blue darken-1" class="save-btn" @click="handleClick(true)">
                    <span class="save-text">Save</span>
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
    }
});

const emit = defineEmits(["confirmSave", "update:isVisible"]);

const localVisible = ref(props.isVisible);

watch(
    () => props.isVisible,
    (newValue) => {
        localVisible.value = newValue;
    }
);

function handleClick(confirm) {
    emit("confirmSave", confirm);
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

.save-btn {
    background-color: #1976d2;
    color: white;
    font-weight: bold;
    position: relative;
    overflow: hidden;
}

.save-btn:hover {
    background-color: #1565c0;
}

.save-btn .save-text {
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    color: white;
}

.fas.fa-save {
    font-size: 24px;
    color: #1976d2;
}
</style>