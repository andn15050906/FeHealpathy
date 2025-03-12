<template>
    <v-tabs v-model="activeTab" :color="tabColor" :direction="tabDirection" :grow="grow" :centered="centered">
        <v-tab v-for="(tab, index) in tabs" :key="index" :value="index" :href="tab.link"
            :target="tab.target || '_self'">
            {{ tab.label }}
        </v-tab>
    </v-tabs>
</template>

<script>
    export default {
        props: {
            tabs: {
                type: Array,
                default: [
                    { label: 'Self Assessment', link: '/statistics/self-assessment', target: '_blank' },
                    { label: 'Your Activities', link: '/statistics/user-activity', target: '_blank' }
                ],
                validator: (value) => {
                    return value.every(tab =>
                        typeof tab === 'object' &&
                        'label' in tab &&
                        'link' in tab
                    )
                }
            },

            initialTab: {
                type: Number,
                default: 0
            },

            tabColor: {
                type: String,
                default: 'primary'
            },

            tabDirection: {
                type: String,
                default: 'horizontal',
                validator: (value) => ['horizontal', 'vertical'].includes(value)
            },

            grow: {
                type: Boolean,
                default: false
            },

            centered: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                activeTab: this.initialTab
            }
        },

        watch: {
            initialTab(newVal) {
                this.activeTab = newVal
            }
        }
    }
</script>

<style scoped>
.v-btn__content {
    position: static !important;
}
</style>