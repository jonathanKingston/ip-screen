'use strict';

class ChoiceGrid {
  constructor(options) {
    this.ipAddressElement = document.getElementById('ip-address');
    this.selectionElement = document.getElementById('selection');
    this.gridElement = document.getElementById('grid');
    this.itemGrid = new WeakMap();
    this.items = options.items;
    this.options = options;

    this.ipAddressElement.value = '';
  
    this.items.forEach((item, i) => {
      let itemDOM = this.addImage(item, this.gridElement);
      this.itemGrid.set(itemDOM, i);
    });
  
    this.gridElement.addEventListener('click', (e) => {
      console.log(e);
      let itemIndex = this.itemGrid.get(e.target);
      this.setGridValue(itemIndex);
    }, true);
  }

  addImage(item, parent) {
    const image = document.createElement('img');

    image.setAttribute('src', `images/${item}.jpg`);
    parent.appendChild(image);

    return image;
  }
  
  setGridValue(id) {
    let value = this.ipAddressElement.value;
    let lastBoundaryFull = /^[0-9]{3}([.][0-9]{3})*$/;
    let boundaries = value.split('.').length - 1;
    let round;
  
    this.addImage(this.items[id], this.selectionElement);
  
    if (value === '') {
      round = this.options.firstRound;
    } else if (value[value.length - 1] === '.') {
      round = this.options.startRound;
    } else {
      round = this.options.midRound;
    }
    
    value += round[id];

    if (lastBoundaryFull.test(value)) {
      value += '.';
    }
    this.ipAddressElement.value = value;
  }
}

function setup() {
  
  const options = {
    items: [
      'bbq',
      'bridge',
      'cd',
      'chicken',
      'dog',
      'horse',
      'kangaroo',
      'seagull',
      'seal',
      'sheep',
      'squirrel',
      'taxi'
    ],
    firstRound: [
      '192.168.0.', // D-Link, Netgear
      '192.168.1.', // Linksys
      '192.168.2.', // Belkin, SMC
      '192.168.3.', //
      '192.168.4.', //
      '192.168.10.', //
      '192.168.11.', // :decoder
      '192.168.100.', // Many?
      '192.168.101.', // Aus?
      '192.168.123.', // US Robotics
      '192.168.178.', // AVM Fritzbox
      '192.168.254.', // :decoder
      '.' // Other, move to normal keyboard
    ],
    startRound: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0.',
      '1.',
      '2.'
    ],
    midRound: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0.',
      '.'
    ]
  };

  const choiceGridInstance = new ChoiceGrid(options);
}

window.addEventListener('load', setup);
