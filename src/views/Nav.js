/**
 * @providesModule Nav.jsx
 * @flow
 */
const React = require('react');

module.exports = () => (
  <nav className="nav">
    <ol className="nav-list">
      <li className="nav-list-item">
        <a href="#questions">Questions</a>
        <ol className="sub-list">
          <li className="sub-list-item">
            <a href="#trips">Trips</a>
          </li>
          <li className="sub-list-item">
            <a href="#tripstweets">Trips n&#39; Tweets</a>
          </li>
        </ol>
      </li>
      <li className="nav-list-item">
        <a href="#connections">Connections</a>
      </li>
      <li className="nav-list-item">
        <a href="#about">About</a>
      </li>
    </ol>
  </nav>
);
