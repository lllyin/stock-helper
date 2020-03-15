/* eslint-disable no-script-url */
import React, { Component } from 'react';
import { API_QUOTE_URL } from '../constants';

const $ = window.$;

// 财务分析组件
export default class Quote extends Component {
  fetchQuote(data) {
    const symbol = `${data.type}${data.symbol}`;

    // $.get(`${API_QUOTE_URL}?symbol=${symbol}&extend=detail`);
    $ &&
      $.ajax({
        type: 'GET',
        url: `${API_QUOTE_URL}?symbol=${symbol}&extend=detail`,
        headers: {
          token: 'haha',
          Referer: 'https://xueqiu.com',
          Origin: 'https://xueqiu.com',
        },
        success: function(res) {
          console.log(res);
        },
        error: function(e) {
          console.error('请求接口错误');
        },
      });
  }
  render() {
    const { data } = this.props;
    return (
      <div>
        <a href="javascript:void(0)" onClick={() => this.fetchQuote(data)}>
          财务分析
        </a>
      </div>
    );
  }
}
