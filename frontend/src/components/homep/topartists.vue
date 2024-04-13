<script setup>
import { defineProps,defineEmits,ref, watch } from "vue";
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js"
import artistcard from  "@/components/homep/artistcard.vue";
import { useRouter } from 'vue-router';

const router=useRouter();    
const prop=defineProps({
    des: Object,
})

const currentcreator=ref({});

const user=Userstore.getters.getuser();
const topartists=ref([]);
function fetchta(){
    if (prop.des.type=='home') topartists.value = Libstore.getters.getcreators();
    if (prop.des.type=='search') topartists.value = Libstore.getters.getcreators(prop.des.val);
}
const exp=ref(false);
fetchta();
function toartist(val){
    router.push({ name: 'artist', params: {param:val}, reload:true });
}
</script>
 
<template>
    <div class="tscont">
        <div class="rowname d-flex justify-content-between">
            <h4>Top-Artists</h4>
            <div v-if="!exp" class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=true">
                <div>Expand</div>
            </div>
            <div v-else class="btn btn-secondary" style="background-color: #b5d2df; color: black" @click="exp=false">
                <div>Retract</div>
            </div>

        </div>
        <div class="songrow d-flex gap-3"
             :class="{'songrow d-flex gap-3 flex-wrap':exp}">
            <artistcard v-for="(artist,index) in topartists" :key="artist.id" :artist="artist" :index="index" @click="toartist(artist.id)" style="cursor:pointer"/>
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