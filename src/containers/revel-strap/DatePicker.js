import React from 'react'
import { DatePicker } from "antd"
import moment from 'moment'

export default class RevelDatePicker extends React.Component {
  constructor(props) {
    super(props)
  }

  disabledDate(current) {
    const { minDate, maxDate } = this.props

    if (minDate !== undefined && maxDate !== undefined) {
      return current && (current > moment(maxDate).clone() || current < moment(minDate).clone())
    } else if (minDate !== undefined) {
      return current && current < moment(minDate).clone()
    } else if (maxDate) {
      return current && current > moment(maxDate).clone()
    }
  }

  _onChangeDate(e) {
    if (this.props.onChange !== undefined) {
      if (e !== null) {
        this.props.onChange(e._d)
      } else {
        this.props.onChange('')
      }
    }
  }

  render() {
    let { setProps } = this.props
    
    return (
      <DatePicker
        {...setProps}
        className={(this.props.className === undefined ? 'form-control' : this.props.className)}
        defaultValue={(this.props.value === '' || this.props.value === undefined) ? '' : moment(this.props.value, "YYYY/MM/DD")}
        format={(this.props.format === undefined ? "DD/MM/YYYY" : this.props.format)}
        allowClear={(this.props.allowClear ? true : false)}
        onChange={(e) => this._onChangeDate(e)}
        disabledDate={(e) => this.disabledDate(e)}
      />
    )
  }
}