let Notification = require('rc-notification');
let classnames = require('classnames');
let defaultDuration = 1.5;
let messageInstance;
let key = 1;
let prefixCls = 'kuma-message';
let transitionName = 'moveUp';
const React = require('react');
let className;

function getMessageInstance() {
    messageInstance = messageInstance || Notification.newInstance({
        prefixCls: prefixCls,
        className: className,
        transitionName: transitionName,
        style: {
            left: '50%'
        } // 覆盖原来的样式
    });
    return messageInstance;
}

function notice(content, duration = defaultDuration, type, onClose) {
    let iconClass = ({
        'info': 'kuma-icon kuma-icon-information',
        'success': 'kuma-icon kuma-icon-success',
        'error': 'kuma-icon kuma-icon-error',
        'loading': 'kuma-loading'
    })[type];

    let instance = getMessageInstance();
    instance.notice({
        key: key,
        duration: duration,
        style: {
            right: '50%'
        },
        content: <div className={ classnames({
                     [`${prefixCls}-container ${prefixCls}-container-${type}`]: true,
                     'fn-clear': true
                 }) }>
                   <i className={ iconClass }></i>
                   <div className={ prefixCls + '-content' }>
                     { content }
                   </div>
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
        prefixCls = options.prefixCls || prefixCls;
        transitionName = options.transitionName || transitionName;
        className = options.className || className;
    }
};