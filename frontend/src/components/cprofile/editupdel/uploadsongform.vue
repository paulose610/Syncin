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

const isdis=ref(false);
const form=ref({
  title: '',
  album: '',
  genre: '',
  audio: null,
  cover: null,
  lyrics: '',
});
function clearform(){
  form.value.title= '';
  form.value.album= '';
  form.value.genre='';
  form.value.audio= null;
  form.value.cover= null;
  form.value.lyrics= '';
}
function clearmsg(){
  setTimeout(()=>{
    suc.value='';
    error.value='';
  },5000)
}
const getaud=(event)=>{
  form.value.audio=event.target.files[0]
}
const getpic=(event)=>{
  form.value.cover=event.target.files[0]
}
function upload(){
  const token=localStorage.getItem('authtoken');
  isdis.value=true;
  const formtosend=new FormData();
  formtosend.append('title',form.value.title);
  formtosend.append('album',form.value.album);
  formtosend.append('genre',form.value.genre);
  formtosend.append('audio',form.value.audio);
  formtosend.append('cover',form.value.cover);
  formtosend.append('lyrics',form.value.lyrics);
  const path='http://127.0.0.1:5000/api/songs'
  axios.post(path, formtosend,{
    headers:{
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authentication-Token': token
            } 
  })
  .then((res)=>{
    console.log(res.data);
    Libstore.dispatch('uploadsong',res.data);
    isdis.value=false;
    clearform();
    suc.value='Song uploaded successfully!';
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
  <div class="col-md-4">
    <label for="title" class="form-label">Title</label>
    <input type="string" class="form-control" id="title" v-model="form.title" required>
  </div>
  <div class="col-md-4">
    <label for="songalbum" class="form-label">Album</label>
    <input type="string" class="form-control" id="songalbum" v-model="form.album">
  </div>
  <div class="col-md-4">
    <label for="genre" class="form-label">Genre</label>
    <input type="string" class="form-control" id="genre" v-model="form.genre" required>
  </div>
  <div class="col-md-6 d-flex flex-column">
    <label for="audio" class="form-label">Audio</label>
    <input type="file" class="form-control" name="audio" id="audio" accept=".mp3" @change="getaud" required>
    <small class="text-danger">* Only mp3 files allowed</small>
  </div>
  <div class="col-md-6">
    <label for="cover" class="form-label">Cover</label>
    <input type="file" class="form-control" name="cover" id="cover" accept="image/*" @change="getpic">
  </div>
  <div class="col-md-12">
    <label for="lyrics" class="form-label">Lyrics</label>
    <textarea class="form-control" id="lyrics" v-model="form.lyrics"></textarea>
  </div>
  <div v-if="iserror" class="col-md-12">
    <p class="text-danger">{{ error }}</p>
  </div>
  <div v-if="issuc" class="col-md-12">
    <p class="text-success">{{ suc }}</p>
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary" :disabled="isdis">Upload</button>
  </div>
</form>
</template>

<style scoped>

</style>