import React, {Component} from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

import Details from '../base/Details'
import HorizontalImageList from '../common/ImageList'
import { getUriPopulated } from '../../utilities/utils'
import {
  castSelected,
  searchItemDetailsFetched,
  tvShowDetailsFetched
} from '../../Actions'

class TvShowDetails extends Details {
  componentDidMount () {
    this.fetchDetails('/tv/', this.props.details.id || this.props.navigation.state.params.id)
  }

  showSeasonDetails (season) {
    this.props.navigation.navigate('SeasonDetails', {season: season,
      title: this.props.details.name,
      tvShowId: this.props.details.id
    })
  }

  getSpecialComponent () {
    const seasons = _.get(this, 'props.details.seasons', [])
    const { config } = this.props

    return <HorizontalImageList
      isTouchableImage
      title='Seasons'
      style={config.style.posterSize}
      onPress={this.showSeasonDetails.bind(this)}
      images={getUriPopulated(seasons.sort((a, b) => b.season_number - a.season_number), config, 'posterSizeForImageList')}
    />
  }
}

const mapStateToProps = ({tabNavHelper, search, tvShows, configuration}) => ({
  details: tabNavHelper.currentTab === 'Search' ? search.details : tvShows.details,
  currentTab: tabNavHelper.currentTab,
  config: configuration
})

const mapDispatchToProps = dispatch => ({
  onDetailsFetched: (details, category, currentTab) => {
    if (currentTab === 'Search') {
      dispatch(searchItemDetailsFetched(details, category))
    } else {
      dispatch(tvShowDetailsFetched(details, category))
    }
  },
  onCastSelected: (cast, currentTab) => {
    dispatch(castSelected(cast, currentTab))
    dispatch(NavigationActions.navigate({routeName: 'CastDetails',
      params: {
        name: cast.name,
        id: cast.id
      }}))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TvShowDetails)
