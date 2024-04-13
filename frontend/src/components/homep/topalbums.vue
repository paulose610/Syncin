<script setup>
import { defineProps,defineEmits,ref, watch } from "vue";
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js"
import albumcard from  "@/components/homep/albumcard.vue";
import expcard from "@/components/homep/expcard.vue";
import Playstore from "@/stores/Play";
    
const prop=defineProps({
    des: Object,
})

const currentsong=ref({});
currentsong.value=Playstore.getters.currentsong();
const currentalbum=ref({'id':-1});
const currentcreator=ref({});
function scal(id){
    currentalbum.value=Libstore.getters.getalbums().find(s=>s.id==id);
    albumsongs.value=Libstore.getters.getalbumsongs(id);
}
const user=Userstore.getters.getuser();
const topalbums=ref([]);
function fetchta(){
    if (prop.des.type=='home') topalbums.value = Libstore.getters.gettopalbums();
    if (prop.des.type=='search') topalbums.value = Libstore.getters.gettopalbums(prop.des.val);
    if (prop.des.type=='artist') topalbums.value = Libstore.getters.artistalbums(prop.des.val);
}

const albumsongs=ref([]);
const emit=defineEmits(['play'])
function playset(sind){
    const carr=albumsongs.value.map(s=>{
        return s.id;
    })
    Playstore.dispatch('setandplay',{'song': sind.song,'cind':sind.ind,'carr':carr});
}
const exp=ref(false);
fetchta();
watch(()=>Libstore.state.albums,()=>{
    console.log('hi');
    fetchta();
    })
</script>
 
<template>
    <div class="tscont">
        <div class="rowname d-flex justify-content-between">
            <h4 v-if="currentalbum.id<1">Top-Albums</h4>
            <h4 v-else>Album : {{currentalbum.name}}</h4>
            <div v-if="currentalbum.id>0" class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="currentalbum={'id':-1}">
                <div>Go back</div>
            </div>
            <div v-if="currentalbum.id==-1 && !exp" class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=true">
                <div>Expand</div>
            </div>
            <div v-else class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=false">
                <div>Retract</div>
            </div>

        </div>
        <div v-if="currentalbum.id<1" class="songrow d-flex gap-3"
                                        :class="{'songrow d-flex gap-3 flex-wrap':exp}">
            <albumcard v-for="(album,index) in topalbums" :key="album.id" :album="album" :index="index" :currentalbum="currentalbum" style="min-width: 150px;" @play="playset" @click="scal(album.id)"/>
        </div>
        <div v-if="currentalbum.id!=-1" class="tsexp">
           <div class="row row-cols-sm-2 row-cols-1 row-cols-md-3 g-1">
           <expcard v-for="(song,index) in albumsongs" :key="song.id" :song="song" :index="index" class="col" @play="playset"/>
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