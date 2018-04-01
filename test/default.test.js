'use strict';

const expect = require('chai').expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire').noPreserveCache(),
  htmlclean = (htmlclean => {
    htmlclean['@noCallThru'] = true;
    return htmlclean;
  })(sinon.spy(content => `${content}<htmlclean>`)),
  loader = proxyquire('../', {htmlclean});

function resetAll() {
  htmlclean.resetHistory();
}

describe('implements a basic flow as loader', () => {
  const OPTS = {p1: 'v1', p2: 'v2'};

  it('should return processed value', () => {
    resetAll();
    expect(loader.call({loaderIndex: 1, query: OPTS}, 'content')).to.equal('content<htmlclean>');
    expect(htmlclean.calledOnceWithExactly('content', OPTS)).to.be.true;
    // Converted (loaderIndex: 0)
    resetAll();
    expect(loader.call({loaderIndex: 0, query: OPTS}, 'content'))
      .to.equal('module.exports = "content<htmlclean>";');
    expect(htmlclean.calledOnceWithExactly('content', OPTS)).to.be.true;
  });

  it('should return a null if a null is input', () => {
    resetAll();
    expect(loader.call({loaderIndex: 1, query: OPTS}, null)).to.be.null;
    expect(htmlclean.notCalled).to.be.true;
    // Converted (loaderIndex: 0)
    resetAll();
    expect(loader.call({loaderIndex: 0, query: OPTS}, null)).to.equal('module.exports = null;');
    expect(htmlclean.notCalled).to.be.true;
  });

});

describe('converts output as code', () => {
  const CONVERTED = 'module.exports = "content<htmlclean>";',
    NOT_CONVERTED = 'content<htmlclean>';

  it('should not convert content when loaderIndex: 1', () => {
    expect(loader.call({loaderIndex: 1, query: {}}, 'content')).to.equal(NOT_CONVERTED);
  });

  it('should convert content when loaderIndex: 0', () => {
    expect(loader.call({loaderIndex: 0, query: {}}, 'content')).to.equal(CONVERTED);
  });

  it('should convert content when loaderIndex: 1 / raw: false', () => {
    expect(loader.call({loaderIndex: 1, query: {raw: false}}, 'content')).to.equal(CONVERTED);
  });

  it('should convert content when loaderIndex: 0 / raw: false', () => {
    expect(loader.call({loaderIndex: 0, query: {raw: false}}, 'content')).to.equal(CONVERTED);
  });

  it('should not convert content when loaderIndex: 1 / raw: true', () => {
    expect(loader.call({loaderIndex: 1, query: {raw: true}}, 'content')).to.equal(NOT_CONVERTED);
  });

  it('should not convert content when loaderIndex: 0 / raw: true', () => {
    expect(loader.call({loaderIndex: 0, query: {raw: true}}, 'content')).to.equal(NOT_CONVERTED);
  });

});
