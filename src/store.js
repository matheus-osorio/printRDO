import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        // urls:{
        //     escala: 'https://webrun.perbras.com.br/medicao/escalaAPI.rule?sys=MDC&mes={{mes}}&ano={{ano}}&estab={{estab}}',
        //     cor: 'https://webrun.perbras.com.br/medicao/colorAPI.rule?sys=MDC&estab={{estab}}',
        //     hora: 'https://webrun.perbras.com.br/medicao/horaExtraAPI.rule?sys=MDC&estab={{estab}}'
        // },
        urls:{
            escala: 'http://localhost:3003/escala',
            cor: 'http://localhost:3003/cor',
            hora: 'http://localhost:3003/valor_hora'
        }
      },
      getters: {
        link: (state) => (id, params) => {
          console.log('params:',params)
          let link = state.urls[id]
          for(let key of Object.keys(params)){
              link = link.replace('{{' + key + '}}',params[key])
          }

          return link
        }
    }
}) 