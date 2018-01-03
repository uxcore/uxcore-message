import expect from 'expect.js';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
//import TestUtils, { Simulate } from 'react-addons-test-utils';
import Message from '../src';

describe('Message', () => {

    let instance;

    let $ = selector => document.querySelector(selector);
    let $$ = selector => document.querySelectorAll(selector);

    Message.config({
        getContainer: () => {
            const container = document.createElement('div');
            container.className = 'uxcore-message';
            document.body.appendChild(container);
            return container;
        },
        prefixCls: 'uxcore-message',
        multipleInstance: false,
        onClose: () => true,
    })

    it('show the different msg by the type', done => {
        let typeArr = ['info', 'success', 'error', 'loading', 'nw_loading'];
        let iconArr = ['uxcore-icon uxicon-tishi-full', 'uxcore-icon uxicon-chenggong-full', 'uxcore-icon uxicon-biaodanlei-tongyongqingchu', 'uxcore-icon uxicon-loading-icon-round', 'kuma-loading'];
        typeArr.forEach(type => {
            Message[type]({
                content: `this is a ${type} msg`,
                className: 'type',
            });
        });
        instance = $$('.uxcore-icon');
        expect(
            Array.prototype.every.call(instance, item => {
                return ~iconArr.indexOf(item.getAttribute('class'));
            })
        ).to.be(true);
        done();
    })

    it('show the msg over time', done => {
        let isExist, isDie;
        Message['info']({
            content: 'this is a msg over time', 
            duration: 5,
            className: 'time'
        });
        instance = $('.time');
        isExist = instance !== null;
        setTimeout(() => {
            isDie = instance === null;
            expect(isExist && isDie).to.be(true);
        }, 5000);
        done();
    })

    it('should apply the custom prefixCls', done => {
        instance = $$('.uxcore-message-content');
        expect(instance.length > 0).to.be(true);
        done();
    })

    it('should into the appoint container', done => {
        instance = $('.uxcore-message');
        expect(instance !== null).to.be(true);
        done();
    })

    it('clear the msg', done => {
        Message['clear']({
            content: 'cleared',
        })
        instance = $$('.uxcore-message-notice')
        expect(instance.length === 0).to.be(true);
        done();
    })
}); 