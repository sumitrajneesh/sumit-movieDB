import React, { Component } from 'react';
import { View, ScrollView, Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {styles} from 'react-native-theme';

import { saveSettingsAction } from './../../Actions'
import { MovieDBListItem, TouchableListItem } from './../common/ListItem';

const appInfo = [
  {
    name: 'App Name',
    value: 'MovieDB'
  }, {
    name: 'App Version',
    value: '0.0.1'
  }
];

const settings = [
  {
    name: 'Language',
    values: ['IN-hi', 'US-en', 'UK-en']
  }, {
    name: 'Region',
    values: ['IN', 'US', 'UK']
  }, {
    name: 'Theme',
    values: ['Light', 'Dark']
  }
]

class Settings extends Component {

  onSettingsChange = (values) => {
    this.props.saveSettingsAction(values);
  }

  render() {
    return (
      <View style={[{flex: 1}, styles.screenBackgroundColor]}>
        <ScrollView style={{marginTop: 20, minHeight: 480}}>
          <Text style={[styles.text, styles.subHeading, styles.settingDetailsTitle]}>
            About
          </Text>
          {appInfo.map((info, index) => (
            <MovieDBListItem name={info.name} value={info.value} key={index}/>
          ))}

          <View style={{marginTop: 20}}>
            <Text style={[styles.text, styles.subHeading, styles.settingDetailsTitle]}>
              Language and Region
            </Text>

            {settings.map(({name, values}) => (
              <TouchableListItem
                key={name}
                name={name}
                onPress={() => {
                this.props.navigation.dispatch(NavigationActions.navigate({
                    routeName: 'SettingDetails',
                    params: {
                      name,
                      values,
                      onSelect: this.onSettingsChange
                    }
                  }))
              }}/>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({settings}) => ({
  settings
})

export default connect(mapStateToProps, { saveSettingsAction })(Settings);
