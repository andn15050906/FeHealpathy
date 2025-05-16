<template>
    <div class="media-list-container">
        <table class="table table-bordered table-hover table-responsive-md">
            <thead class="table-primary text-center">
                <tr>
                    <th>#</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Mô tả</th>
                    <th>Loại</th>
                    <th>Được đăng tải</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(file, index) in sortedMediaFiles" :key="file.id" class="align-middle text-center">
                    <td>{{ index + 1 }}</td>
                    <td>{{ file.title }}</td>
                    <td>{{ file.artist }}</td>
                    <td>{{ file.description }}</td>
                    <td>{{ getTypeLabel(file.type) }}</td>
                    <td>{{ formatDate(file.creationTime) }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-media', file, index)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" @click="$emit('delete-media', file.id, index)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                <tr v-if="sortedMediaFiles.length === 0">
                    <td colspan="7" class="text-center text-muted">Không có phương tiện truyền thông nào</td>
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
    computed: {
        sortedMediaFiles() {
            return [...this.mediaFiles].sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime));
        },
    },
    methods: {
        formatDate(dateString) {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        getTypeLabel(type) {
            const typeMap = {
                1: "Nhạc",
                2: "Video"
            };
            return typeMap[type] || "Unknown";
        }
    },
};
</script>

<style scoped>
.media-list-container {
    width: 72vw;
    margin: 0 auto;
    padding: 20px;
}

.table {
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
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
