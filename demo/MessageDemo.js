/**
 * Message Component Demo for uxcore
 * @author eternaslky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let Message = require('../src');
let Button = require('uxcore-button');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleClick(type) {
        Message[type](type, 10)
    }

    render() {
        let me = this;
        return (
            <div>
                <Button onClick={me.handleClick.bind(me, 'success')}>显示成功提示</Button>
                <Button onClick={me.handleClick.bind(me, 'info')}>显示普通提示</Button>
                <Button onClick={me.handleClick.bind(me, 'error')}>显示错误提示</Button>
                <Button onClick={me.handleClick.bind(me, 'loading')}>显示加载提示</Button>
            </div>
        );
    }
};

module.exports = Demo;
