import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SearchBar, ButtonGroup } from 'react-native-elements'
import * as _ from 'lodash'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { styles } from 'react-native-theme'

import { primaryColor } from './../../styles/styles'
import Constant from '../../utilities/constants'
import SearchResult from './SearchResult'
import {
  doneSearchingMoviesEtc,
  searchFilterChanged,
  searchingForMoviesEtc,
  searchResultSelected,
  selectedMovie,
  selectedTvShow
} from '../../Actions'

import { searchItem } from '../../services/search'

const buttons = ['Movie', 'Tv', 'Person']

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  onTextChange = e => {
    // Set value
    this.setState({ value: e })
    _.debounce(this.onSearch, 500)()
  }

  onSearch = () => {
    // Search only if there is any value
    const { value } = this.state
    if (value) {
      this.props.onSearchingForMoviesEtc()
      const {
        settings: { language, region }
      } = this.props

      searchItem(value, language, region)
        .then(({ data }) => {
          this.props.onDoneSearchingMoviesEtc(data.results)
        })
        .catch(error => console.log(error.response.data.message))
    }
  }

  onClearText = () => {
    this.setState({ value: '' })
  }

  /**
   * Filters search results based on media_type
   */
  filterSearchResults = (results, index) => {
    return results.filter(result => {
      return result.media_type.toLowerCase() === buttons[index].toLowerCase()
    })
  }

  render() {
    const {
      results,
      isSearching,
      onFilterChanged,
      onSearchResultSelected,
      selectedIndex,
      config,
      popular
    } = this.props
    const filteredResults = this.filterSearchResults(results, selectedIndex)

    return (
      <View style={[{ flex: 1 }, styles.screenBackgroundColor]}>
        <SearchBar
          style={{
            marginTop: 20
          }} // lightTheme
          round
          onChangeText={this.onTextChange}
          onClearText={this.onClearText}
          placeholder="Search"
          value={this.state.value}
        />

        <ButtonGroup
          lightTheme={false}
          onPress={onFilterChanged.bind(this)}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{
            height: 30,
            backgroundColor: '#e1e1e1',
            marginTop: 10
          }}
        />

        <View>
          {isSearching ? (
            <ActivityIndicator size="large" color={primaryColor} />
          ) : (
            <SearchResult
              config={config}
              items={filteredResults}
              popular={selectedIndex < 2 ? popular[selectedIndex] : []}
              onSelectPopular={this.onTextChange}
              onSelect={onSearchResultSelected}
            />
          )}
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  config: state.configuration,
  popular: [state.movies.categories.popular, state.tvShows.categories.popular],
  settings: state.settings,
  ...state.search
})

const mapDispatchToProps = dispatch => ({
  onFilterChanged: index => {
    dispatch(searchFilterChanged(index))
  },
  onSearchingForMoviesEtc: () => {
    dispatch(searchingForMoviesEtc())
  },
  onDoneSearchingMoviesEtc: results => {
    dispatch(doneSearchingMoviesEtc(results))
  },
  onSearchResultSelected: result => {
    const params = {
      name: result.name || result.title,
      id: result.id
    }

    dispatch(searchResultSelected(result, result.media_type))
    switch (result.media_type) {
      case 'movie':
        dispatch(
          NavigationActions.navigate({ routeName: 'MovieDetails', params })
        )
        break
      case 'tv':
        dispatch(
          NavigationActions.navigate({ routeName: 'TvShowDetails', params })
        )
        break
      case 'person':
        dispatch(
          NavigationActions.navigate({ routeName: 'CastDetails', params })
        )
        break
      default:
        console.log('Unrecognised media type')
        break
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
