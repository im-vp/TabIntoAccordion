/*!
 * TabIntoAccordion - JQuery plugin.
 * Version: 1.1.0
 * Docs: https://github.com/im-vp/TabIntoAccordion
 */

class TabIntoAccordion {
  //Main properties
  _$element = null;
  _options = null;
  _currentComponentType = null;

  _TAB_TYPE = 'tab';
  _ACCORDION_TYPE = 'accordion';

  //Tab properties
  _tabList = null;
  _tabItems = null;
  _tabButtons = null;

  //Accordion properties
  _accordionItems = null;
  _isAccordionButtonCreate = false;

  //Container properties
  _containers = null;
  _firstContainer = null;
  _openContainer = null;

  constructor(element, options = {}) {
    this._$element = $(element);
    this._options = {
      ...this.defaultsOptions,
      ...options,
      ...this.getDataAttributes,
    };

    this._init();
  }

  get defaultsOptions() {
    return {
      componentType: 'tabIntoAccordion', // 'onlyTab', 'onlyAccordion', 'tabIntoAccordion'
      componentTheme: 'tab-into-accordion--theme', // css class for component styling
      isFirstContainerOpen: true, // open the first default container
      openByHash: true, // open container using hash
      setHash: false, // set hash when opening container
      scrollToContent: false, // when openByHash = true. Value -  boolean or object { scrollShift: Number, scrollTime: Number,}
      pointForTransform: 800, // conversion point to accordion and back
      openTabTime: 0, // tab opening time
      openAccordionTime: 400, // slide opening time
      accordionToggle: true,
      tabToggle: false,
    };
  }

  get publicMethods() {
    return {
      openContainer: (id) => this.openContainer(id), // open container by id
      destroy: this.destroy.bind(this), // destroy component
      refresh: this.refresh.bind(this), // refresh component
    };
  }

  // Public Methods
  destroy() {
    this._resetState();
    this._$element.removeData(['tabIntoAccordion']);
  }

  refresh() {
    this._resetState();
    this._init();
  }

  openContainer(itemId) {
    if (!itemId) return;

    this._openCloseContainer(itemId);
    this._scrollToContent(this._options.scrollToContent);
  }

  // Collect data attributes set as plugin properties
  get getDataAttributes() {
    const data = this._$element.data(),
      attributes = {};

    for (let key in this.defaultsOptions) {
      if (this.defaultsOptions.hasOwnProperty(key) && data[key] !== undefined) {
        attributes[key] = data[key];
      }
    }

    return attributes;
  }

  // Add and reset component state
  _setState() {
    this._$element.addClass(String(this._options.componentTheme));

    this._tabList = this._$element.children('ul');
    this._tabItems = this._tabList.children('li');
    this._tabButtons = this._tabItems.children('button');

    this._containers = this._$element.children('div');
    this._firstContainer = this._$element.children('[data-id-content]').first();

    this._tabList.addClass('tab-into-accordion__list');
    this._tabItems.addClass('tab-into-accordion__item');
    this._tabButtons.addClass('tab-into-accordion__button');
    this._containers.addClass('tab-into-accordion__content');

    this._transformComponent = this._transformComponent.bind(this);
    this._tabHandlerClick = this._tabHandlerClick.bind(this);
  }

  _resetState() {
    this._setComponentTypeClass(null, true);
    this._$element.removeClass('tab-into-accordion--initialized');
    this._$element.removeClass(this._options.componentTheme);
    this._tabList.removeClass('tab-into-accordion__list');
    this._tabItems.removeClass('tab-into-accordion__item tab-into-accordion__item--active');
    this._tabButtons.removeClass('tab-into-accordion__button');
    this._containers
      .removeClass('tab-into-accordion__content tab-into-accordion__content--active')
      .attr('style', '');

    this._isAccordionButtonCreate = false;
    this._accordionItems && this._accordionItems.remove();
    this._tabButtons.off('click', this._tabHandlerClick);
    $(window).off('resize', this._transformComponent);

    this._tabList = null;
    this._tabItems = null;
    this._tabButtons = null;

    this._accordionItems = null;
    this._openContainer = null;
    this._currentComponentType = null;
  }

  // Component type and structure
  _componentStructure() {
    switch (this._options.componentType) {
      case 'onlyTab':
        this._currentComponentType = this._TAB_TYPE;
        this._setComponentTypeClass(this._TAB_TYPE);
        break;

      case 'onlyAccordion':
        this._currentComponentType = this._ACCORDION_TYPE;
        this._setComponentTypeClass(this._ACCORDION_TYPE);
        this._addAccordionButton();
        break;

      default:
        $(window).on('resize', this._transformComponent);
        this._transformComponent();
        break;
    }
  }

  _transformComponent() {
    const currentWidth = $(window).outerWidth();

    if (
      currentWidth > this._options.pointForTransform &&
      this._currentComponentType !== this._TAB_TYPE
    ) {
      this._currentComponentType = this._TAB_TYPE;
      this._setComponentTypeClass(this._TAB_TYPE);
    } else if (
      currentWidth <= this._options.pointForTransform &&
      this._currentComponentType !== this._ACCORDION_TYPE
    ) {
      this._currentComponentType = this._ACCORDION_TYPE;
      this._setComponentTypeClass(this._ACCORDION_TYPE);
      this._addAccordionButton();
    }
  }

  // Opening and closing containers
  _openCloseContainer(itemId) {
    if (this._options.openByHash && !itemId) {
      itemId = this._getHash();
    }

    if (this._openContainer === itemId && !Boolean(this._options.accordionToggle)) return;

    const elemContent = itemId && this._$element.find($(`[data-id-content="${itemId}"]`));

    if (elemContent && elemContent.length) {
      this._openContainer = itemId;
      this._currentComponentType === this._TAB_TYPE
        ? this._tabWork(elemContent)
        : this._accordionWork(elemContent);

      this._setActiveItemClass(itemId);
    } else {
      if (this._options.isFirstContainerOpen) {
        this._openContainer = this._firstContainer.attr('data-id-content');
        this._firstContainer.css('display', 'block');
        this._setActiveItemClass(this._openContainer);
        this._$element.trigger('tabIntoAccordion:afterOpen', [this._firstContainer]);
      }
    }

    if (this._options.setHash && itemId) this._setHash(itemId);
  }

  // Tab methods
  _tabWork(elemContent) {
    if (
      Boolean(this._options.tabToggle) &&
      elemContent.hasClass('tab-into-accordion__content--active')
    ) {
      $(elemContent).fadeOut(this._options.openTabTime);
    } else {
      this._containers.hide();

      $(elemContent).fadeIn(this._options.openTabTime, () =>
        this._$element.trigger('tabIntoAccordion:afterOpen', [elemContent]),
      );
    }
  }

  // Accordion methods
  _accordionWork(elemContent) {
    if (
      Boolean(this._options.accordionToggle) &&
      elemContent.hasClass('tab-into-accordion__content--active')
    ) {
      $(elemContent).slideToggle(this._options.openAccordionTime);
    } else {
      this._containers.slideUp(this._options.openAccordionTime);

      $(elemContent).slideDown(this._options.openAccordionTime, () =>
        this._$element.trigger('tabIntoAccordion:afterOpen', [elemContent]),
      );
    }
  }

  _addAccordionButton() {
    if (
      this._options.componentType === 'onlyTab' ||
      this._isAccordionButtonCreate ||
      (!this._containers.length && !this._tabItems)
    )
      return;

    this._containers.each((i, content) => {
      this._tabItems.each((j, title) => {
        if ($(content).attr('data-id-content') === $(title).attr('data-id-title')) {
          const $element = this._createAccordionButton(
            $(title).attr('data-id-title'),
            $(title).children('.tab-into-accordion__button').html(),
            $(title).hasClass('tab-into-accordion__item--active'),
          );
          $element.children('button').on('click', (e) => this._tabHandlerClick(e));

          $(content).before($element);
        }
      });
    });

    this._accordionItems = this._$element.find('div.tab-into-accordion__item');
    this._isAccordionButtonCreate = true;
  }

  _createAccordionButton(id, content, isActive = false) {
    const $button = $('<button type="button" class="tab-into-accordion__button"></button>'),
      $accordionButtonItem = $('<div class="tab-into-accordion__item"></div>'),
      result = $accordionButtonItem.attr('data-id-title', id).append($button.html(content));

    isActive && $accordionButtonItem.addClass('tab-into-accordion__item--active');

    return result;
  }

  // ---------------------------------------------
  _setComponentTypeClass(type = null, reset = false) {
    const tabClass = `tab-into-accordion--${this._TAB_TYPE}`,
      accordionClass = `tab-into-accordion--${this._ACCORDION_TYPE}`;

    if (reset) {
      this._$element.removeClass([tabClass, accordionClass]);
      return;
    }

    type = type || this._currentComponentType;

    this._$element
      .addClass(type === this._TAB_TYPE ? tabClass : accordionClass)
      .removeClass(type === this._TAB_TYPE ? accordionClass : tabClass);
  }

  _setActiveItemClass(itemId) {
    let elemWithId = !itemId
      ? this._$element.find([
          $('li[data-id-title]')[0],
          $(this._accordionItems)[0],
          $('[data-id-content]')[0],
        ])
      : this._$element.find(`[data-id-title="${itemId}"], [data-id-content="${itemId}"]`);

    if (
      (this._options.tabToggle || this._options.accordionToggle) &&
      elemWithId.hasClass('tab-into-accordion__item--active')
    ) {
      const tabElements =
        this._options.tabToggle &&
        this._currentComponentType === this._TAB_TYPE &&
        elemWithId.filter('li[data-id-title], [data-id-content]');
      const accordionElements =
        this._options.accordionToggle &&
        this._currentComponentType === this._ACCORDION_TYPE &&
        elemWithId.filter('div[data-id-title], [data-id-content]');

      $([])
        .add(tabElements || [])
        .add(accordionElements || [])
        .removeClass('tab-into-accordion__content--active tab-into-accordion__item--active');
    } else {
      this._$element
        .find('[data-id-title], [data-id-content]')
        .removeClass('tab-into-accordion__content--active tab-into-accordion__item--active');

      elemWithId.each((_, el) => {
        $(el).addClass(
          $(el).attr('data-id-content')
            ? 'tab-into-accordion__content--active'
            : 'tab-into-accordion__item--active',
        );
      });
    }
  }

  // ---------------------------------------------
  _getHash() {
    return window.location.hash.slice(1);
  }

  _setHash(hash) {
    window.location.hash = hash;
  }

  _scrollToContent(param) {
    const obj = typeof param === 'object' ? param : Boolean(param);

    if (!obj || !(obj && $(this._$element).find(`[data-id-title="${this._getHash()}"]`).length))
      return;

    const params = {
      scrollShift: 0,
      scrollTime: 500,
      ...obj,
    };

    $('body, html').animate(
      {
        scrollTop: $(this._$element).offset().top - params.scrollShift,
      },
      params.scrollTime,
    );
  }

  //all handlers
  _handlers() {
    this._tabButtons.on('click', this._tabHandlerClick);
  }

  // component button click handler
  _tabHandlerClick(e) {
    const tabId = $(e.currentTarget).parent().attr('data-id-title');
    this._$element.trigger('tabIntoAccordion:click', [e.currentTarget, tabId]);
    this._openCloseContainer(tabId);
    this._scrollToContent(this._options.scrollToContent);
  }

  // component initialization
  _init() {
    this._setState();
    this._componentStructure();
    this._openCloseContainer();
    this._handlers();

    $(window).on('load', () => {
      this._scrollToContent(this._options.scrollToContent);
    });

    this._$element.addClass('tab-into-accordion--initialized');
  }
}

$.fn.tabIntoAccordion = function (options = {}) {
  const agr = arguments;

  return this.each(function () {
    const $this = $(this);
    let data = $this.data('tabIntoAccordion');

    if (!data && typeof options === 'object') {
      data = new TabIntoAccordion(this, options);
      $this.data('tabIntoAccordion', data);
    }

    if (data && typeof options === 'string' && data.publicMethods.hasOwnProperty(options)) {
      data.publicMethods[options](agr[1]);
    }
  });
};
