<script setup>
    import { ref, computed, watch} from 'vue'
    import { RouterLink, useRouter, useRoute } from 'vue-router';
    import Userstore from "@/stores/User";
    import Libstore from "@/stores/Lib";

    const route=useRoute();
    const router = useRouter();
    function search(val){
      if (fs.value) fs.value=false
      else if(val){
        if (val.trim().length==0) pass;
        else router.push({ name: 'searchd', params: {param:searchval.value}, reload:true });
      }    
    }
    function fsearch(...args){
      if (!fs.value) fs.value=true
      else if (args[0]!='' || args[1]!='' || args[2]!=''){
        console.log(args[0]);
        router.push({ name: 'searchd', params:{param:'!@#'}, query:{genre:g.value,artist: aname.value, album:album.value}, reload:true });
      }
    }
    const user=Userstore.getters.getuser();

    const logout=()=>{
        Userstore.dispatch('logout');
    }
    const searchval=ref(route.params.param);
    const fs=ref(false);
    const aname=ref('');
    const artists=ref([]);
    const albums=ref([]);
    const album=ref('');
    const genres=ref([]);
    const g=ref('');

    function fetch(){
     genres.value=Libstore.getters.getgenres(); 
     artists.value=Libstore.getters.getcreators().sort((a,b)=>{
                                                  if (a.name>b.name) return 1;
                                                  return -1
                                                });
     albums.value=[...new Set(Libstore.getters.getalbums().sort((a,b)=>{
                                                  if (a.name>b.name) return 1;
                                                  return -1
                                                }))];
    }
    fetch();
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">SYNCIN</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-between w-100">
          <li class="nav-item">
            <RouterLink to="/" class="Home btn">Home
                <i class="bi bi-house-door-fill"></i>
            </RouterLink>
          </li>
          <li class="nav-item d-flex" style="min-width:30%;">
            <button class="fs btn btn-outline-success" @click="fsearch(g,aname,album)"><i class="bi bi-funnel"></i></button>
            <form class="d-flex" @submit.prevent="search(searchval)">
              <div class="forminput" style="width: 100%">
              <input v-if="!fs" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchval">
              <div v-else class="btn-group d-flex align-items-center" role="group" aria-label="Basic outlined example">
                <div class="dropdown">
                  <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Genre</button>
                  <ul class="dropdown-menu">
                    <li class="ardd d-flex gap-2">
                      <div v-for="genre in genres" :key="genre" @click="g=genre" style="cursor: pointer;"
                      :class="{'lup':g==genre}">{{genre}}</div>
                    </li>
                  </ul>                 
                </div>                
                <div class="dropdown">
                <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Artist</button>
                <ul class="dropdown-menu">
                    <li class="ardd d-flex gap-2">
                      <div v-for="(art,index) in artists" :index="index" :key="art.id" @click="aname=art.creator_name" style="cursor: pointer;"
                            :class="{'lup':art.creator_name==aname}">{{ art.creator_name }}</div>
                    </li>
                </ul>  
                </div>
                <div class="dropdown">
                  <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Album</button>
                  <ul class="dropdown-menu">
                    <li class="ardd d-flex gap-2">
                      <div v-for="(al,index) in albums" :key="al.id" :index="index" @click="album=al.name" style="cursor: pointer;"
                            :class="{'lup':album==al.name}">{{al.name}}</div>                                                         
                    </li>
                  </ul>                 
                </div>                
              </div>                          
              </div>
              <button class="s btn btn-outline-success" type="submit"><i class="bi bi-search"></i></button>
            </form>
          </li>
          <li class="nav-item d-flex">
           <div  v-if="user.role==='creator'" class="dropdown"> 
           <button class="Profile btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Profile
            <i class="bi bi-person"></i>
           </button>
           <ul class="dropdown-menu">
            <li><router-link to="/uprofile" class="dropdown-item">User</router-link></li>
            <li><router-link to="/cprofile" class="dropdown-item">Creator</router-link></li>
           </ul>
           </div>
           <div v-else-if="user.role==='user'">
            <RouterLink to="/uprofile" class="Profile btn">Profile
                <i class="bi bi-person"></i>
            </RouterLink>
           </div>
           <div v-else>
            <RouterLink to="/admin" class="Profile btn">Dashboard
                <i class="bi bi-laptop"></i>
            </RouterLink>
           </div>
           <button class="Logout btn" @click="logout">Logout
           <i class="bi bi-box-arrow-right"></i>
           </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
   nav{
    min-height: 10.5vh;
  }
  
  .fs{
    margin-right: 8px;
  }
  .s{
    margin-left: 8px;
  }

  form{
    width: 1000%;
  }
  .ardd{
    padding-left: 5px;
    width: 300px;
    flex-wrap: wrap;
  }
  .ddcont{
    overflow-x: auto;
    height: 15px;
    max-width:70px; 
    outline: 1px solid green;
    border-radius: 5px;
    text-align: center;
  }
  .lup{
    color: #0d6efd;
  }

</style>