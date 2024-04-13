import { createStore } from 'vuex';
import axios from 'axios';
import router from "@/router/index.js"
import Libstore from "@/stores/Lib.js"
import Userstore from "@/stores/User.js"

const Playstore =createStore({

    state(){
        return{
            song:{
                id: -1,
                title: '',
                lyrics: '',
                audio: '',
                cover: '',
                creator_id:'',
                album_id: -1,
                duration: 0,
                sound: 100,
                play: false,
                elapsed: 0,
            },
            previd: -1,
            carr: [],
            cind: -1,
            audio: new Audio(),
            ap:false,
        }
    },

    getters:{
        ap: (state)=>()=>state.ap,
        currentsong:(state)=>()=>state.song,
        currentarr: (state)=>()=>state.carr,
        currentind: (state)=>()=>state.cind,
        getaudio: (state)=>()=>state.audio,
        isliked: (state)=>(sid)=>{
            const ls=Libstore.getters.getls();
            console.log(ls,sid);
            return ls.includes(sid);
        },
        isflagged: (state)=>(sid)=>{
            const fs=Libstore.getters.getfs();
            return fs.includes(sid);
        },
        creator: (state)=>()=>{
            const creators=Libstore.getters.getcreators();
            const creator=creators.find(creator=>creator.id==state.song.creator_id);
            return creator;
        },

        album: (state)=>()=>{
            const albums=Libstore.getters.getalbums();
            const album=albums.find(al=>al.id==state.song.album_id);
            console.log(album)
            return album;
        }
    },

    mutations:{
        changeap(state){
            state.ap=!state.ap;
        },
        setsong(state,song){
            state.previd=state.song.id;
            state.song.id=song.id;
            state.song.title=song.title;
            state.song.lyrics=song.lyrics;
            state.song.creator_id=song.creator_id;
            state.song.album_id=song.album_id;
            state.song.cover=song.cover
            state.song.audio=song.audio
            state.song.duration=0;
            state.song.sound = 100;
            state.song.elapsed = 0;
            state.song.play=true;
            state.previd = state.song.id == state.previd ? -1 : state.previd;
        },

        setcarrind(state,carrind){
            state.carr=carrind.carr;
            state.cind=carrind.cind;
            // console.log(state.song.id);
        },

        setind(state,ind){
            state.cind=ind;
        },

        playset(state,sid){
            Userstore.dispatch('atlp',sid);
            Libstore.dispatch('changeplay',{'pid':state.previd,'cid':state.song.id});
            state.audio.pause();
            state.audio.currentTime = 0;
            state.audio=new Audio('http://127.0.0.1:5000/audio/' + state.song.audio);
            state.audio.play();
        },

        play(state){
            state.song.play=true;
            state.audio.play();
        },
        pause(state){
            state.song.play=false;
            state.audio.pause();
        },

        dummy(state){
            return ;
        }
    },



    actions:{

        changeap({commit}){
            commit('changeap');
        },
        
        setandplay({ commit },songarr){
            commit('setsong', songarr.song);
            commit('setcarrind',{'carr':songarr.carr,'cind':songarr.cind});
            commit('playset',songarr.song.id);
        },

        playersetplay({ commit }, songind){
                commit('setsong',songind.song);
                commit('setind',songind.ind);
                commit('playset',songind.song.id);
        },

        playcurrent({ commit }){
            commit('play');
        },
        pausecurrent({ commit }){
            commit('pause');
        },

        plays({commit},info){
            commit('dummy',info);
            console.log(info);
            const path='http://127.0.0.1:5000/api/plays'
            axios.put(path,{'sid':info.sid,'aid':info.aid,'cid':info.cid},{});
        }
    },

})

export default Playstore;