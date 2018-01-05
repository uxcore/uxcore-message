
import expect from 'expect.js';
import React from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom'; // eslint-disable-line
import Message from '../src';

describe('Message', () => {
  const $$ = selector => document.querySelectorAll(selector);

  Message.config({
    getContainer: () => {
      const container = document.createElement('div');
      container.className = 'uxcore-message';
      document.body.appendChild(container);
      return container;
    },
    prefixCls: 'uxcore-message',
    multipleInstance: true,
  });

  it('should work with multi instance', (done) => {
    Message.info({
      content: 'this is first msg',
      className: 'multi',
    });
    Message.success({
      content: 'this is second msg',
      className: 'multi',
    });
    expect($$('.multi').length).to.be(2);
    done();
  });

  it('should call the close callback', (done) => {
    let closed = false;
    Message.success({
      content: 'this is second msg',
      className: 'multi',
      duration: 0.5,
      onClose: () => {
        closed = true;
      },
    });
    setTimeout(() => {
      expect(closed).to.be(true);
      done();
    }, 1000);
  });

  it('show responed to different msg type', (done) => {
    const typeArr = [
      'info',
      'success',
      'error',
      'loading',
      'nw_loading',
    ];
    const iconArr = [
      'uxcore-icon uxicon-tishi-full',
      'uxcore-icon uxicon-chenggong-full',
      'uxcore-icon uxicon-biaodanlei-tongyongqingchu',
      'uxcore-icon uxicon-loading-icon-round',
      'kuma-loading',
    ];
    typeArr.forEach((type) => {
      Message[type]({
        content: `this is a ${type} msg`,
      });
    });

    const instances = Array.prototype.slice.call($$('.uxcore-icon'));
    const matched = instances.filter(item =>
      iconArr.indexOf(item.getAttribute('class')) !== -1,
    );
    expect(matched.length).to.be(instances.length);
    done();
  });

  it('show the msg over duration', (done) => {
    Message.info({
      content: 'this is a msg over duration 1(1000ms)',
      duration: 0.5,
      className: 'duration-test',
    });
    setTimeout(() => {
      expect($$('.duration-test').length).to.be(0);
      done();
    }, 1000);
  });

  it('should apply the custom prefixCls', (done) => {
    Message.info({
      content: 'this is a msg',
    });
    expect($$('.uxcore-message-content').length).to.be.greaterThan(0);
    done();
  });

  it('should render into the appointed container', (done) => {
    Message.info({
      content: 'this is a msg',
      className: 'appointed-container',
    });
    expect($$('.uxcore-message .appointed-container').length).to.be(1);
    done();
  });

  it('should the message be cleared', (done) => {
    Message.info({
      content: 'this is a info meesage',
    });
    Message.error({
      content: 'this is a error meesage',
    });
    Message.clear({
      content: 'cleared',
    });
    expect($$('.uxcore-message-notice').length).to.be(0);
    done();
  });
});
