import React, { Component } from 'react';
import AddIconSrc from '../images/add-icon.svg';

import './PositionItem.scss';

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
};

export default class AddPostionItem extends Component {
  state = {
    stock: {},
  };

  // handle input item change
  handleInputChange = (key, e) => {
    const { stock } = this.state;

    this.setState(
      {
        stock: {
          ...stock,
          [key]: String(e.target.value).replace(/\s/g, ''),
        },
      },
      () => {
        const { onComplete } = this.props;
        const isValid = this.validateShema();

        isValid && onComplete({ ...this.state.stock });
      },
    );
  };

  validateShema = () => {
    const { stock } = this.state;

    return Object.keys(SCHEMA).every(schemaKey => {
      const rule = SCHEMA[schemaKey];

      if (stock[schemaKey]) {
        return rule.required ? stock[schemaKey] : true;
      } else {
        return !rule.required;
      }
    });
  };

  handleAdd = () => {
    const { onAdd, stocks = [] } = this.props;
    const { stock } = this.state;
    const isValid = this.validateShema();

    const isExitStock = stocks.some(v => String(v.symbol) === stock.symbol);

    if (isExitStock) {
      alert('该股票已存在了，请不要重复添加');
    } else if (isValid) {
      onAdd && onAdd({ ...stock });
      this.setState({
        stock: {},
      });
    } else {
      alert('请把上方的数据填写完整，再添加新的一条～');
    }
  };

  render() {
    const { stock } = this.state;

    return (
      <div className="postion-item-box">
        <div className="position-edit-item">
          {/* <div className="col stock-name">
            <input
              type="text"
              value={stock.name || ''}
              placeholder="[可填]名称"
              onChange={e => this.handleInputChange('name', e)}
            />
          </div> */}
          <div className="col stock-code">
            <input
              type="text"
              defaultValue={stock.symbol || ''}
              placeholder="* 股票代码"
              onChange={e => this.handleInputChange('symbol', e)}
            />
          </div>
          <div className="col stock-cost-price">
            <input
              type="number"
              defaultValue={stock.costPrice || ''}
              placeholder="* 成本"
              onChange={e => this.handleInputChange('costPrice', e)}
            />
          </div>
          <div className="col stock-postion">
            <input
              type="number"
              defaultValue={stock.position || ''}
              placeholder="* 持仓(股)"
              onChange={e => this.handleInputChange('position', e)}
            />
          </div>
        </div>
        <div className="add-line">
          <div className="add-line-btn" onClick={this.handleAdd}>
            <img src={AddIconSrc} alt="add btn" />
          </div>
        </div>
      </div>
    );
  }
}
