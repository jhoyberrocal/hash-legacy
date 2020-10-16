<template lang="pug">
  v-app
    v-navigation-drawer(app, color="grey lighten-5", permanent, width="200", floating)
      v-list
        v-list-item
          v-list-item-action
            img.icon-brand(src="./../assets/icons/fingerprint.svg")
          v-list-item-title Hasher
      v-list(dense)
        v-list-item(:key="c.id", v-for="c in collections", :to="`/hasher/${c.id}`")
          img.icon-mini(src="./../assets/icons/folder.svg")
          v-list-item-title {{c.name}}
    v-app-bar(dense, app, flat)
      v-btn(outlined, text, to="/hasher", exact)
        v-icon home
      v-spacer
      v-btn(icon, @click="e => dialog = !dialog")
        v-icon create_new_folder
    .grey.lighten-4.fill-height
      v-content(color="grey lighten-5")
        router-view(:key="$route.fullPath")
    v-dialog(v-model="dialog", width="500")
      v-card
        v-card-title
          span.headline New folder
        v-card-text
          v-text-field(label="name", outlined, v-model="newFolder")
          v-btn(outlined, :disabled="!newFolder || newFolder.length < 3", @click="addFolder") Save
</template>

<script>
    export default {
        name: "Hasher",
        data() {
            return {
                dialog: false,
                collections: [],
                newFolder: ''
            }
        },
        created() {
            this.IO.emit('get-collections');
        },
        mounted() {
            const V = this;
            this.IO.on('collections', data => V.collections = data);
        },
        methods: {
          addFolder() {
            this.IO.emit('new-folder', this.newFolder);
          }
        }
    }
</script>

<style scoped>

</style>
