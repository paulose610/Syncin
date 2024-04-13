<script setup>
    import { useRouter, useRoute } from 'vue-router';
    const route=useRoute();
    const router=useRouter();
    if (Object.keys(route.query).length<1){
        console.log(route.query);
        const searchval=route.params.param;
        router.push({ name: 'search', params: {param:searchval}, reload:true });
    }
    else {
        const g=route.query.genre;
        const artist=route.query.artist;
        const aname=route.query.album;
        console.log(artist);
        router.push({ name: 'fsearch', query: {genre:g,artist:artist,album:aname}, reload:true });
    }
</script>
    
<template>
        <div class="sit"></div>
</template>