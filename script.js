import { slaiderioDuomenys } from './duomenys/slaiderioDuomenys.js';
import { skaidresStruktura } from './struktura/skaidresStruktura.js';
import { Slaideris } from './slaideris/slaideris.js';

const interfaceCarousel = new Slaideris ('#slaideris', skaidresStruktura , slaiderioDuomenys, {
    size : {
        mobile: 1,
        tablet: 2,
        desktop: 3,
    },
    previousNext: true,
    dots: true,
});

// console.log(interfaceCarousel);




