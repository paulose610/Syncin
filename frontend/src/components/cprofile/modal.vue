<script setup>
import { ref, defineProps } from 'vue';
import upload from "./editupdel/upload.vue";
import edit from "./editupdel/edit.vue";
import delt from "./editupdel/del.vue";

const props=defineProps({
  type: String,
  user: Object,
})

</script>

<template>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{{props.type}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <upload v-if="props.type==='Upload'"/>
        <edit v-else-if="props.type==='Edit'"/>
        <delt v-else/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal.fade {
    transition: opacity 0.01s linear;
}

</style>