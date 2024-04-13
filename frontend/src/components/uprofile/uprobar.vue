<script setup>
import { defineEmits,ref, defineProps, toRaw} from 'vue';
import become from "@/components/cprofile/become.vue";

const bac=ref({'name':'bac','is':false});
const set=ref({'name':'set','is':false});
const sub=ref({'name':'sub','is':false});
const l=[bac,set,sub];
const prop=defineProps({
    isuser: Boolean,
    email: String
})
const emit=defineEmits(['remove_become']);

function chooseop(val){
        for (var i of l){
            if (i.value.name==val && i.value.is!=true) i.value.is=true;
            else i.value.is=false;
        }
    }
function remove_become(payload){
    bac.value.is=false;
    alert("You've Become a Creator!")
    emit('remove_become',payload);
}
</script>

<template>
<ul class="nav justify-content-center">
    <li class="nav-item">
    <a class="nav-link sub"
                     :class="{'undrl':sub.is}"     
    @click="chooseop('sub')">Subscribtion</a>
  </li>
  <li v-if="isuser" class="nav-item">
    <a class="nav-link bac"
                     :class="{'undrl':bac.is}"     
    @click="chooseop('bac')">Become a creator</a>
  </li>
  <li class="nav-item">
    <a class="nav-link"
       :class="{'undrl':set.is}"
    @click="chooseop('set')">settings</a>
  </li>
</ul>
<div class="line" style="outline:1px solid grey; width: 300px;"></div>
<hr>
<become v-if="bac.is" :email="prop.email" @remove_become="remove_become" />

</template>

<style scoped>
    a{
    cursor: pointer;
    }
    .undrl{
        text-decoration: underline;
    }
</style>