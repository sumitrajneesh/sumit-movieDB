import React, {Component} from 'react'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {View, Text, Image, ActivityIndicator, ScrollView} from 'react-native'
import axios from 'axios'
import {styles} from 'react-native-theme'

import HorizontalImageList from './ImageList'
import {getUriPopulated} from '../../utilities/utils'
import {getCastDetails, getCastKnowFor} from '../../services/person'
import {
  castDetailsFetched, 
  fetchingCastDetails, 
  selectedTvShow, 
  selectedMovie, 
  searchItemDetailsFetched, 
  fetchCastDetails} from '../../Actions'

import {primaryColor} from '../../styles/styles'

class CastDetails extends Component {
  componentDidMount () {
    const castId = this.props.details.id
    this.props.fetchCastDetails(castId)

    const {
      config,
      currentTab,
      config: {
        image: {
          secureBaseUrl,
          posterSizeForBackground
        }
      }
    } = this.props

    if (currentTab !== 'Search') // search tab already has the data available
    { this.props.onFetching(currentTab) }

    // fetch Cast Details
    getCastDetails(castId)
    .then(({data}) => {
      data.imageSrc = `${secureBaseUrl}${posterSizeForBackground}${data['profile_path']}`
      this.props.onDetailsFetched(data, 'bio', this.props.currentTab)
    })
    .catch(error => console.log(error.response))

    // fetch Casts other movies
    getCastKnowFor(castId)
    .then(({data}) => {
      const movieList = [
        ...data.cast,
        ...data.crew
      ]
      this.props.onDetailsFetched(getUriPopulated(movieList, config, 'posterSizeForImageList'),
        'movies',
        this.props.currentTab)
    })
    .catch(error => console.log(error.response))
  }

  showDetails(item) {
    const { onShowDetails, currentTab, searchIndex } = this.props
    onShowDetails(item, currentTab, searchIndex)
  }

  render () {
    const {isFetching, details, config} = this.props

    if (isFetching) {
      return (
        <ScrollView style={styles.screenBackgroundColor}>
          <ActivityIndicator size='large' color={primaryColor} />
        </ScrollView>
      )
    }

    return (
      <View
        style={[{flex: 1}, styles.screenBackgroundColor]}>
        <ScrollView style={styles.screenBackgroundColor}>
          <View style={styles.castBackground}>
            <Image
              style={[styles.avatarSize, styles.avatarBigSize]}
              source={{
                uri: details.imageSrc
              }} />
            <Text style={[styles.text, styles.titleText]}>
              {details.name}
            </Text>
            <Text style={[styles.text, styles.normalText]}>
              {details.birthday}
            </Text>
            <Text style={[styles.text, styles.normalText]}>
              {details.place_of_birth}
            </Text>
          </View>

          <View style={[styles.castBiography]}>
            <Text style={[styles.text, styles.normalText]}>
              {details.biography}
            </Text>

            <HorizontalImageList
              isTouchableImage
              title='Known For'
              style={config.style.posterSize}
              onPress={this.showDetails.bind(this)}
              images={details.movies || []} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const currentTab = state.tabNavHelper.currentTab
  const mapScreenToStateProps = {
    'Movies': 'movies',
    'TvShows': 'tvShows',
    'Search': 'search'
  }

  return {
    config: state.configuration,
    currentTab,
    searchIndex: (currentTab === 'Search') && state.search.selectedIndex,
    ...state[mapScreenToStateProps[currentTab]].cast,
  }
}

const mapDispatchToProps = dispatch => ({
  onFetching: (currentTab) => {
    dispatch(fetchingCastDetails(currentTab))
  },
  onDetailsFetched: (details, category, currentTab) => {
    if (currentTab === 'Search') {
      dispatch(searchItemDetailsFetched(details, category))
    } else {
      dispatch(castDetailsFetched(details, category, currentTab))
    }
  },
  onShowDetails: (item, currentTab, searchIndex) => {
    routeName = (currentTab === 'Movies') ? 'MovieDetails' : 'TvShowDetails'

    if (currentTab === 'Search' && searchIndex) {
      if (searchIndex === 0) {
        routeName = 'MovieDetails'
      } else if (searchIndex === 1) {
        routeName = 'TvShowDetails'
      } else {
        // For people search - known for results only have movie results and not tv shows
        routeName = 'MovieDetails'
      }
    }
    funcToCall = (routeName === 'TvShowDetails') ? selectedTvShow : selectedMovie

    dispatch(funcToCall(item))
    dispatch(NavigationActions.navigate({
      routeName: routeName,
      params: {
        name: item.name || item.original_title,
        id: item.id
      }
    }))
  },
  fetchCastDetails
})

export default connect(mapStateToProps, mapDispatchToProps)(CastDetails)
