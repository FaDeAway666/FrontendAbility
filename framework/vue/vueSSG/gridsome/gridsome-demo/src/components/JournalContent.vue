<template>
    <div 
        class="journal-content"
        v-html="mdToHtml(content)"
    />
</template>

<script>
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
export default {
    props: {
        content: String
    },
    methods: {
        mdToHtml (content) {
            return md.render(content)
        }
    }
}
</script>

<style>
p {
    line-height: 1.5;
    font-size: 1.15rem;
}
h2 {
    font-size: 2rem;
}
h3 {
    font-size: 1.5rem;
}
h4, h5, h6 {
    font-size: 1.15rem;
}
</style>
