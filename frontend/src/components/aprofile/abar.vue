<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import Userstore from "@/stores/User.js";

</script>

<template>
  <div class="content d-flex flex-column gap-2 justify-content-start">
    <div class="actions">
      <ul class="list-group actionlist">
        <li class="list-group-item actionchild btn" data-bs-toggle="modal" data-bs-target="#aModal">Delete<i class="bi bi-trash"></i></li>
      </ul>
    </div>
  </div>
  
</template>

<style scoped>
  .content{
    background-color: whitesmoke;
    width: 250px;
    height: 100%;
  }
  .actionlist > *{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    font-size: larger;
  }
</style>