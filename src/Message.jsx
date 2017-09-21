const Notification = require('rc-notification');
const classnames = require('classnames');
const React = require('react');

const defaultDuration = 1.5;
let messageInstance;
let key = 1;
let prefixCls = 'kuma-message';
let transitionName = 'message-moveUp';
let className;
let getContainer;
let multipleInstance = true;
let size = 'small';
let messageCounter = 0

function createMessageInstance() {
  if (messageInstance && messageInstance.destroy) {
    messageInstance.destroy();
  }
  messageInstance = Notification.newInstance({
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

function tryRemoveMessageInstance() {
  if (messageInstance && messageInstance.destroy) {
    messageInstance.destroy()
    messageInstance = null
  }
}

function notice(content, duration = defaultDuration, type, onClose) {
  const options = typeof content === 'object' ? content : null;
  const iconClass = ({
    info: 'uxcore-icon uxicon-tishi-full',
    success: 'uxcore-icon uxicon-chenggong-full',
    error: 'uxcore-icon uxicon-biaodanlei-tongyongqingchu',
    loading: 'uxcore-icon uxicon-loading-icon-round',
    nw_loading: 'kuma-loading',
  })[type];
  const instance = (multipleInstance && messageInstance)
    ? messageInstance : createMessageInstance(options);

  messageCounter += 1

  instance.notice({
    key,
    duration: options ? options.duration : duration,
    className: options ? options.className : null,
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
          {options ? options.content : content}
        </div>
      </div>
    ),
    onClose: function() {
      messageCounter = Math.max(messageCounter - 1, 0)

      // see https://github.com/uxcore/uxcore-message/issues/17
      if (messageCounter === 0) {
        tryRemoveMessageInstance()
      }

      const fn = (options && options.onClose) || onClose || function() {}

      fn.apply(null, [].slice(arguments))
    },
  });
  return (function () {
    const target = key;
    key += 1;
    return function () {
      instance.removeNotice(target);
    };
  }());
}

const methods = {};

['info', 'success', 'error', 'loading', 'nw_loading'].forEach((item) => {
  methods[item] = (content, duration, onClose) =>
    notice(content, duration, item, onClose);
});

module.exports = {
  ...methods,
  clear() {
    createMessageInstance();
  },
  config(options) {
    if (options) {
      prefixCls = options.prefixCls || prefixCls;
      transitionName = options.transitionName || transitionName;
      className = options.className || className;
      multipleInstance = options.multipleInstance === undefined
        ? multipleInstance : options.multipleInstance;
      getContainer = options.getContainer;
      size = options.size || size;
    }
  },
};
