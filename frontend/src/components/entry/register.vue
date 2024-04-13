<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import Userstore from "@/stores/User.js"

onMounted(()=>{
  Userstore.dispatch('clearerror')
})
let error=computed(()=>{
  return Userstore.getters.geterror();
}) 

const emit=defineEmits(['update:us','entryreg']);

const props=defineProps({
  us: Boolean,
})

const form={
  username: ref(""),
  password: ref(""),
  email: ref(""),
  creator: ref(false),
  crtrname: ref(''),
  }
let formpass={
  username: "",
  password: "",
  email: "",
  creator: ref(false),
  crtrname: "",
  }
const register=(()=>{
  formpass.username=form.username.value;
  formpass.password=form.password.value;
  formpass.email=form.email.value;
  formpass.creator=form.creator.value;
  formpass.crtrname=form.crtrname.value;
  emit('entryreg',formpass);
}) 

</script>

<template>

<form @submit.prevent="register" class="row g-3 regform">
  <div class="col-md-12">
    <label for="username" class="form-label">Username</label>
    <input type="text" class="form-control" id="username" v-model="form.username.value" required
     title="please enter a username"
    >
  </div>
  <div class="col-md-12">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" v-model="form.email.value" required title="please enter an email">
  </div>  
  <div class="col-md-12">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" v-model="form.password.value" required>
  </div>
  <div class="col-md-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="creatorcheck" v-model="form.creator.value">
      <label class="form-check-label" for="creator check">
        Register as Creator
      </label>
    </div>
  </div>
  <div v-if="form.creator.value===true" class="col-md-12">
    <label for="crtrname" class="form-label">Creator name</label>
    <input type="text" class="form-control" id="crtrname" v-model="form.crtrname.value" required>
  </div>
  <br>
  <div v-if="error" style="color: red;">{{ error }}</div>
  <div class="d-grid gap-2">
    <button type="submit" class="btn btn-success btn-sm rounded-pill">Signup</button>
  </div>
  <div class="col-12 d-flex justify-content-center">
    <a class="icon-link icon-link-hover" @click="$emit('update:us',!us)" href="#">
    Already a User? Login.
    </a>
</div>

</form>

</template>

<style scoped>
.regform{
    max-width: 300px;
    color: black;
}
button{
  border-radius: 10px;
}
</style>