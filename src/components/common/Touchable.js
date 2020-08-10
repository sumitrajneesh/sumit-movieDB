import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Image, Text, TouchableOpacity} from 'react-native'
import {styles} from 'react-native-theme'
import ImageLoad from 'react-native-image-placeholder'

export const TouchableImage = (props) => (
  <TouchableOpacity
    onPress={() => props.onPress()}>
    <ImageLoad
      style={props.style}
      source={{uri: props.uri}}
    />
  </TouchableOpacity>
)

TouchableImage.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ]).isRequired,
  uri: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}

export const TouchableText = (props) => (
  <TouchableOpacity onPress={() => props.onPress()} style={styles.textStickToBottom}>
    <Text style={[styles.text, styles.normalText]}>
      {props.text}
    </Text>
  </TouchableOpacity>
)

TouchableText.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
}
