import QRCode from 'qrcode-react';
import React from 'react';
import { Grid, Header } from 'semantic-ui-react'

export default (props) => {
  return (
    <Grid centered columns={1}>
        <Grid.Row><Header as='h1'>{props.eventName}</Header></Grid.Row>
        <Grid.Row><a href={props.eventLink}>{props.eventLink}</a></Grid.Row>
        <Grid.Row><QRCode value={props.eventLink} size={256} /></Grid.Row>
    </Grid>
  )
}