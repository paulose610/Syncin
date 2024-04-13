<script setup>
import { defineProps, defineEmits,computed , ref}  from 'vue';
import Playstore from "@/stores/Play";
import Libstore from "@/stores/Lib";


const prop=defineProps({
  song: Object,
  index: Number,
  type: String,
  pl: String
})
const emit=defineEmits(['play']);
const current=ref({});
current.value=Playstore.getters.currentsong();
function play(){
  if (current.value.id!=prop.song.id){
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
  if (current.value.id==prop.song.id){
    return current.value.play
    }
    else return prop.song.play
})
function delfpl(){
  if (window.confirm('Are you sure you want to delete?')) {
  Libstore.dispatch('delfpl',{'pl':prop.pl,'sid':prop.song.id});
} else {

  return;
}
}
</script>

<template>
<div class="expcard d-flex flex-column justify-content-center align-items-center">
  <div class="cont d-flex justify-content-between align-items-center"
        :class="{'isplay': current.id==prop.song.id}"> 
  <img :src="'http://127.0.0.1:5000/cover/' + prop.song.cover" class="card-img-top" alt="song image" style="max-height: 70px; object-fit: cover; max-width: 70px"> 
  <h6>{{ prop.song.title }}</h6>
  <div class="btngrp d-flex gap-2">
  <div v-if="prop.type=='pl'" class="delfpl" style="cursor: pointer;" @click="delfpl(prop.song.id)"><i class="bi bi-trash3 h3"></i></div>  
  <div class="play" style="cursor: pointer;">
      <i v-if="!isplay" class="bi bi-play-circle-fill h2" @click="play"></i>
      <i v-else class="bi bi-pause-circle-fill h2" @click="pause"></i>
  </div>
  </div>
  </div>
</div>
</template>

<style scoped>
  .expcard{
    outline: 0px solid red;
    height: 60px;
    background-color: #c6dac4;
    padding-left: 3px;
    padding-right: 3px;
  }
  .cont{
    background-color: #f5f5f5;
    height: 95%;
    border-radius: 5px;
    width: 95%;
  }
  .play{
    margin-right: 4px;
  }
  .isplay{
    outline: 2px solid rgb(66, 133, 66);
  }
</style>