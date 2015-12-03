let Notification = require('rc-notification');
let defaultDuration = 1.5;
let top;
let messageInstance;
let key = 1;

function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls: 'kuma-message',
    transitionName: 'move-up',
    style: {
      top: top
    }  // 覆盖原来的样式
  });
  return messageInstance;
}

function notice(content, duration = defaultDuration, type, onClose) {
  let iconClass = ({
    'info': 'kuma-icon kuma-icon-information',
    'success': 'kuma-icon kuma-icon-success',
    'error': 'kuma-icon kuma-icon-error',
    'loading': 'kuma-loading-s'
  })[type];

  let instance = getMessageInstance();
  instance.notice({
    key: key,
    duration: duration,
    style: {},
    content: <div className="ant-message-custom-content">
      <i className={iconClass}></i>
      <span>{content}</span>
    </div>,
    onClose: onClose
  });
  return (function() {
    let target = key++;
    return function() {
      instance.removeNotice(target);
    };
  })();
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
    if (options.top) {
      top = options.top;
    }
  }
};