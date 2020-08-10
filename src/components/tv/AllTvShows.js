import React, { Component } from 'react'
import {Dimensions} from 'react-native'
import { connect } from 'react-redux'
import {styles} from 'react-native-theme'
import { NavigationActions } from 'react-navigation'

import { selectedTvShow } from '../../Actions'
import { FlatImageList } from '../common/ImageList'

// return device width and height
const {height, width} = Dimensions.get('window')
const numColumns = parseInt(width / (92 + (5 * 2)))

class AllTvShows extends Component {
  render () {
    const { onShowDetails, categories, config } = this.props
    const { category } = this.props.navigation.state.params

    return (
      <FlatImageList
        numColumns={config.image.numColumns}
        style={{
          bgColor: styles.screenBackgroundColor,
          imageStyle: config.style.posterSize
        }}
        images={categories[category.toCategory()]}
        onPress={onShowDetails.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state.tvShows,
  config: state.configuration
})

const mapDispatchToProps = dispatch => ({
  onShowDetails: (tvShow) => {
    dispatch(selectedTvShow(tvShow))
    dispatch(NavigationActions.navigate({routeName: 'TvShowDetails',
      params: {
        name: tvShow.name,
        id: tvShow.id
      }}))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AllTvShows)
