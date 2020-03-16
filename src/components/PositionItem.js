import React, { Component } from 'react';

import './PositionItem.scss';

const SCHEMA = {
  name: {
    required: true,
  },
  code: {
    required: true,
  },
  costPrice: {
    required: true,
  },
  postion: {
    required: true,
  },
};

export default class PostionItem extends Component {
  state = {
    stock: {},
  };

  // handle input item change
  handleInputChange = (key, e) => {
    const { stock } = this.state;
    console.log('e', e.target.value);
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

        isValid && onComplete({...this.state.stock});
        console.log('isValid', isValid);
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

  render() {
    const { edit = false, data = {} } = this.props;
    return (
      <div className="postion-item-box">
        {edit ? (
          <div className="position-edit-item">
            <div className="col stock-name">
              <input type="text" placeholder="[可填]名称" onChange={e => this.handleInputChange('name', e)} />
            </div>
            <div className="col stock-code">
              <input type="text" placeholder="* 代码" onChange={e => this.handleInputChange('code', e)} />
            </div>
            <div className="col stock-cost-price">
              <input type="number" placeholder="* 成本" onChange={e => this.handleInputChange('costPrice', e)} />
            </div>
            <div className="col stock-postion">
              <input type="number" placeholder="* 持仓(股)" onChange={e => this.handleInputChange('postion', e)} />
            </div>
          </div>
        ) : (
          <div className="position-show-item">
            <div className="col stock-name">{data.name}</div>
            <div className="col stock-code">{data.code}</div>
            <div className="col stock-cost-price">{data.costPrice}</div>
            <div className="col stock-postion">{data.position}</div>
          </div>
        )}
      </div>
    );
  }
}
