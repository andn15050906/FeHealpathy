<template>
    <v-dialog v-model="confirm" persistent>
        <v-card>
            <v-card-text class="d-flex align-center">
                <span class="ml-2">{{ prop.message }}</span>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn color="cyan" text @click="onclickHandler(false)">Cancel</v-btn>
                <v-btn color="red" text @click="onclickHandler(true)">Remove</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const prop = defineProps({
    message: {
        type: String
    },
})
const confirm = ref(true);
const emit = defineEmits(['popupClick']);

function onclickHandler(event) {
    emit('popupClick', event);
}

</script>