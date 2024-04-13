<script setup>
import { ref, defineEmits, computed, onBeforeMount } from 'vue'
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js";
import axios from 'axios';

const found=ref(false);
const removecover=ref(false);
const album=ref({});
const ind=ref(-1);
const aid=ref(-1);
let cid=Userstore.getters.getuser().id;
const useralbums=Libstore.getters.getuseralbums();
function identify(event){
    const title=event.target.value;
    ind.value=useralbums.findIndex(s=>s.name==title && s.creator_id==cid);
    if (ind.value>-1){
        found.value=true;
        album.value=useralbums[ind.value];
        aid.value=album.value.id;
        fillup(album.value);
    }
    else {
        found.value=false;
        ind.value=-1;
        aid.value=-1;
        clearform();
    }
}
function fillup(a){
  aid.value=a.id;
  form.value.album=a.name;
}
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
  albumsearch:'',
  removecover:false,
  album: '',
  cover: null,
});
function clearform(){
  album.value={};
  found.value=false;
  form.value.removecover=false;
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
  formtosend.append('aid',aid.value);
  formtosend.append('album',form.value.album);
  formtosend.append('cover',form.value.cover);
  formtosend.append('removecover', form.value.removecover);
  const path='http://127.0.0.1:5000/api/albums'
  axios.put(path, formtosend,{
    headers:{
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authentication-Token': token
            } 
  })
  .then((res)=>{
    console.log(res.data);
      Libstore.dispatch('editalbum',res.data)
      isdis.value=false;
      clearform();
      form.value.albumsearch='';
      suc.value='Album Edited successfuly!'
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
  <h5>Album:</h5> 
  <h5 v-if="found" class="text-success">identified.</h5>  
  <h5 v-else class="text-danger">unidentified</h5>
  </div>
  <form class="row g-3" enctype="multipart/form-data" @submit.prevent="upload">
  <div class="col-md-12">
    <label for="albumsearch" class="form-label">Search</label>
    <input type="string" class="form-control" id="albumsearch" v-model="form.albumsearch" @input="identify($event)" required>
    <small class="text-primary">* Input title to identify Album.</small>
  </div>  
  <div class="col-md-6">
    <label for="album" class="form-label">Album Name</label>
    <input type="string" class="form-control" name="album" id="album" v-model="form.album" required>
  </div>
  <div class="col-md-6">
    <label for="cover" class="form-label">Cover</label>
    <input type="file" class="form-control" name="cover" id="cover" accept="image/*" @change="getpic">
    
    <div v-show="album.cover!=null && album.cover.length>0">
    <input class="form-check-input" type="checkbox" value="" id="removecover" v-model="form.removecover">
    <label class="form-check-label" for="removecover">Check to remove cover</label>
    </div>  
    <small v-show="!album.cover" class="text-primary">* no cover image for this album</small>  
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