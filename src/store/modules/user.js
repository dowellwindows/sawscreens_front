import Vue from 'vue';
import axios from 'axios';
import * as types from '../types';
import * as api from '../config';
export default{
 // namespaced:true,
  state: {userlist:null,  },
  getters:{
      
  },
  mutations: 
  { 
   
    [types.GET_USER_LIST ] (state, payload) 
        {
          state.userlist = payload.userlist;   
          
         },
  
  },
  actions: 
  { //actions take first option as dispatch(action) or commit(mutation)
      async getusers({commit})
      { let resp= await axios.get(api.users);

        commit({type:types.GET_USER_LIST ,  userlist: resp.data} );
        
      },
      adduser(ctx, payload) 
      {  return new Promise((resolve, reject) => 
        {  axios.post(api.adduser, payload)
                .then((response) => 
                {  
                    ctx.dispatch('getusers');
                }).catch((error) => { 
                  reject(error);  })
        })
      },
      deleteuser(ctx, payload) 
      {  return new Promise((resolve, reject) => 
        {  axios.post(api.deleteuser, payload)
                .then((response) => 
                {  
                    ctx.dispatch('getusers');
                }).catch((error) => { reject(error);  })
        })
      },
      edituser(ctx, payload) 
      {  return new Promise((resolve, reject) => 
        {  axios.post(api.edituser, payload)
                .then((response) => 
                { ctx.dispatch('getusers');
                }).catch((error) => { reject(error);  })
        })
      },
      
  }
}
