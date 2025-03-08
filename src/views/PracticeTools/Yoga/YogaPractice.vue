<template>

</template>

<script>
export default {
    mounted() {
        let scripts = [
            'https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js',
            'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js',
            'https://unpkg.com/ml5@0.4.3/dist/ml5.min.js'
        ]

        scripts.forEach(async(script) => {
            let scriptElement = document.createElement('script');
            scriptElement.setAttribute('src', script);
            document.head.appendChild(scriptElement);
            await setTimeout(150);
        });

        (async () => {
            await setTimeout(450);
            let scriptElement = document.createElement('script');
            scriptElement.setAttribute('src', 'assets/js/ai/yoga.practice.js');
            document.head.appendChild(scriptElement);
        })();
    }
}
</script>