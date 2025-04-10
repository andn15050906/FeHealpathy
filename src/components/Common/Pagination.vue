<template>
    <nav aria-label="Page navigation" class="pagination-nav">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a @click.prevent="$emit('GoToPage', currentPage - 1)" class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for="page in totalPagesArray" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <a @click.prevent="$emit('GoToPage', page)" class="page-link">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a @click.prevent="$emit('GoToPage', currentPage + 1)" class="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: "Pagination",
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    emits: ['GoToPage'],
    computed: {
        totalPagesArray() {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        },
    },
};
</script>

<style scoped>
.pagination-nav {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination {
    list-style: none;
    display: flex;
    padding-left: 0;
    margin: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.page-item {
    margin: 0;
}

.page-link {
    display: block;
    padding: 10px 24px;
    background-color: #ffffff;
    border: 1px solid #e9ecef;
    color: #55a0f0;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.page-link:hover {
    background-color: #f8f9fa;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #ffffff;
}

.page-item.active .page-link {
    background-color: #55a0f0;
    color: #ffffff;
    border-color: #55a0f0;
}
</style>