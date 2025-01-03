<template>
    <div class="diary-list-container">
        <header class="header-section">
            <h1 class="diary-title">My Diary Entries</h1>
            <router-link to="/diary/diary-writing" class="new-entry-button">
                <span>New Entry</span>
                <svg class="add-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </router-link>
        </header>

        <div class="search-section">
            <input 
                type="text" 
                class="search-input"
                v-model="searchQuery"
                placeholder="Search your memories..."
            />
        </div>

        <div class="diary-entries">
            <div v-for="entry in filteredEntries" 
                :key="entry.id" 
                class="diary-card"
                @click="viewEntry(entry.id)">
                <div class="diary-card-content">
                    <div class="diary-info">
                        <h2 class="entry-title">{{ entry.title }}</h2>
                        <p class="entry-date">{{ formatDate(entry.date) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DiaryList',
    data() {
        return {
            searchQuery: '',
            entries: [
                {
                    id: 1,
                    title: 'My Memory #1',
                    date: '2024-01-15',
                    content: 'Today was amazing! I got promoted at work.'
                },
                {
                    id: 2,
                    title: 'Coffee with Friends',
                    date: '2024-01-16',
                    content: 'Had a wonderful coffee meetup with old friends.'
                },
                {
                    id: 3,
                    title: 'Rainy Day Thoughts',
                    date: '2024-01-17',
                    content: 'Just a normal rainy day, staying indoors.'
                },
                {
                    id: 4,
                    title: 'Missing Home',
                    date: '2024-01-18',
                    content: 'Feeling homesick today...'
                },
                {
                    id: 5,
                    title: 'Weekend Adventure',
                    date: '2024-01-19',
                    content: 'Went hiking with my best friends!'
                },
                {
                    id: 6,
                    title: 'Movie Night',
                    date: '2024-01-20',
                    content: 'Watched my favorite movie again.'
                },
                {
                    id: 7,
                    title: 'Work Deadline',
                    date: '2024-01-21',
                    content: 'Busy day at work, but managed to finish everything.'
                },
                {
                    id: 8,
                    title: 'Family Dinner',
                    date: '2024-01-22',
                    content: 'Had a wonderful dinner with family.'
                },
                {
                    id: 9,
                    title: 'Late Night Thoughts',
                    date: '2024-01-23',
                    content: 'Feeling a bit down tonight...'
                },
                {
                    id: 10,
                    title: 'Morning Walk',
                    date: '2024-01-24',
                    content: 'Beautiful sunrise during my morning walk.'
                },
                {
                    id: 11,
                    title: 'New Project',
                    date: '2024-01-25',
                    content: 'Started a new project at work today.'
                },
                {
                    id: 12,
                    title: 'Birthday Celebration',
                    date: '2024-01-26',
                    content: 'Celebrated my birthday with loved ones!'
                }
            ]
        }
    },
    computed: {
        filteredEntries() {
            return this.entries.filter(entry => 
                entry.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                entry.date.includes(this.searchQuery)
            )
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        viewEntry(id) {
            this.$router.push(`/diary/${id}`)
        }
    }
}
</script>

<style scoped>
.diary-list-container {
    background: #fff;
    padding: 40px;
    max-width: 1286px;
    margin: 0 auto;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.diary-title {
    font: 700 32px Poppins, sans-serif;
    color: #282828;
}

.new-entry-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #282828;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font: 600 16px Manrope, sans-serif;
    cursor: pointer;
}

.search-section {
    margin-bottom: 24px;
}

.search-input {
    width: 100%;
    padding: 16px;
    border-radius: 11px;
    background-color: rgba(220, 210, 247, 0.4);
    border: none;
    font: 400 16px Manrope, sans-serif;
}

.diary-entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.diary-card {
    background-color: rgba(220, 210, 247, 0.4);
    border-radius: 11px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.diary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.diary-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -10px;
}

.diary-info {
    flex: 1;
}

.entry-title {
    font: 600 18px Manrope, sans-serif;
    color: #282828;
    margin-bottom: 8px;
}

.entry-date {
    font: 400 14px Manrope, sans-serif;
    color: #666;
}

@media (max-width: 991px) {
    .diary-list-container {
        padding: 20px;
    }

    .diary-entries {
        grid-template-columns: 1fr;
    }

    .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .new-entry-button {
        justify-content: center;
    }
}
</style>