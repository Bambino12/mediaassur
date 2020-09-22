import React from 'react';
import scriptLoader from 'react-async-script-loader';

import "./Map.css";

const GOOGLE_API_KEY="AIzaSyCUqdsx889D2SIcf_9RN5yNLNicDFY2p34"

const ARC_DE_TRIOMPHE_POSITION = {
    lat: 48.873947,
    lng: 2.295038
};

/*
  const EIFFEL_TOWER_POSITION = {
    lat: 48.858608,
    lng: 2.294471
  };
  */

var markers = []
var polygons = [];
//lastWindow = null
class Maps extends React.Component {

    constructor(props) {
        super(props);
        let {defaultPosition} =  this.props;
        this.state = {
            currentLocation: defaultPosition,
            map : null,
            data : [],
            lastWindow : null,
            lastMarker : null,
            isLoading : false,
        };
        this.panToArcDeTriomphe = this.panToArcDeTriomphe.bind(this);
        this.initMap = this.initMap.bind(this);
        this.toggleBounceMarker = this.toggleBounceMarker.bind(this)
        this.recenterMap = this.recenterMap.bind(this);
        this.dropMarker = this.dropMarker.bind(this);
        this.addMarkerWithTimeout = this.addMarkerWithTimeout.bind(this);
        this.clearMarkers = this.clearMarkers.bind(this);
        this.markerDetails = this.markerDetails.bind(this);
        this.setPolyline = this.setPolyline.bind(this);
        this.initVar = this.initVar.bind(this);
        markers = [];
    }

    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed, position, data}) {

        if (isScriptLoaded && !this.props.isScriptLoaded) {
            if (isScriptLoadSucceed) {
                this.initMap()
            }
            else this.props.onError()
        }

        if(isScriptLoadSucceed){
            this.setState({ currentLocation : position ? position  : this.state.currentLocation });
            this.setState({ data : data ? data :  this.state.data });
        }
    }

    componentDidMount() {
        //this.initVar()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap();
        }

        if (prevState.data.length !== this.state.data.length) {
            this.dropMarker();
        }
    }

    initMap(){
        if (!this.props.position) {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const coords = pos.coords;
                    if(coords.latitude && coords.longitude){
                        this.setState({
                            currentLocation: {
                                lat: coords.latitude,
                                lng: coords.longitude
                            }
                        });
                    }
                });
            }
        }else{
            this.setState({
                currentLocation: {
                    lat: this.props.position.lat,
                    lng: this.props.position.lng
                }
            });
        }

        let {zoom} =  this.props;

        let map = new window.google.maps.Map(this.refs.map, {
            center: this.state.currentLocation,
            zoom: zoom,
            mapTypeId: window.google.maps.MapTypeId.Hybrid
        });

        this.setState({
            map : map
        });

        this.dropMarker();
    }

    initVar(){
        const { isScriptLoaded, isScriptLoadSucceed, position, data } = this.props

        if(position){
            this.setState({ currentLocation : position });
        }

        this.setState({ data : data });

        if (isScriptLoaded && isScriptLoadSucceed) {
            this.initMap();
        }
    }

    dropMarker() {
        if(window.google){
            this.clearMarkers();

            for (var i = 0; i < this.state.data.length; i++) {
                this.addMarkerWithTimeout(this.state.data[i], i);
            }

            if(this.state.data.length > 0 && this.props.polyline) this.setPolyline();
        }
    }

    setPolyline(){
        let bounds = new window.google.maps.LatLngBounds();
        let arr = new Array();
        let map = this.state.map;

        var coordinates = []
        for (var i in coordinates) {
            arr = [];
            for (var j in  coordinates[i].items) {
                arr.push(new window.google.maps.LatLng(
                    coordinates[i].items[j].lat,
                    coordinates[i].items[j].lng
                ));
                bounds.extend(arr[arr.length - 1])
            }

            polygons.push(new window.google.maps.Polyline({
                path: arr,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            }));

            polygons[polygons.length - 1].setMap(map);

        }

        map.fitBounds(bounds);

        this.setState({
            map : map
        });
    }

    addMarkerWithTimeout(item, index) {

        window.setTimeout(() => {
            let icon = "fa-map-marker";

            let marker = new window.google.maps.Marker({
                position: {lat : item.lat, lng: item.lng},
                map: this.state.map,
                animation: window.google.maps.Animation.DROP,
                title : item.title,
                lng : item.lng,
                lat : item.lat,
                icon: {url: "https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon="+  icon +"&background="+ item.color +"&size=50&hoffset=0&voffset=-1"
                    //"https://cdn.mapmarker.io/api/v1/font-awesome/v4/icon?icon="+  icon +"&size=40&color=" + cusStatus[item.status.toString()]
                    //"https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=fa-star-solid&size=50&hoffset=0&voffset=-1&oncolor=6E942A"
                    //"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + (item.actif ? "008000" : "ed0000")
                }
            });

            if(!this.props.hideInfoWindow){
                marker.set("index", index);
                //marker.setAnimation(window.google.maps.Animation.BOUNCE);
                marker.content = this.markerDetails(this.state.data[index]);

                window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow, that) {
                    infowindow = new window.google.maps.InfoWindow();

                    return function() {

                        that.props.onMarkerClick(item);

                        infowindow.setContent(content);
                        //infowindow.close();

                        //console.log(that.state.lastWindow);
                        if(that.state.lastWindow) that.state.lastWindow.close();

                        infowindow.open(that.state.map, marker);
                        that.setState({ lastWindow : infowindow });
                        window.google.maps.event.addListener(that.state.map, 'click', function() {
                            infowindow.close();
                        });
                    };
                })(marker, marker.content, this.state.map.infowindow, this));
            }

            markers.push(marker);
        }, index * 20);
    }

    markerDetails(item) {
        let fileUrl = "https://cdn4.iconfinder.com/data/icons/mix-pack-3/44/Asset_61-512.png";

        // if(item.files.length > 0){
        //     // fileUrl = GET_CLIENT_FILES_CTR + item.files[0].name
        // }
    
        var html = "";
    
        html += '<div class="container py-5">';
        html += '<div class="row">';
        html += '<div class="col-md-12">';
        html += '<div class="row">';
        html += '<div class="col-md-12 mx-auto">';
        html += '<div class="card">';
        html += '<div class="card-body">';
        html += '<div class="" style="margin-bottom: 10px;">';
        html += '<div class="d-flex justify-content-start">';
        html += '<div class="image-container">';
        // html += '<img  src="'+ fileUrl +'" id="imgProfile" style="width: 160px;height: 120px;" class="img-thumbnail img-fluid img-responsive" />';
        html += '</div>';
        html += '<div class="userData ml-3">';
        html += '<h2 class="d-block" style="font-size: 1.5rem; font-weight: bold"><a href="'+ process.env.PUBLIC_URL +'/client/'+  item.id + '" > ' + item.etablissement + ' </a></h2>';
        html += '<ul class="row ul-info" style="float:left; list-style: none; font-size: 15px;margin-left: -50px;">';
        html += '<li class="col-xs-6 col-lg-6" ><strong>'+ item.code +'</strong> <br/> <small class="underLib" >Code client</small></li>';
        html += '<li class="col-xs-6 col-lg-6"><strong>' + item.telephone + ' <br/></strong><small class="underLib" >Telephone</small></li>';
        html += '<li  class="col-xs-6 col-lg-6" ><strong>' +  item.zoneLib + '</strong><br/> <small class="underLib" >Zone</small></li>';
        html += '<li class="col-xs-6 col-lg-6"><strong>' +  item.agenceName + '</strong><br/> <small class="underLib" >Agence</small></li>';
        html += '<li class="col-xs-6 col-lg-6" ><strong>' +  item.gestionnaireName + '</strong><br/> <small class="underLib" >Gestionnaire</small></li>';
        html += '<li class="col-xs-6 col-lg-6"><strong>' +  item.categorieLib + '</strong><br/> <small class="underLib" >Categorie</small></li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        return html;
    }

    clearMarkers(index) {
        if(index){
            markers[index].setMap(null);
            //this.state.markers[index].setMap(null);
        }else{
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }

        for (let i = 0; i < polygons.length; i++) {
            polygons[i].setMap(null);
        }

        polygons = [];
    }

    initMarker(){
    }

    recenterMap() {
        const map = this.state.map;

        if (map) {
            const current = this.state.currentLocation;
            //console.log(current);
            map.panTo(current);
            this.toggleBounceMarker(current)
        }
    }

    toggleBounceMarker(current) {

        if (this.state.lastMarker !== null) {
            if(this.state.lastMarker.getAnimation()){
                this.state.lastMarker.setAnimation(null);
            }
        }

        let marker = markers.filter(x => x.lat === current.lat && x.lng === current.lng);

        if(marker.length !== 0){
            marker = marker[0];
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            //marker.setAnimation(google.maps.Animation.BOUNCE);
            this.setState({lastMarker : marker});
        }
    }

    panToArcDeTriomphe() {
        //console.log(this)
        this.state.map.panTo(ARC_DE_TRIOMPHE_POSITION);
        this.props.test();
    }

    render() {
        const mapStyle = {
            width: "100%",
            height: (this.props.mapHeight ?  this.props.mapHeight : 400)
        };

        return (
            <div>
                <div ref="map" style={mapStyle}>
                    Loading...
                </div>
            </div>
        );

    }
}

export default scriptLoader(
    ['https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY]
)(Maps)


Maps.defaultProps = {
    zoom: 14,
    position: {
        lat: 5.3484461,
        lng: -4.0498769
    },
    defaultPosition: {
        lat: 5.3484461,
        lng: -4.0498769
    },
    centerAroundCurrentLocation: false,
    visible: true,
    onMarkerClick:function () {}
}
