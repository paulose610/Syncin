<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Libstore from "@/stores/Lib";

const emit=defineEmits(['refetch']);

const plname=ref('');
const msg=ref('');
const err=ref('');

function createplaylist(){
    console.log(plname.value);
    Libstore.dispatch('createplaylist',plname.value)
    .then((res)=>{
        if (res) msg.value='created new playlist!'
        else err.value='playlist already exists!'
        clear();
        emit('refetch');
    });
}
function clear(){
  setTimeout(()=>{
    msg.value='';
    err.value='';
    plname.value='';
  },5000)
}
</script>

<template>
<div class="modal fade" id="newpl" tabindex="-1" aria-labelledby="newplLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="newplLabel">Create new Playlist</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form @submit.prevent="createplaylist">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="inputField" placeholder="Name" v-model="plname" required>
        <label for="inputField">Name:</label>
        <small v-if="msg!=''" class="text-success">{{msg}}</small>
        <small v-if="err!=''" class="text-danger">{{err}}</small>
        </div>
        <button type="submit" class="btn btn-success">Create</button>
      </form>
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