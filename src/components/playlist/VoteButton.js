import React from 'react';

import { Button } from 'semantic-ui-react'

class VoteButton extends React.Component {
    static defaultProps = {
        onClick: () => {},
        color: "black",
        active: false,
        voteValue: 0,
        children: undefined,
        disabled: false
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { onClick, color, active, voteValue, disabled, children } = this.props;

        return (
            <Button
                className={active ? color : 'basic'}
                icon color={color}
                onClick={() => { onClick(voteValue); }}
                disabled={disabled}
            >
                {children}
            </Button>
        );
    }
}

export default VoteButton;
