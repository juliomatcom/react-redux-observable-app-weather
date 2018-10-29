import React from 'react';
import { connect } from "react-redux";
import Choices from '../components/Choices'
import Box from '../components/Box';
import {
  updateCityAction,
  fetchCityAction,
  getStopAction
} from '../actions/cityActions';
import { loadingAction } from '../actions/uiActions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(city) {
    return () => {
      this.props.dispatchLoading(true);
      this.props.dispatchFetchCity(city);
    }
  }

  componentDidMount() {
    this.props.history.listen((location, action) => { // https://stackoverflow.com/questions/41911309/how-to-listen-to-route-changes-in-react-router-v4
      this.props.dispatchStopFetch(); // Cancellation
    });
  }

  render() {
    const errorScreen = <p className="error"> Error: {this.props.error && this.props.error.message}</p>;
    const loading = <p> Loading... </p>;

    return (
      <div>
        {this.props.loading && loading}
        {this.props.error && errorScreen}
        <Choices eventSub={this.fetchData} choices={this.props.choices}/>
        <Box city={this.props.city} data={this.props.data} loading={this.props.loading}/>
      </div>
    );
  }
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
  dispatchUpdateCity: updateCityAction,
  dispatchFetchCity: fetchCityAction,
  dispatchStopFetch: getStopAction,
  dispatchLoading: loadingAction
};

export const HomeConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
