<script setup>
import { ref, defineProps } from 'vue';
import delt from "@/components/aprofile/delform.vue";

</script>

<template>
<div class="modal fade" id="aModal" tabindex="-1" aria-labelledby="aModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="aModalLabel">Delete</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <delt />
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