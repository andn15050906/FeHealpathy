<template>
    <div class="music-player">
        <div class="time-control">
            <p class="time-control__current">{{ getTime(songInfo.currentTime) }}</p>
            <div class="track">
                <div class="track__bar" :style="{
                    background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`
                }">
                    <input type="range" min="0" :max="songInfo.duration || 0" :value="songInfo.currentTime"
                        @input="dragHandler" class="track__input" />
                    <div class="track__animate" :style="trackAnim"></div>
                </div>
            </div>
            <p class="time-control__total">
                {{ songInfo.duration ? getTime(songInfo.duration) : '00:00' }}
            </p>
        </div>
        <div class="play-control">
            <i @click="skipTrackHandler('skip-back')"
                class="fas fa-angle-left play-control__button play-control__button--skip-back"></i>
            <i v-if="!isPlaying" @click="playSongHandler"
                class="fas fa-play play-control__button play-control__button--play"></i>
            <i v-else @click="playSongHandler"
                class="fas fa-pause play-control__button play-control__button--pause"></i>
            <i @click="skipTrackHandler('skip-forward')"
                class="fas fa-angle-right play-control__button play-control__button--skip-forward"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MusicPlayer',
    props: {
        currentSong: {
            type: Object,
            required: true,
        },
        isPlaying: {
            type: Boolean,
            required: true,
        },
        audioRef: {
            type: Object,
            required: true,
        },
        songInfo: {
            type: Object,
            required: true,
        },
        songs: {
            type: Array,
            required: true,
        },
    },
    methods: {
        dragHandler(e) {
            const currentTime = e.target.value;
            this.audioRef.currentTime = currentTime;

            this.$emit("update-song-info", {
                ...this.songInfo,
                currentTime: parseFloat(currentTime),
            });
        },
        playSongHandler() {
            this.$emit("toggle-is-playing", !this.isPlaying);
        },

        getTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        },

        skipTrackHandler(direction) {
            this.$emit("skip-track", direction);
        },
    },
    computed: {
        trackAnim() {
            if (!this.songInfo.duration || this.songInfo.currentTime < 0) {
                return { width: "0%" };
            }
            const percentage = (this.songInfo.currentTime / this.songInfo.duration) * 100;
            return {
                width: `${Math.min(percentage, 100)}%`,
            };
        },
    },
};
</script>

<style scoped>
.music-player {
    width: 100%;
    height: 28%;
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.time-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.time-control__current,
.time-control__total {
    font-size: 1rem;
    color: #666;
}

.track {
    width: 100%;
    height: 0.5rem;
    background-color: #eee;
    border-radius: 0.25rem;
    margin: 0 1rem;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.track__bar {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    background: linear-gradient(to right, #2ab3bf, #205950);
    border-radius: 0.25rem;
}

.track__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 2;
    cursor: pointer;
}

.track__input:focus {
    outline: none;
}

.track__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.4rem;
    width: 1.4rem;
    background-color: #fff;
    /* Màu trắng */
    border-radius: 50%;
    border: 2px solid #2ab3bf;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    position: relative;
    z-index: 3;
}

.track__input::-moz-range-thumb {
    height: 1.4rem;
    width: 1.4rem;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #2ab3bf;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.track__animate {
    background: linear-gradient(to right, #2ab3bf, #205950);
    height: 100%;
    border-radius: 0.25rem;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: width 0.1s ease-in-out;
}

.play-control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 2rem;
}

.play-control__button {
    color: #2ab3bf;
    cursor: pointer;
    font-size: 1.5rem;
    transition: color 0.3s ease;
}

.play-control__button:hover {
    color: #205950;
}

.play-control__button--play,
.play-control__button--pause {
    font-size: 2rem;
}
</style>
