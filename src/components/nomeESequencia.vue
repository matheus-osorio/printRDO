<template>
  <tr>
    <th>Nome</th>
    <th id="data" v-for="numero in tamanho" :key="numero.id">{{ numero }}</th>
  </tr>
</template>

<script>
export default {
    props:['tamanho'],
    mounted(){
        console.log(this.tamanho)
    }
};
</script>

<style>
</style>