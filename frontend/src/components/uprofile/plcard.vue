<script setup>
import { ref,defineProps, defineEmits, computed } from 'vue'
import Playstore from "@/stores/Play";
import Libstore from "@/stores/Lib";

const prop=defineProps({
    currentpl: String,
    index: Number,
})

const emit=defineEmits(['open'])

function deletepl(){
  if (window.confirm('Are you sure you want to delete?')) {
  Libstore.dispatch('deletepl', prop.currentpl);
} else {

  return;
}

}
function oppl(){
  emit('open');
}
</script>

<template>
  <div class="card" style="width: 18rem;max-height: 190px; max-width:186.333px;">
    <div class="pln" @click="oppl" style="cursor:pointer"><h3 class="text-center">{{ prop.currentpl }}</h3></div>
    <div class="btnpanel d-flex justify-content-between">
    <div class="delbtn" style="cursor: pointer;" @click="deletepl"><i class="bi bi-trash3 h4"></i></div>
    <div class="open" style="cursor: pointer;" @click="oppl"><i class="bi bi-folder2-open h4"></i></div>
    </div>
  </div>
</template>

<style scoped>
    .pln{
        overflow-x: scroll;
        height: 35px;
        outline: 0px solid red;
    }
    .card{
      display: flex;
    }
</style>