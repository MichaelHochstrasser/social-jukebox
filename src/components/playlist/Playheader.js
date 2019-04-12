import React, { Component } from "react";
import { Container, Grid, Progress, Segment, Image } from "semantic-ui-react";

export class Playheader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentlyPlayingSong, trackProgress, time } = this.props;

    if (!currentlyPlayingSong) {
      return null;
    }

    return (
      <Segment>
        <Grid className="App" columns={1}>
          <Grid.Row>
            <Container align="center">
              <h2>{currentlyPlayingSong.title}</h2>
              <p>{currentlyPlayingSong.artist}</p>
              <div style={{ paddingBottom: "1em" }}>
                <Image src={currentlyPlayingSong.image} size="small" />
              </div>
            </Container>
          </Grid.Row>
          {trackProgress ? (
            <Grid.Row>
              <Grid.Column>
                <Progress percent={trackProgress} size="tiny">
                  {time}
                </Progress>
              </Grid.Column>
            </Grid.Row>
          ) : (
            <div />
          )}
        </Grid>
      </Segment>
    );
  }
}
