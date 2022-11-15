import React from 'react'
import { Select } from "antd"

export default class RevelSelect extends React.Component {
  constructor(props) {
    super(props)
  }

  _onChangeSelect(e) {
    if (this.props.onChange !== undefined) {
      this.props.onChange(e)
    }
  }

  render() {
    let { setProps } = this.props

    return (
      <Select
        {...setProps}
        className={(this.props.className === undefined ? 'ant-select-full-width' : this.props.className)}
        options={(this.props.options === undefined ? [] : this.props.options)}
        value={(this.props.value === undefined ? '' : this.props.value)}
        placeholder={(this.props.placeholder === undefined ? 'select..' : this.props.placeholder)}
        showSearch={(this.props.showSearch === undefined ? true : this.props.showSearch)}
        disabled={(this.props.disabled === undefined ? false : this.props.disabled)}
        filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={(e) => this._onChangeSelect(e)}
      />
    )
  }
}