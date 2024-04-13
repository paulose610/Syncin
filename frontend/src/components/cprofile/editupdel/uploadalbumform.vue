<script setup>
import { ref, defineEmits, computed, onBeforeMount } from 'vue'
import Libstore from "@/stores/Lib.js";
import axios from 'axios';

const error=ref('');
const iserror=computed(()=>{
    return !(error.value==='');
})
const suc=ref('');
const issuc=computed(()=>{
    return !(suc.value==='');
})
const getpic=(event)=>{
  form.value.cover=event.target.files[0]
}
const isdis=ref(false);
const form=ref({
  album: '',
  cover: null,
});
function clearform(){
  form.value.album= '';
  form.value.cover=null
}
function clearmsg(){
  setTimeout(()=>{
    suc.value='';
    error.value='';
  },5000)
}
function upload(){
  const token=localStorage.getItem('authtoken');
  isdis.value=true;
  const formtosend=new FormData();
  formtosend.append('album',form.value.album);
  formtosend.append('cover',form.value.cover);
  const path='http://127.0.0.1:5000/api/albums'
  axios.post(path, formtosend,{
    headers:{
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authentication-Token': token
            } 
  })
  .then((res)=>{
      Libstore.dispatch('createalbum',res.data)
      isdis.value=false;
      clearform();
      suc.value='Album Created successfuly!'
      clearmsg();
  })
  .catch((err)=>{
    isdis.value=false;
    error.value=err.response.data.error;
    console.log(error.value);
    clearmsg();
  })
}
</script>

<template>
  <form class="row g-3" enctype="multipart/form-data" @submit.prevent="upload">
  <div class="col-md-6">
    <label for="album" class="form-label">Album Name</label>
    <input type="string" class="form-control" name="album" id="album" v-model="form.album" required>
  </div>
  <div class="col-md-6">
    <label for="cover" class="form-label">Cover</label>
    <input type="file" class="form-control" name="cover" id="cover" accept="image/*" @change="getpic">
  </div>
  <div v-if="iserror" class="col-md-12">
    <p class="text-danger">{{ error }}</p>
  </div>
  <div v-if="issuc" class="col-md-12">
    <p class="text-success">{{ suc }}</p>
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary" :disabled="isdis">Create</button>
  </div>
</form>
</template>

<style scoped>

</style>