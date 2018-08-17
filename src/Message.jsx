import React from 'react';
import classnames from 'classnames';
import Notification from 'rc-notification';

const defaultDuration = 1.5;
const bodyBackgroundColor = document.body.style.backgroundColor;
let messageInstance;
let key = 1;
let prefixCls = 'kuma-message';
let transitionName = 'message-moveUp';
let className;
let getContainer;
let multipleInstance = true;
let size = 'small';
let messageCounter = 0;

function createMessageInstance() {
  if (messageInstance && messageInstance.destroy) {
    messageInstance.destroy();
    document.body.style.backgroundColor = bodyBackgroundColor;
  }
  let notification = null;
  Notification.newInstance(
    {
      prefixCls,
      className,
      transitionName,
      getContainer,
      style: {
        left: '50%',
      }, // 覆盖原来的样式
    },
    (n) => {
      notification = n;
      messageInstance = n;
    },
  );

  return notification;
}

function incrementCounter() {
  if (multipleInstance) {
    messageCounter += 1;
  }
}

function decrementCounter() {
  if (multipleInstance) {
    messageCounter = Math.max(messageCounter - 1, 0);
  }
}

function tryRemoveMessageInstance() {
  if (!multipleInstance || messageCounter) {
    return;
  }

  if (messageInstance && messageInstance.destroy) {
    messageInstance.destroy();
    messageInstance = null;
    document.body.style.backgroundColor = bodyBackgroundColor;
  }
}

function notice(content, duration = defaultDuration, type, onClose) {
  const options = content && content.content ? content : null;
  const isFullLoadingType = type === 'mask_loading';
  const iconClass = {
    info: 'uxcore-icon uxicon-tishi-full',
    success: 'uxcore-icon uxicon-chenggong-full',
    error: 'uxcore-icon uxicon-biaodanlei-tongyongqingchu',
    loading: 'uxcore-icon uxicon-loading-icon-round',
    mask_loading: 'uxcore-icon uxicon-loading-icon-round',
    nw_loading: 'kuma-loading',
  }[type];

  const instance = multipleInstance && messageInstance ? messageInstance : createMessageInstance(options);

  incrementCounter();
  let activeStyle = {
    right: '50%',
  };
  if (isFullLoadingType) {
    document.body.style.background = 'rgba(0,0,0,0.2)';
    activeStyle = {
      right: '50%',
      padding: 0,
    };
  }

  instance.notice({
    key,
    duration: options ? options.duration : duration,
    className: options ? options.className : null,
    style: activeStyle,
    content: (
      <div className={classnames({ [`${prefixCls}-mask_loading`]: isFullLoadingType })}>
        <div
          className={classnames({
            [`${prefixCls}-container ${prefixCls}-container-${type}`]: true,
            'fn-clear': true,
          })}
        >
          <i className={iconClass} />
          <div className={`${prefixCls}-content`}>{options ? options.content : content}</div>
        </div>
      </div>
    ),
    onClose(...params) {
      // see https://github.com/uxcore/uxcore-message/issues/17
      decrementCounter();
      tryRemoveMessageInstance();

      const callback = (options && options.onClose) || onClose || function noop() {};

      callback(...params);
    },
  });

  return (function removeNotice() {
    const target = key;
    key += 1;
    return () => instance.removeNotice(target);
  }());
}

const methods = {};

['info', 'success', 'error', 'loading', 'mask_loading', 'nw_loading'].forEach((item) => {
  methods[item] = (content, duration, onClose) => notice(content, duration, item, onClose);
});

export default {
  ...methods,
  clear() {
    createMessageInstance();
  },
  config(options) {
    if (options) {
      prefixCls = options.prefixCls || prefixCls;
      transitionName = options.transitionName || transitionName;
      className = options.className || className;
      multipleInstance = options.multipleInstance === undefined ? multipleInstance : options.multipleInstance;
      getContainer = options.getContainer;
      size = options.size || size;
    }
  },
};
