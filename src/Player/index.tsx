import React, { Component } from 'react';
import PlayerCon from './Player';
import { WsPlayerProps } from './PlayerInterface';
export interface PlayerProps extends WsPlayerProps {
}

export default class Player extends Component<PlayerProps> {
  render() {
    // if (this.props.ws) {
      return <PlayerCon {...this.props} />;
    // }
  }
}
