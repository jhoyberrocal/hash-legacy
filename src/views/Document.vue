<template lang="pug">
    v-container
        v-row
          v-col(cols="6")
            v-text-field(outlined, v-model="file.name", dense)
          v-col
            v-btn(text, @click="editFolder")
              v-icon save
        v-row
            v-col(v-for="d in docs", cols="3", v-if="docs.length")
                v-card
                    v-img(
                        :src="`${URL}${d.img}`",
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)",
                        height="200px"
                    )
                    v-card-text  {{ d.name }}
</template>

<script>
    export default {
        name: "Document",
        data() {
            return {
                docs: [],
                file: {}
            }
        },
        created() {
            this.IO.emit('get-documents', {idF: this.$route.params.idF});
        },
        mounted() {
            const V = this;

            this.IO.on('documents', data => {
              V.docs = data.files;
              V.file = data.folder;
            });
        },
        methods: {
            editFolder() {
              this.IO.emit('edit-folder', this.file);
            }
        }
    }
</script>

<style scoped>

</style>
