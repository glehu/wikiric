<template>
  <div style="min-height: 10vh"></div>
  <div class="text-center text-white">
    <div class="card-subtitle container">
      <div class="card-body">
        <input
          v-model="message"
          v-on:keyup.enter="processInput(message)"
          placeholder="Song Title, Artist..."
          class="text-center"
          style="border-radius: 3em; font-size: 200%; font-weight: bold; padding: 10px"
        />
      </div>

      <table class="table table-bordered text-white">
        <thead>
        <tr>
          <th>Name</th>
          <th>Vocalist</th>
          <th>Producer</th>
          <th>Type</th>
          <th>Album Name</th>
          <th>Comment</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in myObj.resultsList" :key="item.uID">
          <td>{{ JSON.parse(item).name }}</td>
          <td>{{ JSON.parse(item).vocalist }}</td>
          <td>{{ JSON.parse(item).producer }}</td>
          <td>{{ JSON.parse(item).type }}</td>
          <td>{{ JSON.parse(item).nameAlbum }}</td>
          <td>{{ JSON.parse(item).comment }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'get-request',
  data () {
    return {
      songResults: null,
      message: '',
      myObj: {}
    }
  },
  methods: {
    getSongFromSearchText (text) {
      this.myObj = {}
      const searchText = text.replace(/\s+/g, '')
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m1/entry/' + searchText + '?type=name&format=json&lock=false',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.myObj = data))
        .catch((err) => console.log(err.message))
    },
    processInput (searchString) {
      this.getSongFromSearchText(searchString)
    }
  }
}
</script>

<style>
</style>
