<script setup>
import Userstore from "@/stores/User.js";
import Libstore from "@/stores/Lib.js";
import navbar from "@/components/navbar.vue";
import player from "@/components/player.vue";
import abar from "@/components/aprofile/abar.vue";
import amodal from "@/components/aprofile/amodal.vue";
import atpl from "@/components/uprofile/atpl.vue";
import { ref, onMounted, onBeforeMount } from 'vue'
import axios from "axios";

const mounted=ref(false);
const user=ref('');
const topsong=ref([]);
const topalbum=ref([]);
const topartist=ref([]);
const mfs=ref([]);
const totusers=ref(0);
const totartists=ref(0);
const totalbums=ref(0);
const sl=ref(0);
const all=ref(0);

onBeforeMount( async () => {
  await Userstore.dispatch('getuserinfo');
  user.value = Userstore.getters.getuser();
  await Libstore.dispatch('libload',user.value);
  mounted.value=true;
  topsong.value=Libstore.getters.topsong()
  topalbum.value=Libstore.getters.topalbum();
  topartist.value=Libstore.getters.topartist();
  mfs.value=Libstore.getters.topflagged();
  totusers.value=Libstore.getters.totalusers();
  totartists.value=Libstore.getters.totalartists();
  totalbums.value=ref(0);
  sl.value=Libstore.getters.sl();
  all.value=Libstore.getters.all();
  fetchchartdata();
  });
  
function fetchchartdata(){
  const token=localStorage.getItem('authtoken');
  axios.get('http://127.0.0.1:5000/charts',{
    headers:{
      'Authentication-Token': token
    }
  })
  .then((res)=>{
    console.log('charts loaded');
  })
  .catch((err)=>{
    console.log("couldn't load charts!");
  })
}

const charttype=ref('')
const ts=ref({'name':'ts','is':false,'path':'song_chart.png'});
const ta=ref({'name':'ta','is':false,'path':'album_chart.png'});
const tc=ref({'name':'tc','is':false,'path':'artist_chart.png'});
const fs=ref({'name':'fs','is':false,'path':'fsong_chart.png'});
const l=[ts,ta,tc,fs]

function chooseop(val){
        for (var i of l){
            if (i.value.name==val && i.value.is!=true) {
              i.value.is=true;
              charttype.value=i.value.path;
            }
            else i.value.is=false;
        }
    }

</script>

<template>
  <div v-if="mounted" class="profilepage">
    <navbar />
    <div class="profilecontent d-flex justify-content-end" style="width:100%;height: 79vh;">
      <div class="discont d-flex flex-column gap-5 align-items-center"> 
        <div class="statcont d-flex justify-content-center">
          <div class="topsong">
            <h4>Top Songs:</h4>
            <div class="sch">
            <div v-for="(song,index) in topsong" :key="index">{{song.title}} by {{song.creator}}</div>
            </div>  
            <a class="chart icon-link" style="cursor:pointer;" @click="chooseop('ts')">view chart</a>
          </div>
          <div class="topalbum">
            <h4>Top Albums:</h4>
            <div class="sch">
            <div v-for="(album,index) in topalbum" :key="index">{{album.name}} by {{album.creator}}</div>
            </div>  
            <a class="chart icon-link" style="cursor:pointer;" @click="chooseop('ta')">view chart</a>
          </div>            
          <div class="topartist">
            <h4>Top Artists:</h4>
            <div class="sch">
            <div v-for="(artist,index) in topartist" :key="index">{{artist.creator_name}}</div>
            </div>  
            <a class="chart icon-link" style="cursor:pointer;" @click="chooseop('tc')">view chart</a>
          </div>
          <div class="mfs">
            <h6>Most flagged</h6>
            <h6>songs:</h6>
            <div class="sch">
            <div v-for="(song,index) in mfs" :key="index">{{song.title}} by {{song.creator}}</div>
            </div>  
            <a class="chart icon-link" style="cursor:pointer;" @click="chooseop('fs')">view chart</a>
          </div>
          <div class='tu'>
            <h4>Total Users:</h4>
            {{totusers}}
          </div>
          <div class='ta'>
            <h4>Total Artists:</h4>
            {{totartists}}
          </div>  
          <div class="sc">
            <h4>Total Songs:</h4>
            {{sl}}
          </div>      
          <div class="sc">
            <h4>Total Albums:</h4>
            {{all}}
          </div>   
        </div>   
      <h2>Graphs</h2>   
      <div class="graph">
        <img v-if="charttype!=''" :src="'http://127.0.0.1:5000/viewchart/' + charttype" class="graph">
      </div>
      </div>
      <div class="pbar d-flex">
      <abar />
      </div>
    </div>
    <player class="fixed-bottom"/>
    <amodal />
    <atpl />
  </div>
</template>

<style scoped>
    .pbar{
        height: 100%;
        align-items: center;
        }
    .discont {
      flex: 1;
      overflow: auto; 
      outline: 0px solid red;
      height: 79vh;
      margin-left:20px;
  }   
  .statcont{
    max-width: 800px;
    flex-wrap: wrap;
    outline: 0px solid blue;
    padding: 20px;
    background-color: #a19e9e;
    margin-right: 20px;
    margin-top: 30px;
    border-radius: 10px;
    box-shadow: 3px 3px 3px rgb(4, 33, 43);

  } 
  .statcont > *{
    width: 160px;
    height: 120px;
    outline: 0px solid red;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin: 10px;
    box-shadow: 3px 3px 3px rgb(4, 33, 43);
    background-color: #f5f5f5;
    padding: 6px;
  }
  .sch{
    overflow-y: auto;
  }
  h2 {
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 36px; 
    font-weight: bold;
    text-align: center; 
    margin-top: 20px;
    margin-bottom: 20px; 
    }
</style>