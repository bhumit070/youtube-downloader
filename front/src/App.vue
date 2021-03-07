<template>
  <div>
    <b-container>
      <b-card title="Youtube Video Downloader" class="mt-5">
        <b-card-body>
          <b-form @submit.prevent="getVideoLink">
            <b-form-group label="Enter Youtube Video URL" label-for="video_url">
              <b-form-input
                id="video_url"
                required
                v-model="url"
                placeholder="Enter Youtube Video URL"
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary" :disabled="loading">
              {{ loading ? 'Getting Video...' : 'Get Video' }}
            </b-button>
          </b-form>
        </b-card-body>
        <div v-if="success">
          <b-container>
            <div class="text-center">
              <img :src="videoThumbnail" /> <br />
              <label class="mt-3"> {{ videoTitle }} </label>
              <div :key="index" v-for="(link, index) in videoLinks">
                <a :href="link.url" :download="`${videoTitle}.mp4`">
                  <b-button
                    variant="outline-primary"
                    class="mt-3 pl-3 pr-3"
                    block
                  >
                    Download in {{ link.quality }}
                  </b-button>
                </a>
              </div>
            </div>
          </b-container>
        </div>
        <div v-if="error">
          <div class="text-center">
            <b-alert variant="danger" show> No Video Found </b-alert>
          </div>
        </div>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: false,
      success: false,
      error: false,
      url: null,
      videoTitle: null,
      videoThumbnail: null,
      videoLinks: null,
    };
  },
  methods: {
    async getVideoLink() {
      this.success = false;
      this.error = false;
      try {
        this.loading = true;
        const api = 'https://shielded-oasis-61722.herokuapp.com/url';
        const payload = { url: this.url };
        const { data } = await axios.post(api, payload);
        if (data.error) {
          this.error = true;
        } else {
          this.success = true;
          this.videoTitle = data.title;
          this.videoThumbnail = data.thumbnail;
          this.videoLinks = data.videoLinks;
        }
      } catch (error) {
        return error;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.url = null;
  },
};
</script>

<style scoped>
img {
  height: 200px;
  width: 350px;
}

@media screen and (max-width: 600px) {
  img {
    height: 200px;
    width: 300px;
  }
}
</style>
