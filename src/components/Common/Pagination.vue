<template>
    <nav aria-label="Page navigation example" class="pagination-nav">
        <ul class="pagination">
            <!-- Previous button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a @click.prevent="goToPage(currentPage - 1)" class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
            </li>

            <!-- Page numbers -->
            <li v-for="page in totalPagesArray" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <a @click.prevent="goToPage(page)" class="page-link">{{ page }}</a>
            </li>

            <!-- Next button -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a @click.prevent="goToPage(currentPage + 1)" class="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
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
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        },
        goToPage: {
            type: Function,
            required: true
        }
    },
    computed: {
        totalPagesArray() {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
    }
};
</script>

<style scoped>
.pagination-nav {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 20px;
}

.pagination {
    list-style: none;
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
}

.page-item {
    margin: 0 5px;
}

.page-link {
    display: block;
    padding: 10px 15px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #5488c7;
    text-decoration: none;
    border-radius: 0.25rem;
    cursor: pointer;
}

.page-item.disabled .page-link {
    color: #ccc;
    cursor: not-allowed;
}

.page-item.active .page-link {
    background-color: #5488c7;
    color: white;
}

.page-link:hover {
    background-color: #f1f1f1;
}

.page-link:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
}
</style>