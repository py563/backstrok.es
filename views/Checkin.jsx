/**
 * @providesModule Checkin.jsx
 * @flow
 */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var {PropTypes} = React;

var Checkin = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    address: PropTypes.string,
    city: PropTypes.string,
    comments: PropTypes.object,
    createdDate: PropTypes.string,
    createdTime: PropTypes.string,
    createdSince: PropTypes.string,
    crossStreet: PropTypes.string,
    seq: PropTypes.number,
    name: PropTypes.string,
    photos: PropTypes.object,
    shout: PropTypes.string,
    state: PropTypes.string,
    venue: PropTypes.object,
    zip: PropTypes.string,
  },
  render() {
    var props = this.props;

    var date = props.createdDate ? ([
      <dt className="checkin-ttl date" key="ttl-date"><span>Date</span></dt>,
      <dd className="checkin-det date" key="det-date"><span>{props.createdDate}</span></dd>,
    ]): <noscript />;

    var time = props.createdTime ? ([
      <dt className="checkin-ttl time" key="ttl-time"><span>Time</span></dt>,
      <dd className="checkin-det time" key="det-time"><span>{props.createdTime}</span></dd>,
    ]): <noscript />;

    var since = props.createdSince ? ([
      <dt className="checkin-ttl since" key="ttl-since"><span>Since</span></dt>,
      <dd className="checkin-det since" key="det-since"><span>{props.createdSince}</span></dd>,
    ]): <noscript />;

    var name = props.name ? ([
      <dt className="checkin-ttl name" key="ttl-name"><span>Name</span></dt>,
      <dd className="checkin-det name" key="det-name"><span>{props.name}</span></dd>,
    ]): <noscript />;

    var crossStreet = props.crossStreet ? ([
      <dt className="checkin-ttl cross" key="ttl-cross"><span>Cross Street</span></dt>,
      <dd className="checkin-det cross" key="det-cross"><span>{props.crossStreet}</span></dd>,
    ]): <noscript />;

    var address = props.address ? ([
      <dt className="checkin-ttl address" key="ttl-address"><span>Address</span></dt>,
      <dd className="checkin-det address" key="det-address"><span>{props.address}</span></dd>,
    ]): <noscript />;

    var city = props.city ? ([
      <dt className="checkin-ttl city" key="ttl-city"><span>City</span></dt>,
      <dd className="checkin-det city" key="det-city"><span>{props.city}</span></dd>,
    ]): <noscript />;

    var state = props.state ? ([
      <dt className="checkin-ttl state" key="ttl-state"><span>State</span></dt>,
      <dd className="checkin-det state" key="det-state"><span>{props.state}</span></dd>,
    ]): <noscript />;

    var zip = props.zip ? ([
      <dt className="checkin-ttl zip" key="ttl-zip"><span>Zip</span></dt>,
      <dd className="checkin-det zip" key="det-zip"><span>{props.zip}</span></dd>,
    ]): <noscript />;

    var shout = props.shout ? ([
      <dt className="checkin-ttl shout" key="ttl-shout"><span>Shout</span></dt>,
      <dd className="checkin-det shout" key="det-shout"><span>{props.shout}</span></dd>,
    ]): <noscript />;

    var photos = <noscript />;

    if (props.photos) {
      var photoItems = props.photos.items.map((photo) => {
        return (
          <li className="checkin-photo">
            <a href={'https://foursquare.com/user/' + photo.user.id + '/checkin/' + props.id} title="View Photo on Foursquare" rel="external">
              <img src={photo.prefix + '36x36' + photo.suffix} height="36" width="36" title="Checkin Photo" alt="Checkin Photo" />
            </a>
          </li>
        );
      });

      photos = [
        <dt className="checkin-ttl photos"><span>Photos</span></dt>,
        <dd className="checkin-det photos photo-count">
          <span>{props.photos.count} Photo{props.photos.count > 1 ? 's' : ''}</span>
        </dd>,
        <dd className="checkin-det photos photo-images"><ul>{photoItems}</ul></dd>,
      ];
    }

    var comments = props.comments ? ([
      <dt className="checkin-ttl comments"><span>Comments</span></dt>,
      <dd className="checkin-det comments comments-count"><span>{props.comments ? props.comments.length : 0}</span></dd>,
    ]): <noscript />;

    var category = this.props.categories[0];

    var image = category && category.icon ?
      <img className="checkin-category" src={category.icon.prefix + 'bg_32' + category.icon.suffix} height="32" width="32" title={category.name} alt={category.name} />
      : <noscript />;

    var header =
      <h4 className="h4 checkin-hd">
        {image}
        <a href={'https://foursquare.com/venue/' + this.props.venue.id} title={this.props.name + ' on Foursquare'} rel="external">{this.props.name}</a>
      </h4>

    return (
      <article className="checkin-item" data-count={props.seq} data-location-lat={this.props.venue.location.lat} data-location-lng={this.props.venue.location.lng}>
        {header}
        <dl className="checkin">
          {date}
          {time}
          {since}
          {name}
          {crossStreet}
          {address}
          {city}
          {state}
          {zip}
          {shout}
          {photos}
          {comments}
        </dl>
      </article>
    );
  }
});

module.exports = Checkin;
