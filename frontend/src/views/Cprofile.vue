<script setup>
import Userstore from "@/stores/User.js";
import Libstore from "@/stores/Lib.js";
import Playstore from "@/stores/Play";

import navbar from "@/components/navbar.vue";
import atpl from "@/components/uprofile/atpl.vue";
import player from "@/components/player.vue";
import pbar from "@/components/cprofile/pbar.vue";
import modal from "@/components/cprofile/modal.vue";
import topalbums from "@/components/homep/topalbums.vue"
import topsongs from "@/components/homep/topsongs.vue";

import { ref, onMounted, onBeforeMount, toRaw, watch } from 'vue'

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
let type=ref('');
let typeprop=ref('');
function modaltype(payload){
  type.value=payload;
}
watch(type,(nval)=>{
  typeprop.value=nval;
})

</script>

<template>
  <div v-if="mounted" class="profilepage">
    <atpl :sid="current.id"/>
    <navbar />
    <div class="profilecontent d-flex justify-content-between align-items-start flex-grow-1" style="width:100%;">
      <div class="discont d-flex flex-column gap-5">     
        <topsongs :des="{'type':'artist','val':user.id}"/>  
        <topalbums :des="{'type':'artist','val':user.id}"/>
      </div>
      <div class="pbar d-flex">
      <pbar @modaltype="modaltype"/>
      </div>
    </div>
    <player class="fixed-bottom"/>
  </div>
  <modal v-if="mounted" :type="typeprop" :user="user"/>
</template>

<style scoped>
    .profilepage{
      height: 100vh;
    }
    .profilecontent{
        height: 79vh;
        background-color: rgb(198, 218, 196);
        /*width: 100%;*/
    } 
    .pbar{
        height: 100%;
        align-items: center;
        width: 250px;
        }
   
    .become{
      margin-top: 10px;
    }
    .discont {
  flex: 1;
  overflow: auto; 
  outline: 0px solid red;
  height: 79vh;
  margin-left:20px;
  }
</style>