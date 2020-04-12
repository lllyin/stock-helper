import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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

export default class PostionItem extends Component {
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

  onDelete = e => {
    const { onDelete, data } = this.props;

    onDelete && onDelete(data, e);
  };

  render() {
    const { edit = false, data = {} } = this.props;
    return (
      <div className="postion-item-box">
        {edit ? (
          <div className="position-edit-item">
            <div className="col stock-name">
              <input
                type="text"
                defaultValue={data.name || ''}
                placeholder="[可填]名称"
                onChange={e => this.handleInputChange('name', e)}
              />
            </div>
            <div className="col stock-code">
              <input
                type="text"
                defaultValue={data.symbol || ''}
                placeholder="* 代码"
                onChange={e => this.handleInputChange('symbol', e)}
              />
            </div>
            <div className="col stock-cost-price">
              <input
                type="number"
                defaultValue={data.costPrice || ''}
                placeholder="* 成本"
                onChange={e => this.handleInputChange('costPrice', e)}
              />
            </div>
            <div className="col stock-postion">
              <input
                type="number"
                defaultValue={data.position || ''}
                placeholder="* 持仓(股)"
                onChange={e => this.handleInputChange('position', e)}
              />
            </div>
          </div>
        ) : (
          <div className="position-show-item">
            <div className="col stock-name">{data.name || ''}</div>
            <div className="col stock-code">{data.symbol}</div>
            <div className="col stock-cost-price">{data.costPrice}</div>
            <div className="col stock-postion">
              <span>{data.position}</span>
              <IconButton className="delete-btn" aria-label="delete" size="small"  onClick={this.onDelete} >
                <DeleteIcon size="small" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}
