<script setup>
import { ref,defineProps, defineEmits, computed } from 'vue'
import Playstore from "@/stores/Play";

const prop=defineProps({
    album: Object,
    index: Number,
    currentalbum: Object
})
</script>

<template>
  <div class="card" 
        :class="{'isplay': prop.album.id==prop.currentalbum.id}" style="width: 18rem;max-height: 190px; max-width:186.333px;overflow: hidden;">
    <img :src="'http://127.0.0.1:5000/cover/' + prop.album.cover" class="card-img-top" alt="album image" style="max-height: 124px; object-fit: cover; max-width: 186.33px">
    <h6 class="text-center">{{ prop.album.name }}</h6>
  </div>
</template>

<style scoped>
    h6{
        overflow-x: scroll;
        height: 20px;
    }
    .isplay{
      outline: 1px solid green;
    }
</style>