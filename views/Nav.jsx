/**
 * @providesModule Nav.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Nav = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <nav className="nav">
        <ol className="nav-list">
          <li className="nav-list-item"><a href="#questions">Questions</a>
            <ol className="sub-list">
              <li className="sub-list-item"><a href="#trips">Trips</a></li>
              <li className="sub-list-item"><a href="#tripstweets">Trips n' Tweets</a></li>
            </ol>
          </li>
          <li className="nav-list-item"><a href="#connections" onClick={this._onButtonClick}>Connections</a></li>
          <li className="nav-list-item"><a href="#about">About</a></li>
        </ol>
      </nav>
    );
  }
});

module.exports = Nav;
