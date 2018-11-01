import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.enterText = this.enterText.bind(this);
  }
  enterText(ev) {
    if (ev.keyCode === 13 || ev.which === 13) {
      this.props.sendMessage(ev.target.value);
      ev.target.value = "";
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.currentUser}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.enterText}/>
      </footer>
    );
  }
}

export default ChatBar;