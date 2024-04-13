<script setup>
import { ref,defineProps, defineEmits, computed } from 'vue'
import Playstore from "@/stores/Play";

const prop=defineProps({
    song: Object,
    index: Number
})
const emit=defineEmits(['play']);

const current=Playstore.getters.currentsong();
function play(){
  if (current.id!=prop.song.id){
    const sind={ 'song':prop.song,'ind':prop.index}
    emit('play',sind);
  }
  else {
    Playstore.dispatch('playcurrent');
  }
}
function pause(){
    Playstore.dispatch('pausecurrent');
}
const isplay=computed(()=>{
    if (current.id>0 && prop.song.id==current.id){
    return current.play;
    }
    else return prop.song.play;
})
</script>

<template>
  <div class="card" style="width: 18rem;max-height: 190px; max-width:186.333px;overflow: hidden;">
    <img :src="'http://127.0.0.1:5000/cover/' + prop.song.cover" class="card-img-top" alt="song image" style="max-height: 124px; object-fit: cover; max-width: 186.33px">
  <div class="card-body d-flex gap-2 justify-content-between"
        :class="{'isplay':current.id==prop.song.id}">
        <h6>{{ prop.song.title }}</h6>
        <div class="play">
            <i v-if="!isplay" class="bi bi-play-circle-fill h1" @click="play"></i>
            <i v-else class="bi bi-pause-circle-fill h1" @click="pause"></i>
        </div> 
  </div>
  </div>
</template>

<style scoped>
    .card-body{
        max-height:50px;
        outline: 0px solid blue;
        align-items: center;
        background-color: rgb(181, 210, 223);
    }
    h6{
        overflow-x: scroll;
        height: 20px;
    }
    .play{
        cursor: pointer;
        outline: 0px solid red;
    }
    .isplay{
        background-color: rgb(66, 133, 66);
    }
</style>