<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import Userstore from "@/stores/User.js"


onMounted(()=>{
  Userstore.dispatch('clearerror')
})
let error=computed(()=>{
  return Userstore.getters.geterror();
})       
const emit=defineEmits(['update:us','entrylogin']);

const form={
  email: ref(""),
  password: ref(""),
  }
let formpass={
  email:'',
  password:''
  }
const login=(()=>{
  formpass.email=form.email.value;
  formpass.password=form.password.value;
  emit('entrylogin',formpass);
})  

const props=defineProps({
  us: Boolean,
})

</script>

<template>

<form class="logform d-flex gap-2" @submit.prevent="login">
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="string" class="form-control" id="email" v-model="form.email.value" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" v-model="form.password.value" required>
    <a class="icon-link icon-link-hover" href="#">
    forgot password.
    </a>
  </div>
  <br>
  <div v-if="error" style="color: red;">{{ error }}</div>
  <br>
  <div class="d-grid gap-2">
    <button type="submit" class="btn btn-success btn-sm rounded-pill">Login</button>
  </div>
  <br>
  <div class="d-flex justify-content-center">
  <a class="icon-link icon-link-hover" href="#" @click="$emit('update:us',!us)">
    Not yet a User? Signup.
  </a>
  </div>

</form>
</template>

<style scoped>
.logform{
    flex-direction: column;
    max-width: 300px;
    color: black;
}
button{
  border-radius: 10px;
}
</style>