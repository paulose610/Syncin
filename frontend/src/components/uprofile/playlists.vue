<script setup>
import { defineProps,defineEmits,ref, watch,computed } from "vue";
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js"
import plcard from  "@/components/uprofile/plcard.vue";
import expcard from "@/components/homep/expcard.vue";
import Playstore from "@/stores/Play";
    
// const currentsong=ref({});
// currentsong.value=Playstore.getters.currentsong();
const currentpl=ref('');
const plsongs=ref([]);
function selpl(name){
    currentpl.value=Libstore.getters.getpl().find(pl=>pl==name);
    plsongs.value=Libstore.getters.getplsongs(name);
}
// const user=Userstore.getters.getuser();
const playlists=ref([]);
function fetchpls(){
    playlists.value=Libstore.getters.getpl(); 
    console.log(playlists.value);   
}
function playset(sind){
    const carr=plsongs.value.map(s=>{
        return s.id;
    })
    Playstore.dispatch('setandplay',{'song': sind.song,'cind':sind.ind,'carr':carr});
}
const exp=ref(false);
fetchpls();
watch(()=>Libstore.state.playlists,()=>{
    fetchpls();
    plsongs.value=Libstore.getters.getplsongs(currentpl.value);
});
const typ='pl';

</script>
 
<template>
    <div class="tscont">
        <div class="rowname d-flex justify-content-between">
            <h4 v-if="currentpl==''">Playlists</h4>
            <h4 v-else>Playlist : {{currentpl}}</h4>
            <div v-if="currentpl!=''" class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="currentpl=''">
                <div>Go back</div>
            </div>
            <div v-if="currentpl=='' && !exp" class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=true">
                <div>Expand</div>
            </div>
            <div v-else class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=false">
                <div>Retract</div>
            </div>

        </div>
        <div v-if="currentpl==''" class="songrow d-flex gap-3"
                                :class="{'songrow d-flex gap-3 flex-wrap':exp}">
            <div class="addpl" data-bs-toggle="modal" data-bs-target="#newpl"><i class="bi bi-plus-circle h1"></i></div>                    
            <plcard v-for="(pl,index) in playlists" :key="pl" :index="index" :currentpl="pl" style="min-width: 150px;" @open="selpl(pl)"/>
        </div>
        <div v-if="currentpl!=''" class="tsexp">
           <div class="row row-cols-sm-2 row-cols-1 row-cols-md-3 g-1">
           <expcard v-for="(song,index) in plsongs" :key="song.id" :song="song" :index="index" :type='typ' :pl='currentpl' class="col" @play="playset"/>
           </div>
        </div>
    </div> 
</template>
 
<style scoped>
    .tscont{
        width: 100%;
        outline: 0px solid blue;
        margin-top: 25px;
    }
    .rowname{
        color: rgb(12, 34, 80);
        font-weight: bold;
        outline: 0px solid red;
    }
    .songrow{
        overflow-x: auto;
    }
    .tsexp{
        max-height: 348px;
        overflow-y: auto;
    }
    .addpl{
        width: 5rem;
        background-color: #f8f9fa;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 5px;
    }
</style>