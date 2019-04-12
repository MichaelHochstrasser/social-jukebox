import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import memoizeOne from "memoize-one";
import "./SearchSong.css";
import "./circle.css";
import { BACKEND_BASE_URL } from "../../shared/constants";

function millisToMinutesAndSeconds(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds === 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export class SearchSongs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      isLoading: false,
      results: []
    };

    this.debouncedSearch = _.debounce(this.handleSearchSong, 300);
    this.memoizedRenderer = memoizeOne(this.resultsRenderer);
  }

  componentDidMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) => {
    this.addSong(result);
    this.setState({ value: result.artist + " - " + result.title });
    this.props.closeModal();
  };

  searchSong = query => {
    if (query) {
      const axios = require("axios");
      const url =
        `${BACKEND_BASE_URL}/search?term=` +
        query +
        "&eventId=" +
        this.props.eventId;
      const header = {
        "Content-Type": "application/json"
      };

      return axios.get(url, header);
    } else {
      return Promise.resolve([]);
    }
  };

  handleSearchSong = () => {
    const { value } = this.state;

    if (value) {
      this.setState({ isLoading: true });

      this.searchSong(value)
        .then(response => {
          let results = [];

          if (response.data && response.data.length) {
            results = response.data
              .map(s => ({ ...s, songid: s.id, key: s.id }))
              .sort((a, b) => (a.popularity < b.popularity ? 1 : -1));
          }

          this.setState({
            isLoading: false,
            results
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  addSong = song => {
    const axios = require("axios");
    const url = `${BACKEND_BASE_URL}/addSong`;
    const body = {
      eventId: this.props.eventId,
      songId: song.id
    };
    const header = {
      "Content-Type": "application/json"
    };

    axios
      .post(url, body, header)
      .then(function(response) {})
      .catch(function(error) {
        console.log(error);
      });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ value }, this.debouncedSearch);
  };

  resultsRenderer = ({
    id,
    songid,
    image,
    title,
    artist,
    duration_ms,
    popularity
  }) => {
    const { loadedSongs } = this.props;

    let rightContent;

    if (loadedSongs.includes(songid)) {
      rightContent = (
        <div>
          <span className="already-added">Already in playlist</span>
        </div>
      );
    } else {
      rightContent = (
        <div className={"small green c100 p" + popularity}>
          <span>{popularity}%</span>
          <div className="slice">
            <div className="bar" />
            <div className="fill" />
          </div>
        </div>
      );
    }

    return (
      <div className="main-container" key={id}>
        <div className="left-content">
          <img alt="song" height={55} src={image} />
        </div>
        <div className="center-content">
          <div className="song-title">{title}</div>
          <div>{artist}</div>
          <div className="song-duration">
            {millisToMinutesAndSeconds(duration_ms)}
          </div>
        </div>
        <div className="right-content">{rightContent}</div>
      </div>
    );
  };

  debouncedSearch = null;

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        loading={isLoading}
        input={{ fluid: true }}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        resultRenderer={this.memoizedRenderer}
        value={value}
      />
    );
  }
}
