import React from 'react';
import {Button, Container, Header, Input} from 'semantic-ui-react';

export default () => {
  return (
    <Container>
      <h1>Create New Event</h1>
      <Input icon='users' iconPosition='left' placeholder='Event name…' action='Create'/>
    </Container>
  );
}