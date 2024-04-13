<script setup>
import{ ref, watch, computed, reactive } from 'vue';
import Playstore from '@/stores/Play';
import Libstore from "@/stores/Lib";
const allsongs=Libstore.getters.getsongs();
const cind=ref(Playstore.getters.currentind());
const carr=ref(Playstore.getters.currentarr());
const creators=ref(Libstore.getters.getcreators());
const currentsong=reactive(Playstore.getters.currentsong());
const audio=ref(Playstore.getters.getaudio());

watch(() => Libstore.state.songs, () => {
  isl.value=Playstore.getters.isliked(currentsong.id)
  isf.value=Playstore.getters.isflagged(currentsong.id)
});

watch(()=>Playstore.state.song.id,()=>{
  Playstore.dispatch('plays',{'sid':currentsong.id,'aid':currentsong.album_id,'cid':currentsong.creator_id});
})

const isl=ref(Playstore.getters.isliked(currentsong.id));
function like(){
  if (currentsong.id>0) {
    isl.value=!isl.value;
    Libstore.dispatch('like',{'sid':currentsong.id,'aid':currentsong.album_id,'cid':currentsong.creator_id});
  }  
  }
const isf=ref(Playstore.getters.isflagged(currentsong.id));
function flag(){
  if (currentsong.id>0) {
    isf.value=!isf.value;
    Libstore.dispatch('flag',currentsong.id);
  }
}
const ap=ref(Playstore.getters.ap());
function changeap(){
  Playstore.dispatch('changeap');
  ap.value=Playstore.getters.ap();
}

watch(()=>Playstore.getters.getaudio(), (newAudio) => {
  audio.value = newAudio;
  audio.value.addEventListener('ended', () => {
    if (ap.value) next();
    else pause();
  });
});


function next(){
  if (currentsong.id>0){
    cind.value=Playstore.getters.currentind();
    carr.value=Playstore.getters.currentarr();
    const nind = cind.value < carr.value.length - 1 ? cind.value + 1 : 0;
    const nsid=carr.value[nind];
    const ns=allsongs.find(s=>s.id==nsid);
    Playstore.dispatch('playersetplay',{'song':ns,'ind':nind});
  }
}  
function back(){
  if (currentsong.id>0){
    cind.value=Playstore.getters.currentind();
    carr.value=Playstore.getters.currentarr();
    const nind = cind.value > 0 ? cind.value - 1 : carr.value.length-1;
    const nsid=carr.value[nind];
    const ns=allsongs.find(s=>s.id==nsid);
    Playstore.dispatch('playersetplay',{'song':ns,'ind':nind});
  }  
}  
function play(){
  if (currentsong.id>0){
  if (audio.value.currentTime==audio.value.duration)  Playstore.dispatch('plays',{'sid':currentsong.id,'aid':currentsong.album_id,'cid':currentsong.creator_id});  
  Playstore.dispatch('playcurrent');
  console.log
  }
}
function pause(){
  Playstore.dispatch('pausecurrent');
}
const isplay=computed(()=>{
  if (currentsong.play){
    return true
  }
  else return false
})
console.log(currentsong);
</script>

<template>
  <div class="body d-flex justify-content-between align-items-center">
    <div class="songinfo d-flex gap-3 align-items-center">
    <img v-if="currentsong.id>0" :src="'http://127.0.0.1:5000/cover/' + currentsong.cover" class="img-fluid" alt="song cover"  style="object-fit: cover; border-radius: 5px; max-height: 60px;">
    <div>{{ currentsong.title }}</div>
    <div class="ap" @click="changeap">
    <div v-if="ap" class="ap"><i class="bi bi-collection-play-fill h3"></i></div>
    <div v-else class="ap"><i class="bi bi-collection-play h3"></i></div>
    </div>
    </div>
    <div class="bpn d-flex justify-content-around gap-3 align-items-center" :disabled="isplay"> 
      <div class="next" style="cursor: pointer;" @click="back">
        <i class="bi bi-skip-start-fill h1"></i> 
      </div> 
      <div class="playpause" style="cursor: pointer;">
        <i v-if="!isplay" class="bi bi-play-circle-fill h1" @click="play"></i>
        <i v-else class="bi bi-pause-circle-fill h1" @click="pause"></i>
      </div>
      <div class="next" style="cursor: pointer;" @click="next">
        <i class="bi bi-skip-end-fill h1"></i> 
      </div> 
    </div>
    <div class="options d-flex gap-4">
      <div class="flag" @click="flag">
        <i v-if="!isf" class="bi bi-flag h3"></i>
        <i v-else class="bi bi-flag-fill h3"></i>
      </div>
      <div class="like" @click="like">
        <i v-if="!isl" class="bi bi-heart h3"></i>
        <i v-else class="bi bi-heart-fill h3"></i>
      </div>
      <div class="atpl" data-bs-toggle="modal" data-bs-target="#atpl"><i class="bi bi-archive-fill h3"></i></div>
      <i class="bi bi-volume-down-fill h1"></i>
    </div>
  </div>
</template>

<style scoped>
  .body{
    background-color: #f8f9fa;
    height: 10.5vh;
    width: 100%;
    outline: 0px solid red;
  }
  .like,.atpl,.flag{
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: 0px solid red;
    cursor: pointer;
  }
</style>