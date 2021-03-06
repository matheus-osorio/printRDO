import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        // urls:{
        //     escala: 'https://webrun.perbras.com.br/medicao/escalaAPI.rule?sys=MDC&mes={{periodo}}&estab={{estab}}&modo=periodo',
        //     cor: 'https://webrun.perbras.com.br/medicao/colorAPI.rule?sys=MDC&estab={{estab}}',
        //     hora: 'https://webrun.perbras.com.br/medicao/horaExtraAPI.rule?sys=MDC&estab={{estab}}',
        //     periodo: "https://webrun.perbras.com.br/medicao/periodoAPI.rule?sys=MDC&mes={{periodo}}&contrato={{estab}}"
              
        // },
        urls:{
            escala: 'http://localhost:3003/escala',
            cor: 'http://localhost:3003/cor',
            hora: 'http://localhost:3003/valor_hora',
            periodo: 'http://localhost:3003/periodo'
        }
      },
      getters: {
        link: (state) => (id, params) => {
          let link = state.urls[id]
          for(let key of Object.keys(params)){
              link = link.replace('{{' + key + '}}',params[key])
          }

          return link
        }
    }
}) 