<script setup>
import { ref } from 'vue';
import delalform from '@/components/aprofile/delalform.vue';
import delsongform from "@/components/aprofile/delsform.vue";

let song=ref(true);
function change(d){
    d === 'song' ? song.value = true : song.value = false;
}

</script>

<template>
    <div class="upcont d-flex flex-column justify-content-center">
        <div class="tabchange container container-fluid">
            <div class="col-6 btn" @click="change('song')"
                 :class="{'outline-green' : song}">Song</div>
            <div class="col-6 btn" @click="change('album')"
                 :class="{'outline-green' : !song}">album</div>
        </div>
        <hr>
        <delalform v-if="!song" />
        <delsongform v-else />
    </div>
</template>

<style scoped>
   .outline-green {
  outline: 2px solid green;
}
</style>