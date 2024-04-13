<script setup>
import navbar from "@/components/navbar.vue";
import atpl from "@/components/uprofile/atpl.vue";
import rsbar from "@/components/rsbar.vue";
import player from "@/components/player.vue"
import topsongs from "@/components/homep/topsongs.vue";

import { ref, onMounted, computed, onBeforeMount, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router';

const route=useRoute();
const genre=route.query.genre;
const artist=route.query.artist;
const aname=route.query.album;
console.log(genre,artist,aname);

import Libstore from "@/stores/Lib.js"
import Userstore from "@/stores/User.js"
import Playstore from "@/stores/Play.js"

const user=ref('');
const mounted=ref(false);
onBeforeMount( async () => {
  await Userstore.dispatch('getuserinfo');
  user.value = Userstore.getters.getuser();
  await Libstore.dispatch('libload',user.value);
  mounted.value=true;
});
const current=Playstore.getters.currentsong(); 
let ls=ref(false);
let rs=ref(false);
 
const barchng=(bar)=>{
  if (bar==='ls') ls.value=!ls.value;
  else rs.value=!rs.value;
}
const barchk=(bar)=>{
  if (bar==='rs') return rs.value;
  else return ls.value;
}

</script>

<template>
  <div v-if="mounted" class="homepage"> 
    <atpl :sid="current.id"/>
    <navbar />
    <div class="homecontent d-flex justify-content-between align-items-start flex-grow-1" style="width:100%;">
      <div class="discont d-flex flex-column gap-5">
          <topsongs :des="{'type':'fsearch','val':{'genre':genre,'artist':artist,'aname':aname}}"/>
      </div>
      <div class="bars rtb d-flex">
      <button class="rsbut btn" @click="barchng('rs')">
        <i v-if="!barchk('rs')" class="bi bi-chevron-bar-left"></i>
        <i v-if="barchk('rs')" class="bi bi-chevron-bar-right"></i>
      </button>
      <rsbar v-if="barchk('rs')"/>
      </div>
    </div>
    <player class="fixed-bottom"/>
  </div>
</template>

<style scoped>
  .homepage{
    height: 100vh;
  }
  .homecontent{
    background-color: #c6dac4;
    align-items: center;
    height:79vh;
  }
  .rsbut,.lsbut{
    background-color:#f8f9fa;
    height: 60px;
    border-radius: 0px;
  }
  .lsbut{
    border-top-right-radius: 10px; 
    border-bottom-right-radius: 10px;
  }
  .rsbut{
    border-top-left-radius: 10px; 
    border-bottom-left-radius: 10px;
  }
  .bars{
    height: 100%;
    align-items: center;
  }
  .discont {
  flex: 1;
  overflow: auto; 
  outline: 0px solid red;
  height: 79vh;
  margin-left:20px;
  }
</style>