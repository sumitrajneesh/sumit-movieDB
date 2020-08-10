import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {connect} from 'react-redux'
import theme, {styles} from 'react-native-theme'

import {fetchSettingsAction} from './../../Actions'
import {TouchableListItem} from './../common/ListItem'

class SettingDetails extends Component {

  componentDidMount() {
    this
      .props
      .fetchSettingsAction();
  }

  _changeSettings = (key, value) => {
    let changes = {};
    changes[key] = value;
    this
      .props
      .navigation
      .state
      .params
      .onSelect(Object.assign({}, this.props.settings, changes));
  }

  render() {
    const {name, values} = this.props.navigation.state.params;
    const selected = this.props.settings[name.toLowerCase()];

    return (
      <View style={[{flex: 1}, styles.screenBackgroundColor]}>
        <View>
          <Text style={[styles.text, styles.subHeading, styles.settingDetailsTitle]}>
            {`${name} Settings`}
          </Text>

          {values.map((value) => (
          <TouchableListItem
            key={value}
            name={value}
            selected={selected}
            onPress={() => {
            this._changeSettings(name.toLowerCase(), value)
          }}/>))}
        </View>
      </View>
    )
  }
}

function mapStateToProps({settings}) {
  return {settings}
}

export default connect(mapStateToProps, {fetchSettingsAction})(SettingDetails);
