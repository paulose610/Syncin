<script setup>
import { ref, defineProps, defineEmits,watch } from 'vue';
import Libstore from "@/stores/Lib";

const prop=defineProps({
    sid: Number,
})
function atpl(pl){
    Libstore.dispatch('atpl',{'pl':pl,'sid':prop.sid});
}
const apl=ref([]);
function fetchpl(){
    apl.value=[...new Set(Libstore.getters.getplta(prop.sid))];
}
fetchpl();
watch(()=>Libstore.state.songs,()=>{fetchpl();});
watch(()=>Libstore.state.playlists,()=>{fetchpl();});
</script>

<template>
<div class="modal fade" id="atpl" tabindex="-1" aria-labelledby="atplLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="atplLabel">Add to PlayList</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul class="list-group list-group-flush text-center">    
        <li v-for="pl in apl" :key="pl" class="list-group-item" style="cursor:pointer" @click="atpl(pl)">{{pl}}</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal.fade {
    transition: opacity 0.01s linear;
}

</style>