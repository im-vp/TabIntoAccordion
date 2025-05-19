## TabIntoAccordion

Plugin for creating tabs with the ability to turn into an accordion and back.
With the ability to set settings in the form of data-attributes or object.

**jQuery is required for this to work.**

### Example html structure:

```html
<div class="tab-into-accordion">
  <ul>
    <li data-id-title="tab_1"><button type="button">Title 1</button></li>
    <li data-id-title="tab_2"><button type="button">Title 2</button></li>
    <li data-id-title="tab_3"><button type="button">Title 3</button></li>
  </ul>
  <div data-id-content="tab_1">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur perferendis ipsum ab
    nesciunt, culpa tenetur fuga iusto natus adipisci eveniet laboriosam, aliquam odio optio,
    dolores provident vel illum! Animi, assumenda?
  </div>
  <div data-id-content="tab_2">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci at autem error minus
    assumenda necessitatibus ipsum voluptatem, doloribus qui rem omnis eos neque nam consequatur.
  </div>
  <div data-id-content="tab_3">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium corporis nostrum
    exercitationem harum minus aliquam autem sint cumque aliquid impedit.
  </div>
</div>
```

### Plugin initialization example:

```javascript
$('.tab-into-accordion').tabIntoAccordion({
  pointForTransform: 1000,
  componentTheme: 'my-class',
  scrollToContent: {
    scrollShift: 100,
    scrollTime: 2000,
  },
});
```

### Settings

| Option               | Type                                               | Default                     | Description                                                                                                     |
| -------------------- | -------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| componentType        | 'onlyTab' \| 'onlyAccordion' \| 'tabIntoAccordion' | 'tabIntoAccordion'          | Set the component type: tabs only, accordion only or dynamically changing type.                                 |
| componentTheme       | string                                             | 'tab-into-accordion--theme' | Css class for component styling.                                                                                |
| isFirstContainerOpen | boolean                                            | true                        | Whether to open the first container by default.                                                                 |
| openByHash           | boolean                                            | true                        | Open container using hash.                                                                                      |
| setHash              | boolean                                            | false                       | Set hash when opening container.                                                                                |
| scrollToContent      | boolean \| object                                  | false                       | In the object you can specify the scroll offset and scroll time - `{scrollShift: Number, scrollTime: Number }`. |
| pointForTransform    | number                                             | 800                         | Conversion point to accordion and back.                                                                         |
| openTabTime          | number                                             | 0                           | Tab opening time.                                                                                               |
| openAccordionTime    | number                                             | 400                         | Slide opening time.                                                                                             |
| accordionToggle      | boolean                                            | true                        | Ability to close active accordion                                                                               |
| tabToggle            | boolean                                            | false                       | Ability to close active tab                                                                                     |

### Events

```javascript
// Triggers after opening a tab or accordion
$('.tab-into-accordion').on('tabIntoAccordion:afterOpen', function (event, openContainer) {
  console.log(openContainer);
  //openContainer - current open container
});

// Triggers when the tab or accordion buttons are pressed
$('.tab-into-accordion').on('tabIntoAccordion:click', function (event, currentTarget, tabId) {
  console.log('Event object:', event);
  console.log('Clicked element:', currentTarget);
  console.log('Tab ID:', tabId);
});
```

| Event                      | Params                      | Description                                            |
| -------------------------- | --------------------------- | ------------------------------------------------------ |
| tabIntoAccordion:afterOpen | event, openContainer        | Triggers after opening a tab or accordion              |
| tabIntoAccordion:click     | event, currentTarget, tabId | Triggers when the tab or accordion buttons are pressed |

### Methods

```javascript
// Destroy component
$('.tab-into-accordion').tabIntoAccordion('destroy');

// Open container by id
$('.tab-into-accordion').tabIntoAccordion('openContainer', 'tab_2');
```

| Method        | Argument         | Description          |
| ------------- | ---------------- | -------------------- |
| destroy       |                  | Destroy component    |
| refresh       |                  | Refresh component    |
| openContainer | string \| number | Open container by id |

Example of setting properties via data-attribute:

```html
<div class="tab-into-accordion" data-component-theme="my-theme" data-open-tab-time="5000">
  <ul>
    <li data-id-title="tab_1"><button type="button">Title 1</button></li>
    <li data-id-title="tab_2"><button type="button">Title 2</button></li>
    <li data-id-title="tab_3"><button type="button">Title 3</button></li>
  </ul>
  <div data-id-content="tab_1">Content...</div>
  <div data-id-content="tab_2">Content...</div>
  <div data-id-content="tab_3">Content...</div>
</div>
```

Just specify property names separated by dashes and in lowercase letters.

**Plugin version: 1.1.0**

#### Dependencies

jQuery.
