$.domReady(e => {
  let as = $('li.trip-nav-itm a'),
    ss = $('.trip-items'),
    es = $("a[rel='external']"),
    hd = $('.trip-nav .section-head'),
    rs = $('.results'),
    buffer = 125;

  function gp(e, n) {
    let p = e.parentNode;
    while (n - 1 > 1 && p) {
      p = p.parentNode;
      n--;
    }
    return p;
  }

  function gs() {
    const r = document.body.scrollTop;
    if (r) {
      return r;
    } else if (window.pageYOffset) {
      return window.pageYOffset;
    } else if (document.body.parentElement) {
      return document.body.parentElement.scrollTop;
    }
    return 0;
  }

  function t(a, p) {
    ss.addClass('closed');
    as.removeClass('selected');
    p.removeClass('closed');
    a.addClass('selected');

    let ho = hd.offset(),
      mb = $.viewport().height - ho.top - ho.height;
    rs.css('marginBottom', `${mb}px`);

    let s = gs(),
      e = p.offset().top - buffer,
      cs = $('.checkin-item', p[0]),
      off = [],
      oP = 0,
      start = cs[0],
      mapArea = $('#map_area'),
      map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 16,
        center: new google.maps.LatLng(
          start.getAttribute('data-location-lat'),
          start.getAttribute('data-location-lng'),
        ),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
      });

    $.tween(
      500,
      p => {
        window.scrollTo(0, p);
      },
      null,
      t => Math.sin(t * Math.PI / 2),
      s,
      e,
    );

    $.tween(
      500,
      position => {
        mapArea.css('top', `${position}px`);
      },
      () => {
        console.log('finished');
        mapArea.css('top', '335px');
      },
      null,
      20,
      335,
    );

    cs.each(c => {
      let o = $(c).offset(),
        coords = {
          item: c,
          top: o.top - buffer,
          height: o.height,
          lim: o.height / 2,
        };

      c.coords = coords;
      off.push(coords);

      let name = $('.checkin-hd a', c)[0].innerHTML,
        iconEl = $('.checkin-hd img', c),
        icon = iconEl[0].src,
        title = `${c.getAttribute('data-count')}. ${name}`,
        marker = new google.maps.Marker({
          map,
          title,
          icon,
          position: new google.maps.LatLng(
            c.getAttribute('data-location-lat'),
            c.getAttribute('data-location-lng'),
          ),
        });

      c.coords.marker = marker;

      iconEl
        .bind('click', () => {
          activate(c.coords);
        })
        .addClass('marked');

      google.maps.event.addListener(marker, 'click', () => {
        activate(c.coords);
      });
    });

    let timeout,
      running = false;

    function activate(p) {
      /* $.tween(200,
        function(y) {
          window.scrollTo(0, y);
        },
        function() {
          setTimeout(function() {
            running = false;
          }, 200);
        },
        function(t) {
          return Math.sin(t * Math.PI / 2);
        },
        gs(),
        p.top
      ); */
      // window.scrollTo(0, p.top);

      if (map) {
        map.panTo(
          new google.maps.LatLng(
            p.item.getAttribute('data-location-lat'),
            p.item.getAttribute('data-location-lng'),
          ),
        );
      }
    }

    $(window).bind('scroll', () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      const pos = gs();

      function getPosition(pos) {
        if (pos < off[0].top) {
          return null;
        }

        for (let i = 0; i < off.length; i++) {
          let item = off[i],
            n = off[i + 1];

          // If it's equal, just return null.
          if (pos == item.top) {
            return null;
          } else if (!n) {
            // Are we at the end of the array?
            return item;
          } else if (n && pos >= n.top) {
            // If the position is larger than the next item, continue.
            continue;
          } else if (pos > item.top && pos <= item.top + item.lim) {
            // If the position is past the top of the item, but within the top half of the item, scroll to the item.
            return item;
          } else if (pos > item.top && pos <= n.top) {
            // If the position is past the top of the item, less than the next item, return the next item position.
            return n;
          }
        }
        return null;
      }

      const p = getPosition(pos);

      if (p && !running) {
        timeout = setTimeout(() => {
          activate(p);
        }, 150);
      }
    });
  }

  es.each(a => {
    a.onclick = function() {
      const newwindow = window.open(a.href);
      if (window.focus) {
        newwindow.focus();
        return false;
      }
      return false;
    };
  });

  as.each(a => {
    const n = a.href.split('#')[1];
    if (!n) {
      return;
    }
    const na = $(`a[id='${n}']`);
    if (!na[0]) {
      return;
    }
    const p = $(gp(na[0], 5));
    p.addClass('closed');
    a.onclick = function() {
      return false;
    };
    a = $(a);
    a.bind('click', () => {
      t(a, p);
      return false;
    });
  });

  // CREATE MAP DIV
  $('.wrapper').append('<div id="map_area"><div id="map_canvas"></div></div>');
});
