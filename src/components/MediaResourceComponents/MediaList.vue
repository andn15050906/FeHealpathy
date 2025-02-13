<template>
    <div>
        <table class="table table-bordered table-hover table-responsive-md">
            <thead class="table-primary text-center">
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(file, index) in mediaFiles" :key="file.id" class="align-middle text-center">
                    <td>{{ index + 1 }}</td>
                    <td>{{ file.title }}</td>
                    <td>{{ file.artist }}</td>
                    <td>{{ file.description }}</td>
                    <td>{{ formatDate(file.creationTime) }}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm me-2" @click="$emit('edit-media', file, index)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" @click="$emit('delete-media', file.id, index)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                <tr v-if="mediaFiles.length === 0">
                    <td colspan="6" class="text-center text-muted">No media files available.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        mediaFiles: {
            type: Array,
            required: true,
        },
    },
    methods: {
        formatDate(dateString) {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
.table {
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th {
    text-transform: uppercase;
    font-size: 0.85rem;
    font-weight: bold;
}

.table td,
.table th {
    vertical-align: middle;
    padding: 0.75rem;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}

.table-responsive-md {
    overflow-x: auto;
}
</style>
