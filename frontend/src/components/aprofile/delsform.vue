<script setup>
import { ref, defineEmits, computed, onBeforeMount } from 'vue'
import Libstore from "@/stores/Lib.js";
import Userstore from "@/stores/User.js";
import axios from 'axios';

const cid=ref(-1);
const ind=ref(-1);
const art=ref({});
const stodel=ref({});
const songs=Libstore.getters.getsongs();
const creators=Libstore.getters.getcreators();
const found=ref(false);
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
  artist: '',
});

function identify(info){
    art.value=creators.find(c=>c.creator_name==info.artist);
    if (art.value) {cid.value=art.value.id}
    else cid.value=-1;
    stodel.value=songs.find(s=>s.title===info.title && s.creator_id==cid.value);
    if (stodel.value) {
        ind.value=stodel.value.id;
        found.value=true;
    }
    else {
        found.value=false;
        ind.value=-1;
        stodel.value={};
        if (del.value) {
            del.value=!del.value;
            isdis.value=!isdis.value;
        }
    }
}
function clearmsg(){
  setTimeout(()=>{
    suc.value='';
    error.value='';
  },5000)
}
const del=ref(false);
function confirmdel(){
    del.value=true;
    isdis.value=true;
}
function clearform(){
    form.value.title='';
    form.value.artist='';
    del.value=false;
    isdis.value=false;
    ind.value=-1;
}
function deletesong(){
  const token=localStorage.getItem('authtoken');
  isdis.value=true;
  del.value=false;
  const path='http://127.0.0.1:5000/api/songs'
  axios.delete(path,{
    params:{
        sid: ind.value,
        cid: cid.value
    },
    headers:{
          'Accept': 'application/json',
          'Authentication-Token': token
            } 
  })
  .then((res)=>{
    suc.value=res.data.msg;
    clearmsg();
    clearform();
    Libstore.dispatch('delsong',res.data.id);
  })
  .catch((err)=>{
    error.value=err.response.data.error;
    clearmsg();
    clearform();
    })
}
</script>

<template>
  <div class="d-flex gap-1">  
  <h5>Song:</h5> 
  <h5 v-if="found" class="text-success">identified.</h5>  
  <h5 v-else class="text-danger">unidentified</h5>
  </div>
  <form class="row g-3" @submit.prevent="confirmdel">
  <div class="col-md-4">
    <label for="artist" class="form-label">Artist</label>
    <input type="string" class="form-control" id="artist" v-model="form.artist" @input="identify({'artist':form.artist,'title':form.title})" required>
    <small class="text-primary">* Input Artist to identify Song</small>
  </div>    
  <div class="col-md-4">
    <label for="title" class="form-label">Title</label>
    <input type="string" class="form-control" id="title" v-model="form.title" @input="identify({'artist':form.artist,'title':form.title})" required>
    <small class="text-primary">* Input title to identify song</small>
  </div>
  <div v-if="iserror" class="col-md-12">
    <p class="text-danger">{{ error }}</p>
  </div>
  <div v-if="issuc" class="col-md-12">
    <p class="text-success">{{ suc }}</p>
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-danger" :disabled="isdis">Delete</button>
  </div>
</form>
<div v-if="del">
    <small class="text-primary">Are you sure you want to delete?</small>
    <a class="icon-link icon-link-hover text-danger" @click="deletesong"><small>Yes</small></a>
</div>
</template>

<style scoped>

</style>