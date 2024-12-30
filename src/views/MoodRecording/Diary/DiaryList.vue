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
                    <div class="mood-indicator">
                        <img :src="getMoodIcon(entry.mood)" :alt="entry.mood" class="mood-icon" />
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
                    mood: 'very-happy',
                    content: 'Today was amazing! I got promoted at work.'
                },
                {
                    id: 2,
                    title: 'Coffee with Friends',
                    date: '2024-01-16',
                    mood: 'very-happy',
                    content: 'Had a wonderful coffee meetup with old friends.'
                },
                {
                    id: 3,
                    title: 'Rainy Day Thoughts',
                    date: '2024-01-17',
                    mood: 'neutral',
                    content: 'Just a normal rainy day, staying indoors.'
                },
                {
                    id: 4,
                    title: 'Missing Home',
                    date: '2024-01-18',
                    mood: 'sad',
                    content: 'Feeling homesick today...'
                },
                {
                    id: 5,
                    title: 'Weekend Adventure',
                    date: '2024-01-19',
                    mood: 'very-happy',
                    content: 'Went hiking with my best friends!'
                },
                {
                    id: 6,
                    title: 'Movie Night',
                    date: '2024-01-20',
                    mood: 'very-happy',
                    content: 'Watched my favorite movie again.'
                },
                {
                    id: 7,
                    title: 'Work Deadline',
                    date: '2024-01-21',
                    mood: 'neutral',
                    content: 'Busy day at work, but managed to finish everything.'
                },
                {
                    id: 8,
                    title: 'Family Dinner',
                    date: '2024-01-22',
                    mood: 'very-happy',
                    content: 'Had a wonderful dinner with family.'
                },
                {
                    id: 9,
                    title: 'Late Night Thoughts',
                    date: '2024-01-23',
                    mood: 'sad',
                    content: 'Feeling a bit down tonight...'
                },
                {
                    id: 10,
                    title: 'Morning Walk',
                    date: '2024-01-24',
                    mood: 'very-happy',
                    content: 'Beautiful sunrise during my morning walk.'
                },
                {
                    id: 11,
                    title: 'New Project',
                    date: '2024-01-25',
                    mood: 'neutral',
                    content: 'Started a new project at work today.'
                },
                {
                    id: 12,
                    title: 'Birthday Celebration',
                    date: '2024-01-26',
                    mood: 'very-happy',
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
        getMoodIcon(mood) {
            const moodIcons = {
                'very-happy': 'https://cdn.builder.io/api/v1/image/assets/TEMP/9b68f23974a28e2ee613607ad4e8f9086a623c81fd8d04436f7b8862eb0bcd72?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657',
                'sad': 'https://cdn.builder.io/api/v1/image/assets/TEMP/f3293582c94a47068c7d253c75b4dfc429b8270402ffc3b71a7b7a3b7c841e81?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657',
                'neutral': 'https://cdn.builder.io/api/v1/image/assets/TEMP/2b08e9dcbcdfb2618f02b4a2293a914c1c92b9d58c21e5bf018dbe03cff35c2d?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657',
                'very-sad': 'https://cdn.builder.io/api/v1/image/assets/TEMP/9b68f23974a28e2ee613607ad4e8f9086a623c81fd8d04436f7b8862eb0bcd72?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657'
            }
            return moodIcons[mood]
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

.mood-indicator {
    width: 40px;
    height: 40px;
}

.mood-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
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