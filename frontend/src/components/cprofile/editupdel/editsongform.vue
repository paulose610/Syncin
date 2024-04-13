<script setup>
import { ref, defineEmits, computed, onBeforeMount } from 'vue'
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js";
import axios from 'axios';

const usersongs=ref('');
const sid=ref(-1);
const ind=ref(-1);
const song=ref({});
const found=ref(false);
const albs=ref('');
const albind=ref(-1);
usersongs.value=Libstore.getters.getusersongs();
albs.value=Libstore.getters.getuseralbums();
let cid=Userstore.getters.getuser().id;
function identify(event){
    const title=event.target.value;
    ind.value=usersongs.value.findIndex(s=>s.title==title && s.creator_id==cid);
    if (ind.value>-1){
        found.value=true;
        song.value=usersongs.value[ind.value];
        fillup(song.value);
    }
    else {
        found.value=false;
        ind.value=-1;
        clearform();
    }
}
function fillup(s){
    sid.value=s.id;
    form.value.title=s.title;
    form.value.lyrics=s.lyrics;
    form.value.genre=s.genre;
    albind.value=albs.value.findIndex(a=>a.id==s.album_id);
    if (albind.value>-1) form.value.album=albs.value[albind.value].name;

}

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
  songsearch:'',
  title: '',
  album: '',
  genre: '',
  audio: null,
  cover: null,
  lyrics: '',
  removecover: false
});
function clearform(){  
  found.value=false;  
  song.value={}; 
  form.value.title= '';
  form.value.album= '';
  form.value.genre='';
  form.value.audio= null;
  form.value.cover= null;
  form.value.removecover=false;
  form.value.lyrics= '';
  sid.value=-1;
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
function edit(){
  const token=localStorage.getItem('authtoken');
  isdis.value=true;
  const formtosend=new FormData();
  formtosend.append('sid',sid.value);
  formtosend.append('title',form.value.title);
  formtosend.append('album',form.value.album);
  formtosend.append('genre',form.value.genre);
  formtosend.append('audio',form.value.audio);
  formtosend.append('cover',form.value.cover);
  formtosend.append('removecover',form.value.removecover);
  formtosend.append('lyrics',form.value.lyrics);
  const path='http://127.0.0.1:5000/api/songs'
  console.log(formtosend)
  axios.put(path, formtosend,{
    headers:{
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authentication-Token': token
            } 
  })
  .then((res)=>{
      Libstore.dispatch('editsong',res.data)
      isdis.value=false;
      clearform();
      form.value.songsearch='';
      suc.value='Song Edited successfuly!'
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
  <div class="d-flex gap-1">  
  <h5>Song:</h5> 
  <h5 v-if="found" class="text-success">identified.</h5>  
  <h5 v-else class="text-danger">unidentified</h5>
  </div>
  <form class="row g-3" enctype="multipart/form-data" @submit.prevent="edit">
  <div class="col-md-12">
    <label for="songsearch" class="form-label">Search</label>
    <input type="string" class="form-control" id="songsearch" v-model="form.songsearch" @input="identify($event)" required>
    <small class="text-primary">* Input title to identify song.</small>
  </div>
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
    <input type="file" class="form-control" name="audio" id="audio" accept=".mp3" @change="getaud">
    <small class="text-danger">* Only mp3 files allowed</small>
  </div>
  <div class="col-md-6">
    <label for="cover" class="form-label">Cover</label>
    <input type="file" class="form-control" name="cover" id="cover" accept="image/*" @change="getpic">
   
    <div v-show="song.cover!=null && song.cover.length>0">
    <input class="form-check-input" type="checkbox" value="" id="removecover" v-model="form.removecover">
    <label class="form-check-label" for="removecover">Check to remove cover</label>
    </div>  
    <small v-show="!song.cover" class="text-primary">* no cover image for this song</small>  
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
    <button type="submit" class="btn btn-primary" :disabled="isdis">Edit</button>
  </div>
</form>
</template>

<style scoped>

</style>