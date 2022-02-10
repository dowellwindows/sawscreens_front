import axios from 'axios';
export default{
  namespaced:true,
  state: {token:null,user:null,  },
  getters:{
      authenticated(state){ 
      return state.token && state.user},
      user(state){
          return state.user}
  },
  mutations: 
  { //all mutations take current state and data to be mutated as input
    SET_TOKEN(state,token1)
        {   state.token=token1;
        
        },
    SET_USER(state,data)
        {   state.user=data;
        
        }
  },
  actions: { //actions take first option as dispatch(action) or commit(mutation)
      async signIn({dispatch},formdata){ 
        let resp= await axios.post('/auth/signin',formdata); // eslint-disable-line
      
        return dispatch('attempt',resp.data.token);
        },
      async attempt({commit, state},token1){ //to validate the token of this user
          if(token1) commit('SET_TOKEN',token1) //dont SET_TOKEN if no token
          if(!state.token) return //dont fire me api if no token
          try{ let resp=await axios.get('auth/me'//,{headers:{'Authorization':'Bearer'+token1}}
                                               )
             
               commit('SET_USER',resp.data)
               }catch(e)
                    {
                      commit('SET_TOKEN',null) //if token invalid- make all token/user-null
                      commit('SET_USER',null)
                    }
         },
       signOut({commit}){
              // return axios.post('auth/signout').then(()=>{
                commit('SET_TOKEN',null) 
                commit('SET_USER',null)
              // })
       }

  }
}
