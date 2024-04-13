import { createStore } from 'vuex';
import { toRaw } from 'vue';
import axios from 'axios';
import router from "@/router/index.js"
import Userstore from "./User";

const Libstore = createStore({
    state(){
        return {
           users:[], 
           creators:[],
           playlists: [],
           likedsongs: [],
           flaggedsongs:[],
           albums: [],
           useralbums: [],
           songs: [] ,
           usersongs: [],
        }
    },

    getters:{
            getcreators:(state)=>(val)=>{
                let ta=state.creators;
                if (val){
                    ta=ta.filter(a=>a.creator_name.toLowerCase().startsWith(val.toLowerCase()));
                }
                return ta.sort((a,b)=>b.likes-a.likes);
            },

            getpl: (state) => () => {
                const pl=state.playlists
                return [...new Set(pl.map(pl=>pl.name))]
            },
            getplsongs: (state)=>(name)=>{
                const sids=state.playlists.filter(v=>v.name==name).map(v=>v.song_id);
                return state.songs.filter(s=>sids.includes(s.id.toString()));
            },
            getplta:(state)=>(sid)=>{
                const pl=state.playlists
                const plws=pl.filter(pl=>pl.song_id==sid).map(pl=>pl.name)
                return pl.filter(pl=>!plws.includes(pl.name)).map(pl=>pl.name);
            },
            getls: (state) => () => state.likedsongs,
            getfs: (state) => ()=> state.flaggedsongs,
            getalbums: (state) => () => state.albums,
            getalbumsongs:(state)=>(id)=>state.songs.filter(s=>s.album_id==id),
            getuseralbums: (state) => () => state.useralbums,
            getsongs: (state) => () => state.songs,
            getusersongs: (state) => () => state.usersongs,
            
            getnewr: (state)=>()=> state.songs.reverse(),

            gettopsongs: (state) => (val) => {
                let fs = state.songs;
                if (val) {
                    fs = fs.filter(song => song.title.toLowerCase().startsWith(val.toLowerCase()));
                }
                return fs.sort((a, b) => b.likes - a.likes);
            },

            gettopalbums: (state)=>(val) => {
                let fa=state.albums;
                if (val){
                    fa=fa.filter(al=>al.name.toLowerCase().startsWith(val.toLowerCase()));
                }
                return fa.sort((a,b)=>b.likes-a.likes);
            },

            artistsongs: (state)=>(val)=>{
                return state.songs.filter(song=>song.creator_id==val).sort((a,b)=>b.likes-a.likes);
            },
        
            artistalbums: (state)=>(val)=>{
                return state.albums.filter(a=>a.creator_id==val).sort((a,b)=>b.likes-a.likes);
            },

            getgenres: (state)=>()=>{
                let genres = state.songs.map(s=>s.genre);
                genres=[...new Set(genres)]
                return genres;
            },

            topsong: (state)=>()=>{
                let max=0
                const creators=state.creators;
                for (var song of state.songs){
                    if (song.likes>max) max=song.likes;
                }
                const mls=state.songs.filter(s=>s.likes==max).map(s=>({'title':s.title,'creator':s.creator_id}))
                for (var sc of mls){
                    let id=sc.creator
                    sc.creator=creators.find(c=>c.id==id).creator_name
                }
                return mls
            },

            topalbum:(state)=>()=>{
                let max=0
                const creators=state.creators;
                for (var album of state.albums){
                    if (album.likes>max) max=album.likes;
                }
                const mla=state.albums.filter(a=>a.likes==max).map(a=>({'name':a.name,'creator':a.creator_id}))
                for (var sc of mla){
                    let id=sc.creator
                    sc.creator=creators.find(c=>c.id==id).creator_name
                }
                return mla             
            },
            
            topartist:(state)=>()=>{
                let max=0
                for (var c of state.creators){
                    if (c.clikes>max) max=c.clikes;
                }
                console.log(max)
                const mlc=state.creators.filter(a=>a.clikes==max)
                console.log(mlc);
                return mlc
            },

            topflagged: (state)=>()=>{
                let max=0
                const creators=state.creators;
                for (var song of state.songs){
                    if (song.flags>max) max=song.flags;
                }
                const mfs=state.songs.filter(s=>s.flags==max).map(s=>({'title':s.title,'creator':s.creator_id}))
                for (var sc of mfs){
                    let id=sc.creator
                    sc.creator=creators.find(c=>c.id==id).creator_name
                }
                return mfs              
            },

            totalusers: (state)=>()=>{
                return state.users.length;
            },

            totalartists: (state)=>()=>{
                return state.creators.length;
            },

            sl: (state)=>()=>{
                return state.songs.length;
            },

            all: (state)=>()=>{
                return state.albums.length;
            }

            },
        

    mutations: {
        setusers(state,users){
            state.users=users;
        },
        setcreators(state,crtrs){
            state.creators=crtrs;
        },

        setplaylists(state,pl){
            state.playlists=pl;
        },
        
        setlikedsongs(state,ls){
            state.likedsongs=ls.map(s=>s.song_id);
        },

        setflaggedsongs(state,fs){
            state.flaggedsongs=fs.map(s=>s.song_id);
        },

        setalbums(state,al){
            state.albums=al;
        },

        setuseralbums(state,usal){
            state.useralbums=usal;
        },

        createalbum(state,al){
            state.albums = [...state.albums, al];
            state.useralbums = [...state.useralbums, al];
            console.log(state.albums);
        },

        editalbum(state,album){
            const index=state.albums.findIndex(s=>s.id==album.id);
            const ualind=state.useralbums.findIndex(s=>s.id==album.id);
            if (index !== -1) {
                const atoedit = state.albums[index];
                state.albums = [...state.albums.slice(0,index),
                                { ...atoedit, ...album },
                                ...state.albums.slice(index+1)    
                            ];
            }
            if (ualind !== -1) {
                state.useralbums=[
                    ...state.useralbums.slice(0,ualind),
                    state.useralbums[index],
                    ...state.useralbums.slice(ualind+1)
                ];
            }

        },

        delalbum(state,delinfo){
            const cond=delinfo.cond;
            const aid=delinfo.id;
            if (cond==1){
                state.usersongs=state.usersongs.filter(s=>s.album_id!=aid);
                state.songs=state.songs.filter(s=>s.album_id!=aid);
            }
            else {
                state.usersongs = state.usersongs.map(s => {
                    if (s.album_id == aid) {
                        return { ...s, album_id: 0 };
                    }
                    return s;
                });
            
                state.songs = state.songs.map(s => {
                    if (s.album_id == aid) {
                        return { ...s, album_id: 0 };
                    }
                    return s;
                });    
            }
            state.useralbums=state.useralbums.filter(a=>a.id!=aid);
            state.albums=state.albums.filter(a=>a.id!=aid);
            console.log(state.usersongs);            
        },    

        setsongs(state,s){
            state.songs=s;
        },

        setusersongs(state,us){
            state.usersongs=us
        },

        uploadsong(state,song){
            state.songs = [...state.songs, song]; 
            state.usersongs = [...state.usersongs, song]; 
            state.songs=state.songs;

        },

        editsong(state,song){
            const index=state.songs.findIndex(s=>s.id==song.id);
            const usind=state.usersongs.findIndex(s=>s.id==song.id);
            if (index !== -1) {
                const stoedit = state.songs[index];
                state.songs = [
                    ...state.songs.slice(0, index), 
                    { ...stoedit, ...song }, 
                    ...state.songs.slice(index + 1) 
                ];
            }
            if (usind!==-1){
                state.usersongs = [
                    ...state.usersongs.slice(0, usind), 
                    state.songs[index], 
                    ...state.usersongs.slice(usind + 1) 
                ];
            }
        },

        delsong(state,id){
            const ind=state.songs.findIndex(s=>s.id==id);
            const usind=state.usersongs.findIndex(s=>s.id==id);
            state.songs = [
                ...state.songs.slice(0, ind), 
                ...state.songs.slice(ind + 1) 
            ];
            state.usersongs = [
                ...state.usersongs.slice(0, usind), 
                ...state.usersongs.slice(usind + 1) 
            ];
        },

        changeplay(state,ids){
            state.songs=state.songs.map(s=>{
                if (s.id==ids.pid){
                    return {...s,play:false}
                }
                else if(s.id==ids.cid){
                    return {...s,play:true}
                }
                else return {...s}
            });
            state.usersongs=state.usersongs.map(s=>{
                if (s.id==ids.pid){
                    return {...s,play:false}
                }
                else if(s.id==ids.cid){
                    return {...s,play:true}
                }
                else return {...s}
            });
        },

        addnewpl(state,plname){
            const newpl={
                'song_id': -1,
                'name': plname
            }
            state.playlists.push(newpl);
            // console.log(state.playlists);
        },
        delpl(state,plname){
            const index=state.playlists.findIndex(pl=>pl.name==plname);
            state.playlists=[
                    ...state.playlists.slice(0,index),
                    ...state.playlists.slice(index+1)
                            ]
        },

        atpl(state,info){
            const pls=state.playlists
            state.playlists=[...pls,{'name':info.pl,'song_id':info.sid}];
        },

        delfpl(state,info){
            const pls=state.playlists
            const indx=pls.findIndex(pl=>pl.name==info.pl && pl.song_id==info.sid)
            state.playlists=[
                ...pls.slice(0,indx),
                ...pls.slice(indx+1)
                ]
        },

        like(state,info){
            const index=state.likedsongs.findIndex(s=>s==info.sid)
            if (index==-1) {
                state.likedsongs=[...state.likedsongs,info.sid];
                console.log(state.likedsongs);
                let ind=state.songs.findIndex(s=>s.id==info.sid);
                const stoe=state.songs[ind];
                stoe.likes=stoe.likes+1;
                state.songs=[
                    ...state.songs.slice(0,ind),
                    stoe,
                    ...state.songs.slice(ind+1)
                ]

                ind=state.albums.findIndex(s=>s.id==info.aid);
                if (ind>-1){
                    const atoe=state.albums[ind];
                    atoe.likes=atoe.likes+1;
                    state.albums=[
                    ...state.albums.slice(0,ind),
                    atoe,
                    ...state.albums.slice(ind+1)
                    ]  
                }
                
                ind=state.creators.findIndex(s=>s.id==info.cid);
                const ctoe=state.creators[ind];
                ctoe.clikes=ctoe.clikes+1;
                state.creators=[
                    ...state.creators.slice(0,ind),
                    ctoe,
                    ...state.creators.slice(ind+1)
                ]                 
                
            }
            else {
                state.likedsongs=[
                    ...state.likedsongs.slice(0,index),
                    ...state.likedsongs.slice(index+1)
                ]
                console.log(state.likedsongs);
                let ind=state.songs.findIndex(s=>s.id==info.sid);
                const stoe=state.songs[ind];
                stoe.likes=stoe.likes-1;
                state.songs=[
                    ...state.songs.slice(0,ind),
                    stoe,
                    ...state.songs.slice(ind+1)
                ]

                ind=state.albums.findIndex(s=>s.id==info.aid);
                if (ind>-1){
                    const atoe=state.albums[ind];
                    atoe.likes=atoe.likes-1;
                    state.albums=[
                    ...state.albums.slice(0,ind),
                    atoe,
                    ...state.albums.slice(ind+1)
                    ]  
                }
                
                ind=state.creators.findIndex(s=>s.id==info.cid);
                const ctoe=state.creators[ind];
                ctoe.clikes=ctoe.clikes-1;
                state.creators=[
                    ...state.creators.slice(0,ind),
                    ctoe,
                    ...state.creators.slice(ind+1)
                ]                 
            }
        },

        flag(state,sid){
            const index=state.flaggedsongs.findIndex(s=>s==sid)
            if (index==-1) {
                state.flaggedsongs=[...state.flaggedsongs,sid]
                const ind=state.songs.findIndex(s=>s.id==sid);
                const stoe=state.songs[ind];
                stoe.flags=stoe.flags+1;
                state.songs=[
                    ...state.songs.slice(0,ind),
                    stoe,
                    ...state.songs.slice(ind+1)
                ]                
            }
                else {
                state.flaggedsongs=[
                    ...state.flaggedsongs.slice(0,index),
                    ...state.flaggedsongs.slice(index+1)
                ]
                const ind=state.songs.findIndex(s=>s.id==sid);
                const stoe=state.songs[ind];
                stoe.flags=stoe.flags-1;
                state.songs=[
                    ...state.songs.slice(0,ind),
                    stoe,
                    ...state.songs.slice(ind+1)
                ]                 
            }            
        }
    },  
    

    actions: {

        async loadusers({ commit }){
            const path='http://127.0.0.1:5000/getusers';
            return axios.get(path,{

            })
            .then((res)=>{
                commit('setusers', res.data);
                console.log(res.data);
            })
            .catch((err)=>{
                console.log("coudln't load users!");
            })
        },

        async loadcrtrs({ commit }){
            const path='http://127.0.0.1:5000/getcreators';
            return axios.get(path,{

            })
            .then((res)=>{
                commit('setcreators', res.data);
            })
            .catch((err)=>{
                console.log("coudln't load creators!");
            })
        },

        async loadpl({ commit },user){
            const path='http://127.0.0.1:5000/api/playlists';
            const token=localStorage.getItem('authtoken');
            return axios.get(path,{
                headers:{
                    'Authentication-Token': token
                }    
            })
            .then((res)=>{
                commit('setplaylists',res.data);
            })
            .catch((err)=>{
                console.log("couldn't load playlists!");
            })
        },

        async loadls({ commit }){
            const path='http://127.0.0.1:5000/api/likedsongs';
            const token=localStorage.getItem('authtoken');
            return axios.get(path,{
                headers:{
                    'Authentication-Token': token
                } 
            })
            .then((res)=>{
                commit('setlikedsongs',res.data);
            })
            .catch((err)=>{
                
                console.log("couldn't load liked songs!");
            })
        },

        async loadfs({commit}){
            const path='http://127.0.0.1:5000/api/flaggedsongs';
            const token=localStorage.getItem('authtoken');
            return axios.get(path,{
                headers:{
                    'Authentication-Token': token
                } 
            })   
            .then((res)=>{
                commit('setflaggedsongs',res.data);
            })         
            .catch((err)=>{
                console.log("couldn't load liked songs");
            })
        },

        async loadalbums({ commit }, user){
            const path='http://127.0.0.1:5000/api/albums';
            return axios.get(path,{
                params: {
                    uid: user.id,
                    ur: user.role 
                }
            })
            .then((res)=>{
                commit('setalbums',res.data['allalbums']);
                if (user.role==='creator'){
                    commit ('setuseralbums', res.data['albums']);
                }
            })
            .catch((err)=>{
                console.log("couldn't load albums");
            })
        },

        createalbum({ commit },album){
            console.log(album);
            commit('createalbum', album);
        },

        editalbum({ commit },album){
            console.log(album);
            commit('editalbum',album);
        },

        delalbum({ commit },delinfo){
            commit('delalbum',delinfo);
        },

        async loadsongs({ commit }, user){
            const path='http://127.0.0.1:5000/api/songs'
            return axios.get(path,{
                params: {
                    uid: user.id,
                    ur: user.role 
                }
            })
            .then((res)=>{
                commit('setsongs',res.data['allsongs']);
                if (user.role==='creator'){
                    commit ('setusersongs', res.data['songs']);
                }
            })
        },

        uploadsong({ commit },song){
            console.log(song);
            commit('uploadsong',song);
        },

        editsong({commit},song){
            console.log(song);
            commit('editsong',song);
        },

        delsong({ commit }, sid){
            console.log(sid);
            commit('delsong',sid);
        },

        async libload({ dispatch },user){
            await dispatch('loadusers');
            await dispatch('loadcrtrs');
            await dispatch('loadls');
            await dispatch('loadfs');
            await dispatch('loadpl',user);
            await dispatch('loadalbums',user);
            await dispatch('loadsongs',user);
        },

        changeplay({ commit },id){
            commit('changeplay',id);
        },

        createplaylist({commit,getters},plname){
            const pls=getters.getpl();
            if (pls.includes(plname)) return false;
            else commit('addnewpl',plname);
            const path='http://127.0.0.1:5000/api/playlists'
            const token=localStorage.getItem('authtoken');
            axios.post(path,{'name':plname,'song_id':-1},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token,
                }
            })
            .then((res)=>{
                console.log(res.data.msg);
            })
            .catch((err)=>{
                console.log(err);
            })
            return true;
        },

        deletepl({commit,getters},plname){
            commit('delpl',plname);
            const path='http://127.0.0.1:5000/api/playlists'
            const token=localStorage.getItem('authtoken');
            axios.delete(path,{
                headers:{
                    'Authentication-token': token,
                },
                data: {'name':plname}                
            })
            .then((res)=>{
                console.log(res);
            })
            .catch((err)=>{
                console.log(err);
            })
        },

        atpl({commit},info){
            commit('atpl',info);
            const path='http://127.0.0.1:5000/api/playlists'
            const token=localStorage.getItem('authtoken');
            axios.put(path,{'name':info.pl,'song_id':info.sid},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token,
                }                
            })  
            .then((res)=>{
                console.log(res.data);
            })          
            .catch((err)=>{
                console.log(err.data);
            })
        },

        delfpl({commit},info){
            commit('delfpl',info);
            const path='http://127.0.0.1:5000/api/delfpl'
            const token=localStorage.getItem('authtoken');
            axios.put(path,{'name':info.pl,'sid':info.sid},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token,
                }                
            })  
            .then((res)=>{
                console.log(res.data);
            })          
            .catch((err)=>{
                console.log(err.data);
            })                       
        },

        like({commit},info){
            console.log(info);
            commit('like',info);
            const path='http://127.0.0.1:5000/api/likedsongs'
            const token=localStorage.getItem('authtoken');
            axios.put(path,{'sid':info.sid,'aid':info.aid,'cid':info.cid},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token,
                }                 
            })
            .then((res)=>{
                console.log('liked songs updated');
            })
            .catch((err)=>{
                console.log('liked songs not updated')
            })
        },

        flag({commit},sid){
            commit('flag',sid);
            const path='http://127.0.0.1:5000/api/flaggedsongs'
            const token=localStorage.getItem('authtoken');
            axios.put(path,{'sid':sid},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token,
                }                 
            })
            .then((res)=>{
                console.log('flagged songs updated');
            })
            .catch((err)=>{
                console.log('flagged songs not updated')
            })            
        },


    },
})

export default Libstore;