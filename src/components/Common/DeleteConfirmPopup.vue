<template>
    <v-dialog v-model="localVisible" persistent max-width="400px" class="delete-confirm-popup">
        <v-card>
            <v-card-title class="d-flex align-center">
                <i class="fas fa-exclamation-circle mr-2" style="color: red;"></i>
                <span class="title">Confirm delete</span>
            </v-card-title>
            <v-card-text class="d-flex align-center">
                <span class="ml-2">{{ message }}</span>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn color="grey" text @click="handleClick(false)">Cancel</v-btn>
                <v-btn color="red" text @click="handleClick(true)">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    isVisible: {
        type: Boolean,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['confirmDelete', 'update:isVisible'])

const localVisible = ref(props.isVisible)

watch(() => props.isVisible, (newValue) => {
    localVisible.value = newValue
})

function handleClick(confirm) {
    emit('confirmDelete', confirm)
    emit('update:isVisible', false)
}

function handleDelete() {
    console.log(`Deleting resource at: ${props.url}`);
    emit('confirmDelete', true);
    emit('update:isVisible', false);
}
</script>

<style scoped>
.delete-confirm-popup {
    max-width: 400px;
    border-radius: 12px;
}

.v-card {
    padding: 20px;
}

.v-card-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.v-card-text {
    font-size: 16px;
    color: #333;
}

.v-btn {
    font-weight: 600;
    border-radius: 8px;
}

.v-btn:hover {
    transition: background-color 0.3s;
}

.v-btn.red {
    background-color: #f44336;
    color: white;
}

.v-btn.red:hover {
    background-color: #d32f2f;
}

.v-btn.grey {
    color: #666;
}

.v-btn.grey:hover {
    background-color: #e0e0e0;
}

.v-icon {
    font-size: 24px;
}
</style> 