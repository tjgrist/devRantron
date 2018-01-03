import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SETTINGS } from '../../consts/types';
import Toggle from './toggle';
import Text from './text';
import Button from './button';
import Slider from './slider';

const { remote } = require('electron');

class General extends Component {
  handleChange(primaryKey, secondaryKey, value = null) {
    this.props.changeGeneral(primaryKey, secondaryKey, value);
  }
  getSettingComponent(setting, primaryKey, secondaryKey) {
    switch (setting.type) {
      case SETTINGS.TYPE.SLIDER: {
        return (
          <Slider
            setting={setting}
            key={secondaryKey}
            handleChange={(value) => {
              this.handleChange(primaryKey, secondaryKey, value);
            }}
            theme={this.props.theme}
          />
        );
      }
      case SETTINGS.TYPE.TOGGLE: {
        return (
          <Toggle
            setting={setting}
            key={secondaryKey}
            handleChange={() => {
              this.handleChange(primaryKey, secondaryKey, !setting.value);
            }}
            theme={this.props.theme}
          />
        );
      }
      case SETTINGS.TYPE.TEXT: {
        return (
          <Text
            key={secondaryKey}
            setting={setting}
            theme={this.props.theme}
            handleChange={(value) => {
              this.handleChange(primaryKey, secondaryKey, value);
            }}
          />
        );
      }
      case SETTINGS.TYPE.BUTTON: {
        return (
          <Button
            key={secondaryKey}
            setting={setting}
            handleChange={() => {
              this.handleChange(primaryKey, secondaryKey);
            }}
            theme={this.props.theme}
          />
        );
      }
      default:
        return <div />;
    }
  }
  getSettings() {
    const { general, theme } = this.props;
    const settings = [];
    Object.keys(general).forEach((key) => {
      const setting = general[key];
      if (setting.options) {
        const subSettings = [];
        const Header = <div className="header">{setting.title}</div>;
        Object.keys(setting.options).forEach((optionKey) => {
          const settingComponent = this.getSettingComponent(
            setting.options[optionKey],
            key,
            optionKey,
          );
          subSettings.push(settingComponent);
        });
        /* eslint-disable */
        settings.push(
          <div
            className="multi_settings"
            style={{
                backgroundColor: theme.item_card.backgroundColor,
                color: theme.item_card.color,
              }}
            key={key}
          >
            { Header }
            <div className="options">
              {
                  subSettings.map(s => s)
                }
            </div>
          </div>,
        );
      } else {
        const component = this.getSettingComponent(setting, key);
        settings.push(<div
          className="single_settings"
          key={key}
          style={{
            backgroundColor: theme.item_card.backgroundColor,
            color: theme.item_card.color,
          }}
        >
          { component }
        </div>);
        /* eslint-enable */
      }
    });
    return settings;
  }
  render() {
    return (
      <div className="general_container">
        {
          this.getSettings().map(s => s)
        }
        <div
          className="version_number"
          style={{ color: this.props.theme.item_card.color }}
        >
          v{remote.app.getVersion()}
        </div>
      </div>
    );
  }
}

General.propTypes = {
  general: PropTypes.object.isRequired,
  changeGeneral: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default General;
