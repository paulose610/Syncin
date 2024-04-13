<script setup>
import { defineEmits,ref, watch, defineProps } from "vue";
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js"
import songcard from  "@/components/homep/songcard.vue";
import expcard from "@/components/homep/expcard.vue";
import Playstore from "@/stores/Play";

const prop=defineProps({
    des: Object,
})
const currentsong=ref({});
currentsong.value=Playstore.getters.currentsong()
const exp=ref(false);
function expand(){
    exp.value=!exp.value;
}
const user=Userstore.getters.getuser();
const topsongs=ref(Libstore.getters.gettopsongs());
function fetchts(){
    if (prop.des.type=='home') topsongs.value = Libstore.getters.gettopsongs();
    else if (prop.des.type=='search') topsongs.value= Libstore.getters.gettopsongs(prop.des.val);
    else if (prop.des.type=='artist') topsongs.value = Libstore.getters.artistsongs(prop.des.val);

    else if (prop.des.type=='fsearch') {
        if (prop.des.val.genre!=''){
            topsongs.value=Libstore.getters.gettopsongs().filter(s=>s.genre==prop.des.val.genre);
        }
        if (prop.des.val.artist!=''){
            const crtr=Libstore.getters.getcreators().find(a=>a.creator_name==prop.des.val.artist)
            if (crtr){   
            const cid=crtr.id;
            topsongs.value=topsongs.value.filter(s=>s.creator_id==cid);
            }
        }    
        if (prop.des.val.aname!=''){
            const aids=Libstore.getters.getalbums().filter(al=>al.name==prop.des.val.aname).map(al=>al.id);
            topsongs.value=topsongs.value.filter(s=>aids.includes(s.album_id))
        }
    }
}
// const emit=defineEmits(['play'])
function playset(sind){
    const carr=topsongs.value.map(s=>{
        return s.id;
    })
    Playstore.dispatch('setandplay',{'song': sind.song,'cind':sind.ind,'carr':carr});
}
fetchts();
// const ftch=ref([]);
watch(()=>Libstore.state.songs,()=>{
    fetchts();

})
// watch(()=>Libstore.state.playlists,()=>{fetchpls()});
</script>
 
<template>
    <div class="tscont">
        <div class="rowname d-flex justify-content-between">
            <h4>Top-Hits</h4>
            <div class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="expand">
                <div v-if="!exp">See more</div>
                <div v-else>Close</div>
            </div>
        </div>
        <div v-if="!exp" class="songrow d-flex gap-3">
            <songcard v-for="(song,index) in topsongs" :key="song.id" :song="song" :index="index" style="min-width: 150px;" @play="playset"/>
        </div>
        <div v-else class="tsexp">
           <div class="row row-cols-sm-2 row-cols-1 row-cols-md-3 g-1">
           <expcard v-for="(song,index) in topsongs" :key="song.id" :song="song" :index="index" class="col" @play="playset"/>
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
</style>