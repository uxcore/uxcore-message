const Notification = require('rc-notification');
const classnames = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

const defaultDuration = 1.5;
let messageInstance;
let key = 1;
let prefixCls = 'kuma-message';
let transitionName = 'message-moveUp';
let className;
let getContainer;

Notification.newInstance = function newNotificationInstance(properties) {
  const { getContainer, ...props } = properties || {};
  let div;
  if (getContainer) {
    div = getContainer();
  } else {
    div = document.createElement('div');
    document.body.appendChild(div);
  }
  /* eslint-disable react/no-render-return-value */
  const notification = ReactDOM.render(<Notification {...props} />, div);
  /* eslint-enable react/no-render-return-value */
  return {
    notice(noticeProps) {
      notification.add(noticeProps);
    },
    removeNotice(index) {
      notification.remove(index);
    },
    component: notification,
    destroy() {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    },
  };
};

function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls,
    className,
    transitionName,
    getContainer,
    style: {
      left: '50%',
    }, // 覆盖原来的样式
  });
  return messageInstance;
}

function notice(content, duration = defaultDuration, type, onClose) {
  const iconClass = ({
    info: 'kuma-icon kuma-icon-information',
    success: 'kuma-icon kuma-icon-success',
    error: 'kuma-icon kuma-icon-error',
    loading: 'kuma-loading',
  })[type];

  const instance = getMessageInstance();
  instance.notice({
    key,
    duration,
    style: {
      right: '50%',
    },
    content: (
      <div
        className={classnames({
          [`${prefixCls}-container ${prefixCls}-container-${type}`]: true,
          'fn-clear': true,
        })}
      >
        <i className={iconClass} />
        <div className={`${prefixCls}-content`}>
          {content}
        </div>
      </div>
    ),
    onClose,
  });
  return (function () {
    const target = key;
    key += 1;
    return function () {
      instance.removeNotice(target);
    };
  }());
}

module.exports = {
  info(content, duration, onClose) {
    return notice(content, duration, 'info', onClose);
  },
  success(content, duration, onClose) {
    return notice(content, duration, 'success', onClose);
  },
  error(content, duration, onClose) {
    return notice(content, duration, 'error', onClose);
  },
  loading(content, duration, onClose) {
    return notice(content, duration, 'loading', onClose);
  },
  config(options) {
    prefixCls = options.prefixCls || prefixCls;
    transitionName = options.transitionName || transitionName;
    className = options.className || className;
    getContainer = options.getContainer;
  },
};
