<script setup>
import { ref, computed, onMounted } from "vue";
import login from "@/components/entry/login.vue";
import register from "@/components/entry/register.vue";
import admin from "@/components/entry/admin.vue";
import Userstore from "@/stores/User.js"

onMounted(()=>{
    Userstore.dispatch('getuserinfo');
})

const hlogin=(form)=>{
    Userstore.dispatch('login',form);
}
const hreg=(form)=>{
    Userstore.dispatch('register',form);
}

let us=ref(true);
let ad=ref(false);

const isadmin=computed(()=>{
    return ad.value
})
const isuser=computed(()=>{
    return us.value
})
const adminchange=()=>{
    ad.value=!ad.value;
}

</script>

<template>
<div class="page">   
<div class="entry">
    <div class="topbar">
    <div class="viewapp">
        <a class="icon-link icon-link-hover" href="#" @click="viewappnosign">
        <p>View App</p>
        </a>
    </div>
    <div class="adminlog">
        <a class="icon-link icon-link-hover" href="#" @click="adminchange">
        <p v-if="!isadmin">Admin</p>
        <p v-else>User</p>
        </a>
    </div>
    </div>

    <div class="formcont">
    <login v-if="isuser & !ad" v-model:us="us" @entrylogin="hlogin"/>
    <register v-if="!isuser & !ad" v-model:us="us" @entryreg="hreg"/>
    <admin v-if="ad" @entrylogin="hlogin"/>
    </div>
</div> 
</div>
    
</template>

<style scoped>
    .page{
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .entry{
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        align-items: center;
        border-radius: 10px;
        outline: 0px solid red;
        height:700px;
        background-color: beige;
        width:500px;
    }
    .formcont{
        display: flex;
        outline: 0px solid red;
        width: 64%;
        padding-top: 4%;
        padding-right: 10%;
        padding-bottom: 4%;
        padding-left: 10%;
    }
    .topbar{
        display: flex;
        justify-content: space-between;
        outline: 0px solid red;
        width: 44%;
    }

</style>