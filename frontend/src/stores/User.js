import { createStore } from 'vuex';
import axios from 'axios';
import router from "@/router/index.js"

const Userstore =createStore({

    state(){
        return {
            user:{
            username: "baby",
            email: "",
            role: "",
            token: localStorage.getItem('authtoken') || "",
            creator_name:"",
            id: 0,
            last_played: "",
            subc: false
            },
            error:""
        };
    },

    getters: {
        geterror: (state) => ()=>state.error,
        getuser: (state) => () => state.user,
        getlp: (state) => () => state.user.last_played,
    },

    mutations:{

        setcreator(state,d){
            state.user.creator_name=d.creator_name
        },
        getuser(state,d){
            state.user.id=d.id;
            state.user.username=d.username;
            state.user.email=d.email;
            state.user.role=d.role;
            state.user.creator_name=d.creator_name;
            state.user.last_played=d.last_played;
            state.user.subc=d.sub;
        },
        setuser(state,d){
            state.user.username=d.username;
            state.user.email=d.email;
            state.user.token=d.token;
            state.user.role=d.role;
            state.user.creator_name=d.creator_name;
            state.user.last_played=d.last_played;
            localStorage.setItem("authtoken",d.token);
        },
        seterror(state, error) {
            state.error = error;
        },
        clearuser(state) {
            state.user.username = '';
            state.user.email = '';
            state.user.role = '';
            state.user.token = '';
            localStorage.removeItem("authtoken");
        },
        clearerror(state) {
            state.error = '';
        },
        become_creator(state,payload){
            state.user.creator_name=payload;
            state.user.role='creator';
            console.log(state.user.creator_name);
        },

        atlp(state,sid){
            let lp=state.user.last_played.split(',');
            if (lp.length>4) lp.pop();
            lp=[sid.toString(), ...lp]
            lp=new Set(lp);
            state.user.last_played=Array.from(lp).join(',');

        }
    },



    actions: {

        atlp({ commit }, sid){
            commit('atlp',sid);
            const token=localStorage.getItem('authtoken');
            const path='http://127.0.0.1:5000/api/atlp';
            axios.put(path,{'sid':sid},{
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': token
                },
            })
            .then((res)=>{
                return;
            })
            .catch((err)=>{
                console.log('task que failed');
            })
        },     

        clearuser({ commit }) {
            commit('clearuser');
        },
        clearerror({commit}){
            commit('clearerror')
        },

        async getuserinfo({ commit }){
            const token=localStorage.getItem('authtoken');
            const path='http://127.0.0.1:5000/api/retreive'
            return axios.get(path,{
                headers: {
                    'Authentication-Token': token
                },
            })
            .then((res)=>{
                commit('getuser',res.data);
            })
            .catch((err)=>{
                console.log('no data fetched');
            })

        },

        become_creator({ commit },payload){
            console.log(payload);
            commit('become_creator',payload);
        },

        async authenticate({ commit }){
            const token=localStorage.getItem('authtoken');
            if (!token) {
                return Promise.resolve(false);
              }
     
            const path='http://127.0.0.1:5000/api/authenticate'
            return axios.get(path,{
                headers: {
                    'Authentication-Token': token
                }
            })
            .then((res)=>{
                if (res.data.authenticated){
                    return res.data.authenticated;
                }
                else {
                    console.log(res.data.authenticated+"hi");
                    localStorage.removeItem('authtoken');
                    return false;
                }
            })
            .catch(()=>{
                localStorage.removeItem('authtoken');
                return false;
            })
        },

        async login({ commit },form){
            const path='http://127.0.0.1:5000/api/login';
            return axios.post(path,form,{
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((res) => {
                commit('setuser',res.data);
                commit('clearerror');
                router.push({name:'home'});
                
            })
            .catch((err)=>{
                commit('seterror', err.response.data.message);
                console.log(this.state.error);
            })
        },

        async logout({ commit }){
            localStorage.removeItem('authtoken')
            // commit('clearuser');
            router.push({name:'entry'});
        },

        async register({commit},form){
            const path='http://127.0.0.1:5000/api/register';
            return axios.post(path,form,{
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((res)=>{
                commit('setuser',res.data.userdata)
                commit('clearerror');
                console.log(res.data);
                router.push({name:'home'});
            })
            .catch((err)=>{
                commit('seterror', err.response.data.message);
                console.log(this.state.error);
            })
        }
    }, 

})

export default Userstore;