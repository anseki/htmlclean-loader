'use strict';

const expect = require('chai').expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire').noPreserveCache(),
  htmlclean = (htmlclean => {
    htmlclean['@noCallThru'] = true;
    return htmlclean;
  })(sinon.spy(content => `${content}<htmlclean>`)),
  loader = proxyquire('../', {htmlclean}),

  CONTENTS = 'content',
  RES_METHOD = `${CONTENTS}<htmlclean>`,
  RES_METHOD_CNV = `module.exports = "${RES_METHOD}";`;

function resetAll() {
  htmlclean.resetHistory();
}

describe('implements a basic flow as loader', () => {
  const OPTS = {p1: 'v1', p2: 'v2'};

  it('should return processed value', () => {
    resetAll();
    expect(loader.call({loaderIndex: 1, query: OPTS}, CONTENTS)).to.equal(RES_METHOD);
    expect(htmlclean.calledOnceWithExactly(CONTENTS, OPTS)).to.be.true;
    // Converted (loaderIndex: 0)
    resetAll();
    expect(loader.call({loaderIndex: 0, query: OPTS}, CONTENTS)).to.equal(RES_METHOD_CNV);
    expect(htmlclean.calledOnceWithExactly(CONTENTS, OPTS)).to.be.true;
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

  it('should not convert content when loaderIndex: 1', () => {
    expect(loader.call({loaderIndex: 1, query: {}}, CONTENTS)).to.equal(RES_METHOD);
  });

  it('should convert content when loaderIndex: 0', () => {
    expect(loader.call({loaderIndex: 0, query: {}}, CONTENTS)).to.equal(RES_METHOD_CNV);
  });

  it('should convert content when loaderIndex: 1 / raw: false', () => {
    expect(loader.call({loaderIndex: 1, query: {raw: false}}, CONTENTS)).to.equal(RES_METHOD_CNV);
  });

  it('should convert content when loaderIndex: 0 / raw: false', () => {
    expect(loader.call({loaderIndex: 0, query: {raw: false}}, CONTENTS)).to.equal(RES_METHOD_CNV);
  });

  it('should not convert content when loaderIndex: 1 / raw: true', () => {
    expect(loader.call({loaderIndex: 1, query: {raw: true}}, CONTENTS)).to.equal(RES_METHOD);
  });

  it('should not convert content when loaderIndex: 0 / raw: true', () => {
    expect(loader.call({loaderIndex: 0, query: {raw: true}}, CONTENTS)).to.equal(RES_METHOD);
  });

});
