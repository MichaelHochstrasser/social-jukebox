import QRCode from 'qrcode-react';
import React from 'react';
import { Grid, Header } from 'semantic-ui-react'

export default (props) => {
  return (
    <Grid centered columns={1}>
        <Grid.Row><Header as='h1'>{props.eventName}</Header></Grid.Row>
        <Grid.Row><a href={props.eventLink}>{props.eventLink}</a></Grid.Row>
        <Grid.Row><QRCode
          value={props.eventLink}
          size={256}
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Love_Heart_symbol.svg/2000px-Love_Heart_symbol.svg.png"
          bgColor="#2ED665"
          fgColor="#000000"/></Grid.Row>
    </Grid>
  )
}