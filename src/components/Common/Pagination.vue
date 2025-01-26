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
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    computed: {
        totalPagesArray() {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        },
    },
    methods: {
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.$emit("go-to-page", page);
            }
        },
    },
};
</script>
