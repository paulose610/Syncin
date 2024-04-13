<script setup>
import {ref,reactive,watch} from 'vue';
import { useRouter } from 'vue-router'
import Userstore from "@/stores/User.js";
import Libstore from "@/stores/Lib.js";
import Playstore from "@/stores/Play.js";
import expcard from '@/components/homep/expcard.vue'

const router=useRouter()
const songs=ref(Libstore.getters.getsongs());
const lps=ref([]);
const lpi=ref(Userstore.getters.getlp());
const cs=ref(Playstore.getters.currentsong());
const lyrics=ref(cs.value.lyrics);
const album=ref(Playstore.getters.album());
const creator=ref(Playstore.getters.creator());

function fetch(){
lpi.value=Userstore.getters.getlp();
lps.value=[];
for (var id of lpi.value.split(',')){
  var s=songs.value.find(s=>s.id==id);
  if (s) lps.value.push(s);
}
}
watch(Playstore.getters.currentsong(),()=>{ 
      lyrics.value=cs.value.lyrics;
      album.value=Playstore.getters.album();
      creator.value=Playstore.getters.creator();
})

fetch();
function playset(sind){
    const carr=lps.value.map(s=>{
        return s.id;
    })
    Playstore.dispatch('setandplay',{'song': sind.song,'cind':sind.ind,'carr':carr});
}
function fsal(){
  router.push({ name: 'searchd', params:{param:'!@#'}, query:{genre:'',artist:creator.value.creator_name,album:album.value.name}, reload:true });
}
function toart(){
  router.push({ name: 'artist', params: {param:creator.value.id}, reload:true });
}
</script>

<template>
  <div class="rbc d-flex flex-column gap-1 justify-content-between">
    <div class="lp d-flex gap-2 flex-column">
       <div class="top d-flex justify-content-between">
       <h4>Last Played</h4>
       <div class="ref" @click="fetch()">
        <i class="bi bi-arrow-clockwise h4"></i>
       </div>
       </div>
       <expcard v-for="(song,index) in lps" :key="song.id" :song="song" :index="index" class="col" @play="playset"/>
    </div>  
    <div v-if="cs.id>-1" class="sinfo d-flex justify-content-around">
      <div v-if="cs.album_id>0" class="aname">
        <h5>Album:</h5>
        <a class="icon-link icon-link-hover" style="cursor:pointer" @click="fsal">{{album.name}}</a>
      </div>
      <div class="cname">
        <h5>Artist:</h5> 
        <a class="icon-link icon-link-hover" style="cursor:pointer" @click="toart">{{creator.creator_name}}</a>
      </div>
    </div>
    <div class="lyr d-flex flex-column gap-2">
       <h4>Lyrics</h4>
       <pre>{{ lyrics }}</pre>
    </div>
  </div>
</template>

<style scoped>
  .rbc{
    background-color: whitesmoke;
    width: 350px;
    height: 100%;
    padding: 10px;
  }
  .rbc{
    overflow-y: auto;
  }
</style>