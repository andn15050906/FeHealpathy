<template>
    <div ref="editorContainer" class="editor-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import Quill from 'quill';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const editorContainer = ref(null);
let quill;

onMounted(() => {
    quill = new Quill(editorContainer.value, {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean']
            ]
        }
    });

    quill.root.innerHTML = props.modelValue;

    quill.on('text-change', () => {
        emit('update:modelValue', quill.root.innerHTML);
    });
});

watch(() => props.modelValue, (newValue) => {
    if (quill.root.innerHTML !== newValue) {
        quill.root.innerHTML = newValue;
    }
});
</script>

<style scoped>
.editor-container {
    height: 300px;
}
</style> 