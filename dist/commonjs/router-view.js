'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterViewLocator = exports.RouterView = undefined;

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaBinding = require('aurelia-binding');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaRouter = require('aurelia-router');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaPal = require('aurelia-pal');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}



function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var RouterView = exports.RouterView = (_dec = (0, _aureliaTemplating.customElement)('router-view'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router, _aureliaTemplating.ViewLocator, _aureliaTemplating.CompositionTransaction, _aureliaTemplating.CompositionEngine), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
  function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    

    _initDefineProp(this, 'swapOrder', _descriptor, this);

    _initDefineProp(this, 'layoutView', _descriptor2, this);

    _initDefineProp(this, 'layoutViewModel', _descriptor3, this);

    _initDefineProp(this, 'layoutModel', _descriptor4, this);

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  RouterView.prototype.created = function created(owningView) {
    this.owningView = owningView;
  };

  RouterView.prototype.bind = function bind(bindingContext, overrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  };

  RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
    var _this = this;

    var component = viewPortInstruction.component;
    var childContainer = component.childContainer;
    var viewModel = component.viewModel;
    var viewModelResource = component.viewModelResource;
    var metadata = viewModelResource.metadata;
    var config = component.router.currentInstruction.config;
    var viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] || {} : {};

    childContainer.get(RouterViewLocator)._notify(this);

    var layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
      if (!_this.compositionTransactionNotifier) {
        _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
      }

      if (layoutInstruction.viewModel || layoutInstruction.view) {
        viewPortInstruction.layoutInstruction = layoutInstruction;
      }

      viewPortInstruction.controller = metadata.create(childContainer, _aureliaTemplating.BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));

      if (waitToSwap) {
        return null;
      }

      _this.swap(viewPortInstruction);
    });
  };

  RouterView.prototype.swap = function swap(viewPortInstruction) {
    var _this2 = this;

    var layoutInstruction = viewPortInstruction.layoutInstruction;
    var previousView = this.view;

    var work = function work() {
      var swapStrategy = _aureliaTemplating.SwapStrategies[_this2.swapOrder] || _aureliaTemplating.SwapStrategies.after;
      var viewSlot = _this2.viewSlot;

      swapStrategy(viewSlot, previousView, function () {
        return Promise.resolve(viewSlot.add(_this2.view));
      }).then(function () {
        _this2._notify();
      });
    };

    var ready = function ready(owningView) {
      viewPortInstruction.controller.automate(_this2.overrideContext, owningView);
      if (_this2.compositionTransactionOwnershipToken) {
        return _this2.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
          _this2.compositionTransactionOwnershipToken = null;
          return work();
        });
      }

      return work();
    };

    if (layoutInstruction) {
      if (!layoutInstruction.viewModel) {
        layoutInstruction.viewModel = {};
      }

      return this.compositionEngine.createController(layoutInstruction).then(function (controller) {
        _aureliaTemplating.ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
        controller.automate((0, _aureliaBinding.createOverrideContext)(layoutInstruction.viewModel), _this2.owningView);
        controller.view.children.push(viewPortInstruction.controller.view);
        return controller.view || controller;
      }).then(function (newView) {
        _this2.view = newView;
        return ready(newView);
      });
    }

    this.view = viewPortInstruction.controller.view;

    return ready(this.owningView);
  };

  RouterView.prototype._notify = function _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  };

  return RouterView;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'layoutView', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'layoutViewModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'layoutModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);

var RouterViewLocator = exports.RouterViewLocator = function () {
  function RouterViewLocator() {
    var _this3 = this;

    

    this.promise = new Promise(function (resolve) {
      return _this3.resolve = resolve;
    });
  }

  RouterViewLocator.prototype.findNearest = function findNearest() {
    return this.promise;
  };

  RouterViewLocator.prototype._notify = function _notify(routerView) {
    this.resolve(routerView);
  };

  return RouterViewLocator;
}();