<script setup>
import { ref,defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router=useRouter();
const prop=defineProps({
    artist: Object,
    index: Number
})
function toartist(val){
    console.log(val)
}
</script>

<template>
  <div class="card" style="width: 18rem;max-height: 190px; max-width:186.333px;overflow: hidden;" @click="toartist(prop.artist.creator_name)">
    <h6 class="text-center">{{ prop.artist.creator_name }}</h6>
  </div>
</template>

<style scoped>
    h6{
        overflow-x: scroll;
        height: 20px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: larger;
    }
    .isplay{
      outline: 1px solid green;
    }
</style>