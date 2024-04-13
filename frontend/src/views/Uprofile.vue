<script setup>
import Userstore from "@/stores/User.js";
import Libstore from "@/stores/Lib.js";
import Playstore from "@/stores/Play";
import atpl from "@/components/uprofile/atpl.vue";
import navbar from "@/components/navbar.vue";
import player from "@/components/player.vue";
import rsbar from "@/components/rsbar.vue";
import uprobar from "@/components/uprofile/uprobar.vue";
import playlists from "@/components/uprofile/playlists.vue";
import newpl from "@/components/uprofile/newpl.vue";

import { ref, onMounted, onBeforeMount, toRaw, computed } from 'vue'

const mounted=ref(false);
const user=ref('');
onBeforeMount( async () => {
  await Userstore.dispatch('getuserinfo');
  user.value = Userstore.getters.getuser();
  await Libstore.dispatch('libload',user.value);
  mounted.value=true;
});
const current=ref({});
current.value=Playstore.getters.currentsong(); 
const isuser=computed(()=>{
  return user.value.role==='user';
})

let bar=ref(true);

const barchng=(()=>{
  bar.value=!bar.value;
})
const barchk=(()=>{
  return bar.value;
})
function become_creator(payload){
  console.log(payload);
  Userstore.dispatch('become_creator',payload);
}
const refetch=(async ()=>{
  await Libstore.dispatch('libload',user.value);
  console.log('hi');
})
</script>

<template>
  <div v-if="mounted" class="profilepage">
    <atpl :sid="current.id"/>
    <navbar />
    <div class="profilecontent d-flex justify-content-between" style="width:100%;height: 79vh;">
      <div class="maincontent d-flex flex-column justify-content-start align-items-center">     
        <uprobar :isuser="isuser" @remove_become="become_creator" :email="user.email"/> 
        <playlists />   
      </div>
      <div class="bar d-flex">
      <button class="barbut btn" @click="barchng()">
        <i v-if="!barchk()" class="bi bi-chevron-bar-left"></i>
        <i v-if="barchk()" class="bi bi-chevron-bar-right"></i>
      </button> 
      <rsbar v-if="barchk()"/>
      </div>
    </div>
    <player class="fixed-bottom"/>
    <newpl @refetch="refetch"/>
  </div>
</template>

<style scoped>
  .bar{
    height: 100%;
    align-items: center;
    }
   .barbut{
    background-color:#f8f9fa;
    height: 60px;
    border-radius: 0px;
    border-top-left-radius: 10px; 
    border-bottom-left-radius: 10px;
    }
    .maincontent{
        height: 79vh;
        overflow: auto;
        background-color: rgb(198, 218, 196);
        width: 100%;
        padding-left: 10px;
    }    

</style>