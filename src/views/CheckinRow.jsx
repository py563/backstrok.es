/**
 * @providesModule CheckinRow
 * @flow
 */
const React = require('react');

export type Checkin = {
  address: ?string,
  categories: Array<{
    icon: ?{
      prefix: string,
      suffix: string,
    },
    name: string,
  }>,
  city: ?string,
  comments: ?Object,
  createdDate: ?string,
  createdTime: ?string,
  createdSince: ?string,
  crossStreet: ?string,
  id: string,
  seq: number,
  name: string,
  photos: ?Object,
  shout: ?string,
  state: ?string,
  venue: Object,
  zip: ?string,
};

class CheckinRow extends React.PureComponent<Checkin> {
  render() {
    const {
      address,
      categories,
      city,
      comments,
      createdDate,
      createdTime,
      createdSince,
      crossStreet,
      id,
      seq,
      name,
      photos,
      shout,
      state,
      venue,
      zip,
    } = this.props;

    const dateField = createdDate ? (
      [
        <dt className="checkin-ttl date" key="ttl-date">
          <span>Date</span>
        </dt>,
        <dd className="checkin-det date" key="det-date">
          <span>{createdDate}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const timeField = createdTime ? (
      [
        <dt className="checkin-ttl time" key="ttl-time">
          <span>Time</span>
        </dt>,
        <dd className="checkin-det time" key="det-time">
          <span>{createdTime}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const sinceField = createdSince ? (
      [
        <dt className="checkin-ttl since" key="ttl-since">
          <span>Since</span>
        </dt>,
        <dd className="checkin-det since" key="det-since">
          <span>{createdSince}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const nameField = [
      <dt className="checkin-ttl name" key="ttl-name">
        <span>Name</span>
      </dt>,
      <dd className="checkin-det name" key="det-name">
        <span>{name}</span>
      </dd>,
    ];

    const crossStreetField = crossStreet ? (
      [
        <dt className="checkin-ttl cross" key="ttl-cross">
          <span>Cross Street</span>
        </dt>,
        <dd className="checkin-det cross" key="det-cross">
          <span>{crossStreet}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const addressField = address ? (
      [
        <dt className="checkin-ttl address" key="ttl-address">
          <span>Address</span>
        </dt>,
        <dd className="checkin-det address" key="det-address">
          <span>{address}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const cityField = city ? (
      [
        <dt className="checkin-ttl city" key="ttl-city">
          <span>City</span>
        </dt>,
        <dd className="checkin-det city" key="det-city">
          <span>{city}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const stateField = state ? (
      [
        <dt className="checkin-ttl state" key="ttl-state">
          <span>State</span>
        </dt>,
        <dd className="checkin-det state" key="det-state">
          <span>{state}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const zipField = zip ? (
      [
        <dt className="checkin-ttl zip" key="ttl-zip">
          <span>Zip</span>
        </dt>,
        <dd className="checkin-det zip" key="det-zip">
          <span>{zip}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const shoutField = shout ? (
      [
        <dt className="checkin-ttl shout" key="ttl-shout">
          <span>Shout</span>
        </dt>,
        <dd className="checkin-det shout" key="det-shout">
          <span>{shout}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    let photosField = <noscript />;

    if (photos) {
      const photoItems = photos.items.map(photo => (
        <li className="checkin-photo">
          <a
            href={`https://foursquare.com/user/${photo.user.id}/checkin/${id}`}
            title="View Photo on Foursquare"
            rel="external">
            <img
              src={`${photo.prefix}36x36${photo.suffix}`}
              height="36"
              width="36"
              title="Checkin"
              alt="Checkin"
            />
          </a>
        </li>
      ));

      photosField = [
        <dt className="checkin-ttl photos">
          <span>Photos</span>
        </dt>,
        <dd className="checkin-det photos photo-count">
          <span>
            {photos.count} Photo{photos.count > 1 ? 's' : ''}
          </span>
        </dd>,
        <dd className="checkin-det photos photo-images">
          <ul>{photoItems}</ul>
        </dd>,
      ];
    }

    const commentsField = comments ? (
      [
        <dt className="checkin-ttl comments">
          <span>Comments</span>
        </dt>,
        <dd className="checkin-det comments comments-count">
          <span>{comments ? comments.length : 0}</span>
        </dd>,
      ]
    ) : (
      <noscript />
    );

    const category = categories[0];

    const imageField =
      category && category.icon ? (
        <img
          className="checkin-category"
          src={`${category.icon.prefix}bg_32${category.icon.suffix}`}
          height="32"
          width="32"
          title={category.name}
          alt={category.name}
        />
      ) : (
        <noscript />
      );

    const headerField = (
      <h4 className="h4 checkin-hd">
        {imageField}
        <a
          href={`https://foursquare.com/venue/${venue.id}`}
          title={`${name} on Foursquare`}
          rel="external">
          {name}
        </a>
      </h4>
    );

    return (
      <article
        className="checkin-item"
        data-count={seq}
        data-location-lat={venue.location.lat}
        data-location-lng={venue.location.lng}>
        {headerField}
        <dl className="checkin">
          {dateField}
          {timeField}
          {sinceField}
          {nameField}
          {crossStreetField}
          {addressField}
          {cityField}
          {stateField}
          {zipField}
          {shoutField}
          {photosField}
          {commentsField}
        </dl>
      </article>
    );
  }
}

module.exports = CheckinRow;
