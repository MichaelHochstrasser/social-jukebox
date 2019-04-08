import React from 'react';
import { Button, Header, Input } from 'semantic-ui-react';

export default () => {
  return (
    <div>
      <Header as='h1'>Create Event</Header>
      <Input icon='users' iconPosition='left' placeholder='Event name…' />
      <Button>Create</Button>
    </div>
  );
}