import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import './PositionItem.scss'

const SCHEMA = {
  name: {
    required: false,
  },
  symbol: {
    required: true,
  },
  costPrice: {
    required: true,
    min: 1,
  },
  position: {
    required: true,
    min: 100,
  },
}

export default class AddPostionItem extends Component {
  state = {
    stock: {},
  }

  // handle input item change
  handleInputChange = (key, e) => {
    const { stock } = this.state

    this.setState(
      {
        stock: {
          ...stock,
          [key]: String(e.target.value).replace(/\s/g, ''),
        },
      },
      () => {
        const { onComplete } = this.props
        const isValid = this.validateShema()

        isValid && onComplete({ ...this.state.stock })
      },
    )
  }

  validateShema = () => {
    const { stock } = this.state

    return Object.keys(SCHEMA).every((schemaKey) => {
      const rule = SCHEMA[schemaKey]

      if (stock[schemaKey]) {
        return rule.required ? stock[schemaKey] : true
      }
      return !rule.required
    })
  }

  handleAdd = () => {
    const { onAdd, stocks = [] } = this.props
    const { stock } = this.state
    const isValid = this.validateShema()

    const isExitStock = stocks.some((v) => String(v.symbol) === stock.symbol)

    if (isExitStock) {
      alert('该股票已存在了，请不要重复添加')
    } else if (isValid) {
      onAdd && onAdd({ ...stock })
      this.setState({
        stock: {},
      })
    } else {
      alert('请把上方的数据填写完整，再添加新的一条～')
    }
  }

  render() {
    const { stock } = this.state

    return (
      <div className="postion-item-box">
        <div className="position-edit-item add-position-item">
          {/* <div className="col stock-name">
            <input
              type="text"
              value={stock.name || ''}
              placeholder="[可填]名称"
              onChange={e => this.handleInputChange('name', e)}
            />
          </div> */}
          <div className="col stock-code">
            <TextField
              required
              type="text"
              label="股票代码"
              defaultValue={stock.symbol || ''}
              onChange={(e) => this.handleInputChange('symbol', e)}
            />
          </div>
          <div className="col stock-cost-price">
            <TextField
              required
              type="number"
              label="成本"
              defaultValue={stock.costPrice || ''}
              onChange={(e) => this.handleInputChange('costPrice', e)}
            />
          </div>
          <div className="col stock-postion">
            <TextField
              required
              type="number"
              label="持仓(股)"
              defaultValue={stock.position || ''}
              onChange={(e) => this.handleInputChange('position', e)}
            />
          </div>
        </div>
        <div className="add-line">
          <div className="add-line-btn" onClick={this.handleAdd}>
            <Button fullWidth variant="text" color="default" startIcon={<AddIcon />}>
              添加
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
