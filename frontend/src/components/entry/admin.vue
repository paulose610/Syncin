<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import Userstore from "@/stores/User.js"

onMounted(()=>{
  Userstore.dispatch('clearerror')
})
let error=computed(()=>{
  return Userstore.getters.geterror();
})       
const emit=defineEmits(['entrylogin']);

const form={
  password: ref(""),
  }
let formpass={
  email:'admin@syncin.ac.in',
  password:''
  }
const login=(()=>{
  formpass.password=form.password.value;
  emit('entrylogin',formpass);
}) 
</script>

<template>

<form class="logform" @submit.prevent="login">
  <div class="mb-3">
    <label for="adminpassword" class="form-label">Admin Password</label>
    <input type="password" class="form-control" id="adminpassword" v-model="form.password.value" required>
    <a class="icon-link icon-link-hover" href="#">
    forgot password.
    </a>
  </div>
  <div v-if="error" style="color: red;">{{ error }}</div>
  <br>
  <div class="d-grid gap-2">
    <button type="submit" class="btn btn-success btn-sm rounded-pill">Login</button>
  </div>
</form>
</template>

<style scoped>
.logform{
    max-width: 300px;
    color: black;
}
button{
  border-radius: 10px;
}
</style>