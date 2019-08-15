class googleGeocodingApiService {
    constructor(location) {
        this.location = location;
    }

    returnLatLong() {
      fetch(`https://hedgehog-party.herokuapp.com/api/v1/invites`)
      .then(response => response.json())
      .then(hedgehogs => appendHedgehogs(hedgehogs))
      .catch(error => console.error({ error }));
    }
}
