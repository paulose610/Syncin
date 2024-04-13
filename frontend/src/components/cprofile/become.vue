<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import axios from 'axios';

const props=defineProps({
    email: String,
})
const emit=defineEmits(['remove_become']);

const error=ref('');
const iserror=computed(()=>{
    return !(error.value==='');
})

const creator=ref('');

function checkname(){
    const path='http://127.0.0.1:5000/api/retreive'
    axios.put(path,{'email':props.email,'cname':creator.value},{
        headers: {
                    'Content-Type': 'application/json'
                },
    })
    .then((res)=>{
        console.log(res)
        emit('remove_become',creator.value);
    })
    .catch((err)=>{
        error.value="Creator name not available!"
    })    
}
</script>

<template>
    <div class="box">
        <h3>Unleash your Creativity.</h3>
        <h3>Become a Creator.</h3>
        <form class="logform d-flex flex-column gap-2" @submit.prevent="checkname">
            <div class="mb-3">
            <label for="creator" class="form-label">Creator Name</label>
            <input type="string" class="form-control" id="creator" v-model="creator" required>
            <div v-if="iserror" Style="color:red;">{{ error }}</div>  
            <br>
            <button class="btn btn-success" style="width:100%;">Go</button>  
            </div>
        </form>    
    </div>
</template>

<style scoped>

</style>