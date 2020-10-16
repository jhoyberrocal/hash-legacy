<template lang="pug">
    v-container
        v-row
            v-col(v-for="i in collections", cols="2")
                v-card(:to="`hasher/${i.id}`", flat)
                    .icon-folder
                      img.img-folder(src="./../assets/icons/folder.svg")
                    v-card-text.text-truncate {{ i.name }}
</template>

<script>
    export default {
        name: "Collections",
        data() {
            return {
                collections: []
            }
        },
        created() {
            this.IO.emit('get-collections');
        },
        mounted() {
            const V = this;
            this.IO.on('collections', data => V.collections = data);
        }
    }
</script>

<style lang="scss" scoped>
  .icon-folder {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    img.img-folder {
      width: 72px;
    }
  }
</style>
