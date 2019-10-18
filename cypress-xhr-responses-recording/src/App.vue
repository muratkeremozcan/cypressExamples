<template>
  <div id="app">
    <ul>
      <User
        v-for="user in users"
        :key="user.id"
        :user="user" />
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

import User from './components/User.vue'

export default {
  name: 'app',
  components: {
    User
  },
  data: () => ({
    users: []
  }),
  async created () {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users')
    this.users = response.data
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
  list-style: none;
}
</style>
