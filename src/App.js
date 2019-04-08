import React, { Component } from 'react';
import './App.css';
import Startpage from './components/Startpage'
import PlaylistItem from './components/PlaylistItem'
import { Grid, Button } from 'semantic-ui-react'

class App extends Component {
  render() {
    return (
      <Grid className="App" columns={1}>
        <Grid.Row>
            <Grid.Column>
                Player
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <p>Playlist</p>
                <PlaylistItem songtitle="Lady Gaga" votes="12"/>
                <PlaylistItem songtitle="Züri West" votes="11"/>
                <PlaylistItem songtitle="The Killers" votes="10"/>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Button circular color='red' size='big' icon='add' />
            </Grid.Column>
        </Grid.Row>
    </Grid>
    );
  }
}

export default App;
